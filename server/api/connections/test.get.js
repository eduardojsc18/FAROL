export default defineEventHandler(async (event) => {

    const { meliFetch } = await useServerMeli(event)

    const data = await meliFetch('/users/me')

    return {data}

})
