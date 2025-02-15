import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { getActivityLogs, updateTask } from '../services/taskService.ts';
import { getTasks } from '../services/taskService.ts'; 
import ActivityHistory from './ActivityHistory.tsx';

const TaskEditForm = ({ onClose, taskId }) => {
    const [task, setTask] = useState({
        title: '',
        description: '',
        category: 'work',
        due_on: '',
        track_status: 'TO-DO',
        attachments: []
    });

    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            const activities = await getActivityLogs();
            setActivities(activities);
        };
        const fetchTaskData = async () => {
            if (taskId) {
                try {
                    const tasks = await getTasks(); // Fetch all tasks from Firestore
                    const taskToEdit = tasks.find((task) => task.id === taskId); // Find the task by taskId
                    if (taskToEdit) {
                        setTask(taskToEdit);
                    }
                } catch (error) {
                    console.error('Error fetching task data:', error);
                }
            }
        };

        fetchTaskData();
        fetchActivities()
    }, [taskId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);

        for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File size exceeds 5 MB limit.");
                continue;
            }

            try {
                const options = {
                    maxSizeMB: 5,
                    maxWidthOrHeight: 800,
                    useWebWorker: true,
                };
                const compressedFile = await imageCompression(file, options);

                const base64String = await toBase64(compressedFile);
                const fileKey = `file-${new Date().getTime()}`;

                localStorage.setItem(fileKey, base64String);

                setTask((prevTask) => {
                    const updatedAttachments = [
                        ...prevTask.attachments,
                        { fileKey },
                    ];

                    localStorage.setItem('taskAttachments', JSON.stringify(updatedAttachments));

                    return { ...prevTask, attachments: updatedAttachments };
                });

                console.log('File saved with key:', fileKey);
            } catch (error) {
                console.error("Error compressing file:", error);
                alert("Failed to compress image.");
            }
        }
    };

    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveAttachment = (fileKey) => {
        localStorage.removeItem(fileKey);

        setTask((prevTask) => {
            const updatedAttachments = prevTask.attachments.filter(
                (attachment) => attachment.fileKey !== fileKey
            );
            localStorage.setItem('taskAttachments', JSON.stringify(updatedAttachments));
            return { ...prevTask, attachments: updatedAttachments };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        // Prepare the data to submit
        const taskWithAttachments = {
            ...task,
            attachments: task.attachments.map((attachment) => {
                const fileKey = attachment.fileKey;
                const base64String = localStorage.getItem(fileKey); 
                return { fileKey, base64String }; 
            }),
        };

        if (taskId) {
            try {
                await updateTask(taskId, taskWithAttachments); 
                console.log("Task updated successfully!");
                onClose();
                window.location.reload(); 

            } catch (error) {
                console.error("Error submitting task:", error);
                alert("Failed to update task.");
            }
        }
    };

    const renderAttachmentPreviews = () => {
        return task.attachments.map((attachment, index) => {
            const fileKey = attachment.fileKey;
            console.log(fileKey)
            const base64String = localStorage.getItem(fileKey);

            if (!base64String) return null;

            return (
                <div key={fileKey} className="flex flex-col items-center justify-between space-x-4">
                    <div className="w-40 h-40 bg-gray-200 rounded-md flex justify-center items-center">
                        <img src={base64String} alt={`Attachment ${index}`} className="object-contain w-full h-full" />
                    </div>
                    <button
                        type="button"
                        onClick={() => handleRemoveAttachment(fileKey)}
                        className="text-red-500"
                    >
                        Remove
                    </button>
                </div>
            );
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex h-[95vh] p-6 bg-white rounded-lg shadow-md max-w-7xl mx-auto">
            {/* Left*/}
            <div className="flex-1 space-y-3 p-3 pt-0">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Edit Task</h2>
                    <button type="button" onClick={onClose} className="text-gray-500 text-2xl">&times;</button>
                </div>
                <hr className="border-gray-300 w-full " />
                <div className='flex max-h-[65vh] overflow-y-auto'>

                    <div className='flex flex-col space-y-3 pr-3'>

                        {/* Title Section */}
                        <input
                            type="text"
                            name="title"
                            value={task.title}
                            onChange={handleChange}
                            placeholder="Task Title"
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-2xl"
                        />

                        {/* Description Section */}
                        <textarea
                            name="description"
                            value={task.description}
                            onChange={handleChange}
                            placeholder="Task Description"
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-2xl h-20"
                        />

                        <div className="flex space-x-4">
                            {/* Task Category */}
                            <div className="flex flex-col items-start justify-start gap-3">
                                <label className="text-xs font-semibold">Task Category *</label>
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setTask({ ...task, category: 'work' })}
                                        className={`px-4 py-2 rounded-full ${task.category === 'work' ? 'bg-[#075cab] text-white' : 'bg-gray-50'}`}
                                    >
                                        Work
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTask({ ...task, category: 'personal' })}
                                        className={`px-4 py-2 rounded-full ${task.category === 'personal' ? 'bg-[#075cab] text-white' : 'bg-gray-50'}`}
                                    >
                                        Personal
                                    </button>
                                </div>
                            </div>

                            {/* Due On */}
                            <div className="flex flex-col justify-center items-start gap-3">
                                <label className="text-xs font-semibold">Due On</label>
                                <input
                                    type="date"
                                    name="due_on"
                                    value={task.due_on}
                                    onChange={handleChange}
                                    className="p-3 py-1 bg-gray-50 border border-gray-300 rounded-2xl w-full"
                                />
                            </div>

                            {/* Track Status */}
                            <div className="flex flex-col justify-center items-start gap-3">
                                <label className="text-xs font-semibold">Track Status</label>
                                <select
                                    name="track_status"
                                    value={task.track_status}
                                    onChange={handleChange}
                                    className="p-3 py-1 bg-gray-50 border border-gray-300 rounded-2xl w-full"
                                >
                                    <option value="TO-DO">TO-DO</option>
                                    <option value="IN-PROGRESS">IN-PROGRESS</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                </select>
                            </div>
                        </div>

                        <hr className="my-4 border-gray-300" />

                        {/* Attachment Section */}
                        <div className="flex flex-col items-start justify-start gap-3">
                            <label className="text-xs font-semibold">Attachment</label>
                            <label htmlFor="file-input" className=" w-full border p-2 text-center bg-gray-50 rounded-full cursor-pointer ">
                                Drop your files or click here to <span className='text-[#075cab] underline'>upload</span>
                            </label>
                            <input
                                type="file"
                                id="file-input"
                                accept='image/*'
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {renderAttachmentPreviews()}
                        </div>

                    </div>

                    {/* Right side for activity history */}
                    <div className="w-96 p-0 max-h-[65vh]">
                        <h1 className='text-xl p-3 pt-0'>
                            Activity
                        </h1>
                        <ActivityHistory activities={activities} />
                    </div>

                </div>

                {/* Cancel and Submit */}
                <div className="flex justify-end space-x-4 border-t p-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border rounded-full text-xs text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-[#075cab] text-white rounded-full text-sm"
                    >
                        Save Changes
                    </button>
                </div>
            </div>


        </form>
    );
};

export default TaskEditForm;
