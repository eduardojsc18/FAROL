import type { UseFetchOptions } from 'nuxt/app'

export function useFetchSupabase<T>(
    url: string | (() => string),
    options?: UseFetchOptions<T>,
) {
    return useFetch(url, {
        ...options,
        $fetch: useNuxtApp().$fetchSupabase as typeof $fetch
    })
}
