<template>
    <div
        class="md:table-row max-sm:pb-5 max-sm:pt-2 max-sm:first:!pt-0 max-sm:grid grid-cols-4 md:*:even:bg-neutral-900 *:flex *:items-center *:justify-center max-sm:*:flex-col max-sm:*:justify-between *:px-3 *:py-4 *:align-middle md:*:table-cell dark:first:*:text-neutral-100 dark:*:text-neutral-300 first:*:text-base *:text-sm first:*:text-left *:text-center"
        :class="{'*:!bg-red-500/10 line-through': props.order.status === 'cancelled'}"
    >
        <div class="max-sm:mt-3 max-sm:col-span-full md:rounded-l-2xl max-sm:rounded-t-2xl">
            <div class="w-full flex items-center justify-start gap-2 mb-3">
                <div v-if="props.order.status === 'cancelled'" class="relative self-center flex justify-center items-center gap-1 rounded-full border text-red-500 bg-white  border-red-500 p-1">
                    <div class="relative">
                        <div class="z-0 absolute size-full animate-ping bg-red-800 rounded-full"/>
                        <div data-tooltip="Cancelado" class="size-2 rounded-full bg-red-500"/>
                    </div>
                    <div class="z-10 relative text-[10px] leading-none font-medium !no-underline">cancelado</div>
                </div>
                <div class=" inline-block text-xs text-center whitespace-nowrap">
                    <b>há {{ dayjs().from(dayjs(props.order.date_created), true) }}</b> -
                    <small><i>{{ dayjs(order.date_created).format('DD/MM/YYYY HH:mm:ss') }}</i></small>
                </div>
            </div>
            <a :href="`https://www.mercadolivre.com.br/vendas/${props.order.id}/detalhe`" target="_blank">
                <div class="flex items-center gap-3 group hover:bg-neutral-700 -m-2 p-2 rounded-xl">
                    <img :src="details?.product?.pictures[0].url" alt="" class="aspect-square rounded-lg object-center object-cover size-16">
                    <div>
                        <p>
                            {{ props.order.order_items[0].item.title }}
                            <span class="invisible group-hover:visible inline-block translate-y-0.5 text-neutral-400 leading-none" data-tooltip="Abrir no ML">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                                <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
                                <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
                            </svg>
                        </span>
                        </p>
                        <div v-if="props.order.order_items[0].item.variation_attributes.length" class="flex flex-wrap items-center gap-1 -ml-1.5">
                            <div v-for="variation in props.order.order_items[0].item.variation_attributes" v-text="`${variation.name}: ${variation.value_name}`" class="rounded-full bg-neutral-800 px-1.5 py-1 text-[10px] leading-none"/>
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <div :class="{'max-sm:rounded-l-xl max-sm:ml-1': props.order.status !== 'cancelled', 'max-sm:rounded-bl-2xl': props.order.status === 'cancelled'}" class="max-sm:py-2 max-sm:bg-neutral-700/50 gap-1">
            <span class="md:hidden text-[10px]">
                Total
            </span>
            <div data-tooltip="Valor Total" class="font-bold" v-text="`R$ ${toBRL(props.order.total_amount)}`"/>
        </div>
        <div class="max-sm:bg-neutral-700/50 max-sm:py-2 gap-1">
            <span class="md:hidden text-[10px]">
                Quantidade
            </span>
            <div data-tooltip="Quantidade" class="font-bold" v-text="props.order.order_items[0].quantity"/>
        </div>
        <div class="max-sm:bg-neutral-700/50 max-sm:py-2">
            <div class="flex justify-center h-full">
                <div class="flex flex-col gap-1 justify-between">
                    <span class="md:hidden text-[10px]">
                        Tipo
                    </span>
                    <div class="flex justify-center">
                        <div v-if="details?.product?.catalog_listing" data-tooltip="Catálogo" class="bg-blue-800 text-white p-1 rounded-md text-xs flex items-center justify-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="flex-shrink-0 size-3.5">
                                <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h11a2.5 2.5 0 0 1 0 5h-11A2.5 2.5 0 0 1 2 4.5ZM2.75 9.083a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H2.75ZM2.75 12.663a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H2.75ZM2.75 16.25a.75.75 0 0 0 0 1.5h14.5a.75.75 0 1 0 0-1.5H2.75Z" />
                            </svg>
                            CATÁLOGO
                        </div>
                        <div v-else class="rounded-md p-1 text-xs text-neutral-400 italic">
                            <span class="h-3.5"/>
                            comum
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div :class="{'max-sm:rounded-r-xl max-sm:mr-1 rounded-r-2xl': props.order.status !== 'cancelled', 'max-sm:rounded-br-2xl md:rounded-r-2xl': props.order.status === 'cancelled'}" class=" max-sm:py-2  max-sm:bg-neutral-700/50">
            <div class="flex justify-center">
                <div class="text-base flex flex-col h-full gap-1 justify-between">
                    <span class="md:hidden text-[10px]">
                        Transporte
                    </span>
                    <div class="flex justify-center min-h-5">
                        <div v-if="details.delivery.logistic_type === 'fulfillment'" class="flex items-center gap-1 font-bold text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="12" viewBox="0 0 40 12">
                                <g fill="#00A650" fill-rule="evenodd"><path fill-rule="nonzero" d="M13.597 9h-1.892l1.617-7.337h5.379l-.363 1.65h-3.487l-.242 1.144h3.399l-.363 1.65h-3.41L13.597 9zm9.35.132c-2.255 0-3.366-1.078-3.366-2.618 0-.121.033-.374.055-.484l.968-4.367h1.925l-.957 4.323a1.62 1.62 0 0 0-.033.308c.011.605.473 1.188 1.408 1.188 1.012 0 1.529-.638 1.716-1.496l.957-4.323h1.914l-.957 4.356c-.396 1.782-1.364 3.113-3.63 3.113zM32.924 9h-4.84l1.617-7.337h1.892L30.35 7.35h2.937L32.924 9zm6.655 0h-4.84l1.617-7.337h1.892L37.005 7.35h2.937L39.579 9z"></path><path d="M2.455 0L0 6.857h4.09L2.456 12 9 4.286H4.91L7.363 0z"></path></g>
                            </svg>
                        </div>
                        <img v-else-if="details.delivery.tracking_method === 'PAC' || details.delivery.tracking_method === 'Sedex'" class="size-7" src="~/assets/img/correios_icon.svg" alt="Correios"/>
                        <span v-else class="font-bold italic text-green-700 leading-tight" v-text="'FLEX'"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import {useGetOrders} from "~/stores/orders/useGetOrders.js";
import {useHelpers} from "~/composables/useHelpers.js";
import { useDayjs } from '#dayjs'

const {toBRL} = useHelpers()
const dayjs = useDayjs()

const props = defineProps({
    order: {type: Object},
})

const details = await useGetOrders().getDetail(props.order.id, props.order.order_items[0].item.id, props.order.shipping.id)
</script>
<style scoped>

</style>
