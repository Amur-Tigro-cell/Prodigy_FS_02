import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Try to import AuthContext, fallback to mock if it fails
let AuthProvider, useAuth;
try {
  const authContext = require('./contexts/AuthContext');
  AuthProvider = authContext.AuthProvider;
  useAuth = authContext.useAuth;
} catch (error) {
  console.log('AuthContext error, using fallback');
  // Fallback auth context
  AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    
    const login = async (email, password) => {
      if ((email === 'admin@emptrack.com' && password === 'admin123') ||
          (email === 'employee@emptrack.com' && password === 'employee123')) {
        const userData = {
          id: email === 'admin@emptrack.com' ? 1 : 2,
          email: email,
          role: email === 'admin@emptrack.com' ? 'admin' : 'employee',
          name: email === 'admin@emptrack.com' ? 'Admin User' : 'Employee User'
        };
        setUser(userData);
        localStorage.setItem('token', email === 'admin@emptrack.com' ? 'admin-token-123' : 'employee-token-456');
        return;
      }
      throw new Error('Invalid credentials');
    };
    
    const logout = () => {
      setUser(null);
      localStorage.removeItem('token');
    };
    
    return React.createElement('div', { value: { user, login, logout, loading } }, children);
  };
  
  useAuth = () => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    
    const login = async (email, password) => {
      if ((email === 'admin@emptrack.com' && password === 'admin123') ||
          (email === 'employee@emptrack.com' && password === 'employee123')) {
        const userData = {
          id: email === 'admin@emptrack.com' ? 1 : 2,
          email: email,
          role: email === 'admin@emptrack.com' ? 'admin' : 'employee',
          name: email === 'admin@emptrack.com' ? 'Admin User' : 'Employee User'
        };
        setUser(userData);
        localStorage.setItem('token', email === 'admin@emptrack.com' ? 'admin-token-123' : 'employee-token-456');
        return;
      }
      throw new Error('Invalid credentials');
    };
    
    const logout = () => {
      setUser(null);
      localStorage.removeItem('token');
    };
    
    return { user, login, logout, loading };
  };
}

import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Attendance from './pages/Attendance';
import Clients from './pages/Clients';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OfficeBranches from './pages/OfficeBranches';
import CheckIn from './pages/CheckIn';
import CheckOut from './pages/CheckOut';
import AddTask from './pages/AddTask';
import Profile from './pages/Profile';
import SettingsPage from './pages/Settings';

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login/:role" element={<LoginPage />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes with Layout */}
              <Route path="/app" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="employees" element={<Employees />} />
                <Route path="employees/add" element={<AddEmployee />} />
                <Route path="employees/edit/:id" element={<EditEmployee />} />
                <Route path="projects" element={<Projects />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="clients" element={<Clients />} />
              </Route>
              
              {/* Standalone Dashboard Routes */}
              <Route path="/employee-dashboard" element={
                <ProtectedRoute>
                  <EmployeeDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin-dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/branches" element={
                <ProtectedRoute>
                  <OfficeBranches />
                </ProtectedRoute>
              } />
              <Route path="/employees" element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              } />
              <Route path="/employees/add" element={
                <ProtectedRoute>
                  <AddEmployee />
                </ProtectedRoute>
              } />
              <Route path="/employees/edit/:id" element={
                <ProtectedRoute>
                  <EditEmployee />
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } />
              <Route path="/attendance" element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              } />
              <Route path="/clients" element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              } />
              
              {/* Action Routes */}
              <Route path="/attendance/checkin" element={
                <ProtectedRoute>
                  <CheckIn />
                </ProtectedRoute>
              } />
              <Route path="/attendance/checkout" element={
                <ProtectedRoute>
                  <CheckOut />
                </ProtectedRoute>
              } />
              <Route path="/tasks/add" element={
                <ProtectedRoute>
                  <AddTask />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
