import React, { useEffect, useState, useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { deleteTask, updateTaskOrder, updateTask } from '../services/taskService.ts';
import { Modal } from '@mui/material';
import TaskEditForm from './TaskEditForm.tsx';
import TaskDetailsPage from './TaskDetails.tsx';
import ToDoTable from './Boards/ToDoTable.tsx';
import InProgressTable from './Boards/InProgressTable.tsx';
import CompletedTable from './Boards/CompletedTable.tsx';
import { MdLibraryAddCheck } from 'react-icons/md';

export const TaskBoard = ({ tasks }) => {
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
    console.log("selectedTasks", selectedTasks);
    console.log(Object.keys(selectedTasks).length);

  }, [selectedTasks]);

  // New state to manage visibility of each task table
  const [tableVisibility, setTableVisibility] = useState({
    'TO-DO': true,
    'IN-PROGRESS': true,
    'COMPLETED': true
  });

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

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const reorderedTasks = [...taskList];
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setTaskList(reorderedTasks);

    const updatedTasks = reorderedTasks.map((task, index) => ({ id: task.id, orderIndex: index }));
    try {
      await updateTaskOrder(updatedTasks);
      console.log("Task order updated successfully");
    } catch (error) {
      console.error('Error updating task order:', error);
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

  const updateSelectedStatus = async (selectedStatus) => {
    const selectedTaskIds = Object.keys(selectedTasks).filter(taskId => selectedTasks[taskId]);
    if (selectedTaskIds.length === 0 || !selectedStatus) return;

    try {
      const updatedTasks = await Promise.all(
        selectedTaskIds.map(async (taskId) => {
          const task = taskList.find(task => task.id === taskId);
          const updatedTask = { ...task, track_status: selectedStatus };

          await updateTask(taskId, updatedTask);

          return updatedTask;
        })
      );

      setTaskList((prevTaskList) => {
        const updatedTaskList = prevTaskList.map((task) =>
          updatedTasks.find((updatedTask) => updatedTask.id === task.id) || task
        );
        return updatedTaskList;
      });

      setSelectedTasks({});
      console.log(`Status updated for ${selectedTaskIds.length} tasks`);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Toggle visibility of each status table
  const toggleTableVisibility = (status) => {
    setTableVisibility(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  return (
    <div className="p-4 flex gap-4 items-start justify-center ">
      {/* Shared Controls */}

      {Object.values(selectedTasks).filter((val) => val).length > 0 && (
        <div className="flex fixed bottom-4 left-1/2 transform -translate-x-1/2 justify-between items-center w-fit p-4 bg-gray-800 text-white border rounded-xl shadow-lg gap-3 z-50">
          {/* Selected count label with icon */}
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {Object.values(selectedTasks).filter((val) => val).length}{" "}
            </span>
            <MdLibraryAddCheck className='w-5 h-5' />
          </div>

          {/* Status update dropdown & Delete button */}
          <div className="flex gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => {
                const newStatus = e.target.value;
                setSelectedStatus(newStatus);
                if (newStatus) {
                  updateSelectedStatus(newStatus);
                }
              }}
              className="p-1 border px-2 rounded-full text-black"
            >
              <option value="">Status Update</option>
              <option value="TO-DO">TO-DO</option>
              <option value="IN-PROGRESS">IN-PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>

            <button
              onClick={deleteSelectedTasks}
              className="flex items-center space-x-2 p-1 px-4 border rounded-full bg-red-500 text-white font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Separate Tables */}
      <div className="flex space-x-4">
        <div className="w-1/3">
          <DragDropContext onDragEnd={onDragEnd}>
            <ToDoTable
              tasks={taskList.filter((task) => task.track_status === "TO-DO")}
              onDeleteTask={handleDeleteTask}
              onToggleSelection={toggleTaskSelection}
              selectedTasks={selectedTasks}
              sortTasksByDate={sortTasksByDate}
              sortOrder={sortOrder}
              menuOpenTaskId={menuOpenTaskId}
              setMenuOpenTaskId={setMenuOpenTaskId}
              menuRef={menuRef}
              setShowModal={setShowModal}
              setEditTaskId={setEditTaskId}
              setShowDetailsModal={setShowDetailsModal}
              setDetailsTaskId={setDetailsTaskId}
              tableVisibility={tableVisibility["TO-DO"]}
              toggleTableVisibility={() => toggleTableVisibility("TO-DO")}
            />
          </DragDropContext>
        </div>

        <div className="w-1/3">
          <DragDropContext onDragEnd={onDragEnd}>
            <InProgressTable
              tasks={taskList.filter((task) => task.track_status === "IN-PROGRESS")}
              onDeleteTask={handleDeleteTask}
              onToggleSelection={toggleTaskSelection}
              selectedTasks={selectedTasks}
              sortTasksByDate={sortTasksByDate}
              sortOrder={sortOrder}
              menuOpenTaskId={menuOpenTaskId}
              setMenuOpenTaskId={setMenuOpenTaskId}
              menuRef={menuRef}
              setShowModal={setShowModal}
              setEditTaskId={setEditTaskId}
              setShowDetailsModal={setShowDetailsModal}
              setDetailsTaskId={setDetailsTaskId}
              tableVisibility={tableVisibility["IN-PROGRESS"]}
              toggleTableVisibility={() => toggleTableVisibility("IN-PROGRESS")}
            />
          </DragDropContext>
        </div>

        <div className="w-1/3">
          <DragDropContext onDragEnd={onDragEnd}>
            <CompletedTable
              tasks={taskList.filter((task) => task.track_status === "COMPLETED")}
              onDeleteTask={handleDeleteTask}
              onToggleSelection={toggleTaskSelection}
              selectedTasks={selectedTasks}
              sortTasksByDate={sortTasksByDate}
              sortOrder={sortOrder}
              menuOpenTaskId={menuOpenTaskId}
              setMenuOpenTaskId={setMenuOpenTaskId}
              menuRef={menuRef}
              setShowModal={setShowModal}
              setEditTaskId={setEditTaskId}
              setShowDetailsModal={setShowDetailsModal}
              setDetailsTaskId={setDetailsTaskId}
              tableVisibility={tableVisibility["COMPLETED"]}
              toggleTableVisibility={() => toggleTableVisibility("COMPLETED")}
            />
          </DragDropContext>
        </div>
      </div>


      {/* Modals */}
      {showModal && (
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div className="flex">
            <div className="p-6 w-full flex justify-center items-center h-screen">
              <TaskEditForm
                onClose={() => setShowModal(false)}
                taskId={editTaskId}
              />
            </div>
          </div>
        </Modal>
      )}

      {showDetailsModal && (
        <Modal
          open={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        >
          <div className="flex">
            <div className="p-6 w-full flex justify-center items-center h-screen">
              <TaskDetailsPage
                onClose={() => setShowDetailsModal(false)}
                taskId={detailsTaskId}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};