import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { FiMoreHorizontal } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";
import { LuGripVertical } from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa";
import { BiDetail } from "react-icons/bi";

const CompletedTable = ({
  tasks = [],
  onDeleteTask,
  onToggleSelection,
  selectedTasks,
  sortTasksByDate,
  sortOrder,
  menuOpenTaskId,
  setMenuOpenTaskId,
  menuRef,
  setShowModal,
  setEditTaskId,
  setShowDetailsModal,
  setDetailsTaskId,
  tableVisibility,
  toggleTableVisibility,
}) => {
  return (
    <div className="mb-8 w-[30vw]">
      {/* Section Header */}
      <div className="bg-[#A2D6A0] p-2 rounded-t-lg w-full">
        <div className="flex justify-between items-center">
          <span className="font-semibold">COMPLETED ({tasks.length})</span>
          <button onClick={toggleTableVisibility} className="text-sm">
            {tableVisibility ? (
              <RiArrowDropDownLine className="w-7 h-7 rotate-180" />
            ) : (
              <RiArrowDropDownLine className="w-7 h-7" />
            )}
          </button>
        </div>
      </div>

      {/* Droppable Tasks List */}
      {tableVisibility && (
        <Droppable droppableId="to-do-tasks">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
             
              {/* Tasks List as Cards */}
              <div className="space-y-2 p-4 bg-[#f1f1f1] h-screen">
              {tasks.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No Tasks in Completed
                </div>
              )}
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-2 rounded-lg shadow-md relative"
                      >
                        {/* First Row: Task Title and Three Dots Menu */}
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center gap-2 p-2">
                            <span className="font-medium text-sm line-through">{task.title}</span>
                          </div>
                          <div className="relative">
                            <div
                              className="cursor-pointer p-2"
                              onClick={() =>
                                setMenuOpenTaskId(
                                  menuOpenTaskId === task.id ? null : task.id
                                )
                              }
                            >
                              <FiMoreHorizontal />
                            </div>

                            {/* Task Menu */}
                            {menuOpenTaskId === task.id && (
                              <div
                                ref={menuRef}
                                className="absolute right-0 top-6 mt-2 bg-white shadow-lg rounded-md w-24 z-50"
                              >
                                <button
                                  className="flex justify-start items-center gap-1 w-full text-left px-2 py-1 hover:bg-gray-100 border-b"
                                  onClick={() => {
                                    setShowModal(true);
                                    setEditTaskId(task.id);
                                  }}
                                >
                                  <CiEdit />
                                  <span className="font-bold text-xs">Edit</span>
                                </button>
                                <button
                                  className="flex justify-start items-center border-b gap-1 w-full text-left px-2 py-1 hover:bg-gray-100 text-red-500"
                                  onClick={() => onDeleteTask(task.id)}
                                >
                                  <MdDeleteOutline style={{ fill: "red" }} />
                                  <span className="font-bold text-xs">Delete</span>
                                </button>
                                <button
                                  className="flex justify-start items-center gap-1 w-full text-left px-2 py-1 hover:bg-gray-100"
                                  onClick={() => {
                                    setShowDetailsModal(true);
                                    setDetailsTaskId(task.id);
                                  }}
                                >
                                  <BiDetail />
                                  <span className="font-bold text-xs">Details</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Second Row: Category and Due Date */}
                        <div className="flex justify-between items-center mt-10  text-xs text-gray-500">
                          <span>{task.category}</span>
                          <span>{task.due_on}</span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};

export default CompletedTable;