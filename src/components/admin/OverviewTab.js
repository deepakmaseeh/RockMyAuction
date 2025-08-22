'use client'

import React from 'react';

const OverviewTab = ({ adminStats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Activity Chart Placeholder */}
        <div className="bg-[#232326] rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-bold mb-4">Platform Activity (Last 30 days)</h3>
          <div className="h-48 sm:h-64 flex items-end justify-between gap-1 sm:gap-2 bg-[#2a2a2e] rounded p-2 sm:p-4">
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className="bg-orange-500 w-1 sm:w-2 rounded-t transition-all"
                style={{ height: `${Math.floor(Math.random() * 80) + 10}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-[#232326] rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-bold mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Active Users</span>
              <span className="font-bold">{adminStats.activeUsers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Monthly Revenue</span>
              <span className="font-bold">${adminStats.monthlyRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Conversion Rate</span>
              <span className="font-bold">{adminStats.conversionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average Order Value</span>
              <span className="font-bold">${adminStats.averageOrderValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;