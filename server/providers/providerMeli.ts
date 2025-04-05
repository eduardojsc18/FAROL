// server/providers/meli.ts
import { $fetch, FetchOptions, FetchResponse } from 'ofetch'

// Interface para o token
interface TokenData {
    access_token: string
    refresh_token: string
    expires_at: number // timestamp de expiração
}

// Função para verificar se o token expirou
const isTokenExpired = (expiresAt: number): boolean => {
    return Date.now() >= expiresAt
}

// Função para obter token atualizado
const refreshAccessToken = async (refreshToken: string) => {
    try {
        // Substitua com sua lógica real de refresh token
        const response = await $fetch('https://api.mercadolibre.com/oauth/token', {
            method: 'POST',
            body: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: process.env.MELI_CLIENT_ID,
                client_secret: process.env.MELI_CLIENT_SECRET
            }
        })

        const newTokenData: TokenData = {
            access_token: response.access_token,
            refresh_token: response.refresh_token,
            expires_at: Date.now() + response.expires_in * 1000
        }

        await saveTokenData(newTokenData)

        return newTokenData.access_token
    } catch (error) {
        console.error('Erro ao atualizar token:', error)
        throw error
    }
}

// Função para salvar os dados do token (implemente conforme seu sistema)
const saveTokenData = async (tokenData: TokenData) => {
    // Implemente de acordo com seu sistema de armazenamento
    // Pode ser Redis, DB, arquivo, etc.
}

// Função para obter os dados do token (implemente conforme seu sistema)
const getTokenData = async (): Promise<TokenData | any> => {
    // Implemente de acordo com seu sistema de armazenamento
    // Retorne null se não houver token
}

export const meliFetch = async <T>(url: string, options: FetchOptions = {}): Promise<T> => {

    let tokenData = await getTokenData()

    if (!tokenData) {
        throw new Error('Nenhum token disponível para o Mercado Livre')
    }

    if (isTokenExpired(tokenData.expires_at)) {
        tokenData.access_token = await refreshAccessToken(tokenData.refresh_token)
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${tokenData.access_token}`
    }

    try {
        return await $fetch<T>(url, {
            ...options,
            headers,
            responseType: 'json'
        } as FetchOptions<'json'>)
    } catch (error: any) {
        if (error.status === 401) {
            const newToken = await refreshAccessToken(tokenData.refresh_token)

            return await $fetch<T>(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${newToken}`
                },
                responseType: 'json'
            } as FetchOptions<'json'>)
        }

        throw error
    }
}
