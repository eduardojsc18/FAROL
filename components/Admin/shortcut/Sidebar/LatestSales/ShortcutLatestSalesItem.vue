<template>
    <a
        :href="`https://www.mercadolivre.com.br/vendas/${props.order.id}/detalhe`"
        target="_blank"
        class="rounded-lg my-2 group relative min-w-28 w-28 !flex hover:bg-neutral-800 ring ring-transparent hover:ring-neutral-800 flex-col"
        :class="{'!ring !ring-red-500/10 !bg-red-500/10 line-through': props.order.status === 'cancelled'}"
    >
        <img :src="product.pictures[0].url" alt="" class="aspect-square rounded-lg object-center object-cover w-28 h-28" :class="{'': props.order.status !== 'cancelled'}">
        <div class="p-1">
            <div class="text-[11px] leading-tight line-clamp-2" v-text="props.order.order_items[0].item.title" />
            <div class="text-[9px] mt-1 flex justify-start flex-wrap gap-1">
                <div class="px-1 py-0.5 rounded-lg bg-neutral-400/20 backdrop-blur leading-none" data-tooltip="Valor Total" v-text="`${toBRL(props.order.total_amount)}`"/>
                <!--                    <div class="px-1 py-0.5 rounded-lg bg-neutral-400/50 backdrop-blur leading-none" data-tooltip="Valor Receber" v-text="`${toBRL(order.total_amount)}`"/>-->
                <div class="px-1 py-0.5 rounded-lg bg-neutral-400/20 backdrop-blur leading-none" data-tooltip="Quantidade" v-text="props.order.order_items[0].quantity"/>
                <div v-if="props.order.status === 'cancelled'" class="order-first relative self-center">
                    <div class="absolute size-full animate-ping bg-red-800 rounded-full"/>
                    <div data-tooltip="Cancelado" class="size-3 rounded-full bg-red-500"/>
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

const { data: product } = await useAsyncData(
    `picture-${props.order.id}`,
    () => customFetch(`items/${props.order.order_items[0].item.id}`),
    { initialCache: false }
)
</script>
