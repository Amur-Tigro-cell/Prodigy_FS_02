import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const CheckIn = () => {
  const { user } = useAuth();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save attendance record to localStorage
      const today = new Date();
      const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const timeString = today.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      
      // Get existing attendance records
      const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
      
      // Check if already checked in today
      const existingRecord = existingRecords.find(r => r.date === dateKey);
      if (existingRecord && existingRecord.checkIn) {
        toast.error('You have already checked in today!');
        setIsCheckingIn(false);
        return;
      }
      
      // Add or update today's record
      const updatedRecords = existingRecords.filter(r => r.date !== dateKey);
      updatedRecords.push({
        date: dateKey,
        checkIn: timeString,
        checkOut: null,
        totalHours: null,
        employeeId: user?.id || 'current-user'
      });
      
      localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
      
      toast.success('Successfully checked in!');
      // Redirect back to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/employee-dashboard';
      }, 2000);
    } catch (error) {
      toast.error('Failed to check in. Please try again.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/employee-dashboard" className="text-gray-300 hover:text-white flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
              <h1 className="text-xl font-semibold">Check In</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Check In
              </h2>
              
              <p className="text-gray-600 mb-6">
                Welcome back, {user?.username || 'Employee'}!
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 mb-2">Current Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentTime.toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={handleCheckIn}
                disabled={isCheckingIn}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingIn ? 'Checking In...' : 'Check In Now'}
              </button>

              <div className="mt-6 text-center">
                <Link to="/employee-dashboard" className="text-gray-600 hover:text-gray-800 text-sm">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckIn;
