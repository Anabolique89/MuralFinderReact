import { Popover, PopoverPanel, PopoverButton, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useState } from "react";
import { BiSolidComment, BiSolidHeart, BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import styles from '../style';

const data = [
  {
    _id: "65c5bbf3787832cf99f28e6d",
    team: [
      "65c202d4aa62f32ffd1303cc",
      "65c27a0e18c0a1b750ad5cad",
      "65c30b96e639681a13def0b5",
    ],
    text: "You can now start building your online presence!",
    task: null,
    notiType: "alert",
    isRead: [],
    createdAt: "2024-07-09T05:45:23.353Z",
    updatedAt: "2024-02-09T05:45:23.353Z",
    __v: 0,
  },
  {
    _id: "65c5f12ab5204a81bde866ab",
    team: [
      "65c202d4aa62f32ffd1303cc",
      "65c30b96e639681a13def0b5",
      "65c317360fd860f958baa08e",
    ],
    text: "Welcome to the MuralFinder app. Enjoy your journey & thank you for joining us!!!",
    task: {
      _id: "65c5f12ab5204a81bde866a9",
      title: "Test task",
    },
    notiType: "alert",
    isRead: [],
    createdAt: "2024-07-09T09:32:26.810Z",
    updatedAt: "2024-02-09T09:32:26.810Z",
    __v: 0,
  },
  {
    _id: "65d8f8b3400006a234de5671",
    user: "John Doe",
    text: "John Doe liked your post.",
    post: {
      _id: "65d8f8b3400006a234de5672",
      title: "How to Improve Your Coding Skills",
    },
    notiType: "like",
    isRead: [],
    createdAt: "2024-09-12T10:00:00.000Z",
    updatedAt: "2024-09-12T10:00:00.000Z",
    __v: 0,
  },
  {
    _id: "65d8f8b3400006a234de5673",
    user: "Jane Smith",
    text: "Jane Smith commented on your post.",
    post: {
      _id: "65d8f8b3400006a234de5674",
      title: "10 Tips for Remote Work Productivity",
    },
    comment: "This is really helpful! Thanks for sharing.",
    notiType: "comment",
    isRead: [],
    createdAt: "2024-09-12T12:15:00.000Z",
    updatedAt: "2024-09-12T12:15:00.000Z",
    __v: 0,
  },
];

const ICONS = {
  alert: (
    <HiBellAlert className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
  message: (
    <BiSolidMessageRounded className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
  like: (
    <BiSolidHeart className='h-5 w-5 text-gray-600 group-hover:text-red-500' />
  ),
  comment: (
    <BiSolidComment className='h-5 w-5 text-gray-600 group-hover:text-blue-500' />
  ),
};

const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  //  const { data, refetch } = useGetNotificationsQuery();
  //  const [markAsRead] = useMarkNotiAsReadMutation();

  const readHandler = () => { };
  const viewHandler = () => { };

  const callsToAction = [
    { name: "Cancel", href: "#", icon: "" },
    {
      name: "Mark All Read",
      href: "#",
      icon: "",
      onClick: () => readHandler("all", ""),
    },
  ];

  return (
    <>
      <Popover className='relative'>
        <PopoverButton className='inline-flex items-center outline-none'>
          <div className='w-8 h-8 flex items-center justify-center text-gray-800 relative'>
            <IoIosNotificationsOutline className='text-2xl' />
            {data?.length > 0 && (
              <span className='absolute text-center top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600'>
                {data?.length}
              </span>
            )}
          </div>
        </PopoverButton>

        <Transition
          as={Fragment}
          enter='transition ease-out duration-200'
          enterFrom='opacity-0 translate-y-1'
          enterTo='opacity-100 translate-y-0'
          leave='transition ease-in duration-150'
          leaveFrom='opacity-100 translate-y-0'
          leaveTo='opacity-0 translate-y-1'
        >
          <PopoverPanel className='absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max  px-4'>
            {({ close }) =>
              data?.length > 0 && (
                <div className='w-screen max-w-md flex-auto overflow-hidden rounded-3xl backdrop-filter backdrop-blur-lg border-solid border-2 border-indigo-700 text-sm leading-6 shadow-lg ring-1 ring-gray-900/5 z-[99]'>
                  <div className='p-4'>
                    {data?.slice(0, 5).map((item, index) => (
                      <div
                        key={item._id + index}
                        className='group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50'
                      >
                        <div className='mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white'>
                          {ICONS[item.notiType]}
                        </div>

                        <div
                          className='cursor-pointer'
                          onClick={() => viewHandler(item)}
                        >
                          <div className='flex items-center gap-3 font-semibold text-gray-900 capitalize font-raleway'>
                            <p> {item.notiType}</p>
                            <span className='text-xs font-raleway lowercase '>
                              {moment(item.createdAt).fromNow()}
                            </span>
                          </div>
                          <p className='line-clamp-1 mt-1 text-black font-raleway '>
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='grid grid-cols-2 divide-x backdrop-filter backdrop-blur-lg'>
                    {callsToAction.map((item) => (
                      <Link
                        key={item.name}
                        onClick={
                          item?.onClick ? () => item.onClick() : () => close()
                        }
                        className='flex items-center justify-center gap-x-2.5 p-3 font-semibold text-black hover:bg-gray-100 font-raleway'
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
          </PopoverPanel>
        </Transition>
      </Popover>
    </>
  );
};

export default NotificationPanel;