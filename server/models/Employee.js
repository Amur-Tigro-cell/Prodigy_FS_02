const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Customer Service'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
    maxlength: [50, 'Role cannot exceed 50 characters']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  profileImage: {
    type: String,
    default: ''
  },
  salary: {
    type: Number,
    min: [0, 'Salary cannot be negative']
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search functionality
employeeSchema.index({ name: 'text', email: 'text' });

module.exports = mongoose.model('Employee', employeeSchema);
