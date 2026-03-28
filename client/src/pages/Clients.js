import React from 'react';
import { useQuery } from 'react-query';
import { Search, Filter, Plus, Building, Phone, Mail } from 'lucide-react';

const Clients = () => {
  const { data, isLoading, error } = useQuery('clients', () => Promise.resolve({ data: [], pagination: {} }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <button className="btn btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </button>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Client Management</h3>
          <p className="text-gray-500">Client management features coming soon!</p>
          <p className="text-sm text-gray-400 mt-2">Client database, project history, and contact management will be available here.</p>
        </div>
      </div>
    </div>
  );
};

export default Clients;
