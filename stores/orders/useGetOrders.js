import {defineStore} from 'pinia'
import {useHelpers} from "~/composables/useHelpers.js";
import {useMe} from "~/stores/useMe.js";

export const useGetOrders = defineStore('useGetOrders', {
    state: () => ({
        // me: () => {
        //     return useMe()
        // }
    }),
    actions: {
        async getOrders(query) {
            const { customFetch } = useHelpers()
            const { me } = useMe()
            const { data } = await useAsyncData(
                `orders`,
                () => customFetch(`/orders/search?`, {
                    query: {
                        seller: me.id,
                        sort: 'date_desc',
                        limit: 10,
                        ...query,
                    },
                }, { immediate: true })
            )
            return data.value
        },
        async getDetail(itemID, shippingID) {
            const { customFetch } = useHelpers()
            const { data} = await useAsyncData(
                `orders-item-detail-${itemID}`,
                async () => {
                    const [product, delivery] = await Promise.all([
                        customFetch(`items/${itemID}`),
                        customFetch(`shipments/${shippingID}`)
                    ])
                    return { product, delivery }
                }
            )
            return data.value
        }
    },
})
