import { Sidebar, MobileSidebar } from '../components/dashboard';
import React from "react";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import GroupIcon from '@mui/icons-material/Group';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import ArticleIcon from '@mui/icons-material/Article';
import RoomIcon from '@mui/icons-material/Room';
import moment from "moment";
import { summary } from "../assets/data";
import clsx from "clsx";
import { Chart } from "../components/Chart";
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
  

const Dashboard = () => {
    const totals = summary.tasks;

    const stats = [
      {
        _id: "1",
        label: "WALLS",
        total: summary?.totalTasks || 0,
        icon: <RoomIcon />,
        bg: "bg-[#1d4ed8]",
      },
      {
        _id: "2",
        label: "ARTWORKS",
        total: totals["completed"] || 0,
        icon: <InsertPhotoIcon />,
        bg: "bg-[#b444d0]",
      },
      {
        _id: "3",
        label: "POSTS",
        total: totals["in progress"] || 0,
        icon: <ArticleIcon />,
        bg: "bg-[#f59e0b]",
      },
      {
        _id: "4",
        label: "USERS",
        total: totals["todo"],
        icon: <GroupIcon />,
        bg: "bg-[#be185d]" || 0,
      },
    ];

    const Card = ({ label, count, bg, icon }) => {
        return (
          <div className='w-full h-32 backdrop-filter backdrop-blur-lg  md:p-8 sm:p-10 ss:p-30 cta-block border-solid border-2 border-indigo-600  p-5 shadow-md rounded-md flex items-center justify-between'>
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
        <section>
        <div className='w-full h-screen flex flex-col md:flex-row'>
             <div className='w-1/5 h-screen bg-indigo-700 sticky top-0 hidden md:block'>
               <Sidebar />
             </div>
             {/* <MobileSidebar /> */}

 {/* Grid */}
         
 <div className='h-full py-4 w-full pl-2 pr-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
            {stats.map(({ icon, bg, label, total }, index) => (
              <Card key={index} icon={icon} bg={bg} label={label} count={total} />
            ))}
          </div>
    
          <div className='w-full backdrop-filter backdrop-blur-lg  md:p-8 sm:p-10 ss:p-30 cta-block border-solid border-2 border-indigo-600 my-16 p-4 rounded shadow-sm'>
            <h4 className='text-xl text-white font-semibold font-raleway'>
              Chart by Priority
            </h4>
            <Chart/>
          </div>

        </div>
     
 

             </div>
             <div className='p-4 2xl:px-10'>
          <Outlet />
          </div>
  
          <div className={`${styles.paddingX} bg-indigo-700 w-full overflow-hidden`}>
          <div className='w-full flex flex-col md:flex-row gap-2 2xl:gap-4 py-8'>
            {/* /left */}
    
            <TaskTable tasks={summary.last10Task} />
    
            {/* /right */}
    
            <UserTable users={summary.users} />
          </div>
          </div>

          <BackToTopButton />
    <div className={`${styles.paddingX} bg-indigo-700 w-full overflow-hidden`}>
                <Footer/>
            </div>

        </section>
      );
    };
    

export default Dashboard