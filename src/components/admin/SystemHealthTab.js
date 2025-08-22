'use client'

import React from 'react';

const SystemHealthTab = ({ systemHealth }) => {
  return (
    <div>
      <div className="bg-[#232326] rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">System Health Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${systemHealth.cpuUsage < 80 ? 'bg-green-500' : 'bg-red-500'}`}>
              {systemHealth.cpuUsage}%
            </div>
            <div className="mt-2">CPU Usage</div>
          </div>
          <div className="text-center">
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${systemHealth.ramUsage < 80 ? 'bg-green-500' : 'bg-red-500'}`}>
              {systemHealth.ramUsage}%
            </div>
            <div className="mt-2">RAM Usage</div>
          </div>
          <div className="text-center">
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${systemHealth.storageUsage < 80 ? 'bg-green-500' : 'bg-red-500'}`}>
              {systemHealth.storageUsage}%
            </div>
            <div className="mt-2">Storage Usage</div>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-bold mb-2">Recent System Events</h4>
          <ul className="list-disc list-inside text-gray-400">
            {systemHealth.recentEvents.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthTab;