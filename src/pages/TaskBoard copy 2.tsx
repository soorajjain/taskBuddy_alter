import React, { useState, useEffect } from 'react';
import { deleteTask, updateTaskOrder } from '../services/taskService.ts';
import ToDoTable from './Boards/ToDoTable.tsx';
import InProgressTable from './Boards/InProgressTable.tsx';
import CompletedTable from './Boards/CompletedTable.tsx';

export const TaskBoard = ({ tasks }) => {
  const [taskList, setTaskList] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState({});
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    setTaskList(tasks || []);
  }, [tasks]);

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    setTaskList(taskList.filter((task) => task.id !== taskId));
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

  return (
    <div className="p-4">
      {/* Shared Controls */}
      <div className="flex justify-end mb-4 gap-3">
        <button
          onClick={deleteSelectedTasks}
          className="flex items-center space-x-2 p-1 px-4 border rounded-full bg-red-500 text-white font-bold"
        >
          Delete Selected
        </button>
      </div>

      {/* Separate Tables */}
      <ToDoTable
        tasks={taskList.filter(task => task.track_status === "TO-DO")}
        onDeleteTask={handleDeleteTask}
        onToggleSelection={toggleTaskSelection}
        selectedTasks={selectedTasks}
        sortTasksByDate={sortTasksByDate}
        sortOrder={sortOrder}
      />

      <InProgressTable
        tasks={taskList.filter(task => task.track_status === "IN-PROGRESS")}
        onDeleteTask={handleDeleteTask}
        onToggleSelection={toggleTaskSelection}
        selectedTasks={selectedTasks}
        sortTasksByDate={sortTasksByDate}
        sortOrder={sortOrder}
      />

      <CompletedTable
        tasks={taskList.filter(task => task.track_status === "COMPLETED")}
        onDeleteTask={handleDeleteTask}
        onToggleSelection={toggleTaskSelection}
        selectedTasks={selectedTasks}
        sortTasksByDate={sortTasksByDate}
        sortOrder={sortOrder}
      />
    </div>
  );
};