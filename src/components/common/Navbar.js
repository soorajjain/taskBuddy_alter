import React from 'react';
import { CiViewBoard, CiViewList } from 'react-icons/ci';
import { MdOutlineTask } from 'react-icons/md';
import { FaTasks } from "react-icons/fa";
import { RiLogoutBoxLine } from "react-icons/ri";

const Navbar = ({ user, onLogout, setView, view }) => {
  return (
    <div className="max-w-[98%] flex items-center justify-between p-4 mx-auto pt-6">
      <div className='flex flex-col justify-start items-center gap-5'>
        <div className=" text-2xl w-full flex justify-start items-center gap-2"> <FaTasks className='w-5 h-5' /> <span style={{ fontWeight: 600 }}>TaskBuddy</span> </div>
        <div className="space-x-4 hidden md:flex">

          <button
            onClick={() => setView('list')}
            className="font-semibold flex justify-center items-center gap-2"
          >
            <span className={`${view === 'list' ? 'relative after:content-[""] after:block after:w-full after:h-[2px] after:bg-gray-500 after:mt-1' : ''}`}>

              <span className='flex items-center justify-center gap-1'>
                <CiViewList />
                List View
              </span>
            </span>
          </button>
          <button
            onClick={() => setView('board')}
            className="font-semibold flex justify-center items-center gap-2"
          >
            <span className={`${view === 'board' ? 'relative after:content-[""] after:block after:w-full after:h-[2px] after:bg-gray-500 after:mt-1' : ''}`}>


              <span className='flex items-center justify-center gap-1'>
                <CiViewBoard />
                Board View
              </span>
            </span>
          </button>




        </div>
      </div>

      <div className="flex flex-col items-end justify-end gap-5">
        <div className='flex justify-center items-center gap-2'>

          {user?.photoURL ? (
            <img
              src={user?.photoURL}
              alt="Profile"
              className='w-10 h-10 rounded-full'
              onError={(e) => e.target.src = "/assets/images/default_user.jpg"} // Fallback image
            />
          ) : (
            <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#ccc" }} />
          )}

          <span className='font-bold text-gray-500'>{user?.displayName || "Guest"}</span>
        </div>
        <button onClick={onLogout} className="border  w-full shadow-md px-3 py-1 rounded-full hidden  md:flex items-center justify-center gap-2"><RiLogoutBoxLine />Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
