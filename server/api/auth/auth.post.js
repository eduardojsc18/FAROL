export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    const config = useRuntimeConfig(event)

    if (body.login === config.login && body.password === config.password) {

        setCookie(event, 'auth', JSON.stringify('KZMxkWZ7jJXrOOljUDmxFSxJEG3yqQiobPg1VaEFcDmKeM3fUxThI1oUduCu44fV'), { secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 })

        return {
            message: 'Autenticação realizada com sucesso',
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
