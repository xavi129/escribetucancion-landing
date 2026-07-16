-- Migration: Add currency field to orders table
-- Date: 2025-01-09
-- Description: Support multi-currency orders (MXN, USD, EUR, COP)

-- Add currency column with default value MXN
ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'MXN';

-- Create index for currency queries
CREATE INDEX IF NOT EXISTS idx_orders_currency ON orders(currency);

-- Update existing orders to MXN (they are all in MXN)
UPDATE orders SET currency = 'MXN' WHERE currency IS NULL;

-- Add a comment to document the column
COMMENT ON COLUMN orders.currency IS 'ISO 4217 currency code (MXN, USD, EUR, COP)';
