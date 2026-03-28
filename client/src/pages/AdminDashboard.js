import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  AlertCircle,
  LogOut,
  Home,
  Settings,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [employeeCount, setEmployeeCount] = useState(124);

  useEffect(() => {
    // Load employee count from localStorage or use default
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      const employees = JSON.parse(storedEmployees);
      setEmployeeCount(employees.length);
    }
  }, []);

  const stats = [
    {
      title: 'Total Employees',
      value: employeeCount.toString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Projects',
      value: '18',
      icon: Building,
      color: 'bg-green-500',
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'Monthly Revenue',
      value: '$45.2k',
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Pending Tasks',
      value: '47',
      icon: FileText,
      color: 'bg-orange-500',
      change: '-5',
      changeType: 'negative'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New employee registered', user: 'John Doe', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'Project deadline approaching', user: 'Project Alpha', time: '5 hours ago', type: 'warning' },
    { id: 3, action: 'System backup completed', user: 'System', time: '1 day ago', type: 'info' },
    { id: 4, action: 'New client added', user: 'Tech Corp', time: '2 days ago', type: 'success' }
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
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.username || 'Admin'}</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
              </div>
              
              <button className="relative p-2 text-gray-300 hover:text-white">
                <AlertCircle className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button className="p-2 text-gray-300 hover:text-white">
                <Link to="/settings">
                  <Settings className="w-5 h-5" />
                </Link>
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
            Welcome back, {user?.username || 'Admin'}!
          </h2>
          <p className="text-gray-600">Here's an overview of your organization's performance.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isEmployeeCard = stat.title === 'Total Employees';
            return (
              <div key={index} className={`bg-white rounded-lg shadow-md p-6 ${isEmployeeCard ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}>
                {isEmployeeCard ? (
                  <Link to="/employees" className="block">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${stat.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </Link>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${stat.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                <Link to="/activities" className="text-blue-600 hover:text-blue-800 text-sm">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Management */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Management</h3>
              
              <div className="space-y-3">
                <Link to="/employees">
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-800 font-medium">Employees</span>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{employeeCount}</span>
                    </div>
                  </button>
                </Link>
                
                <Link to="/projects">
                  <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">Projects</span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">18</span>
                    </div>
                  </button>
                </Link>
                
                <Link to="/tasks">
                  <button className="w-full text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-orange-600" />
                        <span className="text-orange-800 font-medium">Tasks</span>
                      </div>
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">47</span>
                    </div>
                  </button>
                </Link>
                
                <Link to="/clients">
                  <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-purple-600" />
                      <span className="text-purple-800 font-medium">Clients</span>
                    </div>
                  </button>
                </Link>
                
                <Link to="/attendance">
                  <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-800 font-medium">Attendance</span>
                    </div>
                  </button>
                </Link>
              </div>
            </div>

            {/* Branch Locations */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Branch Locations</h3>
                <Link to="/branches" className="text-blue-600 hover:text-blue-800 text-sm">
                  View All
                </Link>
              </div>
              
              <div className="space-y-3">
                {['Head Office - New York', 'Branch Office - London', 'Branch Office - Tokyo'].map((branch, index) => (
                  <div key={index} className="flex items-center justify-between p-2">
                    <div className="flex items-center space-x-3">
                      <Building className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-900">{branch}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {index === 0 ? 'HQ' : `Branch ${index}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
