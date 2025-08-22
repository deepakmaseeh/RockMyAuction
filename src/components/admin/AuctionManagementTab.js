'use client'

import React from 'react';

const AuctionManagementTab = ({ recentAuctions, handleAuctionAction, getStatusColor }) => {
  return (
    <div>
      <div className="bg-[#232326] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#2a2a2e]">
              <tr>
                <th className="p-4 font-medium">Auction</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium hidden md:table-cell">Current Bid</th>
                <th className="p-4 font-medium hidden md:table-cell">Bids</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentAuctions.map(auction => (
                <tr key={auction.id} className="border-b border-[#2a2a2e]">
                  <td className="p-4">
                    <div className="font-bold">{auction.title}</div>
                    <div className="text-gray-400 text-xs">Seller: {auction.seller}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(auction.status)}`}>
                      {auction.status}
                    </span>
                    {auction.reported && <span className="ml-2 text-red-400">!</span>}
                  </td>
                  <td className="p-4 hidden md:table-cell">${auction.currentBid}</td>
                  <td className="p-4 hidden md:table-cell">{auction.bids}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleAuctionAction(auction.id, 'View')} className="text-blue-400 hover:text-blue-300">View</button>
                      <button onClick={() => handleAuctionAction(auction.id, 'Edit')} className="text-yellow-400 hover:text-yellow-300">Edit</button>
                      <button onClick={() => handleAuctionAction(auction.id, 'End')} className="text-red-400 hover:text-red-300">End</button>
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

export default AuctionManagementTab;