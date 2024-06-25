export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    const config = useRuntimeConfig(event)

    if (body.login === config.login && body.password === config.password) {
        return {
            name: 'Premium Price',
        }
    }

    throw createError({
        statusCode: 500,
        statusMessage: 'Não autorizado',
        data: {
            login: body.login !== config.login ? 'Usuário não encontrado' : '',
            password: body.login === config.login && body.password !== config.password ? 'Senha incorreta' : '',
        }
    })

})
