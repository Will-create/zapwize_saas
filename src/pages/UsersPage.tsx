import { useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600 mt-1">Manage users and their permissions</p>
      </div>

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => {/* Open add user modal */}}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          <Plus size={16} className="mr-2" />
          Add User
        </button>
      </div>

      {/* Empty state */}
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <Users size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users added yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Add team members to your account and manage their roles and permissions.
          </p>
          <button
            onClick={() => {/* Open add user modal */}}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus size={16} className="mr-2" />
            Add First User
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;