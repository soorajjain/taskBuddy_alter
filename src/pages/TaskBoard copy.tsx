import React, { useEffect, useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { addTask, updateTask, deleteTask, updateTaskOrder } from '../services/taskService.ts';
import { FiMoreHorizontal } from 'react-icons/fi';
import { BsGripVertical } from 'react-icons/bs';
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { Modal } from '@mui/material';
import TaskEditForm from './TaskEditForm.tsx';
import TaskDetailsPage from './TaskDetails.tsx';

export const TaskBoard = ({ tasks, activities }) => {
  const [taskList, setTaskList] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState({});
  const [sortOrder, setSortOrder] = useState("asc");
  const [menuOpenTaskId, setMenuOpenTaskId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const menuRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState(false);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTaskId, setDetailsTaskId] = useState(false);

  useEffect(() => {
    setTaskList(tasks || []);
  }, [tasks]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenTaskId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const reorderedTasks = [...taskList];
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setTaskList(reorderedTasks);

    const updatedTasks = reorderedTasks.map((task, index) => ({ id: task.id, orderIndex: index }));
    try {
      await updateTaskOrder(updatedTasks);
      console.log("Task order updated in Firebase successfully");
    } catch (error) {
      console.error('Error updating task order in Firebase:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    setTaskList(taskList.filter((task) => task.id !== taskId));
    setMenuOpenTaskId(null);
  };

  const deleteSelectedTasks = async () => {
    const selectedTaskIds = Object.keys(selectedTasks).filter(taskId => selectedTasks[taskId]);
    if (selectedTaskIds.length === 0) return;

    try {
      await Promise.all(selectedTaskIds.map((taskId) => deleteTask(taskId)));
      setTaskList(taskList.filter((task) => !selectedTaskIds.includes(task.id)));
      setSelectedTasks({});
      console.log(`Deleted ${selectedTaskIds.length} tasks`);
    } catch (error) {
      console.error('Error deleting tasks:', error);
    }
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const sortTasksByDate = () => {
    const sortedTasks = [...taskList].sort((a, b) => {
      return sortOrder === "asc"
        ? new Date(a.due_on) - new Date(b.due_on)
        : new Date(b.due_on) - new Date(a.due_on);
    });
    setTaskList(sortedTasks);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Handle batch status update for selected tasks
  const updateSelectedStatus = async (selectedStatus) => {
    const selectedTaskIds = Object.keys(selectedTasks).filter(taskId => selectedTasks[taskId]);
    if (selectedTaskIds.length === 0 || !selectedStatus) return;

    try {
      // Update the tasks with the new status
      const updatedTasks = await Promise.all(
        selectedTaskIds.map(async (taskId) => {
          const task = taskList.find(task => task.id === taskId);
          const updatedTask = { ...task, track_status: selectedStatus };

          // Call the API to update the task
          await updateTask(taskId, updatedTask);

          // Return the updated task
          return updatedTask;
        })
      );

      // Update the state with the modified task list
      setTaskList((prevTaskList) => {
        const updatedTaskList = prevTaskList.map((task) =>
          updatedTasks.find((updatedTask) => updatedTask.id === task.id) || task
        );
        return updatedTaskList;
      });

      // Reset the selected tasks
      setSelectedTasks({});
      console.log(`Status updated for ${selectedTaskIds.length} tasks`);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };


  // Render the table grouped by status
  const renderTable = () => {
    const groupedTasks = {
      "TO-DO": taskList.filter(task => task.track_status === "TO-DO"),
      "IN-PROGRESS": taskList.filter(task => task.track_status === "IN-PROGRESS"),
      "COMPLETED": taskList.filter(task => task.track_status === "COMPLETED")
    };

    return (
      <div className="p-4">
        {selectedTasks && (
          <div className="flex justify-end mb-4 gap-3 ">


            <div>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  console.log(newStatus)
                  setSelectedStatus(newStatus);

                  if (newStatus) {
                    updateSelectedStatus(newStatus);
                  }
                }}
                className=" p-1 border px-1 rounded-full "
              >
                <option value="">Status Update</option>
                <option value="TO-DO">TO-DO</option>
                <option value="IN-PROGRESS">IN-PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
            <div>
              <button
                onClick={() => deleteSelectedTasks()}
                className="flex items-center space-x-2 p-1 px-4 border rounded-full bg-red-500 text-white font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        )}



        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <table className="min-w-full bg-white shadow-md rounded-lg" {...provided.droppableProps} ref={provided.innerRef}>
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">&nbsp;</th>
                    <th className="p-2 max-w-[200px]">Task Name</th>
                    <th className="p-2 cursor-pointer" onClick={sortTasksByDate}>
                      Due On {sortOrder === "asc" ? "↑" : "↓"}
                    </th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(groupedTasks).map((status) => (
                    <React.Fragment key={status}>
                      <tr className="bg-gray-100">
                        <td colSpan="6" className="p-2 text-left font-semibold">{status}</td>
                      </tr>
                      {groupedTasks[status].map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border-b relative">
                              <td className="p-2 flex gap-2 items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={!!selectedTasks[task.id]}
                                  onChange={() => toggleTaskSelection(task.id)}
                                />
                                <BsGripVertical />
                              </td>
                              <td className="p-2 text-center max-w-[200px]">{task.title}</td>
                              <td className="p-2 text-center">{task.due_on}</td>
                              <td className="p-2 text-center">{task.track_status}</td>
                              <td className="p-2 text-center">{task.category}</td>
                              <td className="p-2 relative flex justify-center items-center cursor-pointer">
                                <div
                                  className="cursor-pointer"
                                  onClick={() => setMenuOpenTaskId(menuOpenTaskId === task.id ? null : task.id)}
                                >
                                  <FiMoreHorizontal />
                                </div>
                                {menuOpenTaskId === task.id && (
                                  <div ref={menuRef} className="absolute right-[60%] top-[10%] mt-2 bg-white shadow-lg rounded-md w-24 z-50">
                                    <button
                                      className="flex justify-start items-center gap-1 w-full text-left px-2 py-1 hover:bg-gray-100"
                                      onClick={() => {
                                        setShowModal(true)
                                        setEditTaskId(task.id)
                                      }}
                                    >
                                      <CiEdit /> <span className='font-bold'>Edit</span>
                                    </button>
                                    <button
                                      className="flex justify-start items-center gap-1 w-full text-left px-2 py-1 hover:bg-gray-100 text-red-500"
                                      onClick={() => handleDeleteTask(task.id)}
                                    >
                                      <MdDeleteOutline style={{ fill: "red" }} /> <span className='font-bold'>Delete</span>
                                    </button>
                                    <button
                                      className="flex justify-start items-center gap-1 w-full text-left px-2 py-1 hover:bg-gray-100 "
                                      onClick={() => {
                                        setShowDetailsModal(true)
                                        setDetailsTaskId(task.id)
                                      }}
                                    >
                                      <span className='font-bold'>Details</span>
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
        {showModal && (
          <Modal open={showModal} setshowmodal={setShowModal}>
            <div className="flex">
              {/* Create Task Form (Left side) */}
              <div className=" p-6 w-full flex justify-center items-center h-screen">
                <TaskEditForm onClose={() => setShowModal(false)} taskId={editTaskId} activities={activities} />
              </div>
            </div>
          </Modal>
        )}

        {showDetailsModal && (
          <Modal open={showDetailsModal} setshowmodal={setShowDetailsModal}>
            <div className="flex">
              {/* Create Task Form (Left side) */}
              <div className=" p-6 w-full flex justify-center items-center h-screen">
                <TaskDetailsPage onClose={() => setShowDetailsModal(false)} taskId={detailsTaskId} />
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  };

  return renderTable();
};
