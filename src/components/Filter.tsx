import React, { useState } from 'react';

const Filter = ({ filter, onFilterChange }) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDueDateDropdown, setShowDueDateDropdown] = useState(false);

  // Handle category change
  const handleCategoryChange = (e) => {
    const newFilter = { ...filter, category: e.target.value };
    onFilterChange(newFilter); // Send updated filter to parent
    setShowCategoryDropdown(false); // Close the dropdown after selection
  };

  // Handle due date change
  const handleDueDateChange = (e) => {
    const newFilter = { ...filter, dueDate: e.target.value };
    onFilterChange(newFilter); // Send updated filter to parent
    setShowDueDateDropdown(false); // Close the dropdown after selection
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center space-x-0 md:space-x-3 space-y-3 md:space-y-0">
      {/* Filter by text */}
      <div className="text-gray-500">Filter by: </div>

      <div className='flex gap-3'>



        {/* Category Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center space-x-2 p-1 border-2 rounded-full"
          >
            <span className='px-3'>{filter.category || 'Category'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Category Dropdown */}
          {showCategoryDropdown && (
            <div className="absolute right-0 w-full mt-1 bg-white shadow-lg rounded-lg z-50">
              <button
                value="work"
                onClick={handleCategoryChange}
                className="block w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100"
              >
                Work
              </button>
              <button
                value="personal"
                onClick={handleCategoryChange}
                className="block w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100"
              >
                Personal
              </button>
            </div>
          )}
        </div>

        {/* Due Date Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDueDateDropdown(!showDueDateDropdown)}
            className="flex items-center space-x-2 p-1 px-4 border-2 rounded-full  z-50"
          >
            <span>{filter.dueDate ? new Date(filter.dueDate).toLocaleDateString() : 'Due Date'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Due Date Dropdown */}
          {showDueDateDropdown && (
            <div className="absolute right-0 w-full mt-1 bg-white shadow-lg rounded-md z-50">
              <input
                type="date"
                value={filter.dueDate || ''}
                onChange={handleDueDateChange}
                className="w-full px-4 py-2 text-sm text-gray-700 border rounded-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;
