<template>
    <a
        :href="`https://www.mercadolivre.com.br/vendas/${props.order.id}/detalhe`"
        target="_blank"
        class="rounded-lg group relative min-w-28 w-28 !flex hover:bg-neutral-400/10 flex-col"
        :class="{'!bg-red-500/10 line-through': props.order.status === 'cancelled'}"
    >
        <img :src="details?.product?.pictures[0].url" alt="" class="aspect-square min-w-28 rounded-lg object-center object-cover w-28 h-28">
        <div class="p-1">
            <div class="text-[11px] leading-tight line-clamp-2" v-text="props.order.order_items[0].item.title" />
            <div class="text-[9px] mt-1 flex justify-start items-center flex-wrap gap-1">
                <div v-if="props.order.status === 'cancelled'" class="relative self-center">
                    <div class="absolute size-full animate-ping bg-red-800 rounded-full"/>
                    <div data-tooltip="Cancelado" class="size-3 rounded-full bg-red-500"/>
                </div>
                <div class="px-1 py-0.5 rounded-lg bg-neutral-400/10 backdrop-blur leading-none" data-tooltip="Valor Total" v-text="`${toBRL(props.order.total_amount)}`"/>
                <div class="px-1 py-0.5 rounded-lg bg-neutral-400/10 backdrop-blur leading-none" data-tooltip="Quantidade" v-text="props.order.order_items[0].quantity"/>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
                        <path d="M6.5 3c-1.051 0-2.093.04-3.125.117A1.49 1.49 0 0 0 2 4.607V10.5h9V4.606c0-.771-.59-1.43-1.375-1.489A41.568 41.568 0 0 0 6.5 3ZM2 12v2.5A1.5 1.5 0 0 0 3.5 16h.041a3 3 0 0 1 5.918 0h.791a.75.75 0 0 0 .75-.75V12H2Z" />
                        <path d="M6.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM13.25 5a.75.75 0 0 0-.75.75v8.514a3.001 3.001 0 0 1 4.893 1.44c.37-.275.61-.719.595-1.227a24.905 24.905 0 0 0-1.784-8.549A1.486 1.486 0 0 0 14.823 5H13.25ZM14.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    </svg>
                </div>
            </div>
        </div>
    </a>
</template>
<script setup>
import helpers from "~/composables/helpers.js";
const { customFetch, toBRL } = helpers()

const props = defineProps({
    order: {type: Object},
})

const { data: details, execute, pending, loading, status } = await useAsyncData(
    `shortcut-detail-item-${props.order.order_items[0].item.id}`,
    async () => {
        const [product, delivery] = await Promise.all([
            customFetch(`items/${props.order.order_items[0].item.id}`),
            customFetch(`shipments/${props.order.shipping.id}`)
        ])
        return { product, delivery }
    }
)
</script>
