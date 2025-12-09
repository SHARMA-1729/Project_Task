// backend/scripts/import-csv.js
// Imports sales_data.csv into Supabase in small chunks

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const readline = require('readline');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const CHUNK_SIZE = 500; // Small batches for Supabase free tier
const CSV_PATH = path.join(__dirname, '..', 'data', 'sales_data.csv');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set in .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1, // Single connection to avoid overwhelming Supabase
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Pool error:', err.message);
});

// Parse CSV line into values array
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

// Convert tags string to Postgres array format
function formatTags(tagsStr) {
  if (!tagsStr || tagsStr === '') return null;
  const cleaned = tagsStr.replace(/[\[\]']/g, '');
  const tags = cleaned.split(',').map(t => t.trim()).filter(Boolean);
  if (tags.length === 0) return null;
  return `{${tags.map(t => `"${t.replace(/"/g, '\\"')}"`).join(',')}}`;
}

// Format date for Postgres
function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

// Sleep helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Insert a batch of rows
async function insertBatch(rows, batchNum, retries = 3) {
  if (rows.length === 0) return 0;

  const columns = [
    'customer_id', 'customer_name', 'phone_number', 'gender', 'age',
    'customer_region', 'customer_type', 'product_id', 'product_name',
    'brand', 'product_category', 'tags', 'quantity', 'price_per_unit',
    'discount_percentage', 'total_amount', 'final_amount', 'date',
    'payment_method', 'order_status', 'delivery_type', 'store_id',
    'store_location', 'salesperson_id', 'employee_name'
  ];

  const placeholders = [];
  const values = [];
  let paramIndex = 1;

  for (const row of rows) {
    const rowPlaceholders = [];
    for (let i = 0; i < columns.length; i++) {
      rowPlaceholders.push(`$${paramIndex++}`);
    }
    placeholders.push(`(${rowPlaceholders.join(', ')})`);
    values.push(...row);
  }

  const query = `
    INSERT INTO sales (${columns.join(', ')})
    VALUES ${placeholders.join(', ')}
  `;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await pool.query(query, values);
      return rows.length;
    } catch (err) {
      console.error(`   ⚠️ Batch ${batchNum} attempt ${attempt} failed: ${err.message}`);
      if (attempt < retries) {
        await sleep(2000 * attempt); // Exponential backoff
      } else {
        // Final attempt: try row by row
        console.log(`   Trying row-by-row insert...`);
        let successCount = 0;
        for (const row of rows) {
          try {
            const singleQuery = `INSERT INTO sales (${columns.join(', ')}) VALUES (${columns.map((_, i) => `$${i + 1}`).join(', ')})`;
            await pool.query(singleQuery, row);
            successCount++;
          } catch (rowErr) {
            // Skip problematic row
          }
          await sleep(10); // Small delay between rows
        }
        return successCount;
      }
    }
  }
  return 0;
}

async function importCSV() {
  console.log('🚀 Starting CSV import...');
  console.log(`📁 Reading from: ${CSV_PATH}`);
  console.log(`📦 Batch size: ${CHUNK_SIZE} rows`);

  if (!fs.existsSync(CSV_PATH)) {
    console.error('❌ CSV file not found:', CSV_PATH);
    process.exit(1);
  }

  // Test connection first
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connection OK');
  } catch (err) {
    console.error('❌ Cannot connect to database:', err.message);
    process.exit(1);
  }

  const fileStream = fs.createReadStream(CSV_PATH, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let headers = null;
  let batch = [];
  let totalRows = 0;
  let insertedRows = 0;
  let batchNum = 0;

  for await (const line of rl) {
    if (!headers) {
      headers = parseCSVLine(line);
      console.log(`📋 CSV Headers: ${headers.length} columns`);
      console.log(`   ${headers.slice(0, 5).join(', ')}...`);
      continue;
    }

    const values = parseCSVLine(line);
    if (values.length < 10) continue; // Skip malformed rows

    // Map CSV columns based on actual headers:
    // Transaction ID(0), Date(1), Customer ID(2), Customer Name(3), Phone Number(4),
    // Gender(5), Age(6), Customer Region(7), Customer Type(8), Product ID(9),
    // Product Name(10), Brand(11), Product Category(12), Tags(13), Quantity(14),
    // Price Per Unit(15), Discount %(16), Total Amount(17), Final Amount(18),
    // Payment Method(19), Order Status(20), Delivery Type(21), Store ID(22),
    // Store Location(23), Salesperson ID(24), Employee Name(25)
    
    const row = [
      values[2] || null,                          // customer_id
      values[3] || 'Unknown',                     // customer_name
      values[4] || '',                            // phone_number (VARCHAR, not INT)
      values[5] || null,                          // gender
      values[6] ? parseInt(values[6]) : null,     // age
      values[7] || null,                          // customer_region
      values[8] || null,                          // customer_type
      values[9] || null,                          // product_id
      values[10] || null,                         // product_name
      values[11] || null,                         // brand
      values[12] || null,                         // product_category
      formatTags(values[13]),                     // tags (array)
      values[14] ? parseInt(values[14]) : null,   // quantity
      values[15] ? parseFloat(values[15]) : null, // price_per_unit
      values[16] ? parseFloat(values[16]) : null, // discount_percentage
      values[17] ? parseFloat(values[17]) : null, // total_amount
      values[18] ? parseFloat(values[18]) : null, // final_amount
      formatDate(values[1]),                      // date (column 1)
      values[19] || null,                         // payment_method
      values[20] || null,                         // order_status
      values[21] || null,                         // delivery_type
      values[22] || null,                         // store_id
      values[23] || null,                         // store_location
      values[24] || null,                         // salesperson_id
      values[25] || null,                         // employee_name
    ];

    batch.push(row);
    totalRows++;

    if (batch.length >= CHUNK_SIZE) {
      batchNum++;
      const inserted = await insertBatch(batch, batchNum);
      insertedRows += inserted;
      batch = [];
      console.log(`✅ Batch ${batchNum}: ${inserted} rows | Total: ${insertedRows.toLocaleString()}/${totalRows.toLocaleString()}`);
      await sleep(100); // Small delay between batches
    }
  }

  // Insert remaining rows
  if (batch.length > 0) {
    batchNum++;
    const inserted = await insertBatch(batch, batchNum);
    insertedRows += inserted;
    console.log(`✅ Batch ${batchNum}: ${inserted} rows | Total: ${insertedRows.toLocaleString()}/${totalRows.toLocaleString()}`);
  }

  console.log(`\n🎉 Import complete!`);
  console.log(`📊 Total rows in CSV: ${totalRows.toLocaleString()}`);
  console.log(`📊 Rows inserted: ${insertedRows.toLocaleString()}`);

  await pool.end();
}

importCSV().catch(err => {
  console.error('❌ Import failed:', err);
  pool.end();
  process.exit(1);
});
