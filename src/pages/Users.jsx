import React, { useState, useEffect } from "react";
import Title from "../components/dashboard/Title";
import Button from "../components/dashboard/Button.jsx";
import { MdMenu } from "react-icons/md";
import { getInitials, getRoleClass } from "../utils/index.js";
import { Outlet } from "react-router-dom";
import styles from '../style';
import Footer from '../components/Footer.jsx';
import BackToTopButton from '../components/BackToTopButton.jsx';
import Sidebar from '../components/dashboard/Sidebar';
import MobileSidebar from '../components/dashboard/MobileSidebar';
import DashboardService from '../services/DashboardService';
import Spinner from '../components/Spinner';
import GroupIcon from '@mui/icons-material/Group';
import clsx from "clsx";

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userStatistics, setUserStatistics] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(10);

  useEffect(() => {
    const fetchUserStatistics = async (page = 1) => {
      setLoading(true);
      try {
        const data = await DashboardService.getUsersStatisticsData(page);
        setUserStatistics(data.userStatistics);
        setFilteredUsers(data.userStatistics);
        setCurrentPage(data.currentPage);
        setTotalPages(data.lastPage);
        setTotalUsers(data.totalUsers);

      } catch (error) {
        console.error('Error fetching user statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatistics(currentPage);
  }, [currentPage]);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, roleFilter, userStatistics]);

  const filterUsers = () => {
    let filtered = userStatistics;
    if (searchQuery) {
      filtered = filtered.filter(user =>
        (user.profile ? `${user.profile.first_name} ${user.profile.last_name}` : user.username)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    setFilteredUsers(filtered);
  };

  const userActionHandler = () => {};
  const deleteHandler = () => {};

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Email</th>
        <th className='py-2'>Role</th>
        <th className='py-2'>Posts</th>
        <th className='py-2'>Artworks</th>
        <th className='py-2'>Followers</th>
        <th className='py-2'>Followings</th>
        <th className='py-2'></th>
      </tr>
    </thead>
  );



  const TableRow = ({ user }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='p-2'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-purple-700'>
            <span className='text-xs md:text-sm text-center'>
              {user.profile ? getInitials(`${user.profile.first_name} ${user.profile.last_name}`) : getInitials(user.username)}
            </span>
          </div>
          {user.profile ? `${user.profile.first_name} ${user.profile.last_name}` : user.username}
        </div>
      </td>

      <td className='p-2'>{user.email || "user.email.com"}</td>
      <td className='p-2'>
        <span className={getRoleClass(user.role)}>{user.role}</span>
      </td>
      <td className='p-2'>{user.postsCount}</td>
      <td className='p-2'>{user.artworksCount}</td>
      <td className='p-2'>{user.followersCount}</td>
      <td className='p-2'>{user.followingsCount}</td>

      <td className='p-2 flex gap-4 justify-end'>
        <Button
          className='text-purple-600 hover:text-purple-500 font-semibold sm:px-0'
          label='Edit'
          type='button'
          onClick={() => editClick(user)}
        />

        <Button
          className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
          label='Delete'
          type='button'
          onClick={() => deleteClick(user?._id)}
        />
      </td>
    </tr>
  );

  const Card = ({ label, count, bg, icon }) => {
    return (
      <div className='w-full h-32 backdrop-filter backdrop-blur-lg md:p-8 sm:p-10 ss:p-30 cta-block border-solid border-2 border-indigo-600 p-5 shadow-md rounded-md flex items-center justify-between'>
        <div className='h-full flex flex-1 flex-col justify-between'>
          <p className={` ${styles.paragraph} text-base font-semibold`}>{label}</p>
          <span className='text-2xl font-regular text-white font-raleway'>{count}</span>
          <span className='text-sm text-gray-400'>{"110 last month"}</span>
        </div>
        <div
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center text-white",
            bg
          )}
        >
          {icon}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className='w-full flex flex-col md:flex-row flex-1'>
        <div className='w-1/5 bg-indigo-700 sticky top-0 hidden md:block'>
          <Sidebar />
        </div>
        <MobileSidebar
          isSidebarOpen={isSidebarOpen}
          closeSidebar={() => setIsSidebarOpen(false)}
        />
        <div className='flex-1 flex flex-col py-4 px-2 md:px-6'>
          <header className='w-full flex justify-between items-center p-4 bg-white shadow-md md:hidden'>
            <button onClick={() => setIsSidebarOpen(true)} className='text-2xl'>
              <MdMenu />
            </button>
          </header>
          <div className='flex-1'>
            <Outlet />
          </div>
        </div>

        <div className='w-full md:px-1 px-0 mb-6'>
          <div className='flex items-center justify-between mb-8'>
            <Card label="TOTAL" count={totalUsers} bg="bg-[#f59e0b]" icon={<GroupIcon />} />
          </div>
          <div className='flex items-center justify-between mb-4'>
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            >
              <option value="">Filter by role</option>
              <option value="admin">Admin</option>
              <option value="green">Green</option>
              <option value="blue">Blue</option>
              <option value="artist">Artist</option>
              <option value="art_lover">Art Lover</option>
            </select>
          </div>
          <div className='bg-white px-2 md:px-4 py-4 shadow-md rounded'>
            <div className='overflow-x-auto'>
              {loading ? (
                <Spinner />
              ) : (
                <table className='w-full mb-5'>
                  <TableHeader />
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <TableRow key={index} user={user} />
                    ))}
                  </tbody>
                </table>
              )}
              <div className='flex justify-between items-center mt-4'>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='px-4 py-2 bg-gray-300 rounded disabled:opacity-50'
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className='px-4 py-2 bg-gray-300 rounded disabled:opacity-50'
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <BackToTopButton />
          <div className={`${styles.paddingX} bg-indigo-700 w-full overflow-hidden`}>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}

export default Users;
