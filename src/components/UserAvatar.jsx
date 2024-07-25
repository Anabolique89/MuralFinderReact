
// import ChangePassword from "./ChangePassword";

const UserAvatar = () => {
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  
  const navigate = useNavigate();

//   const logoutHandler = async () => {
//     try {
//       await logoutUser().unwrap();
//       dispatch(logout());

//       navigate("/log-in");
//     } catch (error) {
//       toast.error("Something went wrong. Please try again.");
//     }
//   };

  return (
    <>
      <div className=''>
        <Menu as='div' className='relative inline-block text-left'>
          <div>
            <MenuButton className='w-10 h-10 2xl:w-12 2xl:h-12 items-center justify-center rounded-full bg-blue-600'>
              <span className='text-white font-semibold'>
                {getInitials(user?.username)}
              </span>
            </MenuButton>
          </div>

          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <MenuItems className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-[#1f1f1f] shadow-2xl ring-1 ring-black/5 focus:outline-none'>
              <div className='p-4'>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => setOpen(true)}
                      className={`text-gray-700 dark:text-gray-300  group flex w-full items-center rounded-md px-2 py-2 text-base`}
                    >
                      <FaUser className='mr-2' aria-hidden='true' />
                      Profile
                    </button>
                  )}
                </MenuItem>

                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => setOpenPassword(true)}
                      className={`text-gray-700 dark:text-gray-300  group flex w-full items-center rounded-md px-2 py-2 text-base`}
                    >
                      <FaUserLock className='mr-2' aria-hidden='true' />
                      Change Password
                    </button>
                  )}
                </MenuItem>

                <MenuItem>
                  {({ active }) => (
                    <button
                    //   onClick={logoutHandler}
                      className={`text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base`}
                    >
                      <IoLogOutOutline className='mr-2' aria-hidden='true' />
                      Logout
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      {/* <AddUser open={open} setOpen={setOpen} userData={user} /> */}
      {/* <ChangePassword open={openPassword} setOpen={setOpenPassword} /> */}
    </>
  );
};

export default UserAvatar;
