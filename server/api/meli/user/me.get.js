export default defineEventHandler(async (event) => {
    const { meliFetch } = await useMeli()
    return await meliFetch('/users/me')
})
