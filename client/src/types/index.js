// User Types
export const User = {
  id: 'string',
  username: 'string',
  email: 'string',
  role: 'admin|employee|manager',
  department: 'string',
  createdAt: 'string',
  updatedAt: 'string'
};

// Employee Types
export const Employee = {
  _id: 'string',
  name: 'string',
  email: 'string',
  phone: 'string',
  department: 'string',
  role: 'string',
  status: 'Active|Inactive|On Leave|Terminated',
  createdAt: 'string',
  updatedAt: 'string'
};

// Task Types
export const Task = {
  id: 'string',
  title: 'string',
  description: 'string',
  status: 'Pending|In Progress|Completed|Cancelled',
  priority: 'Low|Medium|High|Critical',
  dueDate: 'string',
  assignedTo: 'string',
  estimatedHours: 'number',
  createdAt: 'string',
  updatedAt: 'string'
};

// Project Types
export const Project = {
  _id: 'string',
  name: 'string',
  description: 'string',
  status: 'Active|Completed|On Hold',
  startDate: 'string',
  endDate: 'string',
  team: 'array',
  createdAt: 'string',
  updatedAt: 'string'
};

// Attendance Types
export const Attendance = {
  _id: 'string',
  employeeId: 'string',
  date: 'string',
  checkIn: 'string',
  checkOut: 'string',
  totalHours: 'number',
  status: 'Present|Absent|Late'
};

// Client Types
export const Client = {
  _id: 'string',
  name: 'string',
  email: 'string',
  phone: 'string',
  company: 'string',
  status: 'Active|Inactive',
  createdAt: 'string',
  updatedAt: 'string'
};

// API Response Types
export const ApiResponse = {
  success: 'boolean',
  data: 'any',
  message: 'string',
  error: 'string|null'
};

// Pagination Types
export const Pagination = {
  page: 'number',
  limit: 'number',
  total: 'number',
  totalPages: 'number'
};

// Form Types
export const FormField = {
  name: 'string',
  value: 'any',
  error: 'string|null',
  touched: 'boolean'
};

// Dashboard Stats Types
export const DashboardStats = {
  totalEmployees: 'number',
  activeEmployees: 'number',
  inactiveEmployees: 'number',
  totalTasks: 'number',
  completedTasks: 'number',
  pendingTasks: 'number',
  totalProjects: 'number',
  activeProjects: 'number'
};
