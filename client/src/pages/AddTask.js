import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus, CheckSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';

const AddTask = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const generateId = () => {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing tasks from localStorage
      const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      
      // Create new task
      const newTask = {
        id: generateId(),
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate,
        estimatedHours: parseFloat(data.estimatedHours),
        status: 'Pending',
        assignedTo: user?.username || 'Current User',
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      // Save to localStorage
      const updatedTasks = [newTask, ...existingTasks];
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
      // Update React Query cache
      queryClient.setQueryData('tasks', updatedTasks);
      
      toast.success('Task added successfully!');
      reset();
      
      // Redirect back to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/employee-dashboard';
      }, 2000);
    } catch (error) {
      toast.error('Failed to add task. Please try again.');
    } finally {
      setIsSubmitting(false);
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
              <h1 className="text-xl font-semibold">Add Task</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Add New Task
              </h2>
              <p className="text-gray-600">
                Create a new task for yourself
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title
                </label>
                <input
                  {...register('title', {
                    required: 'Task title is required',
                    minLength: {
                      value: 3,
                      message: 'Title must be at least 3 characters'
                    }
                  })}
                  type="text"
                  className="input"
                  placeholder="Enter task title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description', {
                    required: 'Description is required',
                    minLength: {
                      value: 10,
                      message: 'Description must be at least 10 characters'
                    }
                  })}
                  rows={4}
                  className="input"
                  placeholder="Enter task description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select {...register('priority')} className="input">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    {...register('dueDate', {
                      required: 'Due date is required'
                    })}
                    type="date"
                    className="input"
                  />
                  {errors.dueDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Hours
                </label>
                <input
                  {...register('estimatedHours', {
                    min: {
                      value: 0.5,
                      message: 'Minimum 0.5 hours'
                    },
                    max: {
                      value: 40,
                      message: 'Maximum 40 hours'
                    }
                  })}
                  type="number"
                  step="0.5"
                  className="input"
                  placeholder="e.g., 2.5"
                />
                {errors.estimatedHours && (
                  <p className="text-red-500 text-sm mt-1">{errors.estimatedHours.message}</p>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Adding Task...' : 'Add Task'}
                </button>
                
                <Link to="/employee-dashboard">
                  <button
                    type="button"
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddTask;
