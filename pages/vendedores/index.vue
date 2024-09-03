<template>
    <div class="space-y-10">
        <HeaderPage
            title="Vendedores"
            description="Vendedores para monitorar"
        >
            <template #icon>
                <IconSeller />
            </template>
        </HeaderPage>

        <section class="!mt-10">
            <div class="inline-block">
                <p class="font-bold text-orange-600 flex items-center justify-center gap-1 leading-tight">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                    </svg>
                    <span class="drop-shadow tracking-wide">Vendedores para monitorar</span>
                </p>
            </div>
            <div class="flex flex-wrap gap-3 mt-2 *:px-4 *:flex *:items-center *:justify-center *:gap-2 *:py-2 *:rounded-full *:bg-orange-600 *:shadow-md text-sm font-medium tracking-wide">

                <a v-for="seller in sellers" :href="seller.perma_link" target="_blank">
                    {{seller.name}}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h4.59l-2.1 1.95a.75.75 0 0 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 1 0-1.02 1.1l2.1 1.95H6.75Z" clip-rule="evenodd" />
                    </svg>
                </a>

            </div>
        </section>

    </div>
</template>
<script setup>
//Props
import HeaderPage from "~/components/UI/Layout/Admin/Header/HeaderPage.vue";
import IconSeller from "~/components/Admin/shared/icons/IconSeller.vue";

useHead({
    title: 'Vendedores'
})

const sellers = ref([
    { perma_link: 'https://lista.mercadolivre.com.br/_CustId_830116693', name: 'EERR_IMPORTS' },
    { perma_link: 'https://lista.mercadolivre.com.br/_CustId_667423573', name: 'ZEBRA ECOMMERCE' },
    { perma_link: 'https://lista.mercadolivre.com.br/_CustId_678787874', name: 'ORUS TECNOLOGY' },
])

</script>
<style scoped>

</style>
