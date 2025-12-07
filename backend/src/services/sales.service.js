// backend/src/services/sales.service.js

const db = require('./db.service');

// Allowed sort fields mapping
const SORT_FIELDS = {
  date: 'date',
  quantity: 'quantity',
  customer_name: 'customer_name',
};

function parseCSVParam(param) {
  if (!param) return [];
  if (Array.isArray(param)) return param;
  return String(param)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

async function getSalesWithFilters(query) {
  let {
    search,
    region,
    gender,
    ageMin,
    ageMax,
    productCategory,
    tags,
    paymentMethod,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
    page,
    pageSize,
  } = query;

  // Pagination: fixed 10 per assignment
  const pageNum = Math.max(parseInt(page || '1', 10), 1);
  const limit = 10; // fixed page size
  const offset = (pageNum - 1) * limit;

  const whereClauses = [];
  const values = [];
  let paramIndex = 1;

  // --- Search (full-text + phone fallback) ---
  if (search && search.trim()) {
    const term = search.trim();
    whereClauses.push(
      `(ts_vector @@ plainto_tsquery('english', $${paramIndex}) OR phone_number ILIKE $${paramIndex +
        1})`
    );
    values.push(term);
    values.push(`%${term}%`);
    paramIndex += 2;
  }

  // --- Filters ---

  // Customer Region (multi-select)
  const regions = parseCSVParam(region);
  if (regions.length > 0) {
    whereClauses.push(`customer_region = ANY($${paramIndex})`);
    values.push(regions);
    paramIndex++;
  }

  // Gender (multi-select)
  const genders = parseCSVParam(gender);
  if (genders.length > 0) {
    whereClauses.push(`gender = ANY($${paramIndex})`);
    values.push(genders);
    paramIndex++;
  }

  // Age Range
  if (ageMin) {
    whereClauses.push(`age >= $${paramIndex}`);
    values.push(parseInt(ageMin, 10));
    paramIndex++;
  }
  if (ageMax) {
    whereClauses.push(`age <= $${paramIndex}`);
    values.push(parseInt(ageMax, 10));
    paramIndex++;
  }

  // Product Category (multi-select)
  const categories = parseCSVParam(productCategory);
  if (categories.length > 0) {
    whereClauses.push(`product_category = ANY($${paramIndex})`);
    values.push(categories);
    paramIndex++;
  }

  // Tags (multi-select, TEXT[] column)
  const tagsList = parseCSVParam(tags);
  if (tagsList.length > 0) {
    whereClauses.push(`tags && $${paramIndex}::text[]`); // overlap operator
    values.push(tagsList);
    paramIndex++;
  }

  // Payment Method (multi-select)
  const paymentMethods = parseCSVParam(paymentMethod);
  if (paymentMethods.length > 0) {
    whereClauses.push(`payment_method = ANY($${paramIndex})`);
    values.push(paymentMethods);
    paramIndex++;
  }

  // Date Range
  if (dateFrom) {
    whereClauses.push(`date >= $${paramIndex}`);
    values.push(new Date(dateFrom));
    paramIndex++;
  }
  if (dateTo) {
    whereClauses.push(`date <= $${paramIndex}`);
    values.push(new Date(dateTo));
    paramIndex++;
  }

  const whereSQL =
    whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

  // --- Sorting ---
  const sortField = SORT_FIELDS[sortBy] || 'date';
  let direction = 'DESC';

  if (sortOrder && ['asc', 'ASC', 'desc', 'DESC'].includes(sortOrder)) {
    direction = sortOrder.toUpperCase();
  } else {
    // default: date desc, quantity desc, name asc
    if (sortField === 'customer_name') direction = 'ASC';
    if (sortField === 'quantity') direction = 'DESC';
    if (sortField === 'date') direction = 'DESC';
  }

  const orderBySQL = `ORDER BY ${sortField} ${direction}`;

  // --- Data query with pagination ---
  const limitIndex = paramIndex;
  const offsetIndex = paramIndex + 1;

  const dataQuery = `
    SELECT
      id,
      customer_id,
      customer_name,
      phone_number,
      gender,
      age,
      customer_region,
      customer_type,
      product_id,
      product_name,
      brand,
      product_category,
      tags,
      quantity,
      price_per_unit,
      discount_percentage,
      total_amount,
      final_amount,
      date,
      payment_method,
      order_status,
      delivery_type,
      store_id,
      store_location,
      salesperson_id,
      employee_name
    FROM sales
    ${whereSQL}
    ${orderBySQL}
    LIMIT $${limitIndex} OFFSET $${offsetIndex};
  `;

  const dataValues = [...values, limit, offset];

  // --- Count query (for total pages) ---
  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM sales
    ${whereSQL};
  `;

  const [dataResult, countResult] = await Promise.all([
    db.query(dataQuery, dataValues),
    db.query(countQuery, values),
  ]);

  const total = countResult.rows[0]?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data: dataResult.rows,
    pagination: {
      page: pageNum,
      pageSize: limit,
      total,
      totalPages,
    },
  };
}

module.exports = {
  getSalesWithFilters,
};
