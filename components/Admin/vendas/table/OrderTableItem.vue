<template>
    <tr class="*:px-3 *:py-4">
        <td class="text-base dark:text-primary-200">
            <div class="flex items-center gap-3">
                <img :src="details?.product?.pictures[0].url" alt="" class="aspect-square rounded-lg object-center object-cover size-16">
                <span>{{ props.order.order_items[0].item.title }}</span>
            </div>
        </td>
        <td class="whitespace-nowrap text-sm text-center dark:text-gray-300">
            <div data-tooltip="Valor Total" v-text="`R$ ${toBRL(props.order.total_amount)}`"/>
        </td>
        <td class="whitespace-nowrap text-sm text-center dark:text-gray-300">
            <div data-tooltip="Quantidade" v-text="props.order.order_items[0].quantity"/>
        </td>
        <td class="whitespace-nowrap text-sm dark:text-gray-300">
            <div class="flex justify-center">
                <div v-if="details?.product?.catalog_listing" data-tooltip="Catálogo" class="inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="flex-shrink-0 size-5">
                        <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h11a2.5 2.5 0 0 1 0 5h-11A2.5 2.5 0 0 1 2 4.5ZM2.75 9.083a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H2.75ZM2.75 12.663a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H2.75ZM2.75 16.25a.75.75 0 0 0 0 1.5h14.5a.75.75 0 1 0 0-1.5H2.75Z" />
                    </svg>
                </div>
            </div>
        </td>
        <td class="text-sm text-center font-medium sm:pr-0">
            <div class="flex justify-center">
                <img v-if="details.delivery.tracking_method === 'PAC' || details.delivery.tracking_method === 'Sedex'" class="size-9" src="~/assets/img/correios_icon.svg" alt="Correios"/>
                <span v-else class="font-bold italic text-green-600" v-text="'FLEX'" />
            </div>
        </td>
    </tr>
</template>
<script setup>
import {useGetOrders} from "~/stores/orders/useGetOrders.js";
import {useHelpers} from "~/composables/useHelpers.js";

const props = defineProps({
    order: {type: Object},
})



const {toBRL} = useHelpers()
const details = await useGetOrders().getDetail(props.order.id, props.order.order_items[0].item.id, props.order.shipping.id)

</script>
<style scoped>

</style>
