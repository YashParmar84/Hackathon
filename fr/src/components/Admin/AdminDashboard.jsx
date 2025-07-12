// src/components/Admin/AdminDashboard.jsx
import React from 'react';

const AdminDashboard = () => (
  <div className="flex min-h-screen bg-gray-900">
    {/* Sidebar */}
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-6 font-bold text-xl border-b border-gray-700">Admin Panel</div>
      <nav className="flex-1 p-4 space-y-2">
        <a href="/admin/users" className="block py-2 px-4 rounded hover:bg-gray-700">Users</a>
        <a href="/admin/swaps" className="block py-2 px-4 rounded hover:bg-gray-700">Swaps</a>
        <a href="/admin/reports" className="block py-2 px-4 rounded hover:bg-gray-700">Reports</a>
      </nav>
    </aside>
    {/* Main Content */}
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h1>
      {/* Add widgets, stats, tables, etc. here */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow text-white">
          <div className="text-lg font-semibold mb-2">Total Users</div>
          <div className="text-3xl font-bold">123</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow text-white">
          <div className="text-lg font-semibold mb-2">Active Swaps</div>
          <div className="text-3xl font-bold">45</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow text-white">
          <div className="text-lg font-semibold mb-2">Reports</div>
          <div className="text-3xl font-bold">3</div>
        </div>
      </div>
    </main>
  </div>
);

export default AdminDashboard; 