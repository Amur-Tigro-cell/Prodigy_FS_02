import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

import axios from 'axios';

const createEmployee = async (employeeData) => {
  const response = await axios.post('/api/employees', employeeData);
  return response.data;
};

const AddEmployee = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const mutation = useMutation(createEmployee, {
    onSuccess: () => {
      queryClient.invalidateQueries('employees');
      toast.success('Employee added successfully');
      navigate('/employees');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add employee');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Customer Service'];

  return (
    <div className="space-y-6 animate-fade-in" style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '24px' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/employees" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add Employee</h1>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  {...register('name', {
                    required: 'Name is required',
                    maxLength: { value: 100, message: 'Name cannot exceed 100 characters' }
                  })}
                  type="text"
                  className="input"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="input"
                  placeholder="john.doe@company.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[\d\s\-\+\(\)]+$/,
                      message: 'Please enter a valid phone number'
                    }
                  })}
                  type="tel"
                  className="input"
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  {...register('department', {
                    required: 'Department is required'
                  })}
                  className="input"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <input
                  {...register('role', {
                    required: 'Role is required',
                    maxLength: { value: 50, message: 'Role cannot exceed 50 characters' }
                  })}
                  type="text"
                  className="input"
                  placeholder="Software Engineer"
                />
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="input"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary
                </label>
                <input
                  {...register('salary', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Salary cannot be negative' }
                  })}
                  type="number"
                  className="input"
                  placeholder="75000"
                />
                {errors.salary && (
                  <p className="mt-1 text-sm text-red-600">{errors.salary.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link to="/employees">
                <button type="button" className="btn btn-secondary">
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={mutation.isLoading}
                className="btn btn-primary flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {mutation.isLoading ? 'Saving...' : 'Save Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
