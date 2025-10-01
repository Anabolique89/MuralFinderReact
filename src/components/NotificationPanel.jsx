import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { BiSolidComment, BiSolidHeart, BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import NotificationService from '@services/NotificationService';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import AuthService from '@services/AuthService';

const ICONS = {
    alert: <HiBellAlert className="h-5 w-5 text-amber-600 group-hover:text-amber-700" />,
    message: <BiSolidMessageRounded className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />,
    like: <BiSolidHeart className="h-5 w-5 text-red-500 group-hover:text-red-600" />,
    comment: <BiSolidComment className="h-5 w-5 text-green-600 group-hover:text-green-700" />,
};

const NotificationPanel = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [notificationIds] = useState(new Set());

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const response = await NotificationService.fetchNotifications(1);
            const notificationsArray = Array.isArray(response) ? response : [];
            
            if (notificationsArray.length > 0) {
                const newNotifications = notificationsArray.filter(noti => {
                    if (!notificationIds.has(noti.id)) {
                        notificationIds.add(noti.id);
                        return true;
                    }
                    return false;
                });
                if (newNotifications.length > 0) {
                    setNotifications(prev => [...prev, ...newNotifications]);
                    setUnreadCount(prev => prev + newNotifications.filter(noti => !noti.read_at).length);
                }
            }
        } catch (error) {
            console.error('Failed to load notifications:', error);
            // If it's an authentication error, don't show error to user
            if (error.message.includes('Authentication required')) {
                console.log('User not authenticated, skipping notifications');
            }
        } finally {
            setLoading(false);
        }
    };

    const userId = AuthService.getUser()?.id;

    useEffect(() => {
        loadNotifications();
    
        window.Pusher = Pusher;
        const echo = new Echo({
            broadcaster: 'pusher',
            key: '557321c61466429ce693',
            cluster: 'eu',
            encrypted: true,
        });
    
        const pusher = echo.connector.pusher;
    
        // Bind connection events
        pusher.connection.bind('connected', () => {
            console.log('Pusher connected');
        });
    
        echo.channel('notifications').subscribed(() => {
            console.log('Successfully subscribed to notifications channel');
        });
    
        pusher.connection.bind('disconnected', () => {
            console.log('Pusher disconnected');
        });
    
        // Listen to the "notifications" channel
        echo.channel('notifications').listen('.ActivityNotification', (event) => {
            const { notification } = event;
            const activityType = notification.data.activity_type;
    
            const allowedTypes = ['message', 'alert', 'like', 'comment', 'post_liked', 'post_commented']; // Include "post_liked" type
    
            console.log(`Notification: ${activityType}`, notification.data.message);
            // Check if the user_id from the notification matches the current user's id
            if (notification.data.user_id === userId && allowedTypes.includes(activityType)) {
                const newNotification = {
                    id: notification.id,
                    data: notification.data,
                    created_at: notification.created_at,
                    read_at: null,
                };
    
                setNotifications((prev) => {
                    if (!notificationIds.has(newNotification.id)) {
                        notificationIds.add(newNotification.id);
                        setUnreadCount((count) => count + 1);
                        return [...prev, newNotification];
                    }
                    return prev;
                });
            }
        });
    
        // Clean up connection bindings
        return () => {
            pusher.connection.unbind('connected');
            pusher.connection.unbind('disconnected');
        };
    }, [userId]);
    

    const handleMarkAsRead = async (notificationId) => {
        try {
            await NotificationService.markNotificationAsRead(notificationId);
            setNotifications(notifications.map(noti => noti.id === notificationId ? { ...noti, read_at: new Date() } : noti));
            setUnreadCount(prev => prev - 1);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleViewNotification = (notification) => {
        handleMarkAsRead(notification.id);
    };

    return (
        <Popover className="relative">
            <PopoverButton className="inline-flex items-center outline-none">
                <div className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white relative transition-all duration-300 hover:scale-110">
                    <IoIosNotificationsOutline className="text-2xl" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 text-xs text-white font-bold w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center shadow-lg animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>
            </PopoverButton>
            <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
                <PopoverPanel className="absolute -right-16 md:-right-2 z-10 mt-5 w-screen max-w-md px-4">
                    {({ close }) => (
                        <div className="w-full bg-white rounded-xl shadow-xl ring-1 ring-gray-200/50 backdrop-blur-sm">
                            <div className="p-4">
                                {notifications.length > 0 ? (
                                    notifications.map(notification => (
                                        <div key={notification.id} className={`group relative flex gap-x-4 rounded-lg p-4 transition-all duration-300 ${!notification.read_at ? 'bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-l-4 border-blue-400' : 'bg-white hover:bg-gray-50'}`} onClick={() => handleViewNotification(notification)}>
                                            <div className={`mt-1 h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                                                notification.data.activity_type === 'like' ? 'bg-red-100 group-hover:bg-red-200' :
                                                notification.data.activity_type === 'comment' ? 'bg-green-100 group-hover:bg-green-200' :
                                                notification.data.activity_type === 'message' ? 'bg-blue-100 group-hover:bg-blue-200' :
                                                'bg-amber-100 group-hover:bg-amber-200'
                                            }`}>
                                                {ICONS[notification.data.activity_type] || ICONS['alert']}
                                            </div>
                                            <div className="cursor-pointer flex-1">
                                                <div className="flex items-center gap-3 font-semibold text-gray-900 capitalize">
                                                    <p className={`${
                                                        notification.data.activity_type === 'like' ? 'text-red-700' :
                                                        notification.data.activity_type === 'comment' ? 'text-green-700' :
                                                        notification.data.activity_type === 'message' ? 'text-blue-700' :
                                                        'text-amber-700'
                                                    }`}>{notification.data.activity_type}</p>
                                                    <span className="text-xs text-gray-500 lowercase">
                                                        {moment(notification.created_at).fromNow()}
                                                    </span>
                                                </div>
                                                <p className="line-clamp-2 mt-1 text-gray-700 leading-relaxed">{notification.data.message}</p>
                                            </div>
                                            {!notification.read_at && (
                                                <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                            <IoIosNotificationsOutline className="text-4xl text-blue-500" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">No notifications</h3>
                                        <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                                            You&apos;re all caught up! Check back later for updates.
                                        </p>
                                    </div>
                                )}
                            </div>
                            {notifications.length > 0 && (
                                <>
                                    <div className="flex justify-center p-3 border-t border-gray-200 bg-gray-50">
                                        {loading ? (
                                            <span className="text-gray-500 flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                Loading more notifications...
                                            </span>
                                        ) : (
                                            <button onClick={() => setNotifications(prev => [...prev])} className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"> Load More </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                                        <button onClick={() => close()} className="flex items-center justify-center gap-x-2.5 p-3 font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"> Close </button>
                                        <button onClick={async () => {
                                            try {
                                                await NotificationService.markAllNotificationsAsRead();
                                                notifications.forEach(noti => handleMarkAsRead(noti.id));
                                            } catch (error) {
                                                console.error('Failed to mark all notifications as read:', error);
                                            }
                                            close();
                                        }} className="flex items-center justify-center gap-x-2.5 p-3 font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200"> Mark All Read </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </PopoverPanel>
            </Transition>
        </Popover>
    );
};

export default NotificationPanel;