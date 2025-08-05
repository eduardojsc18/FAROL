CREATE TABLE products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      meli_id TEXT,
      title TEXT,
      thumbnail TEXT,
      permalink TEXT,

      status TEXT,

      health TEXT,

      created_at TIMESTAMP,
      updated_at TIMESTAMP,

      stock_init INTEGER,
      stock_available INTEGER,
      qtd_sold INTEGER,
      visits INTEGER,

      sale_price NUMERIC,

      cost_unit NUMERIC,
      tax_nfe_unit NUMERIC,

      shipping_type TEXT,
      shipping_free BOOLEAN,
      shipping_costs JSONB,
      shipping_cost_estimated NUMERIC,

      selling_fees JSONB,

      marketplace_fee_percentage NUMERIC,
      marketplace_fee_fixed NUMERIC,
      marketplace_fee_total NUMERIC,


      tax_meli_unit NUMERIC,
      profit_unit NUMERIC,
      profit_unit_percent NUMERIC,

      received_total_gross NUMERIC,
      received_total_cost NUMERIC,
      received_total_profit NUMERIC,
      received_total_profit_with_tax NUMERIC,
      received_total_profit_percent NUMERIC,
      received_total_profit_percent_with_tax NUMERIC,

      receivable_total_gross NUMERIC,
      receivable_total_cost NUMERIC,
      receivable_total_profit NUMERIC,
      receivable_total_profit_with_tax NUMERIC,
      receivable_total_profit_percent NUMERIC,
      receivable_total_profit_percent_with_tax NUMERIC,

      variations JSONB,

      fetch_errors JSONB,
      fetch_data JSONB

);
