// // backend/src/models/sales.model.js

// const db = require('../services/db.service');

// // SQL command to create the Sales table
// const createSalesTable = `
//     CREATE TABLE IF NOT EXISTS sales (
//         id SERIAL PRIMARY KEY,
//         customer_id VARCHAR(50) NOT NULL,
//         customer_name VARCHAR(100) NOT NULL,
//         phone_number VARCHAR(20) NOT NULL,
//         gender VARCHAR(10),
//         age INTEGER,
//         customer_region VARCHAR(50),
//         customer_type VARCHAR(50),
        
//         product_id VARCHAR(50),
//         product_name VARCHAR(100),
//         brand VARCHAR(50),
//         product_category VARCHAR(50),
//         tags TEXT[], -- Use TEXT[] for array of strings (easier to work with tags)
        
//         quantity INTEGER,
//         price_per_unit NUMERIC(10, 2),
//         discount_percentage NUMERIC(5, 2),
//         total_amount NUMERIC(10, 2),
//         final_amount NUMERIC(10, 2),
        
//         date TIMESTAMP WITH TIME ZONE NOT NULL,
//         payment_method VARCHAR(50),
//         order_status VARCHAR(50),
//         delivery_type VARCHAR(50),
//         store_id VARCHAR(50),
//         store_location VARCHAR(100),
//         salesperson_id VARCHAR(50),
//         employee_name VARCHAR(100),

//         -- *** CRITICAL FOR SEARCH PERFORMANCE ***
//         -- ts_vector: A dedicated column for Full-Text Search indexing
//         ts_vector TSVECTOR
//     );
// `;

// // SQL command to create an index on the ts_vector column for fast searching (GIN index)
// const createTSVectorIndex = `
//     CREATE INDEX IF NOT EXISTS ts_idx ON sales USING GIN (ts_vector);
// `;

// // SQL command to update the ts_vector automatically when search fields change
// const createUpdateTrigger = `
//     -- Function to generate the ts_vector
//     CREATE OR REPLACE FUNCTION sales_ts_vector_trigger() RETURNS trigger AS $$
//     begin
//         new.ts_vector := 
//             setweight(to_tsvector('english', coalesce(new.customer_name, '')), 'A') ||
//             setweight(to_tsvector('english', coalesce(new.phone_number, '')), 'B');
//         return new;
//     end
//     $$ LANGUAGE plpgsql;

//     -- Trigger to run the function before insert or update
//     DROP TRIGGER IF EXISTS ts_vector_update ON sales;
//     CREATE TRIGGER ts_vector_update BEFORE INSERT OR UPDATE
//     ON sales FOR EACH ROW EXECUTE PROCEDURE sales_ts_vector_trigger();
// `;


// // Function to run all setup commands
// async function setupDatabase() {
//     try {
//         console.log('Starting database setup...');
//         await db.query(createSalesTable);
//         console.log('Table "sales" created or verified.');
        
//         await db.query(createTSVectorIndex);
//         console.log('GIN index created or verified.');
        
//         await db.query(createUpdateTrigger);
//         console.log('TS_VECTOR trigger created or verified.');
        
//         console.log('✅ Database schema setup complete!');
//     } catch (error) {
//         console.error('Database setup failed:', error);
//     }
// }

// module.exports = {
//     setupDatabase
// };












// backend/src/models/sales.model.js

const db = require('../services/db.service');

// SQL command to create the Sales table
const createSalesTable = `
  CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    gender VARCHAR(10),
    age INTEGER,
    customer_region VARCHAR(50),
    customer_type VARCHAR(50),

    product_id VARCHAR(50),
    product_name VARCHAR(100),
    brand VARCHAR(50),
    product_category VARCHAR(50),
    tags TEXT[],

    quantity INTEGER,
    price_per_unit NUMERIC(10, 2),
    discount_percentage NUMERIC(5, 2),
    total_amount NUMERIC(10, 2),
    final_amount NUMERIC(10, 2),

    date TIMESTAMPTZ NOT NULL,
    payment_method VARCHAR(50),
    order_status VARCHAR(50),
    delivery_type VARCHAR(50),
    store_id VARCHAR(50),
    store_location VARCHAR(100),
    salesperson_id VARCHAR(50),
    employee_name VARCHAR(100),

    -- Full-text search column
    ts_vector TSVECTOR
  );
`;

// Index on ts_vector for full-text search
const createTSVectorIndex = `
  CREATE INDEX IF NOT EXISTS ts_idx ON sales USING GIN (ts_vector);
`;

// Trigger to auto-update ts_vector
const createUpdateTrigger = `
  CREATE OR REPLACE FUNCTION sales_ts_vector_trigger() RETURNS trigger AS $$
  begin
    new.ts_vector :=
      setweight(to_tsvector('english', coalesce(new.customer_name, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(new.phone_number, '')), 'B');
    return new;
  end
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS ts_vector_update ON sales;
  CREATE TRIGGER ts_vector_update BEFORE INSERT OR UPDATE
  ON sales FOR EACH ROW EXECUTE PROCEDURE sales_ts_vector_trigger();
`;

async function setupDatabase() {
  try {
    console.log('🚧 Starting database setup...');
    await db.query(createSalesTable);
    console.log('✅ Table "sales" created or verified.');

    await db.query(createTSVectorIndex);
    console.log('✅ GIN index on ts_vector created or verified.');

    await db.query(createUpdateTrigger);
    console.log('✅ TS_VECTOR trigger created or verified.');

    console.log('🎉 Database schema setup complete!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

module.exports = {
  setupDatabase,
};
