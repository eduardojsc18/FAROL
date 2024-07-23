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
            const id = useId()
            const { customFetch } = useHelpers()
            const { me } = useMe()
            const { data } = await useAsyncData(
                `orders-${id}`,
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
        async getDetail(orderID, itemID, shippingID) {
            const { customFetch } = useHelpers()
            const { data} = await useAsyncData(
                `order-${orderID}-item-${itemID}-detail`,
                async () => {
                    const [product, delivery] = await Promise.all([
                        itemID ? customFetch(`items/${itemID}`) : false,
                        shippingID ? customFetch(`shipments/${shippingID}`) : false,
                    ])
                    return { product, delivery }
                }
            )
            return data.value
        },
    },
})
