const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks with search and filter
// @access   Private
router.get('/', auth, [
  query('search').optional().trim(),
  query('status').optional().isIn(['To Do', 'In Progress', 'Review', 'Completed', 'Cancelled']),
  query('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']),
  query('project').optional().isMongoId(),
  query('assignedTo').optional().isMongoId(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { search, status, priority, project, assignedTo, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (project) {
      query.project = project;
    }

    // Employees can only see their own tasks
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignedTo', 'username email')
      .populate('assignedBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      data: tasks,
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

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', ' name')
      .populate('assignedTo', 'username email')
      .populate('assignedBy', 'username email')
      .populate('comments.author', 'username email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to this task
    if (req.user.role !== 'admin' && 
        req.user.role !== 'manager' &&
        task.assignedTo._id.toString() !== req.user._id.toString() &&
        task.assignedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access   Private (Admin/Manager only)
router.post('/', auth, [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('description').optional().trim(),
  body('project').notEmpty().withMessage('Project is required'),
  body('assignedTo').notEmpty().withMessage('Assigned employee is required'),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']),
  body('dueDate').notEmpty().withMessage('Due date is required'),
  body('estimatedHours').optional().isNumeric().withMessage('Estimated hours must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user has permission to create tasks
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const task = new Task({
      ...req.body,
      assignedBy: req.user._id
    });

    await task.save();

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access   Private
router.put('/:id', auth, [
  body('title').optional().trim(),
  body('description').optional().trim(),
  body('status').optional().isIn(['To Do', 'In Progress', 'Review', 'Completed', 'Cancelled']),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']),
  body('actualHours').optional().isNumeric().withMessage('Actual hours must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has permission to update this task
    if (req.user.role !== 'admin' && 
        req.user.role !== 'manager' &&
        task.assignedTo.toString() !== req.user._id.toString() &&
        task.assignedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // If status is being changed to 'Completed', set completedAt
    if (req.body.status === 'Completed' && task.status !== 'Completed') {
      req.body.completedAt = new Date();
    }

    Object.assign(task, req.body);
    await task.save();

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access   Private (Admin/Manager only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has permission to delete this task
    if (req.user.role !== 'admin' && 
        req.user.role !== 'manager' &&
        task.assignedTo.toString() !== req.user._id.toString() &&
        task.assignedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
