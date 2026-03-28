import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Users, UserCheck, UserX, Building, TrendingUp, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import axios from 'axios';

const fetchDashboardStats = async () => {
  const response = await axios.get('/api/employees/stats/dashboard');
  return response.data.data;
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const StatCard = ({ title, value, icon: Icon, color, link }) => (
  <Link to={link} className="block">
    <div className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  </Link>
);

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery('dashboard-stats', fetchDashboardStats, {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const { data: departmentStats, isLoading: departmentLoading } = useQuery('department-stats', fetchDepartmentStats, {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const { data: recentEmployees, isLoading: employeesLoading } = useQuery('recent-employees', fetchRecentEmployees, {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  if (statsLoading || departmentLoading || employeesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Handle case when stats is undefined or empty
  const statsData = stats || {
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    departmentStats: [],
    recentEmployees: []
  };

  const {
    totalEmployees,
    activeEmployees,
    inactiveEmployees,
    departmentStats: deptStats,
    recentEmployees: recentEmps
  } = statsData;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/employees/add">
          <button className="btn btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          icon={Users}
          color="bg-blue-500"
          link="/employees"
        />
        <StatCard
          title="Active Employees"
          value={activeEmployees}
          icon={UserCheck}
          color="bg-green-500"
          link="/employees?status=Active"
        />
        <StatCard
          title="Inactive Employees"
          value={inactiveEmployees}
          icon={UserX}
          color="bg-red-500"
          link="/employees?status=Inactive"
        />
        <StatCard
          title="Departments"
          value={departmentStats.length}
          icon={Building}
          color="bg-purple-500"
          link="/employees"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h2>
          {deptStats && deptStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deptStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {deptStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-72 text-gray-400">
              <Building className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">No Department Data</p>
              <p className="text-sm">Add employees to see department distribution</p>
            </div>
          )}
        </div>

        {/* Department Bar Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Employees by Department</h2>
          {deptStats && deptStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-72 text-gray-400">
              <Users className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">No Department Data</p>
              <p className="text-sm">Add employees to see department statistics</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Employees */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Employees</h2>
          <Link to="/employees" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
            View All
          </Link>
        </div>
        {recentEmps && recentEmps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentEmps.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Users className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">No Employees Yet</p>
            <p className="text-sm">Add your first employee to get started</p>
            <Link to="/employees/add">
              <button className="btn btn-primary mt-4">
                Add First Employee
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
