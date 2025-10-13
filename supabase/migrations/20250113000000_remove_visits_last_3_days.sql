-- Remove a coluna visits_last_3_days se ela existir
-- A nova estratégia é armazenar todo o histórico de visitas na coluna visits (JSONB)
-- Formato: { "2025-01-13": 45, "2025-01-12": 32, ... }

ALTER TABLE products DROP COLUMN IF EXISTS visits_last_3_days;
