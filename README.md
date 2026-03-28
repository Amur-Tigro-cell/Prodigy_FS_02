# Employee Management System

A modern full-stack Employee Management System built with React.js, Node.js, Express.js, and MongoDB.

## 🚀 Features

- **Authentication System**: Secure admin login with JWT authentication and password hashing
- **Employee CRUD Operations**: Create, Read, Update, and Delete employee records

### 🎨 User Experience
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **⚡ Real-time Updates**: Instant notifications and data synchronization
- **🎯 Intuitive Interface**: Clean, modern, and user-friendly design
- **🔍 Search & Filter**: Advanced filtering and search capabilities
- **📈 Analytics**: Comprehensive reporting and insights

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **React Hot Toast** - Notification system

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/emptrack.git
   cd emptrack
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd client
   npm install
   
   # Backend
   cd ../server
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # In server/.env
   MONGODB_URI=mongodb://localhost:27017/emptrack
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

4. **Start the application**
   ```bash
   # Backend (Terminal 1)
   cd server
   npm start
   
   # Frontend (Terminal 2)
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 Screenshots

### Login Page
![Login](./screenshots/login.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Attendance Calendar
![Attendance](./screenshots/attendance.png)

### Task Management
![Tasks](./screenshots/tasks.png)

## 🏗️ Project Structure

```
emptrack/
├── � client/                 # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/     # Reusable components
│   │   ├── 📁 pages/          # Page components
│   │   ├── 📁 contexts/       # React contexts
│   │   ├── 📁 hooks/          # Custom hooks
│   │   ├── 📁 services/       # API services
│   │   └── 📁 utils/          # Utility functions
│   └── 📄 package.json
├── 📁 server/                 # Node.js Backend
│   ├── 📁 models/             # MongoDB models
│   ├── 📁 routes/             # API routes
│   ├── 📁 middleware/         # Custom middleware
│   ├── 📁 config/             # Configuration files
│   └── 📄 package.json
└── 📄 README.md
```

## 🔐 Default Credentials

### Admin Login
- **Username**: admin
- **Password**: admin123

### Employee Login
- **Username**: employee
- **Password**: employee123

## 📊 Features Overview

### 🎯 Employee Dashboard
- Personal attendance calendar
- Task assignments and status
- Quick actions (Check In/Out)
- Profile management

### 🏢 Admin Dashboard
- Company-wide analytics
- Employee management
- Task assignment and tracking
- System settings

### 📅 Attendance System
- **Check In/Out**: Easy time tracking
- **Calendar View**: Monthly attendance overview
- **Statistics**: Present/Absent/Late tracking
- **Reports**: Detailed attendance reports

### 📝 Task Management
- **Create Tasks**: Assign to employees
- **Track Progress**: Real-time status updates
- **Priority Levels**: High, Medium, Low
- **Due Dates**: Deadline management

## � API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Add new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Attendance
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance` - Get attendance records

## 🎨 Customization
## 🔒 Security Features

- JWT-based authentication with expiration
- Password hashing using bcryptjs
- Rate limiting to prevent brute force attacks
- CORS configuration
- Helmet for security headers
- Input validation and sanitization
- Protected routes for employee operations

## 🎨 UI Features

- Responsive design for all screen sizes
- Modern, clean interface with Tailwind CSS
- Interactive sidebar navigation
- Loading states and animations
- Toast notifications for user feedback
- Modal confirmations for destructive actions
- Form validation with error messages
- Hover states and transitions

## 📊 Dashboard Features

- Total employees count
- Active/inactive employee statistics
- Department distribution pie chart
- Employee count by department bar chart
- Recent employees table
- Quick access to add new employees

## 🚀 Deployment

### Backend Deployment
1. Set environment variables in production
2. Build and deploy to your preferred platform (Heroku, AWS, etc.)
3. Ensure MongoDB connection string is properly configured

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the build folder to your hosting service
3. Configure proxy settings if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**: Ensure MongoDB is running and the connection string is correct
2. **CORS Issues**: Check that the frontend URL is properly configured in the backend CORS settings
3. **Authentication Issues**: Verify JWT_SECRET is set and tokens are being stored correctly
4. **Build Errors**: Ensure all dependencies are installed and Node.js version is compatible

### Development Tips

- Use `npm run dev` for backend development with hot reload
- Use `npm start` for frontend development
- Check browser console for detailed error messages
- Use MongoDB Compass or similar tools to inspect database
- Test API endpoints with Postman or similar tools

## 📞 Support

For any issues or questions, please create an issue in the repository or contact the development team.
