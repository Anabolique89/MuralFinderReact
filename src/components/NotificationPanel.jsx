import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { BiSolidComment, BiSolidHeart, BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import NotificationService from "../services/NotificationService";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import AuthService from "../services/AuthService";

const ICONS = {
    alert: <HiBellAlert className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />,
    message: <BiSolidMessageRounded className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />,
    like: <BiSolidHeart className="h-5 w-5 text-gray-600 group-hover:text-red-500" />,
    comment: <BiSolidComment className="h-5 w-5 text-gray-600 group-hover:text-blue-500" />,
};

const NotificationPanel = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [notificationIds, setNotificationIds] = useState(new Set());

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const response = await NotificationService.fetchNotifications(1);
            if (response && response.data && Array.isArray(response.data)) {
                const newNotifications = response.data.filter(noti => {
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
                <div className="w-8 h-8 flex items-center justify-center text-gray-800 relative">
                    <IoIosNotificationsOutline className="text-2xl" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-1 text-xs text-white font-semibold w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </div>
            </PopoverButton>
            <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
                <PopoverPanel className="absolute -right-16 md:-right-2 z-10 mt-5 w-screen max-w-md px-4">
                    {({ close }) => notifications.length > 0 && (
                        <div className="w-full bg-white rounded-lg shadow-lg ring-1 ring-gray-900/5">
                            <div className="p-4">
                                {notifications.map(notification => (
                                    <div key={notification.id} className={`group relative flex gap-x-4 rounded-lg p-4 transition duration-200 ${!notification.read_at ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white'}`} onClick={() => handleViewNotification(notification)}>
                                        <div className="mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-300 group-hover:bg-gray-200">
                                            {ICONS[notification.data.activity_type] || ICONS['alert']}
                                        </div>
                                        <div className="cursor-pointer">
                                            <div className="flex items-center gap-3 font-semibold text-gray-900 capitalize">
                                                <p>{notification.data.activity_type}</p>
                                                <span className="text-xs text-gray-500 lowercase">
                                                    {moment(notification.created_at).fromNow()}
                                                </span>
                                            </div>
                                            <p className="line-clamp-1 mt-1 text-black">{notification.data.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center p-2 border-t border-gray-200">
                                {loading ? (
                                    <span className="text-gray-500">Loading more notifications...</span>
                                ) : (
                                    <button onClick={() => setNotifications(prev => [...prev])} className="text-indigo-600 hover:underline"> Load More </button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 divide-x">
                                <button onClick={() => close()} className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-black hover:bg-gray-100"> Close </button>
                                <button onClick={async () => {
                                    try {
                                        await NotificationService.markAllNotificationsAsRead();
                                        notifications.forEach(noti => handleMarkAsRead(noti.id));
                                    } catch (error) {
                                        console.error('Failed to mark all notifications as read:', error);
                                    }
                                    close();
                                }} className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-black hover:bg-gray-100"> Mark All Read </button>
                            </div>
                        </div>
                    )}
                </PopoverPanel>
            </Transition>
        </Popover>
    );
};

export default NotificationPanel;