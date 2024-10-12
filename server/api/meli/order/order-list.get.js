
export default defineEventHandler((event) => {

    // const me = await useApiMeli('/users/me');

    return useMeliFetch('/orders/search?', {
        query: {
            // seller: me.id,
            sort: 'date_desc',
            limit: 10,
        },
    });

    // const {data} = await $api(`/orders/search?`, {
    //         query: {
    //             seller: me.id,
    //             sort: 'date_desc',
    //             limit: 10,
    //         },
    //     })


})
