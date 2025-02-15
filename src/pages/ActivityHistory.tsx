import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const ActivityHistory = ({ activities }) => {
  return (
    <div className="bg-gray-100 p-2 overflow-y-auto">
      <ul className="space-y-2">
        {activities.map((activity, index) => (
          <li key={index} className="p-2 border-b border-gray-300 flex justify-between items-center">
            {/* Render the task title and relative time */}
            <p className='text-xs w-[65%]'>{activity.action}</p>
            <p className='text-xs'>{formatDistanceToNow(new Date(activity.timestamp))} ago</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityHistory;
