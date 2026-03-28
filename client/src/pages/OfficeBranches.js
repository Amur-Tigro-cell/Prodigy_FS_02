import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Clock,
  ArrowLeft,
  Home,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

const OfficeBranches = () => {
  const [branches, setBranches] = useState([
    {
      id: 1,
      name: 'Head Office',
      city: 'New York',
      country: 'United States',
      address: '123 Business Ave, Manhattan, NY 10001',
      phone: '+1 (555) 123-4567',
      email: 'headoffice@company.com',
      employees: 124,
      manager: 'John Smith',
      established: '2015',
      status: 'Active',
      workingHours: '9:00 AM - 6:00 PM',
      timezone: 'EST (UTC-5)',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 2,
      name: 'West Coast Branch',
      city: 'San Francisco',
      country: 'United States',
      address: '456 Tech Street, San Francisco, CA 94105',
      phone: '+1 (555) 987-6543',
      email: 'westcoast@company.com',
      employees: 67,
      manager: 'Sarah Johnson',
      established: '2018',
      status: 'Active',
      workingHours: '8:00 AM - 5:00 PM',
      timezone: 'PST (UTC-8)',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    {
      id: 3,
      name: 'European Branch',
      city: 'London',
      country: 'United Kingdom',
      address: '789 Business Park, London, UK SW1A 0AA',
      phone: '+44 20 7123 4567',
      email: 'europe@company.com',
      employees: 45,
      manager: 'Michael Brown',
      established: '2019',
      status: 'Active',
      workingHours: '9:00 AM - 6:00 PM',
      timezone: 'GMT (UTC+0)',
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    {
      id: 4,
      name: 'Asia Pacific Branch',
      city: 'Tokyo',
      country: 'Japan',
      address: '321 Tech Plaza, Shibuya, Tokyo 150-0002',
      phone: '+81 3-1234-5678',
      email: 'asia@company.com',
      employees: 38,
      manager: 'Yuki Tanaka',
      established: '2020',
      status: 'Active',
      workingHours: '9:00 AM - 6:00 PM',
      timezone: 'JST (UTC+9)',
      coordinates: { lat: 35.6762, lng: 139.6503 }
    },
    {
      id: 5,
      name: 'Middle East Branch',
      city: 'Dubai',
      country: 'United Arab Emirates',
      address: '654 Business Tower, Dubai, UAE',
      phone: '+971 4 123 4567',
      email: 'middleeast@company.com',
      employees: 28,
      manager: 'Ahmed Hassan',
      established: '2021',
      status: 'Active',
      workingHours: '8:00 AM - 5:00 PM',
      timezone: 'GST (UTC+4)',
      coordinates: { lat: 25.2048, lng: 55.2708 }
    }
  ]);

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleViewDetails = (branch) => {
    setSelectedBranch(branch);
  };

  const handleDelete = (branch) => {
    setSelectedBranch(branch);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setBranches(branches.filter(b => b.id !== selectedBranch.id));
    setShowDeleteModal(false);
    setSelectedBranch(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
              <h1 className="text-xl font-semibold">Office Branch Locations</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="btn btn-primary flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Branch
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Branches</p>
                <p className="text-2xl font-bold text-gray-900">{branches.length}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Building className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">
                  {branches.reduce((sum, branch) => sum + branch.employees, 0)}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Countries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {[...new Set(branches.map(b => b.country))].length}
                </p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Branches</p>
                <p className="text-2xl font-bold text-gray-900">
                  {branches.filter(b => b.status === 'Active').length}
                </p>
              </div>
              <div className="p-3 bg-orange-500 rounded-full">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <div key={branch.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{branch.city}, {branch.country}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(branch.status)}`}>
                    {branch.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{branch.address}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{branch.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{branch.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{branch.employees} employees • Manager: {branch.manager}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{branch.workingHours} ({branch.timezone})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">Established {branch.established}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(branch)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(branch)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Branch Details Modal */}
        {selectedBranch && !showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedBranch.name}</h2>
                  <button
                    onClick={() => setSelectedBranch(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Address</p>
                        <p className="text-gray-900">{selectedBranch.address}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Phone</p>
                        <p className="text-gray-900">{selectedBranch.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Email</p>
                        <p className="text-gray-900">{selectedBranch.email}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Branch Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Manager</p>
                        <p className="text-gray-900">{selectedBranch.manager}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Employees</p>
                        <p className="text-gray-900">{selectedBranch.employees}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Established</p>
                        <p className="text-gray-900">{selectedBranch.established}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Working Hours</p>
                        <p className="text-gray-900">{selectedBranch.workingHours}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Timezone</p>
                        <p className="text-gray-900">{selectedBranch.timezone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setSelectedBranch(null)}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Close
                    </button>
                    <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                      Edit Branch
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Branch
              </h3>
              
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete {selectedBranch?.name}? This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OfficeBranches;
