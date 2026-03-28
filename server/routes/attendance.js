const express = require('express');
const { body, validationResult } = require('express-validator');
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/attendance
// @desc    Get attendance records with search and filter
// @access   Private
router.get('/', auth, [
  query('employee').optional().isMongoId(),
  query('date').optional().isISO8601(),
  query('status').optional().isIn(['Present', 'Absent', 'Late', 'Half Day', 'On Leave', 'Holiday']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { employee, date, status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    if (employee) {
      query.employee = employee;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (status) {
      query.status = status;
    }

    // Employees can only see their own attendance
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      query.employee = req.user._id;
    }

    const attendance = await Attendance.find(query)
      .populate('employee', 'username email')
      .populate('approvedBy', 'username email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Attendance.countDocuments(query);

    res.json({
      success: true,
      data: attendance,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/attendance/:id
// @desc    Get attendance record by ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('employee', 'username email department')
      .populate('approvedBy', 'username email');

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Check if user has access to this record
    if (req.user.role !== 'admin' && 
        req.user.role !== 'manager' &&
        attendance.employee._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/attendance/checkin
// @desc    Check in employee
// @access   Private
router.post('/checkin', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingRecord = await Attendance.findOne({
      employee: req.user._id,
      date: { $gte: today }
    });

    if (existingRecord && existingRecord.checkIn) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    let attendance = existingRecord;
    if (!attendance) {
      attendance = new Attendance({
        employee: req.user._id,
        date: today,
        checkIn: new Date(),
        status: 'Present'
      });
    } else {
      attendance.checkIn = new Date();
      attendance.status = 'Present';
    }

    await attendance.save();

    res.status(201).json({
      success: true,
      data: attendance,
      message: 'Checked in successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/attendance/checkout
// @desc    Check out employee
// @access   Private
router.post('/checkout', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's attendance record
    const attendance = await Attendance.findOne({
      employee: req.user._id,
      date: { $gte: today }
    });

    if (!attendance) {
      return res.status(400).json({ message: 'No check-in record found for today' });
    }

    if (!attendance.checkIn) {
      return res.status(400).json({ message: 'Please check in first' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    const checkOutTime = new Date();
    const workHours = Math.round((checkOutTime - attendance.checkIn) / (1000 * 60)); // in minutes

    attendance.checkOut = checkOutTime;
    attendance.workHours = workHours;

    await attendance.save();

    res.json({
      success: true,
      data: attendance,
      message: 'Checked out successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/attendance
// @desc    Create attendance record (Admin/Manager only)
// @access   Private (Admin/Manager only)
router.post('/', auth, [
  body('employee').notEmpty().withMessage('Employee is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('checkIn').notEmpty().withMessage('Check-in time is required'),
  body('status').optional().isIn(['Present', 'Absent', 'Late', 'Half Day', 'On Leave', 'Holiday']),
  body('workHours').optional().isNumeric().withMessage('Work hours must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user has permission to create attendance records
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const attendance = new Attendance({
      ...req.body,
      approvedBy: req.user._id
    });

    await attendance.save();

    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
