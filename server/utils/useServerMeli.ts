import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import {$fetch, FetchOptions} from "ofetch";

export async function useServerMeli(event: any) {

    interface User {
        id: string|number;
        name?: string;
    }
    interface TokenData {
        access_token?: string;
        refresh_token?: string;
        expires_at?: Date;
        updated_at?: Date;
        status?: string;
    }

    const client = await serverSupabaseClient(event)
    // @ts-ignore
    const user: User = await serverSupabaseUser(event)
    const config = useRuntimeConfig()

    const isTokenExpired = (expiresAt: Date|any): boolean => {
        return Date.now() >= new Date(expiresAt).getTime()
    }
    const refreshAccessToken = async (refreshToken?: string) => {
        try {

            const response = await $fetch('oauth/token', {
                baseURL: config.public.meliUrl,
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body: {
                    'grant_type': 'refresh_token',
                    'client_id': config.meliClientId,
                    'client_secret': config.meliSecretPassword,
                    'refresh_token': refreshToken,
                },
                retry: 3,
                retryDelay: 1000,
            })

            const newTokenData: TokenData = {
                access_token: response.access_token,
                refresh_token: response.refresh_token,
                expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000),
            }

            await saveTokenData(newTokenData)
            return newTokenData.access_token

        } catch (error) {
            console.error('Erro ao atualizar token:', error)
            throw error
        }
    }
    const saveTokenData = async (tokenData: TokenData) => {
        try {

            const { data, error } = await client
                .from('connections')
                // @ts-ignore
                .update({
                    access_token: tokenData.access_token,
                    refresh_token: tokenData.refresh_token,
                    expires_at: tokenData.expires_at,
                    updated_at: new Date(),
                    status: 'connected',
                })
                .eq('profile_id', user.id)
                .select('*')
                .single()

            if (error) {
                throw error
            }

            return data
        } catch (error) {
            console.error('Erro ao atualizar conexão:', error)
            throw error
        }
    }
    const getTokenData = async (): Promise<TokenData | any> => {

       return client.from('connections')
           .select('id, title, description, type, status, seller_id, status_message, expires_at, access_token, refresh_token')
           .eq('profile_id', user.id)
           .single();

    }
    const getSellerId = async (): Promise<string> => {
        const {data} = await getTokenData()
        return data.seller_id || ''
    }
    const meliFetch = async <T>(
        url: string,
        options: FetchOptions = {},
        useAuthorization: boolean = true,
        maxRetries = 3
    ): Promise<T> => {

        let attempt = 0
        let lastError

        while (attempt < maxRetries) {

            let tokenData:TokenData = {
                access_token: '',
                refresh_token: '',
                expires_at: new Date(),
            }

            try {

                const { data } = await getTokenData()
                tokenData = {...data}

                if (!tokenData.access_token && useAuthorization) {
                    throw new Error('Nenhum token disponível para o Mercado Livre')
                }

                if (useAuthorization && isTokenExpired(tokenData.expires_at)) {
                    tokenData.access_token = await refreshAccessToken(tokenData.refresh_token)
                }

                const headers = {
                    ...options.headers,
                    ...(useAuthorization && tokenData ? {
                        Authorization: `Bearer ${tokenData.access_token}`,
                        Accept: 'application/json',
                    } : {}),
                }

                return await $fetch<T>(url, {
                    ...options,
                    headers,
                    baseURL: config.public.meliUrl,
                    responseType: 'json',
                    retry: 3,
                    retryDelay: 1000,
                } as FetchOptions<'json'>)

            } catch (error: any) {

                lastError = error;
                attempt++;

                if (useAuthorization && error.status === 401 && attempt < maxRetries) {
                    const newToken = await refreshAccessToken(tokenData.refresh_token);
                    options.headers = {
                        ...options.headers,
                        'Authorization': `Bearer ${newToken}`,
                    };
                } else if (attempt >= maxRetries) {
                    throw lastError
                }

            }
        }

        throw lastError

    }

    return {
        meliFetch, getSellerId
    }

}
