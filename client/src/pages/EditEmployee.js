import React from 'react';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

import axios from 'axios';

const fetchEmployee = async (id) => {
  const response = await axios.get(`/api/employees/${id}`);
  return response.data.data;
};

const updateEmployee = async ({ id, data }) => {
  const response = await axios.put(`/api/employees/${id}`, data);
  return response.data;
};

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: employee, isLoading, error } = useQuery(
    ['employee', id],
    () => fetchEmployee(id),
    {
      enabled: !!id,
      onSuccess: (data) => {
        reset({
          name: data.name,
          email: data.email,
          phone: data.phone,
          department: data.department,
          role: data.role,
          status: data.status,
          salary: data.salary
        });
      }
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const mutation = useMutation(
    ({ id, data }) => updateEmployee({ id, data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
        queryClient.invalidateQueries(['employee', id]);
        toast.success('Employee updated successfully');
        navigate('/employees');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update employee');
      }
    }
  );

  const onSubmit = (data) => {
    mutation.mutate({ id, data });
  };

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Customer Service'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>Error loading employee data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/employees" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Employee</h1>
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
                {mutation.isLoading ? 'Updating...' : 'Update Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
