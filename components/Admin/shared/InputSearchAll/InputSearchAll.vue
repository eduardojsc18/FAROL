<template>
    <div class="max-w-xl w-full mx-auto relative" v-click-away="() => showDropDown = false">
        <form @submit.prevent="execute">
            <label for="search-header" class="z-10 text-color-default flex items-center py-1.5 ring-[1px] ring-neutral-500/60 focus-within:ring-orange-500 focus-within:bg-neutral-500/20 px-2 gap-2 rounded-md bg-neutral-500/10 backdrop-blur">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-5">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
                <input type="search" name="" v-model="search" @focusin="showDropDown = true" @focusout="showDropDown = true" id="search-header" placeholder="Buscar produtos" class="w-full p-0 m-0 text-sm bg-transparent placeholder-neutral-400 outline-none">
            </label>
        </form>
        <Transition
            enter-active-class="transition ease-out duration-500" enter-from-class="-translate-y-1 scale-[1.01] opacity-0" enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition ease-out duration-300" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-2 scale-95 opacity-0"
        >
            <div v-if="showDropDown" class="absolute top-full grid place-items-center left-0 min-h-64 overflow-y-auto max-h-80 w-full rounded-lg ring-[1px] ring-neutral-500/40 bg-neutral-500/20 dark:bg-neutral-800/90 backdrop-blur shadow-md mt-2 p-2">
                <main class="w-full h-full relative">
                    <Products :products="products?.results" :specific-result="products?.specific_result" :pending="pending" :status="status" />
<!--                    {{ pending}} {{ status }}-->
<!--                    <Sellers />-->
<!--                    <LoaderSearch class="-mt-10"/>-->
                </main>
            </div>
        </Transition>
    </div>
</template>
<script setup>
import helpers from "~/composables/helpers.js";
import moment from "moment";
import Products from "~/components/Admin/shared/InputSearchAll/Sections/Products.vue";
import {useLazyAsyncData} from "#app";

const { customFetch, toBRL } = helpers()

const showDropDown = ref(false)
const search = ref('')

const {data: products, pending, execute, status} = await useLazyAsyncData(`INPUT-SEARCH-ALL`,
    () => {
        const makeUrl = search.value.includes('/MLB') ?
            `/items/MLB${search.value.match(/MLB-([A-Za-z0-9]+)/)[1]}` :
                `/sites/MLB/search?q=${search.value}`
        return customFetch(makeUrl)
    },
    {
        immediate: false,
        transform: (products) => {
            if (search.value.includes('/MLB')) {
                return {
                    specific_result: true,
                    results: [{
                        ...products,
                        date_created: moment(products.date_created).format('DD/MM/YYYY hh:mm:ss'),
                        last_updated: moment(products.last_updated).format('DD/MM/YYYY hh:mm:ss'),
                        price: toBRL(products.price),
                        base_price: toBRL(products.base_price),
                        original_price: toBRL(products.original_price),
                    }]
                }
            }
            else {
                return products
            }
        }
    },
)
</script>
