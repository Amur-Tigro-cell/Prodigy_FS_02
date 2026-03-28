const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects with search and filter
// @access   Private
router.get('/', auth, [
  query('search').optional().trim(),
  query('status').optional().isIn(['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled']),
  query('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { search, status, priority, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    // If user is not admin, only show their projects
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      query.$or = [
        { manager: req.user._id },
        { employees: req.user._id }
      ];
    }

    const projects = await Project.find(query)
      .populate('client', 'name company')
      .populate('manager', 'username email')
      .populate('employees', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: projects,
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

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name company email phone')
      .populate('manager', 'username email')
      .populate('employees', 'username email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access to this project
    if (req.user.role !== 'admin' && 
        project.manager._id.toString() !== req.user._id.toString() && 
        !project.employees.some(emp => emp._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access   Private (Admin/Manager only)
router.post('/', auth, [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('description').optional().trim(),
  body('client').notEmpty().withMessage('Client is required'),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']),
  body('startDate').notEmpty().withMessage('Start date is required'),
  body('endDate').notEmpty().withMessage('End date is required'),
  body('deadline').notEmpty().withMessage('Deadline is required'),
  body('budget').optional().isNumeric().withMessage('Budget must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user has permission to create projects
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const project = new Project({
      ...req.body,
      manager: req.user._id
    });

    await project.save();

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access   Private
router.put('/:id', auth, [
  body('name').optional().trim(),
  body('description').optional().trim(),
  body('status').optional().isIn(['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled']),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']),
  body('progress').optional().isInt({ min: 0, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has permission to update this project
    if (req.user.role !== 'admin' && 
        project.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(project, req.body);
    await project.save();

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access   Private (Admin/Manager only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has permission to delete this project
    if (req.user.role !== 'admin' && 
        project.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
