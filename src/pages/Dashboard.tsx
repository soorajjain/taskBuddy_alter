import React, { useState, useEffect, useContext } from 'react';
import { getTasks, addTask, updateTask, deleteTask, getActivityLogs } from '../services/taskService.ts';
import TaskForm from './TaskForm.tsx';
import Navbar from '../components/common/Navbar.js';
import ActivityHistory from './ActivityHistory.tsx';
import { Modal } from '@mui/material';
import Filter from '../components/Filter.tsx';
import { CiSearch } from 'react-icons/ci';
import { useAuth } from "../context/AuthContext.tsx";
import { TaskList } from "./TaskList.tsx"
import { TaskBoard } from "./TaskBoard.tsx"
import Loader from '../components/loader/Loader.tsx';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('list');
  const [showModal, setShowModal] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState({ category: '', dueDate: '' });
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTasks = async () => {
setLoading(true)
      try {
        const tasks = await getTasks();
        setTasks(tasks);
        setFilteredTasks(tasks);
      } catch (error) {
        console.log("error whiile fetching tasks", error)
      } finally {
        setLoading(false)
      }

    };



    fetchTasks();
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (loading) return <Loader/>

  const handleAddTask = async (task) => {
    await addTask(task);
    const updatedTasks = await getTasks();
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    setShowModal(false); // Close modal after adding task
  };

  const handleUpdateTask = async (id, updatedTask) => {
    await updateTask(id, updatedTask);
    const updatedTasks = await getTasks();
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    const updatedTasks = await getTasks();
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    const filtered = tasks.filter((task) => {
      return (
        (newFilter.category ? task.category === newFilter.category : true) &&
        (newFilter.dueDate ? task.dueDate === newFilter.dueDate : true)
      );
    });
    setFilteredTasks(filtered);
  };

  // Handle search query change and filter tasks
  const handleSearch = (query) => {
    setSearchQuery(query);
    const searchResults = tasks.filter((task) =>
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTasks(searchResults);
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar
        user={user}
        setView={setView}
        view={view}
        onLogout={() => logout()}
      />

      <div className="flex flex-col justify-center p-6 pt-0 pb-3 md:pt-6 md:pb-6 ">
        <div className="flex flex-col md:flex-row justify-between items-left md:items-center gap-3">
          <div className='flex justify-end md:hidden'>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#075cab] text-white py-2 px-4 rounded-full bold md:hidden w-fit "
            >
              Add Task
            </button>
          </div>

          <Filter filter={filter} onFilterChange={handleFilterChange} />

          {/* Task Search */}
          <div className="flex justify-start md:justify-center items-center gap-2">
            <div className="flex justify-center items-center">
              <div className="relative w-full md:max-w-sm">
                <CiSearch
                  style={{ fill: "#D1D5DB" }}
                  className="absolute left-[8%] top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-300"
                />
                <input
                  type="text"
                  className="w-full pl-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)} // Handle search input change
                />
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#075cab] text-white py-2 px-4 rounded-full font-bold hidden md:block"
            >
              Add Task
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between mb-6">
        <div className="max-w-[98%] w-full mx-auto">
          {/* Single Task Board */}
          {view !== "list" && (
            <div className="space-y-6">
              <TaskBoard
                tasks={filteredTasks}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            </div>
          )}

          {/* If not in board view, show the list view */}
          {view === "list" && (
            <div className="space-y-6">
              <TaskList
                tasks={filteredTasks}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal for Create Task */}
      {showModal && (
        <Modal open={showModal} setshowmodal={setShowModal}>
          <div className="flex">
            {/* Create Task Form (Left side) */}
            <div className=" p-6 pb-0 px-0 md:pb-6 md:px-6 w-full flex justify-center items-center h-screen">
              <TaskForm
                onSubmit={handleAddTask}
                onClose={() => setShowModal(false)}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
