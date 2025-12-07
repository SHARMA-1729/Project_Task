// backend/src/routes/sales.routes.js

const express = require('express');
const { getSales } = require('../controllers/sales.controller');

const router = express.Router();

// GET /api/sales
// Supports: search, filters, sorting, pagination (page)
router.get('/', getSales);

module.exports = router;
