// backend/src/controllers/sales.controller.js

const { getSalesWithFilters } = require('../services/sales.service');

async function getSales(req, res) {
  try {
    const result = await getSalesWithFilters(req.query);

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('❌ Error in getSales controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sales data',
    });
  }
}

module.exports = {
  getSales,
};
