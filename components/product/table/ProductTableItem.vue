<template>
    <div
        class="md:table-row max-sm:pb-5 max-sm:pt-2 max-sm:first:!pt-0 max-sm:grid grid-cols-5 md:*:even:bg-neutral-900 *:flex *:items-center *:justify-center max-sm:*:flex-col max-sm:*:justify-between *:p-3 *:align-middle md:*:table-cell dark:first:*:text-neutral-100 dark:*:text-neutral-300 first:*:text-base *:text-sm first:*:text-left *:text-center"
        :class="{'*:!bg-red-500/10': !item.detail?.available_quantity, 'line-through': item.detail?.status !== 'active'}"
    >
        <div class="max-sm:mt-3 max-sm:col-span-full md:rounded-l-2xl max-sm:rounded-t-2xl">
            <div class="w-full flex items-center justify-start gap-2 mb-3">
                <div v-if="item.detail?.status !== 'active'" class="relative self-center flex justify-center items-center gap-1 rounded-full border text-white bg-red-500 border-red-500 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-3 -ml-0.5 -my-3">
                        <path fill-rule="evenodd" d="M3.05 3.05a7 7 0 1 1 9.9 9.9 7 7 0 0 1-9.9-9.9Zm1.627.566 7.707 7.707a5.501 5.501 0 0 0-7.707-7.707Zm6.646 8.768L3.616 4.677a5.501 5.501 0 0 0 7.707 7.707Z" clip-rule="evenodd" />
                    </svg>
                    <div class="z-10 relative text-[10px] leading-none font-medium">inativo</div>
                </div>
                <div v-if="item.detail?.available_quantity === 1" class="relative self-center flex justify-center items-center gap-1 rounded-full border text-yellow-500 bg-white border-yellow-500 p-1">
                    <div class="relative">
                        <div class="z-0 absolute size-full animate-ping bg-yellow-800 rounded-full"/>
                        <div class="size-2 rounded-full bg-yellow-500"/>
                    </div>
                    <div class="z-10 relative text-[10px] leading-none font-medium !no-underline">ficando sem estoque</div>
                </div>
                <div v-if="!item.detail?.available_quantity" class="relative self-center flex justify-center items-center gap-1 rounded-full border text-red-500 bg-white border-red-500 p-1">
                    <div class="relative">
                        <div class="z-0 absolute size-full animate-ping bg-red-800 rounded-full"/>
                        <div data-tooltip="Cancelado" class="size-2 rounded-full bg-red-500"/>
                    </div>
                    <div class="z-10 relative text-[10px] leading-none font-medium !no-underline">sem estoque</div>
                </div>
                <div class="inline-block text-xs text-center whitespace-nowrap leading-tight">
                    <b>Criado há {{ getTime(item.detail?.date_created) }}</b> -
                    <small><i>{{ dayjs(item.detail?.date_created).format('DD/MM/YYYY HH:mm:ss') }}</i></small>
                </div>
            </div>
            <a :href="item.detail?.permalink" target="_blank">
                <div class="flex items-center gap-3 group hover:bg-neutral-700 -m-2 p-2 rounded-xl">
                    <img :src="item.detail?.thumbnail" alt="" class="aspect-square rounded-lg object-center object-cover size-16">
                    <div>
                        <p>
                            {{ item.detail?.title }}
                            <span class="invisible group-hover:visible inline-block translate-y-0.5 text-neutral-400 leading-none" data-tooltip="Abrir no ML">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                                    <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
                                    <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
                                </svg>
                            </span>
                        </p>
                    </div>
                </div>
            </a>
        </div>
        <div :class="{'max-sm:rounded-tl-xl': item.detail?.available_quantity, '!rounded-none !-ml-0': !item.detail?.available_quantity}" class="max-sm:py-2 max-sm:bg-neutral-700/50 gap-1">
            <span class="md:hidden text-[10px]">
                Total
            </span>
            <div data-tooltip="Valor Total" class="font-bold whitespace-nowrap" v-text="`R$ ${toBRL(item.detail?.price)}`"/>
        </div>
        <div class="max-sm:bg-neutral-700/50  max-sm:py-2">
            <span class="md:hidden text-[10px]">
                Vendas
            </span>
            <div class="font-bold whitespace-nowrap">
                {{ item.detail?.sold_quantity }}
            </div>
        </div>
        <div class="max-sm:bg-neutral-700/50 max-sm:py-2">
            <span class="md:hidden text-[10px]">
                Visitas
            </span>
            <div class="font-bold whitespace-nowrap">
                {{ item.visit[props.product] }}
            </div>
        </div>
        <div class="max-sm:bg-neutral-700/50  max-sm:order-last max-sm:col-span-full max-sm:rounded-b-xl max-sm:py-2">
            <span class="md:hidden text-[10px]">
                Quantidade
            </span>
            <table class="text-[11px] leading-tight mx-auto divide-y">
                <tr v-for="variation in item.detail?.variations" :class="{'text-red-500': !variation.available_quantity}">
                    <td class="flex items-center justify-end text-right gap-1">
                        <div v-if="!variation.available_quantity" data-tooltip="Sem estoque" class="relative translate-y-px">
                            <div class="z-0 absolute size-full animate-ping bg-red-800 rounded-full"/>
                            <div data-tooltip="Cancelado" class="size-2 rounded-full bg-red-500"/>
                        </div>
                        {{ variation.attribute_combinations[0].value_name }}:
                    </td>
                    <td class="px-2">
                        <strong>{{ variation.available_quantity }}</strong>
                    </td>
                </tr>
                <tr>
                    <td class="text-right">
                        <small>Total:</small>
                    </td>
                    <td class="px-2">
                        <strong class="font-bold" v-text="item.detail?.available_quantity"/>
                    </td>
                </tr>
            </table>
        </div>
        <div  class="max-sm:py-2 max-sm:bg-neutral-700/50">
            <div class="flex justify-center h-full">
                <div class="flex flex-col gap-1 justify-between">
                    <span class="md:hidden text-[10px]">
                        Tipo
                    </span>
                    <div class="flex justify-center">
                        <div v-if="item.detail?.catalog_listing" data-tooltip="Catálogo" class="bg-blue-800 text-white p-1 rounded-md text-xs flex items-center justify-center gap-1">
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
        <div :class="{'!rounded-t-none rounded-br-xl !-mr-0': !item.detail?.available_quantity}" class="max-sm:rounded-tr-xl max-sm:rounded-br-none rounded-r-2xl max-sm:py-2 max-sm:bg-neutral-700/50 ">
            <div class="flex justify-center">
                <div class="text-base flex flex-col h-full gap-1 justify-between">
                    <span class="md:hidden text-[10px]">
                        Transporte
                    </span>
                    <div class="flex justify-center min-h-5">
                        <div v-if="item.detail?.shipping.logistic_type === 'fulfillment'" class="flex items-center gap-1 font-bold text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="12" viewBox="0 0 40 12">
                                <g fill="#00A650" fill-rule="evenodd"><path fill-rule="nonzero" d="M13.597 9h-1.892l1.617-7.337h5.379l-.363 1.65h-3.487l-.242 1.144h3.399l-.363 1.65h-3.41L13.597 9zm9.35.132c-2.255 0-3.366-1.078-3.366-2.618 0-.121.033-.374.055-.484l.968-4.367h1.925l-.957 4.323a1.62 1.62 0 0 0-.033.308c.011.605.473 1.188 1.408 1.188 1.012 0 1.529-.638 1.716-1.496l.957-4.323h1.914l-.957 4.356c-.396 1.782-1.364 3.113-3.63 3.113zM32.924 9h-4.84l1.617-7.337h1.892L30.35 7.35h2.937L32.924 9zm6.655 0h-4.84l1.617-7.337h1.892L37.005 7.35h2.937L39.579 9z"></path><path d="M2.455 0L0 6.857h4.09L2.456 12 9 4.286H4.91L7.363 0z"></path></g>
                            </svg>
                        </div>
                        <template v-else>
                            <div class="flex justify-center items-center gap-2">
                                <img class="size-7" src="~/assets/img/correios_icon.svg" alt="Correios"/>
                                <span class="font-bold italic text-green-700 leading-tight" v-text="'FLEX'"/>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import {useHelpers} from "~/composables/useHelpers.js";
import {useDayjs} from '#dayjs'
const { customFetch } = useHelpers()

const {toBRL} = useHelpers()
const dayjs = useDayjs()


const props = defineProps({
    product: {type: String},
})

function getTime(date) {
    return dayjs().from(dayjs(date), true)
}

const {data: item} = await useAsyncData(
    `item-${props.product}`,
    async () => {
        const [detail, visit] = await Promise.all([
            customFetch(`/items/${props.product}`),
            customFetch(`/visits/items?ids=${props.product}`)
        ])
        return {detail, visit}
    }
)
</script>
<style scoped>

</style>
