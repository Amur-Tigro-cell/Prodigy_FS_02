import React from 'react';
import { useQuery } from 'react-query';
import { Clock, LogIn, LogOut } from 'lucide-react';

const Attendance = () => {
  const { data, isLoading, error } = useQuery('attendance', () => Promise.resolve({ data: [], pagination: {} }));

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
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <div className="flex space-x-4">
          <button className="btn btn-success flex items-center">
            <LogIn className="w-4 h-4 mr-2" />
            Check In
          </button>
          <button className="btn btn-secondary flex items-center">
            <LogOut className="w-4 h-4 mr-2" />
            Check Out
          </button>
        </div>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Attendance Tracking</h3>
          <p className="text-gray-500">Attendance management features coming soon!</p>
          <p className="text-sm text-gray-400 mt-2">Check-in/check-out, time tracking, and attendance reports will be available here.</p>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
