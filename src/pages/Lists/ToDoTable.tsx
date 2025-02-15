import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { FiMoreHorizontal } from "react-icons/fi";
import { BsGripVertical } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";
import { LuGripVertical } from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa";
import { BiDetail } from "react-icons/bi";

const ToDoTable = ({
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
    <div className="mb-8">
      {/* Table Header */}
      <table className="min-w-full bg-white border-t mt-3 table-auto hidden md:table">
        <thead>
          <tr>
            <th className="p-2 w-[40%] text-left text-gray-600 text-xs">Task Name</th>
            <th
              className="p-2 cursor-pointer w-[20%] text-center text-gray-600 text-xs"
              onClick={sortTasksByDate}
            >
              Due On {sortOrder === "asc" ? "↑" : "↓"}
            </th>
            <th className="p-2 w-[10%] text-gray-600 text-xs">Track Status</th>
            <th className="p-2 w-[20%] text-gray-600 text-xs">Task Category</th>
            <th className="p-2 w-[10%] text-gray-600"></th>
          </tr>
        </thead>
      </table>

      {/* Section Header */}
      <div className="bg-[#FAC3FF] p-2 rounded-t-lg w-full mt-3">
        <div className="flex justify-between items-center">
          <span className="font-semibold">TO-DO ({tasks.length})</span>
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
              <table className="min-w-full bg-[#F1F1F1] shadow-md rounded-lg">
                <tbody>
                  {/* Empty Tasks Message */}
                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-gray-500">
                        No Tasks in To-Do
                      </td>
                    </tr>
                  )}

                  {/* Tasks List */}
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="border-b relative"
                        >
                          <td className="p-4 w-[10%]">
                            <div className="flex gap-2 items-center justify-center w-full">
                              <input
                                type="checkbox"
                                checked={!!selectedTasks[task.id]}
                                onChange={() => onToggleSelection(task.id)}
                              />
                              <LuGripVertical />
                              <FaCheckCircle style={{ fill: "gray" }} />
                            </div>
                          </td>
                          <td className="p-2 text-left w-[30%] ">
                            {task.title}
                          </td>
                          <td className="p-2 text-center w-[20%] hidden md:table-cell">
                            {task.due_on}
                          </td>
                          <td className="p-2 text-center w-[10%] hidden md:table-cell">
                            <span className="p-2 bg-[#dddadd] rounded-md text-xs">
                              {task.track_status}
                            </span>
                          </td>
                          <td className="p-2 text-center w-[20%] hidden md:table-cell">
                            {task.category}
                          </td>

                          <td className="p-2 w-[10%] relative">
                            <div className="flex justify-center items-center cursor-pointer">
                              <div
                                className="cursor-pointer"
                                onClick={() =>
                                  setMenuOpenTaskId(
                                    menuOpenTaskId === task.id ? null : task.id
                                  )
                                }
                              >
                                <FiMoreHorizontal />
                              </div>
                            </div>

                            {/* Task Menu */}
                            {menuOpenTaskId === task.id && (
                              <div
                                ref={menuRef}
                                className="absolute right-[60%] top-[10%] mt-2 bg-white shadow-lg rounded-md w-24 z-50"
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
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};

export default ToDoTable;
