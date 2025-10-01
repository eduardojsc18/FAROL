interface PaginationOptions {
    limit?: number;
    initialOffset?: number;
    maxRetries?: number;
    retryDelay?: number;
}

interface PaginatedResponse<T = any> {
    results: T[];
    paging?: {
        total?: number;
        offset?: number;
        limit?: number;
    };
}

type FetchFunction = (endpoint: string, options?: any) => Promise<PaginatedResponse>;

/**
 * Utilitário para buscar todos os registros de uma API paginada
 *
 * @param fetchFn - Função de fetch (ex: meliFetch)
 * @param endpoint - Endpoint da API
 * @param queryParams - Parâmetros da query (sem limit e offset)
 * @param options - Opções de paginação
 * @returns Array com todos os registros
 */
export async function useServerFetchAllPagination<T = any>(
    fetchFn: FetchFunction,
    endpoint: string,
    queryParams: Record<string, any> = {},
    options: PaginationOptions = {}
): Promise<T[]> {
    const {
        limit = 50,
        initialOffset = 0,
        maxRetries = 3,
        retryDelay = 1000
    } = options;

    let offset = initialOffset;
    let allResults: T[] = [];
    let hasMore = true;
    let retryCount = 0;

    while (hasMore) {
        try {
            const response = await fetchFn(endpoint, {
                query: {
                    ...queryParams,
                    limit,
                    offset,
                },
            });

            const results = response.results || [];

            // Se não há resultados, para a paginação
            if (!results.length) {
                hasMore = false;
                break;
            }

            // Adiciona os resultados ao array total
            allResults.push(...results);
            offset += limit;

            // Verifica se há mais páginas
            if (results.length < limit || offset >= (response.paging?.total || 0)) {
                hasMore = false;
            }

            // Reset retry count em caso de sucesso
            retryCount = 0;

        } catch (error) {
            console.error(`Erro na paginação offset ${offset}:`, error);

            // Implementa retry logic
            if (retryCount < maxRetries) {
                retryCount++;
                console.warn(`Tentativa ${retryCount}/${maxRetries} falhou. Tentando novamente em ${retryDelay}ms...`);

                // Aguarda antes de tentar novamente
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                continue;
            }

            // Se esgotou as tentativas, lança o erro
            // @ts-ignore
            throw new Error(`Falha ao buscar dados após ${maxRetries} tentativas: ${error.message}`);
        }
    }

    return allResults;
}
export class ServerPaginationBuilder<T = any> {
    private readonly fetchFn: FetchFunction;
    private readonly endpoint: string;
    private queryParams: Record<string, any> = {};
    private options: PaginationOptions = {};

    constructor(fetchFn: FetchFunction, endpoint: string) {
        this.fetchFn = fetchFn;
        this.endpoint = endpoint;
    }

    query(params: Record<string, any>) {
        this.queryParams = { ...this.queryParams, ...params };
        return this;
    }

    limit(limit: number) {
        this.options.limit = limit;
        return this;
    }

    maxRetries(retries: number) {
        this.options.maxRetries = retries;
        return this;
    }

    async execute(): Promise<T[]> {
        return useServerFetchAllPagination<T>(
            this.fetchFn,
            this.endpoint,
            this.queryParams,
            this.options
        );
    }
}
