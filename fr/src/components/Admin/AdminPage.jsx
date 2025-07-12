import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  AlertTriangle, 
  MessageSquare, 
  Download, 
  BarChart3, 
  Eye, 
  Ban, 
  Flag, 
  CheckCircle, 
  XCircle,
  Clock,
  Send,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // Check if user is admin
  if (!user?.isAdmin) {
    return (
      <div className="p-6 text-center">
        <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-gray-400">You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage users, monitor swaps, and control platform settings</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-800 rounded-lg p-1">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'flagged', label: 'Flagged Users', icon: Flag },
          { id: 'swaps', label: 'Swaps', icon: MessageSquare },
          { id: 'messages', label: 'Platform Messages', icon: Send },
          { id: 'reports', label: 'Reports', icon: Download }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800 rounded-lg p-6">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'flagged' && <FlaggedUsersTab />}
        {activeTab === 'swaps' && <SwapsTab />}
        {activeTab === 'messages' && <MessagesTab />}
        {activeTab === 'reports' && <ReportsTab />}
      </div>
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/v1/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Platform Statistics</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Swaps</p>
              <p className="text-2xl font-bold text-white">{stats?.activeSwaps || 0}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Flagged Users</p>
              <p className="text-2xl font-bold text-white">{stats?.flaggedUsers || 0}</p>
            </div>
            <Flag className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed Swaps</p>
              <p className="text-2xl font-bold text-white">{stats?.completedSwaps || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Users</h3>
          <div className="space-y-3">
            <p className="text-2xl font-bold text-white">{stats?.recentUsers ?? 0}</p>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Swaps</h3>
          <div className="space-y-3">
            {stats?.recentSwaps?.map((swap, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{swap.fromUser.name} → {swap.toUser.name}</p>
                  <p className="text-gray-400 text-sm">{swap.skillOffered} ↔ {swap.skillRequested}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  swap.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  swap.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {swap.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Users Tab Component
const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: 'active',
    role: 'user',
    search: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...filters
      });
      
      const response = await fetch(`http://localhost:8000/api/v1/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users);
        setTotalPages(data.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, status, reason = '') => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, flagReason: reason }),
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
            <option value="under_review">Under Review</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">{user.name}</h3>
                  <p className="text-gray-400">{user.email}</p>
                  <p className="text-gray-500 text-sm">Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {user.status}
                  </span>
                  <button
                    onClick={() => updateUserStatus(user._id, 'disabled', 'Policy violation')}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                  >
                    Disable
                  </button>
                  <button
                    onClick={() => updateUserStatus(user._id, 'active')}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                  >
                    Enable
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-2 rounded ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Flagged Users Tab Component
const FlaggedUsersTab = () => {
  const [flaggedUsers, setFlaggedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlaggedUsers();
  }, []);

  const fetchFlaggedUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/v1/admin/flagged-users?page=1&limit=10&status=disabled', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setFlaggedUsers(data.data.flaggedUsers);
      }
    } catch (error) {
      console.error('Error fetching flagged users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Flagged Users</h2>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {flaggedUsers.map((user) => (
            <div key={user.id} className="bg-gray-700 rounded-lg p-4 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">{user.name}</h3>
                  <p className="text-gray-400">{user.email}</p>
                  <p className="text-red-400 text-sm">Reason: {user.flagReason}</p>
                  <p className="text-gray-500 text-sm">Flagged: {new Date(user.flaggedAt).toLocaleDateString()}</p>
                </div>
              
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Swaps Tab Component
const SwapsTab = () => {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');

  useEffect(() => {
    fetchSwaps();
  }, [statusFilter]);

  const fetchSwaps = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: statusFilter,
        page: 1,
        limit: 10
      });
      
      const response = await fetch(`http://localhost:8000/api/v1/admin/swaps?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setSwaps(data.data.swaps);
      }
    } catch (error) {
      console.error('Error fetching swaps:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Swap Management</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        >
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {swaps.map((swap) => (
            <div key={swap.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">
                    {(swap.fromUser?.name || 'Unknown')} ↔ {(swap.toUser?.name || 'Unknown')}
                  </h3>
                  <p className="text-gray-400">
                    {swap.skillOffered} ↔ {swap.skillRequested}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Created: {new Date(swap.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  swap.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  swap.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  swap.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {swap.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Messages Tab Component
const MessagesTab = () => {
  const [message, setMessage] = useState({
    title: '',
    content: '',
    type: 'all'
  });

  const sendPlatformMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/platform-message', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: message.title,
          message: message.content,
          type: message.type
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ title: '', content: '', type: 'all' });
        alert('Message sent successfully!');
      }
    } catch (error) {
      console.error('Error sending platform message:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Platform Messages</h2>
      
      <form onSubmit={sendPlatformMessage} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Message Title
          </label>
          <input
            type="text"
            value={message.title}
            onChange={(e) => setMessage({ ...message, title: e.target.value })}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            placeholder="Enter message title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Message Content
          </label>
          <textarea
            value={message.content}
            onChange={(e) => setMessage({ ...message, content: e.target.value })}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            placeholder="Enter message content"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target Users
          </label>
          <select
            value={message.type}
            onChange={(e) => setMessage({ ...message, type: e.target.value })}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="all">All Users</option>
            <option value="active">Active Users</option>
            <option value="verified">Verified Users</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Send Platform Message
        </button>
      </form>
    </div>
  );
};

// Reports Tab Component
const ReportsTab = () => {
  const [reportType, setReportType] = useState('user_activity');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const generateReport = async () => {
    try {
      const params = new URLSearchParams({
        reportType,
        format: 'json',
        dateFrom,
        dateTo
      });
      
      const response = await fetch(`http://localhost:8000/api/v1/admin/reports?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        // Download the report
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Reports</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="user_activity">User Activity</option>
            <option value="swap_activity">Swap Activity</option>
            <option value="feedback_logs">Feedback Logs</option>
            <option value="swap_stats">Swap Statistics</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
        </div>

        <button
          onClick={generateReport}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Generate & Download Report</span>
        </button>
      </div>
    </div>
  );
}; 