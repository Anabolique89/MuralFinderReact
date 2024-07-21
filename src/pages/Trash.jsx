import React, { useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import {MdMenu} from "react-icons/md";
import { tasks } from "../assets/data";
import Title from "../components/dashboard/Title";
import Button from "../components/dashboard/Button";
import {PRIOTITYSTYLES, TASK_TYPE } from "../utils";
// import AddUser from "../components/AddUser";
import ConfirmationDialog from "../components/dashboard/Dialogs.jsx";
import clsx from "clsx";
import { Outlet } from "react-router-dom";
import styles from '../style';
import Footer from '../components/Footer.jsx';
import BackToTopButton from '../components/BackToTopButton.jsx';
import Sidebar from '../components/dashboard/Sidebar';
import MobileSidebar from '../components/dashboard/MobileSidebar';

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {

  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const[selected, setSelected] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to empty the Trash?");
    setOpenDialog(true);
  };
  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all?");
    setOpenDialog(true);
  };
    
  const deleteClick = (id) => {
    setType("delete");
    setSelected(id);
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setSelected("delete");
    setType("restore");
    setMsg("Restore item?");
    setOpenDialog(true);
  };

//header row
  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black  text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Stage</th>
        <th className='py-2 line-clamp-1'>Modified On</th>
      </tr>
    </thead>
  );

  //rows with deleted stuff 

  const TableRow = ({ item }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[item.stage])}
          />
          <p className='w-full line-clamp-2 text-base text-black'>
            {item?.title}
          </p>
        </div>
      </td>

      <td className='py-2 capitalize'>
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYLES[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span className=''>{item?.priority}</span>
        </div>
      </td>

      <td className='py-2 capitalize text-center md:text-start'>
        {item?.stage}
      </td>
      <td className='py-2 text-sm'>{new Date(item?.date).toDateString()}</td>

      <td className='py-2 flex gap-1 justify-end'>
        <Button
          icon={<MdOutlineRestore className='text-xl text-gray-500' />}
          onClick={() => restoreClick(item._id)}
        />
        <Button
          icon={<MdDelete className='text-xl text-red-600' />}
          onClick={() => deleteClick(item._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
         <div className='w-full flex flex-col md:flex-row flex-1'>
        <div className='w-1/5 bg-indigo-700 sticky top-0 hidden md:block'>
          <Sidebar />
        </div>
     {/* Mobile Sidebar */}
     <MobileSidebar
          isSidebarOpen={isSidebarOpen}
          closeSidebar={() => setIsSidebarOpen(false)}
        />

     {/* Main Content */}
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
        <Title title='Trashed Tasks' />

        <div className='flex gap-2 md:gap-4 items-center'>
          <Button
            label='Restore All'
            icon={<MdOutlineRestore className='text-lg hidden md:flex' />}
            className='flex flex-row-reverse gap-1 items-center  text-black text-sm md:text-base rounded-md 2xl:py-2.5'
            onClick={() => restoreAllClick()}
          />
          <Button
            label='Delete All'
            icon={<MdDelete className='text-lg hidden md:flex' />}
            className='flex flex-row-reverse gap-1 items-center  text-red-600 text-sm md:text-base rounded-md 2xl:py-2.5'
            onClick={() => deleteAllClick()}
          />
        </div>
      </div>
      <div className='bg-white px-2 md:px-6 py-4 shadow-md rounded'>
        <div className='overflow-x-auto'>
          <table className='w-full mb-5'>
            <TableHeader />
            <tbody>
              {tasks?.map((tk, id) => (
                <TableRow key={id} item={tk} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    </div>
    <BackToTopButton />
          <div className={`${styles.paddingX} bg-indigo-700 w-full overflow-hidden`}>
            <Footer />
          </div>
    <ConfirmationDialog
      open={openDialog}
      setOpen={setOpenDialog}
      msg={msg}
      setMsg={setMsg}
      type={type}
      setType={setType}
      onClick={() => deleteRestoreHandler()}
    />
  </>
  )
}

export default Trash