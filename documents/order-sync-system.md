# Sistema de Sincronização de Pedidos

## Visão Geral

O sistema de sincronização de pedidos foi implementado para otimizar o desempenho e reduzir chamadas desnecessárias à API do Mercado Livre. O sistema mantém os dados dos pedidos no banco de dados local e verifica periodicamente se há alterações na API.

## Como Funciona

### 1. Primeira Consulta
- Quando não há pedidos no banco para o período solicitado, o sistema busca todos os pedidos da API do Mercado Livre
- Os pedidos são processados e salvos no banco de dados com todos os detalhes
- Os dados são retornados imediatamente para o frontend

### 2. Consultas Subsequentes
- O sistema sempre busca os pedidos do banco de dados primeiro
- Verifica quais pedidos precisam ser sincronizados baseado em:
  - Flag `needs_sync` = true
  - Última verificação na API há mais de 1 hora
  - Hash dos dados da API mudou (dados foram alterados)
- Sincroniza apenas os pedidos que precisam de atualização
- Retorna os dados atualizados do banco

### 3. Relacionamento com Produtos
- Cada pedido está relacionado a um produto através do `product_id`
- Produtos são criados automaticamente quando não existem
- Produtos também têm sistema de sincronização similar

## Estrutura do Banco de Dados

### Tabela `orders`
- Campos principais: `order_number`, `status`, `order_created_at`, `order_updated_at`
- Relacionamento: `product_id` → `products.id`, `connection_id` → `connections.id`
- Campos de sincronização: `api_last_checked`, `api_hash`, `needs_sync`, `sync_attempts`
- Dados do produto: `product_meli_id`, `product_title`, `product_sku`, etc.
- Cálculos financeiros: `tax_marketplace`, `net_revenue`, `product_cost_total`, etc.

### Tabela `products`
- Campos principais: `meli_id`, `title`, `thumbnail`, `status`
- Campos de sincronização: `api_last_checked`, `api_hash`, `needs_sync`, `sync_attempts`
- Dados financeiros: `cost_unit`, `sale_price`, `profit_unit`, etc.

## APIs Disponíveis

### 1. `GET /api/orders`
- Busca pedidos com sincronização automática
- Parâmetros: `date_range` (array com 2 datas)
- Retorna: pedidos, relatórios e estatísticas

### 2. `POST /api/orders/sync`
- Força sincronização de pedidos específicos ou todos
- Body: `{ "order_numbers": ["123456", "789012"], "force_sync": true }`
- Retorna: resultado da sincronização

### 3. `GET /api/orders/sync-stats`
- Estatísticas de sincronização
- Retorna: status de saúde, percentuais de sincronização, erros

## Configurações

### Intervalo de Sincronização
- Verificação automática: 1 hora
- Pode ser ajustado modificando o valor em `index.get.js` linha 73

### Tamanho do Lote
- Sincronização em lotes de 5 pedidos para evitar rate limit
- Aguarda 1 segundo entre lotes

### Hash de Verificação
- Usa SHA-256 para comparar dados da API
- Detecta mudanças em qualquer campo dos dados

## Monitoramento

### Flags de Status
- `needs_sync`: true quando precisa ser sincronizado
- `sync_attempts`: contador de tentativas de sincronização
- `last_sync_error`: última mensagem de erro
- `api_last_checked`: timestamp da última verificação

### Logs
- Erros de sincronização são logados no console
- Tentativas de sincronização são registradas
- Falhas incrementam o contador `sync_attempts`

## Vantagens

1. **Performance**: Reduz drasticamente as chamadas à API
2. **Confiabilidade**: Dados sempre disponíveis mesmo se a API estiver indisponível
3. **Eficiência**: Sincroniza apenas dados que mudaram
4. **Auditoria**: Histórico completo de sincronizações e erros
5. **Relacionamentos**: Produtos e pedidos integrados no banco

## Troubleshooting

### Pedidos não sincronizando
1. Verificar `needs_sync` flag
2. Verificar `sync_attempts` (muitas tentativas podem indicar erro persistente)
3. Verificar `last_sync_error` para detalhes do erro

### Performance lenta
1. Verificar índices do banco de dados
2. Ajustar tamanho do lote de sincronização
3. Verificar rate limit da API

### Dados desatualizados
1. Forçar sincronização via API `/api/orders/sync`
2. Verificar se `api_hash` está sendo calculado corretamente
3. Verificar se `api_last_checked` está sendo atualizado


