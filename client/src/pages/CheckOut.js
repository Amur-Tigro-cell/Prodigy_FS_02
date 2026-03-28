import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const CheckOut = () => {
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckOut = async () => {
    setIsCheckingOut(true);
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
      
      // Find today's record
      const existingRecord = existingRecords.find(r => r.date === dateKey);
      
      if (!existingRecord || !existingRecord.checkIn) {
        toast.error('You must check in first!');
        setIsCheckingOut(false);
        return;
      }
      
      if (existingRecord.checkOut) {
        toast.error('You have already checked out today!');
        setIsCheckingOut(false);
        return;
      }
      
      // Calculate total hours
      const checkInTime = new Date(`${dateKey} ${existingRecord.checkIn}`);
      const checkOutTime = new Date(`${dateKey} ${timeString}`);
      const diffMs = checkOutTime - checkInTime;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const totalHours = `${diffHours}h ${diffMinutes}m`;
      
      // Update today's record
      const updatedRecords = existingRecords.filter(r => r.date !== dateKey);
      updatedRecords.push({
        ...existingRecord,
        checkOut: timeString,
        totalHours: totalHours,
        employeeId: user?.id || 'current-user'
      });
      
      localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
      
      toast.success('Successfully checked out!');
      // Redirect back to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/employee-dashboard';
      }, 2000);
    } catch (error) {
      toast.error('Failed to check out. Please try again.');
    } finally {
      setIsCheckingOut(false);
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
              <h1 className="text-xl font-semibold">Check Out</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Check Out
              </h2>
              
              <p className="text-gray-600 mb-6">
                Good work today, {user?.username || 'Employee'}!
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

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-600 mb-2">Today's Work Hours</p>
                <p className="text-xl font-bold text-blue-900">
                  8h 32m
                </p>
              </div>

              <button
                onClick={handleCheckOut}
                disabled={isCheckingOut}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? 'Checking Out...' : 'Check Out Now'}
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

export default CheckOut;
