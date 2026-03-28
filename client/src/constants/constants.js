// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh'
  },
  EMPLOYEES: {
    GET_ALL: '/api/employees',
    GET_BY_ID: '/api/employees/:id',
    CREATE: '/api/employees',
    UPDATE: '/api/employees/:id',
    DELETE: '/api/employees/:id'
  },
  TASKS: {
    GET_ALL: '/api/tasks',
    GET_BY_ID: '/api/tasks/:id',
    CREATE: '/api/tasks',
    UPDATE: '/api/tasks/:id',
    DELETE: '/api/tasks/:id'
  },
  PROJECTS: {
    GET_ALL: '/api/projects',
    GET_BY_ID: '/api/projects/:id',
    CREATE: '/api/projects',
    UPDATE: '/api/projects/:id',
    DELETE: '/api/projects/:id'
  },
  ATTENDANCE: {
    CHECK_IN: '/api/attendance/checkin',
    CHECK_OUT: '/api/attendance/checkout',
    GET_RECORDS: '/api/attendance'
  },
  CLIENTS: {
    GET_ALL: '/api/clients',
    GET_BY_ID: '/api/clients/:id',
    CREATE: '/api/clients',
    UPDATE: '/api/clients/:id',
    DELETE: '/api/clients/:id'
  }
};

// Task Status
export const TASK_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

// Task Priority
export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
};

// Employee Status
export const EMPLOYEE_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  ON_LEAVE: 'On Leave',
  TERMINATED: 'Terminated'
};

// Departments
export const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'IT',
  'Customer Service'
];

// Roles
export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  MANAGER: 'manager'
};

// Routes
export const ROUTES = {
  LOGIN: '/',
  DASHBOARD: '/dashboard',
  EMPLOYEES: '/employees',
  TASKS: '/tasks',
  PROJECTS: '/projects',
  ATTENDANCE: '/attendance',
  CLIENTS: '/clients',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  BRANCHES: '/branches'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  TASKS: 'tasks',
  EMPLOYEES: 'employees',
  THEME: 'theme'
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MM/DD/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'MM/DD/YYYY HH:mm:ss'
};
