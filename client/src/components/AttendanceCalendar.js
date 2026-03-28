import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AttendanceCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage('attendanceRecords', []);
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getAttendanceStatus = (date) => {
    const dateKey = formatDateKey(date);
    const record = attendanceRecords.find(r => r.date === dateKey);
    
    if (!record) return null;
    
    if (record.checkIn && record.checkOut) {
      return 'complete';
    } else if (record.checkIn) {
      return 'partial';
    } else {
      return 'absent';
    }
  };

  const getAttendanceColor = (status) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getAttendanceIcon = (status) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4" />;
      case 'absent':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10 border border-gray-100 bg-gray-50"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const status = getAttendanceStatus(date);
      const isToday = formatDateKey(date) === formatDateKey(new Date());
      const isSelected = selectedDate && formatDateKey(date) === formatDateKey(selectedDate);

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-10 border cursor-pointer transition-all duration-200 flex items-center justify-center text-sm
            ${getAttendanceColor(status)}
            ${isToday ? 'ring-2 ring-blue-500 font-bold' : ''}
            ${isSelected ? 'ring-2 ring-purple-500' : ''}
            hover:shadow-md`}
        >
          <div className="flex items-center space-x-1">
            <span>{day}</span>
            {status && getAttendanceIcon(status)}
          </div>
        </div>
      );
    }

    return days;
  };

  const getAttendanceDetails = () => {
    if (!selectedDate) return null;
    
    const dateKey = formatDateKey(selectedDate);
    const record = attendanceRecords.find(r => r.date === dateKey);
    
    if (!record) {
      return (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No attendance record for this date</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Check In</span>
          </div>
          <span className="text-green-700">{record.checkIn}</span>
        </div>
        
        {record.checkOut ? (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Check Out</span>
            </div>
            <span className="text-blue-700">{record.checkOut}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Check Out</span>
            </div>
            <span className="text-yellow-700">Not checked out</span>
          </div>
        )}
        
        {record.checkIn && record.checkOut && (
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-800">Total Hours</span>
            </div>
            <span className="text-purple-700">{record.totalHours || '8h 32m'}</span>
          </div>
        )}
      </div>
    );
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  const getMonthStats = () => {
    const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
    const monthRecords = attendanceRecords.filter(r => r.date.startsWith(monthKey));
    
    const present = monthRecords.filter(r => r.checkIn).length;
    const complete = monthRecords.filter(r => r.checkIn && r.checkOut).length;
    const workingDays = getDaysInMonth(currentMonth);
    
    return {
      present,
      complete,
      partial: present - complete,
      absent: workingDays - present,
      total: workingDays
    };
  };

  const stats = getMonthStats();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Attendance Calendar</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-600 min-w-[120px] text-center">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Month Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-700">{stats.present}</p>
          <p className="text-xs text-green-600">Present</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-700">{stats.complete}</p>
          <p className="text-xs text-blue-600">Complete</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-700">{stats.partial}</p>
          <p className="text-xs text-yellow-600">Partial</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
          <p className="text-xs text-red-600">Absent</p>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mb-6 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-gray-600">Complete</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span className="text-gray-600">Partial</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-gray-600">Absent</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
          <span className="text-gray-600">No Record</span>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h4>
          {getAttendanceDetails()}
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendar;
