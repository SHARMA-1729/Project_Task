// // backend/src/utils/data.ingestion.js

// const fs = require('fs');
// const path = require('path');
// const csv = require('csv-parser');
// const db = require('../services/db.service'); 

// // CORRECTED PATH: Assumes 'data' folder is in the 'backend' root directory.
// // Path from utils/ -> src/ -> backend/ -> data/ -> sales_data.csv
// const DATA_FILE_PATH = path.join(__dirname, '..', 'data', 'sales_data.csv');



// // List of all column names in the PostgreSQL 'sales' table (snake_case)
// // This MUST match the order and names used in your sales.model.js CREATE TABLE statement
// const DB_COLUMN_NAMES = [
//     'customer_id', 'customer_name', 'phone_number', 'gender', 'age', 
//     'customer_region', 'customer_type', 'product_id', 'product_name', 'brand', 
//     'product_category', 'tags', 'quantity', 'price_per_unit', 'discount_percentage', 
//     'total_amount', 'final_amount', 'date', 'payment_method', 'order_status', 
//     'delivery_type', 'store_id', 'store_location', 'salesperson_id', 'employee_name'
// ];

// async function ingestSalesData() {
//     const dataRecords = [];
//     let rowsInserted = 0;
    
//     // --- File Path Check ---
//     if (!fs.existsSync(DATA_FILE_PATH)) {
//         console.error(`❌ Data file not found! Checked path: ${DATA_FILE_PATH}`);
//         return; 
//     }
//     console.log(`\n⏳ File found! Starting ingestion from: ${path.basename(DATA_FILE_PATH)}...`);

//     // 1. Read and Process the CSV data
//     await new Promise((resolve, reject) => {
//         fs.createReadStream(DATA_FILE_PATH)
//             .pipe(csv())
//             .on('data', (data) => {
//                 // Map CSV data (with spaces and mixed case) to DB column order (snake_case)
                
//                 // Helper to convert comma-separated string tags to a PostgreSQL array (TEXT[])
//                 const tagsArray = data['Tags'] 
//                     ? data['Tags'].split(',').map(tag => tag.trim()) 
//                     : null;

//                 dataRecords.push([
//                     // Customer Fields
//                     data['Customer ID'],
//                     data['Customer Name'],
//                     data['Phone Number'],
//                     data['Gender'],
//                     parseInt(data['Age']), // Must be Integer
//                     data['Customer Region'],
//                     data['Customer Type'],
                    
//                     // Product Fields
//                     data['Product ID'],
//                     data['Product Name'],
//                     data['Brand'],
//                     data['Product Category'],
//                     tagsArray, // Handled as array for PostgreSQL
                    
//                     // Sales Fields
//                     parseInt(data['Quantity']), // Must be Integer
//                     parseFloat(data['Price per Unit']), // Must be Numeric/Float
//                     parseFloat(data['Discount Percentage']), // Must be Numeric/Float
//                     parseFloat(data['Total Amount']), // Must be Numeric/Float
//                     parseFloat(data['Final Amount']), // Must be Numeric/Float
                    
//                     // Operational Fields
//                     new Date(data['Date']).toISOString(), // Must be TIMESTAMP format
//                     data['Payment Method'],
//                     data['Order Status'],
//                     data['Delivery Type'],
//                     data['Store ID'],
//                     data['Store Location'],
//                     data['Salesperson ID'],
//                     data['Employee Name'],
//                 ]);
//             })
//             .on('end', resolve)
//             .on('error', reject);
//     });

//     if (dataRecords.length === 0) {
//         console.log('No records found in CSV to insert.');
//         return;
//     }

//     // 2. Insert data into PostgreSQL using parameterized query for security
//     const client = await db.pool.connect();
//     try {
//         await client.query('BEGIN'); 

//         // Use the pre-defined list of column names
//         const columnNamesString = DB_COLUMN_NAMES.join(', ');

//         // Create placeholders ($1, $2, $3, ...) based on the number of columns
//         const valuePlaceholders = dataRecords[0].map((_, i) => `$${i + 1}`).join(', ');
        
//         const insertQuery = `INSERT INTO sales (${columnNamesString}) VALUES (${valuePlaceholders})`;

//         for (const record of dataRecords) {
//             // The query will use the indexed parameters to prevent SQL Injection
//             await client.query(insertQuery, record);
//             rowsInserted++;
//         }

//         await client.query('COMMIT'); 
//         console.log(`✅ Successfully inserted ${rowsInserted} records into the sales table.`);

//     } catch (error) {
//         await client.query('ROLLBACK'); 
//         console.error('Data ingestion failed during database insert:', error.message);
//         console.error('Check your column mapping and data types (e.g., ensure all prices are valid floats).');
//     } finally {
//         client.release();
//     }
// }

// module.exports = {
//     ingestSalesData
// };

















// backend/src/utils/data.ingestion.js

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const db = require('../services/db.service');
const { setupDatabase } = require('../models/sales.model');

// Path from: backend/src/utils -> backend/src -> backend -> root -> data/sales_data.csv
const DATA_FILE_PATH = path.join(__dirname, '..', '..', 'data', 'sales_data.csv');

console.log("CSV PATH:", DATA_FILE_PATH);
console.log("EXISTS:", fs.existsSync(DATA_FILE_PATH));


// List of all column names in the PostgreSQL 'sales' table (snake_case)
const DB_COLUMN_NAMES = [
  'customer_id',
  'customer_name',
  'phone_number',
  'gender',
  'age',
  'customer_region',
  'customer_type',
  'product_id',
  'product_name',
  'brand',
  'product_category',
  'tags',
  'quantity',
  'price_per_unit',
  'discount_percentage',
  'total_amount',
  'final_amount',
  'date',
  'payment_method',
  'order_status',
  'delivery_type',
  'store_id',
  'store_location',
  'salesperson_id',
  'employee_name',
];

async function ingestSalesData() {
  const dataRecords = [];
  let rowsInserted = 0;

  // --- File Path Check ---
  if (!fs.existsSync(DATA_FILE_PATH)) {
    console.error(`❌ Data file not found! Checked path: ${DATA_FILE_PATH}`);
    return;
  }
  console.log(
    `\n⏳ File found! Starting ingestion from: ${path.basename(
      DATA_FILE_PATH
    )}...`
  );

  // 1. Read and Process the CSV data
  await new Promise((resolve, reject) => {
    fs.createReadStream(DATA_FILE_PATH)
      .pipe(csv())
      .on('data', (data) => {
        // Convert comma-separated tags into JS array for TEXT[]
        const tagsArray = data['Tags']
          ? data['Tags'].split(',').map((tag) => tag.trim())
          : [];

        dataRecords.push([
          // Customer Fields
          data['Customer ID'],
          data['Customer Name'],
          data['Phone Number'],
          data['Gender'],
          parseInt(data['Age'], 10) || null,
          data['Customer Region'],
          data['Customer Type'],

          // Product Fields
          data['Product ID'],
          data['Product Name'],
          data['Brand'],
          data['Product Category'],
          tagsArray,

          // Sales Fields
          parseInt(data['Quantity'], 10) || 0,
          parseFloat(data['Price per Unit']) || 0,
          parseFloat(data['Discount Percentage']) || 0,
          parseFloat(data['Total Amount']) || 0,
          parseFloat(data['Final Amount']) || 0,

          // Operational Fields
          new Date(data['Date']), // JS Date → pg TIMESTAMPTZ
          data['Payment Method'],
          data['Order Status'],
          data['Delivery Type'],
          data['Store ID'],
          data['Store Location'],
          data['Salesperson ID'],
          data['Employee Name'],
        ]);
      })
      .on('end', resolve)
      .on('error', reject);
  });

  if (dataRecords.length === 0) {
    console.log('No records found in CSV to insert.');
    return;
  }

  // 2. Insert data into PostgreSQL using parameterized query
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const columnNamesString = DB_COLUMN_NAMES.join(', ');
    const valuePlaceholders = dataRecords[0]
      .map((_, i) => `$${i + 1}`)
      .join(', ');
    const insertQuery = `INSERT INTO sales (${columnNamesString}) VALUES (${valuePlaceholders})`;

    for (const record of dataRecords) {
      await client.query(insertQuery, record);
      rowsInserted++;
    }

    await client.query('COMMIT');
    console.log(
      `✅ Successfully inserted ${rowsInserted} records into the sales table.`
    );
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(
      'Data ingestion failed during database insert:',
      error.message
    );
  } finally {
    client.release();
  }
}

module.exports = {
  ingestSalesData,
};

// Allow running via: npm run ingest
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running DB setup and CSV ingestion...');
      await setupDatabase();
      await ingestSalesData();
      console.log('🎉 Ingestion completed.');
      process.exit(0);
    } catch (err) {
      console.error('❌ Ingestion script failed:', err);
      process.exit(1);
    }
  })();
}
