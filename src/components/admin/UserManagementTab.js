'use client'

import React from 'react';

const UserManagementTab = ({ recentUsers, handleUserAction, getStatusColor }) => {
  return (
    <div>
      <div className="bg-[#232326] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#2a2a2e]">
              <tr>
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium hidden md:table-cell">Sales</th>
                <th className="p-4 font-medium hidden md:table-cell">Purchases</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(user => (
                <tr key={user.id} className="border-b border-[#2a2a2e]">
                  <td className="p-4">
                    <div className="font-bold">{user.name}</div>
                    <div className="text-gray-400 text-xs">{user.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell">{user.sales}</td>
                  <td className="p-4 hidden md:table-cell">{user.purchases}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleUserAction(user.id, 'View')} className="text-blue-400 hover:text-blue-300">View</button>
                      <button onClick={() => handleUserAction(user.id, 'Edit')} className="text-yellow-400 hover:text-yellow-300">Edit</button>
                      <button onClick={() => handleUserAction(user.id, 'Suspend')} className="text-red-400 hover:text-red-300">Suspend</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementTab;