import React, { useState, useEffect } from "react";
import { getTasks } from "../services/taskService.ts";
import { FaCalendarAlt } from "react-icons/fa";

const categoryColors = {
    work: "bg-blue-500 text-white",
    personal: "bg-green-500 text-white",
    others: "bg-gray-500 text-white",
};

const statusColors = {
    "TO-DO": "bg-red-500",
    "IN-PROGRESS": "bg-yellow-500",
    "COMPLETED": "bg-green-500",
};

const TaskDetailsPage = ({ onClose, taskId }) => {
    const [task, setTask] = useState(null);
    const [fullScreenImage, setFullScreenImage] = useState(null);

    useEffect(() => {
        const fetchTaskData = async () => {
            if (taskId) {
                try {
                    const tasks = await getTasks();
                    const taskToShow = tasks.find((task) => task.id === taskId);
                    if (taskToShow) {
                        setTask(taskToShow);
                    }
                } catch (error) {
                    console.error("Error fetching task data:", error);
                }
            }
        };

        fetchTaskData();
    }, [taskId]);

    if (!task) {
        return <div className="text-center p-6">Loading task details...</div>;
    }

    return (
        <div className="h-auto w-[500px] p-6 bg-white rounded-lg shadow-lg mx-auto overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Task Details</h2>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-500 text-2xl hover:text-gray-800"
                >
                    &times;
                </button>
            </div>
            <hr className="border-gray-300 my-3" />

            <div className="flex justify-end items-center gap-2">
                <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white w-fit ${statusColors[task.track_status] || "bg-gray-500"
                        }`}
                >
                    {task.track_status}
                </div>

                <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[task.category] || "bg-gray-400 text-white"
                        }`}
                >
                    {task.category}
                </div>
            </div>

            <div className="space-y-4 mt-3">
                <p className="text-base font-semibold text-gray-900">{task.title}</p>
                <p className="text-gray-600">{task.description}</p>

                {/* Category Badge */}


                {/* Due Date */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FaCalendarAlt className="text-blue-500" />
                    <span className="font-medium">{task.due_on}</span>
                </div>

                {/* Status */}

            </div>

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mt-4">Attachments</h3>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                        {task.attachments.map((attachment, index) => (
                            <img
                                key={index}
                                src={attachment.base64String}
                                alt={`Attachment ${index}`}
                                className="w-28 h-28 object-cover rounded-lg cursor-pointer shadow-md hover:shadow-lg transition"
                                onClick={() => setFullScreenImage(attachment.base64String)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Full-Screen Image Viewer */}
            {fullScreenImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
                    onClick={() => setFullScreenImage(null)}
                >
                    <img
                        src={fullScreenImage}
                        alt="Full Screen"
                        className="max-w-full max-h-full p-4 rounded-lg shadow-lg"
                    />
                </div>
            )}

            {/* Footer */}
            {/* <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border rounded-full text-sm text-gray-700 hover:bg-gray-100 transition"
        >
          Close
        </button>
      </div> */}
        </div>
    );
};

export default TaskDetailsPage;
