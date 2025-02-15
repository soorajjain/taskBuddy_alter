// Modal.tsx
import React from 'react';
import TaskForm from '../../pages/TaskForm.tsx';
import ActivityHistory from '../../pages/ActivityHistory.tsx';

const Modal = ({ setshowmodal, activities, onSubmitTask }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-4xl flex space-x-8">
        {/* Left Section: Task Form */}
        <div className="w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Create Task</h2>
          <TaskForm onSubmit={onSubmitTask} />
        </div>

        {/* Right Section: Activity History */}
        <div className="w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Activity History</h2>
          {/* <ActivityHistory activities={activities} /> */}
        </div>
      </div>

      {/* Close Button */}
      <button
        className="absolute top-4 right-4 bg-gray-300 p-2 rounded-full"
        onClick={()=>{
          setshowmodal(false)
        }}
      >
        X
      </button>
    </div>
  );
};

export default Modal;
