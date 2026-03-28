const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Employee is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  checkIn: {
    type: Date,
    required: [true, 'Check-in time is required']
  },
  checkOut: {
    type: Date
  },
  breakTime: {
    type: Number,
    min: 0,
    default: 0 // in minutes
  },
  workHours: {
    type: Number,
    min: 0,
    default: 0 // in minutes
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Half Day', 'On Leave', 'Holiday'],
    default: 'Present'
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot exceed 200 characters']
  },
  location: {
    type: String,
    trim: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  overtime: {
    type: Number,
    min: 0,
    default: 0 // in minutes
  }
}, {
  timestamps: true
});

// Compound index for employee and date
attendanceSchema.index({ employee: 1, date: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
