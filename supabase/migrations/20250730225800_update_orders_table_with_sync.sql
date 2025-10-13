-- Atualizar tabela de pedidos para incluir campos de sincronização
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS api_last_checked TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS api_hash TEXT,
ADD COLUMN IF NOT EXISTS needs_sync BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS sync_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_sync_error TEXT;

-- Adicionar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_connection_id ON orders(connection_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_api_last_checked ON orders(api_last_checked);
CREATE INDEX IF NOT EXISTS idx_orders_needs_sync ON orders(needs_sync);
CREATE INDEX IF NOT EXISTS idx_orders_order_created_at ON orders(order_created_at);

-- Adicionar constraint para garantir que order_number seja único por connection
ALTER TABLE orders 
ADD CONSTRAINT unique_order_per_connection UNIQUE (order_number, connection_id);

-- Adicionar campos de auditoria
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_orders_updated_at ON orders;
CREATE TRIGGER trigger_update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_orders_updated_at();

-- Adicionar campos para melhor controle de sincronização
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS has_advertising BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS advertising_data JSONB,
ADD COLUMN IF NOT EXISTS order_type TEXT,
ADD COLUMN IF NOT EXISTS date_closed TIMESTAMP;

-- Atualizar tabela de produtos para incluir campos de sincronização
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS connection_id uuid references public.connections (id),
ADD COLUMN IF NOT EXISTS api_last_checked TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS api_hash TEXT,
ADD COLUMN IF NOT EXISTS needs_sync BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS sync_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_sync_error TEXT;

-- Adicionar índices para produtos
CREATE INDEX IF NOT EXISTS idx_products_meli_id ON products(meli_id);
CREATE INDEX IF NOT EXISTS idx_products_connection_id ON products(connection_id);
CREATE INDEX IF NOT EXISTS idx_products_api_last_checked ON products(api_last_checked);
CREATE INDEX IF NOT EXISTS idx_products_needs_sync ON products(needs_sync);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Adicionar constraint para garantir que meli_id seja único por connection
ALTER TABLE products 
ADD CONSTRAINT unique_product_per_connection UNIQUE (meli_id, connection_id);

-- Criar função para gerar hash dos dados da API
CREATE OR REPLACE FUNCTION generate_api_hash(data JSONB)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(digest(data::text, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;
