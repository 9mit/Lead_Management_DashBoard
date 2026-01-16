const express = require('express');
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/analytics/summary - Get analytics summary
router.get('/summary', auth, async (req, res) => {
    try {
        const { day } = req.query;
        let query = {};

        if (day) {
            // Filter by day of month (based on current year and month for simplicity)
            const year = new Date().getFullYear();
            const month = new Date().getMonth();
            const startDate = new Date(year, month, parseInt(day), 0, 0, 0);
            const endDate = new Date(year, month, parseInt(day), 23, 59, 59);
            query.createdAt = { $gte: startDate, $lte: endDate };
        }

        // Total leads
        const totalLeads = await Lead.countDocuments(query);

        // Converted leads
        const convertedLeads = await Lead.countDocuments({ ...query, stage: 'Converted' });

        // Leads by stage
        const leadsByStage = await Lead.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$stage',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Leads by status
        const leadsByStatus = await Lead.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Conversion rate
        const conversionRate = totalLeads > 0
            ? ((convertedLeads / totalLeads) * 100).toFixed(2)
            : 0;


        res.json({
            success: true,
            data: {
                totalLeads,
                convertedLeads,
                conversionRate: parseFloat(conversionRate),
                leadsByStage: leadsByStage.map(item => ({
                    stage: item._id,
                    count: item.count
                })),
                leadsByStatus: leadsByStatus.map(item => ({
                    status: item._id,
                    count: item.count
                }))
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

module.exports = router;
