<template>
    <div
        class="md:table-row max-sm:pb-5 max-sm:pt-2 max-sm:first:!pt-0 max-sm:grid grid-cols-2 md:*:even:bg-neutral-900 *:flex *:items-center *:justify-center max-sm:*:flex-col max-sm:*:justify-between *:p-3 *:align-middle md:*:table-cell dark:first:*:text-neutral-100 dark:*:text-neutral-300 first:*:text-base *:text-sm first:*:text-left *:text-center"
    >
        <div class="max-sm:mt-2 max-sm:col-span-full md:rounded-l-2xl max-sm:rounded-t-2xl">
            <div class="w-full flex items-center justify-start gap-2 mb-3">
                <div v-if="props.question.status === 'ANSWERED'" class="relative self-center flex justify-center items-center gap-1 rounded-full border text-green-500 border-green-500 p-1">
                    <div class="relative">
                        <div class="z-0 absolute size-full animate-ping bg-green-800 rounded-full"/>
                        <div data-tooltip="Cancelado" class="size-2 rounded-full bg-green-500"/>
                    </div>
                    <div class="z-10 relative text-[10px] leading-none font-medium !no-underline">Respondido</div>
                </div>
                <div v-else class="relative self-center flex justify-center items-center gap-1 rounded-full border text-yellow-500 border-yellow-500 p-1">
                    <div class="relative">
                        <div class="z-0 absolute size-full animate-ping bg-yellow-800 rounded-full"/>
                        <div data-tooltip="Cancelado" class="size-2 rounded-full bg-yellow-500"/>
                    </div>
                    <div class="z-10 relative text-[10px] leading-none font-medium !no-underline">Aguardando</div>
                </div>
                <div class="text-xs whitespace-nowrap leading-tight">
                    <b>há {{ dayjs().from(dayjs(props.question.date_created), true) }}</b> -
                    <small><i>{{ dayjs(props.question.date_created).format('DD/MM/YYYY HH:mm:ss') }}</i></small>
                </div>
            </div>
            <div class="self-stretch flex items-start gap-2 max-md:pr-9">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 text-neutral-400 flex-shrink-0 -translate-y-1">
                    <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
                </svg>
                <p class="bg-white/10 rounded-r-lg w-auto flex-1 rounded-b-lg relative p-2 leading-none after:absolute after:-left-1 after:border-white/10 after:top-0 after:border-2 after:border-b-transparent after:border-l-transparent">
                    {{ props.question.text }}
                </p>
            </div>
            <div class="self-stretch flex items-end justify-end gap-2 pl-6">
                <p v-if="props.question.answer.text" class="bg-green-950 w-auto flex-1 rounded-l-lg text-xs text-gray-400 italic mt-2 rounded-t-lg relative p-2 leading-none after:absolute after:-right-1 after:border-green-950 after:bottom-0 after:border-2 after:border-t-transparent after:border-r-transparent">
                    R: {{ props.question.answer.text }}
                </p>
                <img alt class="size-7 translate-y-1 flex-shrink-0 bg-white rounded-3xl aspect-square object-cover object-center transition-all" :src="logoDefault">
            </div>
        </div>
        <div class="max-sm:rounded-l-xl max-sm:ml-1 max-sm:py-2 max-sm:pb-5 max-sm:bg-neutral-700/50 gap-1">
             <span class="md:hidden text-[10px]">
                Produto
            </span>
            <a :href="`${details?.product?.permalink}`" target="_blank" class="flex justify-center">
                <div class="flex items-center gap-3 group hover:bg-neutral-700 -m-2 p-2 rounded-xl">
                    <img :src="details?.product?.pictures[0].url" alt="" class="aspect-square rounded-lg object-center object-cover size-10">
                </div>
            </a>
        </div>
        <div class="max-sm:rounded-r-xl max-sm:mr-1 rounded-r-2xl max-sm:pb-5 max-sm:py-2 max-sm:bg-neutral-700/50 !text-[10px]">
            <span class="md:hidden text-[10px]">
                Usuário
            </span>
            {{ user.nickname }}
        </div>
    </div>
</template>
<script setup>
import {useDayjs} from "#dayjs";
import {useGetOrders} from "~/stores/orders/useGetOrders.js";
import {useSidebar} from "~/stores/useSidebar.js";
import logoDefault from "assets/img/IMG_20240228_140009_538-removebg-preview.png";
const dayjs = useDayjs()

const props = defineProps({
    question: {type: Object},
})

const details = await useGetOrders().getDetail(null, props.question.item_id, null)

const { customFetch } = useHelpers()
const user = await customFetch(`users/${props.question.from.id}`)
</script>
