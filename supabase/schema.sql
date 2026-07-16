-- Schema for Supabase Database

-- Orders table to store all song creation requests
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id TEXT,
  
  -- Customer Information
  customer_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  
  -- Song Details
  song_type TEXT NOT NULL, -- 'lite', 'estandar', 'premium'
  purpose TEXT, -- 'personal', 'business'
  occasion TEXT,
  include_name BOOLEAN,
  person_name TEXT,
  relationship TEXT,
  genre TEXT,
  song_references TEXT, -- Renamed from 'references' which is a reserved SQL keyword
  voice_gender TEXT, -- 'male', 'female'
  styles TEXT[], -- Array of style strings
  details TEXT,
  
  -- Delivery Information
  delivery_type TEXT NOT NULL, -- 'standard', 'express'
  
  -- Payment Information
  payment_method TEXT, -- 'card', 'transfer'
  base_price DECIMAL(10, 2),
  delivery_extra DECIMAL(10, 2),
  total_price DECIMAL(10, 2),
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed'
  
  -- Order Status
  status TEXT DEFAULT 'new', -- 'new', 'in_progress', 'completed', 'cancelled'
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update the updated_at field
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_transaction_id ON orders(transaction_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Comments for better documentation
COMMENT ON TABLE orders IS 'Stores all song creation requests from customers';
COMMENT ON COLUMN orders.transaction_id IS 'Unique transaction ID generated for each order';
COMMENT ON COLUMN orders.song_type IS 'Type of song package: lite, estandar, or premium';
COMMENT ON COLUMN orders.delivery_type IS 'Delivery speed: standard (3-5 days) or express (24 hours)';
COMMENT ON COLUMN orders.styles IS 'Array of musical styles selected by the customer';
COMMENT ON COLUMN orders.status IS 'Current status of the order in the production pipeline';