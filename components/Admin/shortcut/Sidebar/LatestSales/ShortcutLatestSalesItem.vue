<template>
    <a
        :href="`https://www.mercadolivre.com.br/vendas/${props.order.id}/detalhe`"
        target="_blank"
        class="rounded-lg group relative w-full flex hover:bg-neutral-400/10 flex-col"
        :class="{'!bg-red-500/10 line-through': props.order.status === 'cancelled'}"
    >
        <ProductImageWithOrderVariation class="w-full aspect-square" :product="details.product" :order="props.order" />
        <div class="p-1 dark:text-neutral-200">
            <div class="text-sm font-medium leading-tight line-clamp-2" v-text="props.order.order_items[0].item.title" />
            <div class="text-xs mt-1 flex justify-start items-center flex-wrap gap-1">
                <div v-if="props.order.status === 'cancelled'" class="relative self-center">
                    <div class="absolute size-full animate-ping bg-red-800 rounded-full"/>
                    <div data-tooltip="Cancelado" class="size-3 rounded-full bg-red-500"/>
                </div>
                <div class="px-1 py-0.5 rounded-lg bg-neutral-400/10 backdrop-blur leading-none" data-tooltip="Valor Total" v-text="`${toBRL(props.order.total_amount)}`"/>
                <div class="px-1 py-0.5 rounded-lg bg-neutral-400/10 backdrop-blur leading-none" data-tooltip="Quantidade" v-text="props.order.order_items[0].quantity"/>
                <div v-if="details?.product?.catalog_listing" data-tooltip="Catálogo">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="flex-shrink-0 size-3">
                        <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h11a2.5 2.5 0 0 1 0 5h-11A2.5 2.5 0 0 1 2 4.5ZM2.75 9.083a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H2.75ZM2.75 12.663a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H2.75ZM2.75 16.25a.75.75 0 0 0 0 1.5h14.5a.75.75 0 1 0 0-1.5H2.75Z" />
                    </svg>
                </div>
                <div class="flex-1" />
                <div >
                    <div v-if="details.delivery.logistic_type === 'fulfillment'" data-tooltip="Full" data-tooltip-position="top-right">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-3 text-green-600">
                            <path fill-rule="evenodd" d="M9.58 1.077a.75.75 0 0 1 .405.82L9.165 6h4.085a.75.75 0 0 1 .567 1.241l-6.5 7.5a.75.75 0 0 1-1.302-.638L6.835 10H2.75a.75.75 0 0 1-.567-1.241l6.5-7.5a.75.75 0 0 1 .897-.182Z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <svg v-else-if="details.delivery.tracking_method === 'PAC' || details.delivery.tracking_method === 'Sedex'" class="size-3" width="281" height="205" viewBox="0 0 281 205" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M71.2 204.8H62.2C55 204.8 48.5 201.4 44.2 196L1.6 141.3C0.7 140 0 138.4 0 136.6C0 134.8 0.7 133.2 1.6 131.9L44.5 77C48.8 71.6 55.1 68.2 62.5 68.2H157.3L103.4 135.8L64 185.5L71.2 204.8Z" fill="url(#paint0_linear_2_18)"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M104 136.5L103.6 135.8L64 185.5C62.4 187.5 61.1 190.2 61.1 194.7C61.1 199.2 65.4 204.8 73.9 204.8H157.2L104 136.5Z" fill="url(#paint1_linear_2_18)"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M216.3 19.3L209.1 0H218.1C225.3 0 231.8 3.4 236.1 8.8L279 63.6C279.9 64.9 280.6 66.5 280.6 68.3C280.6 70.1 279.9 71.7 279 73L235.9 127.8C231.6 133.2 225.3 136.6 217.9 136.6H123.1L177 68.9L216.3 19.3Z" fill="url(#paint2_linear_2_18)"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M176.5 68.3L176.9 69L216.2 19.4C217.8 17.4 219.1 14.7 219.1 10.2C219.1 5.69998 214.8 0.0999756 206.3 0.0999756H123L176.5 68.3Z" fill="url(#paint3_linear_2_18)"/>
                        <path d="M218.5 18.4C220.1 16.4 221 14.1 221 11.4C221 5.2 215.8 0 209.5 0H206.6C212.9 0 217.8 5.2 217.8 11.5C217.8 14.2 216.9 16.7 215.3 18.5L176.4 68.4L123.2 136.4L218.5 18.4Z" fill="#0BBBEF"/>
                        <path d="M62 186.4C60.4 188.4 59.5 190.7 59.5 193.4C59.5 199.7 64.7 204.9 71 204.9H73.9C67.6 204.9 62.4 199.7 62.4 193.4C62.4 190.7 63.3 188.2 64.9 186.4L104 136.5L157.2 68.5L62 186.4Z" fill="#FFD500"/>
                        <defs>
                            <linearGradient id="paint0_linear_2_18" x1="154.566" y1="64.9063" x2="22.431" y2="168.14" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#FFDD00"/>
                                <stop offset="0.9" stop-color="#D49F00"/>
                                <stop offset="1" stop-color="#FFDD00"/>
                            </linearGradient>
                            <linearGradient id="paint1_linear_2_18" x1="157.196" y1="170.34" x2="61.0812" y2="170.34" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#D49F00"/>
                                <stop offset="1" stop-color="#AB5808"/>
                            </linearGradient>
                            <linearGradient id="paint2_linear_2_18" x1="125.558" y1="139.747" x2="257.81" y2="36.7934" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#00537E"/>
                                <stop offset="0.9" stop-color="#18AAE2"/>
                                <stop offset="1" stop-color="#107BC0"/>
                            </linearGradient>
                            <linearGradient id="paint3_linear_2_18" x1="206.177" y1="-9.40583" x2="150" y2="34.4837" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#002542"/>
                                <stop offset="1" stop-color="#004169"/>
                            </linearGradient>
                        </defs>
                    </svg>
                    <span v-else class="text-[8px] font-bold italic text-green-600">
                        FLEX
                    </span>
                </div>
            </div>
        </div>
    </a>
</template>
<script setup>
import {useGetOrders} from "~/stores/orders/useGetOrders.js";
import {useHelpers} from "~/composables/useHelpers.js";
import imageDefault from "~/assets/img/default-image.png";
import ProductImageWithOrderVariation from "~/components/Admin/product/ProductImageWithOrderVariation.vue";

const props = defineProps({
    order: {type: Object},
})

const {toBRL} = useHelpers()

const details = await useGetOrders().getDetail(props.order.id, props.order.order_items[0].item.id, props.order.shipping.id)
</script>
