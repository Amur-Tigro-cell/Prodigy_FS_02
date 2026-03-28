import { lazy } from 'react';

// Lazy load components for better performance
export const LazyTasks = lazy(() => import('../pages/Tasks'));
export const LazyProjects = lazy(() => import('../pages/Projects'));
export const LazyAttendance = lazy(() => import('../pages/Attendance'));
export const LazyClients = lazy(() => import('../pages/Clients'));
export const LazyOfficeBranches = lazy(() => import('../pages/OfficeBranches'));
export const LazySettings = lazy(() => import('../pages/Settings'));
