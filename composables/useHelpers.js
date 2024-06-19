import {useCookie} from "#app";

export function useHelpers() {
    // const config = useRuntimeConfig()
    function toBRL (value) {
        if (typeof value === "string") value = parseFloat(value)
        return (value || 0).toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2})
    }
    function setCookie (cName, cValue, expDays)  {
        let date = new Date();
        date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
    }
    function getCookie (cName) {
        const name = cName + "=";
        const cDecoded = decodeURIComponent(document.cookie); //to be careful
        const cArr = cDecoded.split('; ');
        let res;
        cArr.forEach(val => {
            if (val.indexOf(name) === 0) res = val.substring(name.length);
        })
        return res;
    }
    function normalizeString (text) {
        return text
            ? text.toString().toLowerCase().normalize("NFD")
            : ''
    }
    function removeEmptyAttributes (obj) {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => v != null && v !== "")
        );
    }
    function clearAttr (obj) {
        for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                // Se o valor for um objeto, chame a função recursivamente
                this.clearAttr(obj[key]);
                // Verifique se o objeto está vazio após a chamada recursiva
                if (Object.keys(obj[key]).length === 0) {
                    delete obj[key];
                }
            } else if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
                // Remova nulos, indefinidos e strings vazias
                delete obj[key];
            }
        }
        return obj
    }
    async function customFetch(request, options, headers) {

        const config = useRuntimeConfig()
        const baseURL = config.public.apiBase

        const token = useCookie('token')
        const access_token = ref(token.value ?? '')

        if (!token.value) {
            access_token.value = await $fetch(`/api/access-token`)
        }

        return $fetch(request, {
            method: "GET",
            ...options,
            params: {
                access_token: access_token.value,
                ...options?.params
            },
            baseURL,
            onResponseError(context) {
                if ( context.response.status === 400 || context.response.status === 401) {
                    token.value = ''
                    customFetch(request, options, headers)
                }
            }
        })

    }

    return {
        toBRL,
        setCookie,
        getCookie,
        normalizeString,
        removeEmptyAttributes,
        clearAttr,
        customFetch,
    }

}
