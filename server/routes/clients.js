const express = require('express');
const { body, validationResult } = require('express-validator');
const Client = require('../models/Client');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/clients
// @desc    Get all clients with search and filter
// @access   Private (Admin/Manager only)
router.get('/', auth, [
  query('search').optional().trim(),
  query('status').optional().isIn(['Active', 'Inactive', 'Prospective']),
  query('industry').optional().isIn(['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 'Other']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user has permission to view clients
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { search, status, industry, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (industry) {
      query.industry = industry;
    }

    const clients = await Client.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Client.countDocuments(query);

    res.json({
      success: true,
      data: clients,
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

// @route   GET /api/clients/:id
// @desc    Get client by ID
// @access   Private (Admin/Manager only)
router.get('/:id', auth, async (req, res) => {
  try {
    // Check if user has permission to view clients
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const client = await Client.findById(req.params.id)
      .populate('projects', 'name status deadline');

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/clients
// @desc    Create new client
// @access   Private (Admin/Manager only)
router.post('/', auth, [
  body('name').trim().notEmpty().withMessage('Client name is required'),
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
  body('phone').optional().matches(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number'),
  body('company').optional().trim(),
  body('industry').optional().isIn(['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 'Other']),
  body('status').optional().isIn(['Active', 'Inactive', 'Prospective'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user has permission to create clients
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const client = new Client(req.body);

    await client.save();

    res.status(201).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/clients/:id
// @desc    Update client
// @access   Private (Admin/Manager only)
router.put('/:id', auth, [
  body('name').optional().trim(),
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
  body('status').optional().isIn(['Active', 'Inactive', 'Prospective'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user has permission to update clients
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    Object.assign(client, req.body);
    await client.save();

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/clients/:id
// @desc    Delete client
// @access   Private (Admin/Manager only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user has permission to delete clients
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    await Client.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
