import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Clock, 
  CheckSquare, 
  TrendingUp, 
  Bell,
  LogOut,
  Users,
  Home
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AttendanceCalendar from '../components/AttendanceCalendar';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    // Load tasks from localStorage
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      const tasks = JSON.parse(storedTasks);
      // Show only the most recent 3 tasks
      setRecentTasks(tasks.slice(0, 3));
    } else {
      // Fallback tasks if no stored tasks
      setRecentTasks([
        { id: 1, title: 'Complete project documentation', status: 'In Progress', dueDate: '2024-03-25' },
        { id: 2, title: 'Review code changes', status: 'Pending', dueDate: '2024-03-24' },
        { id: 3, title: 'Team meeting preparation', status: 'Completed', dueDate: '2024-03-23' }
      ]);
    }
  }, []); // Reload when component mounts

  const stats = [
    {
      title: 'Today\'s Tasks',
      value: recentTasks.length.toString(),
      icon: CheckSquare,
      color: 'bg-blue-500',
      link: '/tasks'
    },
    {
      title: 'Hours Worked',
      value: '32.5',
      icon: Clock,
      color: 'bg-green-500',
      link: '/attendance'
    },
    {
      title: 'Attendance Rate',
      value: '95%',
      icon: Calendar,
      color: 'bg-purple-500',
      link: '/attendance'
    },
    {
      title: 'Projects',
      value: '3',
      icon: TrendingUp,
      color: 'bg-orange-500',
      link: '/projects'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <h1 className="text-xl font-semibold">Employee Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.username || 'Employee'}</p>
                  <p className="text-xs text-gray-400">Employee</p>
                </div>
              </div>
              
              <button className="relative p-2 text-gray-300 hover:text-white">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-300 hover:text-white"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username || 'Employee'}!
          </h2>
          <p className="text-gray-600">Here's what's happening with your work today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={index} to={stat.link}>
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
                <Link to="/app/tasks" className="text-blue-600 hover:text-blue-800 text-sm">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link to="/attendance/checkin">
                  <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 font-medium">Check In</span>
                    </div>
                  </button>
                </Link>
                
                <Link to="/attendance/checkout">
                  <button className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-red-600" />
                      <span className="text-red-800 font-medium">Check Out</span>
                    </div>
                  </button>
                </Link>
                
                <Link to="/tasks/add">
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-800 font-medium">Add Task</span>
                    </div>
                  </button>
                </Link>
                
                <Link to="/profile">
                  <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-purple-600" />
                      <span className="text-purple-800 font-medium">Update Profile</span>
                    </div>
                  </button>
                </Link>
              </div>
            </div>

            {/* Attendance Calendar */}
            <div className="mt-6">
              <AttendanceCalendar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
