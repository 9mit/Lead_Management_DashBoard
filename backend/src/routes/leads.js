const express = require('express');
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/leads - Get all leads with search, filter, sort, and pagination
router.get('/', auth, async (req, res) => {
    try {
        const {
            search = '',
            stage = '',
            status = '',
            day = '',
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1,
            limit = 10
        } = req.query;

        // Build query
        const query = {};

        if (day) {
            const year = new Date().getFullYear();
            const month = new Date().getMonth();
            const startDate = new Date(year, month, parseInt(day), 0, 0, 0);
            const endDate = new Date(year, month, parseInt(day), 23, 59, 59);
            query.createdAt = { $gte: startDate, $lte: endDate };
        }


        // Search across name, email, company
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by stage
        if (stage) {
            query.stage = stage;
        }

        // Filter by status
        if (status) {
            query.status = status;
        }

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Sort order
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query
        const leads = await Lead.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        // Get total count for pagination
        const total = await Lead.countDocuments(query);

        res.json({
            success: true,
            data: leads,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// GET /api/leads/:id - Get single lead by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found'
            });
        }

        res.json({
            success: true,
            data: lead
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;
