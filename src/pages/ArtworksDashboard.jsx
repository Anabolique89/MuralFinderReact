import { Sidebar, MobileSidebar } from '../components/dashboard';
import React from "react";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { LuClipboardEdit } from "react-icons/lu";
import { FaNewspaper, FaUsers } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import { summary } from "../assets/data";
import clsx from "clsx";
import { BGS, PRIOTITYSTYLES, TASK_TYPE, getInitials } from "../utils/index.js";
import UserInfo from "../components/dashboard/UserInfo";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import styles from '../style';
import Footer from '../components/Footer.jsx';
import BackToTopButton from '../components/BackToTopButton.jsx';

const TaskTable = ({ tasks }) => {
    const ICONS = {
      high: <MdKeyboardDoubleArrowUp />,
      medium: <MdKeyboardArrowUp />,
      low: <MdKeyboardArrowDown />,
    };
  
    const TableHeader = () => (
      <thead className='border-b border-gray-300 '>
        <tr className='text-black text-left'>
          <th className='py-2'>Task Title</th>
          <th className='py-2'>Priority</th>
          <th className='py-2'>Team</th>
          <th className='py-2 hidden md:block'>Created At</th>
        </tr>
      </thead>
    );
  
    const TableRow = ({ task }) => (
        <tr className='border-b border-gray-300 text-gray-600 hover:bg-gray-300/10'>
          <td className='py-2'>
            <div className='flex items-center gap-2'>
              <div
                className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
              />
    
              <p className='text-base text-black'>{task.title}</p>
            </div>
          </td>
    
          <td className='py-2'>
            <div className='flex gap-1 items-center'>
              <span className={clsx("text-lg", PRIOTITYSTYLES[task.priority])}>
                {ICONS[task.priority]}
              </span>
              <span className='capitalize'>{task.priority}</span>
            </div>
          </td>
    
          <td className='py-2'>
            <div className='flex'>
              {task.team.map((m, index) => (
                <div
                  key={index}
                  className={clsx(
                    "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                    BGS[index % BGS.length]
                  )}
                >
                  <UserInfo user={m} />
                </div>
              ))}
            </div>
          </td>
          <td className='py-2 hidden md:block'>
            <span className='text-base text-gray-600'>
              {moment(task?.date).fromNow()}
            </span>
          </td>
        </tr>
      );
      return (
        <>
          <div className='w-full md:w-2/3 bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded'>
            <table className='w-full'>
              <TableHeader />
              <tbody>
                {tasks?.map((task, id) => (
                  <TableRow key={id} task={task} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    };
    

    const UserTable = ({ users }) => {
        const TableHeader = () => (
          <thead className='border-b border-gray-300 '>
            <tr className='text-black  text-left'>
              <th className='py-2'>Username</th>
              <th className='py-2'>Role (User or Admin?)</th>
              <th className='py-2'>Created At</th>
            </tr>
          </thead>
        );
      
        const TableRow = ({ user }) => (
          <tr className='border-b border-gray-200  text-gray-600 hover:bg-gray-400/10'>
            <td className='py-2'>
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-700'>
                  <span className='text-center'>{getInitials(user?.name)}</span>
                </div>
      
                <div>
                  <p> {user.name}</p>
                  <span className='text-xs text-black'>{user?.role}</span>
                </div>
              </div>
            </td>
      
            <td>
              <p
                className={clsx(
                  "w-fit px-3 py-1 rounded-full text-sm",
                  user?.isActive ? "bg-blue-200" : "bg-yellow-100"
                )}
              >
                {user?.isActive ? "Active" : "Disabled"}
              </p>
            </td>
            <td className='py-2 text-sm'>{moment(user?.createdAt).fromNow()}</td>
          </tr>
        );
      
        return (
          <div className='w-full md:w-1/3 bg-white h-fit px-2 md:px-6 py-4 shadow-md rounded'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {users?.map((user, index) => (
                  <TableRow key={index + user?._id} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        );
      };
  

const ArtworksDashboard = () => (
  <section>
  <div className='w-full h-screen flex flex-col md:flex-row'>
       <div className='w-1/5 h-screen bg-indigo-700 sticky top-0 hidden md:block'>
         <Sidebar />
       </div>
       {/* <MobileSidebar /> */}

       <div className='p-4 2xl:px-10'>
    <Outlet />
    </div>

    <div className={`${styles.paddingX} bg-indigo-700 w-full overflow-hidden`}>
    <div className='w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8'>
      {/* /left */}

      <TaskTable tasks={summary.last10Task} />

      {/* /right */}

      {/* <UserTable users={summary.users} /> */}
    </div>
    </div>
    </div>
    <BackToTopButton />
<div className={`${styles.paddingX} bg-indigo-700 w-full overflow-hidden`}>
          <Footer/>
      </div>
   
  </section>
);


export default ArtworksDashboard