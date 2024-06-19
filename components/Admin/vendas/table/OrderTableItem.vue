<template>
    <div class="md:table-row max-sm:pb-3 max-sm:grid grid-cols-4 *:px-3 *:py-4 *:align-middle md:*:table-cell dark:first:*:text-primary-200 dark:*:text-gray-300 first:*:text-base *:text-sm first:*:text-left *:text-center">
        <div class="max-sm:col-span-full">
            <div class="mb-1 inline-block text-xs w-16 text-center" :data-tooltip="`comprado em ${moment(order.date_created).format('DD/MM/YYYY HH:mm:ss')}`" data-tooltip-position="top-left">{{ date_humanized }}</div>
            <a :href="`https://www.mercadolivre.com.br/vendas/${props.order.id}/detalhe`" target="_blank">
                <div class="flex items-center gap-3 group hover:bg-neutral-700 -m-2 p-2 rounded-xl">
                    <img :src="details?.product?.pictures[0].url" alt="" class="aspect-square rounded-lg object-center object-cover size-16">
                    <p>
                        {{ props.order.order_items[0].item.title }}
                        <span class="invisible group-hover:visible inline-block translate-y-0.5 text-neutral-400 leading-none" data-tooltip="Abrir no ML">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                                <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
                                <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
                            </svg>
                        </span>
                    </p>
                </div>
            </a>
        </div>
        <div class="max-sm:rounded-l-2xl max-sm:bg-neutral-600/50 flex items-center justify-center">
            <div data-tooltip="Valor Total" v-text="`R$ ${toBRL(props.order.total_amount)}`"/>
        </div>
        <div class="max-sm:bg-neutral-600/50 flex items-center justify-center">
            <div data-tooltip="Quantidade" v-text="props.order.order_items[0].quantity"/>
        </div>
        <div class="max-sm:bg-neutral-600/50 flex items-center justify-center">
            <div class="flex items-center justify-center">
                <div v-if="details?.product?.catalog_listing" data-tooltip="Catálogo" class="inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="flex-shrink-0 size-5">
                        <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h11a2.5 2.5 0 0 1 0 5h-11A2.5 2.5 0 0 1 2 4.5ZM2.75 9.083a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H2.75ZM2.75 12.663a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H2.75ZM2.75 16.25a.75.75 0 0 0 0 1.5h14.5a.75.75 0 1 0 0-1.5H2.75Z" />
                    </svg>
                </div>
            </div>
        </div>
        <div class="max-sm:rounded-r-2xl max-sm:bg-neutral-600/50">
            <div class="flex items-center justify-center">
                <div v-if="details.delivery.logistic_type === 'fulfillment'">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 text-green-600">
                        <path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clip-rule="evenodd" />
                    </svg>
                </div>
                <img v-else-if="details.delivery.tracking_method === 'PAC' || details.delivery.tracking_method === 'Sedex'" class="size-9" src="~/assets/img/correios_icon.svg" alt="Correios"/>
                <span v-else class="font-bold italic text-green-600" v-text="'FLEX'" />
            </div>
        </div>
    </div>
</template>
<script setup>
import {useGetOrders} from "~/stores/orders/useGetOrders.js";
import {useHelpers} from "~/composables/useHelpers.js";
import moment from "moment";
import 'moment/locale/pt-br.js'

const props = defineProps({
    order: {type: Object},
})

const duration = moment.duration(moment().diff(moment(props.order.date_created)))
const date_humanized = ref(duration.humanize());

const {toBRL} = useHelpers()
const details = await useGetOrders().getDetail(props.order.id, props.order.order_items[0].item.id, props.order.shipping.id)

</script>
<style scoped>

</style>
