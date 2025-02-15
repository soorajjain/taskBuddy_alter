import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';

const TaskForm = ({ onSubmit, onClose }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    category: 'work',
    due_on: '',
    track_status: 'TO-DO',
    attachments: [] // Will store file URLs here
  });

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

  const renderAttachmentPreviews = () => {
    return task.attachments.map((attachment, index) => {
      const fileKey = attachment.fileKey;
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
  // Helper function to convert file to base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file); // Convert the file to base64
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const taskWithFiles = { ...task };
    onSubmit(taskWithFiles);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-6 h-[95vh] bg-white rounded-lg shadow-md max-w-2xl mx-auto overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Create Task</h2>
        <button type="button" onClick={onClose} className="text-gray-500 text-2xl">&times;</button>
      </div>
      <hr className="my-4 border-gray-300" />

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

      {/* Task Category, Due On, and Track Status in a single row */}
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
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        {renderAttachmentPreviews()}
      </div>

      {/* Cancel and Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border rounded-full text-xs text-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-[#075cab] text-white rounded-full text-xs"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
