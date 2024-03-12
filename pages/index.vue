<template>
    <div class="gap-2 container mx-auto max-w-2xl space-y-3">

        <form @submit.prevent="execute" class="w-full bg-slate-50 focus-within:bg-white rounded-lg overflow-hidden flex p-2">
            <input type="search" v-model="search" class="flex-1 bg-transparent border-0 ring-0 outline-0 p-2 text-lg" placeholder="Cole aqui meu amorzinho">
            <button type="submit" class="bg-blue-500 text-white rounded-lg px-3 py-2 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                    <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
                </svg>
                Buscar
            </button>
        </form>

        <div v-if="status === 'pending'" class="grid place-items-center pt-12">
            <Loading />
        </div>

        <div v-else-if="status === 'success'" class="bg-neutral-700 shadow-md p-3 rounded-md lg:flex gap-3">
            <div class="flex-shrink-0">
                <img :src="product.pictures[0].url" alt="" class="w-full lg:w-[200px] h-full lg:h-[200px] object-contain bg-white rounded-md">
                <div class="grid grid-cols-4 gap-2 mt-2">
                    <img v-for="img in product.pictures" :src="img.url" alt="" class="w-full lg:w-10 h-full lg:h-10 object-contain bg-white rounded-md">
                </div>
            </div>
            <div class="text-white">
                <h1 class="font-semibold text-3xl drop-shadow">{{ product.title }}</h1>
                <div class="grid grid-cols-3 mt-10">
                    <div>Preço</div>
                    <div class="col-span-2"> R${{ toBRL(product.price) }} </div>
                    <div>Preço Base</div>
                    <div class="col-span-2"> R${{ toBRL(product.base_price) }} </div>
                    <div>Preço Original</div>
                    <div class="col-span-2"> R${{ toBRL(product.original_price) }} </div>
                </div>
                <div class="grid grid-cols-3 mt-10">
                    <div>Criado em: </div>
                    <div class="col-span-2"> {{ moment(product.date_created).format('DD/MM/YYYY hh:mm:ss') }} </div>
                    <div>Ultima atualização: </div>
                    <div class="col-span-2"> {{ moment(product.last_updated).format('DD/MM/YYYY hh:mm:ss') }} </div>
                </div>
            </div>
        </div>

        <div v-else-if="status === 'error'" class="grid text-neutral-50 text-lg place-items-center p-12">
            <div class="relative w-[150px] h-[150px] grid place-items-center">
                <Error />
            </div>
            Vixiiii foi não, contatar o suporte
        </div>

        <div v-else class="border-2 border-dashed border-neutral-300 p-10 rounded-lg grid place-items-center text-center text-lg text-neutral-50">
            <div class="relative w-[150px] h-[150px] grid place-items-center">
                <Waiting />
            </div>
            Amor, primeiro precisa colar o link :)
        </div>

<!--        <pre class="text-white">-->
<!--            {{ product }}-->
<!--        </pre>-->

    </div>
</template>
<script setup>
import moment from "moment";
import helpers from "~/composables/helpers.js";

const { customFetch, toBRL } = helpers()
const search = ref('')

const {data: product, pending, execute, status} = await useAsyncData(
    `PRODUCT-MLB`,
    () => customFetch(`/items/MLB${search.value.match(/MLB-([A-Za-z0-9]+)/)[1]}`),
    { immediate: false }
)

// watch(execute, () => {
//     if  (search.value.length) {
//         console.log( search.value.match(/MLB-([A-Za-z0-9]+)/)[1] )
//     }
// })

const { data: pageVisits } = await useFetch(() => `/api/page-viewer`)

</script>
