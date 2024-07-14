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
          <th className='py-2'>Wall Title</th>
          <th className='py-2'>Status</th>
          <th className='py-2'>Description</th>
          <th className='py-2'>Location</th>
          <th className='py-2'>User</th>
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
    

const WallsDashboard = () => {

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
      label: "LEGAL",
      total: totals["completed"] || 0,
      icon: <InsertPhotoIcon />,
      bg: "bg-[#b444d0]",
    },
    {
      _id: "3",
      label: "ILLEGAL",
      total: totals["in progress"] || 0,
      icon: <ArticleIcon />,
      bg: "bg-[#f59e0b]",
    },
    {
      _id: "4",
      label: "DELETED",
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
          <div className='p-2 2xl:px-6'>
    <Outlet />
    </div>
    <div className={`${styles.paddingX} bg-indigo-700 w-full z-`}>
    <div className='w-full flex flex-col md:flex-row gap-3 2xl:gap-5 py-6'>
      {/* /left */}

      <TaskTable tasks={summary.last10Task} />
    </div>
    </div>
    
          
    </div>
    
    </div>
    <BackToTopButton />
<div className={`${styles.paddingX} bg-indigo-700 w-full overflow-hidden`}>
          <Footer/>
      </div>
    
  </section>
  );
};

export default WallsDashboard