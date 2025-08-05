CREATE TABLE orders (

    id UUID PRIMARY KEY,
    order_number TEXT,
    status TEXT,
    order_created_at TIMESTAMP,
    order_updated_at TIMESTAMP,

    product_id uuid references public.products (id),
    connection_id uuid references public.connections (id),

    product_meli_id TEXT,
    product_title TEXT,
    product_sku TEXT,
    product_thumbnail TEXT,
    product_variation_attributes JSONB,

    qtd INTEGER,
    unit_price NUMERIC,
    order_total NUMERIC,

    tax_marketplace NUMERIC,
    tax_marketplace_shipping_before NUMERIC,
    tax_marketplace_shipping_after NUMERIC,
    advertising_cost NUMERIC,

    tax_nfe NUMERIC,
    tax_nfe_percent NUMERIC,

    product_cost_unit NUMERIC,
    product_cost_total NUMERIC,

    net_revenue NUMERIC,
    net_revenue_percent NUMERIC,

    shipping_id TEXT,
    shipping_type TEXT,
    shipping_status TEXT,
    shipping_base_cost NUMERIC,

    buyer_id TEXT,
    buyer_nickname TEXT,

    order_type TEXT,
    fetched_at TIMESTAMP,

    fetch_errors JSONB,
    fetch_data JSONB

);
