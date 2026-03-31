import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // For demo, create user from token
      const demoUser = token === 'admin-token-123' 
        ? { id: 1, email: 'admin@emptrack.com', role: 'admin', name: 'Admin User' }
        : { id: 2, email: 'employee@emptrack.com', role: 'employee', name: 'Employee User' };
      setUser(demoUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // For demo: check hardcoded credentials
      if ((email === 'admin@emptrack.com' && password === 'admin123') ||
          (email === 'employee@emptrack.com' && password === 'employee123')) {
        
        const user = {
          id: email === 'admin@emptrack.com' ? 1 : 2,
          email: email,
          role: email === 'admin@emptrack.com' ? 'admin' : 'employee',
          name: email === 'admin@emptrack.com' ? 'Admin User' : 'Employee User'
        };
        
        const token = email === 'admin@emptrack.com' ? 'admin-token-123' : 'employee-token-456';
        
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        
        return;
      }
      
      // Try real API call for other credentials
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
