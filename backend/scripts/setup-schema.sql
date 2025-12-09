-- backend/scripts/setup-schema.sql
-- Run this in Supabase SQL Editor to create the sales table

-- Drop existing table if you want a fresh start (uncomment if needed)
-- DROP TABLE IF EXISTS sales CASCADE;

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

-- Index for full-text search
CREATE INDEX IF NOT EXISTS ts_idx ON sales USING GIN (ts_vector);

-- Index for common filter columns
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales (date);
CREATE INDEX IF NOT EXISTS idx_sales_region ON sales (customer_region);
CREATE INDEX IF NOT EXISTS idx_sales_category ON sales (product_category);

-- Trigger to auto-update ts_vector on insert/update
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

-- Verify table was created
SELECT 'Table sales created successfully' as status;
