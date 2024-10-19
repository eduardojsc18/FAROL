export default defineEventHandler(async (event) => {
    //
    // console.error(useMeli())
    // // const { data } = await meliFetch('/users/me')

    const { meliFetch } = await useMeli();
    return await meliFetch('/users/me')
})
