<template>
    <section>
        <header>

        </header>
        <main>

            <div v-if="status === 'pending'" class="grid place-items-center pt-12">
                <LoaderLoading />
            </div>

            <template v-else-if="status === 'success'">
                <template v-if="!specificResult">
                    <div class="grid grid-cols-3 gap-2">
                        <div v-for="product in products" class="flex flex-col">
                            <div class="flex-shrink-0">
                                <img :src="!!product?.pictures?.length ? product?.pictures[0]?.url : product.thumbnail" alt="" class="size-full aspect-square object-contain bg-white rounded-md">
                                <!--                        <div v-if="!!product?.pictures?.length" class="grid grid-cols-4 gap-2 mt-2">-->
                                <!--                            <img v-for="img in product.pictures" :src="img.url" alt="" class="w-full lg:w-10 h-full lg:h-10 object-contain bg-white rounded-md">-->
                                <!--                        </div>-->
                            </div>
                            <div class="flex-1 text-white flex flex-col h-full">
                                <h1 class="font-semibold text-sm drop-shadow flex-grow line-clamp-2" :data-tooltip="product.title">{{ product.title }}</h1>
                                <div class="flex flex-wrap gap-1 text-[10px] mt-4 text-neutral-300 *:px-2 *:py-1 *:border *:rounded-full *:bg-neutral-600 *:whitespace-nowrap">
                                    <div v-if="product.price" data-tooltip="Preço">R$ {{ product.price }}</div>
                                    <div v-if="product.base_price" data-tooltip="Preço Base">R$ {{ product.base_price }}</div>
                                    <div v-if="product.original_price" data-tooltip="Preço Original">R$ {{ product.original_price }}</div>
                                    <div v-if="product.date_created" data-tooltip="Criado em">{{ product.date_created }}</div>
                                    <div v-if="product.last_updated" data-tooltip="Ultima atualização">{{ product.last_updated }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div v-for="product in products" class="flex items-start gap-3">
                        <div class="flex-shrink-0 max-w-[30%]">
                            <img :src="!!product?.pictures?.length ? product?.pictures[0]?.url : product.thumbnail" alt="" class="size-full aspect-square object-contain bg-white rounded-md">
<!--                            <div v-if="!!product?.pictures?.length" class="grid items-start grid-cols-2 gap-2 mt-2">-->
<!--                                <img v-for="img in product.pictures" :src="img.url" alt="" class="size-full aspect-square object-contain bg-white rounded-md">-->
<!--                            </div>-->
                        </div>
                        <div class="text-white">
                            <h1 class="font-semibold text-xl drop-shadow">{{ product.title }}</h1>
                            <div class="grid grid-cols-3 text-xs mt-4 gap-y-1 text-neutral-300">
                                <div>Preço</div>
                                <div class="col-span-2"> R${{ product.price }} </div>
                                <div>Preço Base</div>
                                <div class="col-span-2"> R${{ product.base_price }} </div>
                                <div>Preço Original</div>
                                <div class="col-span-2"> R${{ product.original_price }} </div>
                                <div>Criado em</div>
                                <div class="col-span-2"> {{ product.date_created }} </div>
                                <div>Ultima atualização</div>
                                <div class="col-span-2"> {{ product.last_updated }} </div>
                            </div>
                        </div>
                    </div>
                </template>
                <div v-if="!products.length">
                    Não encontrei nada
                </div>
            </template>

            <div v-else-if="status === 'error'" class="grid text-neutral-50 text-lg place-items-center p-12">
                <div class="relative w-[150px] h-[150px] grid place-items-center">
                    <LoaderError />
                </div>
                Vixiiii foi não, contatar o suporte
            </div>

            <div v-else class="border-2 border-dashed border-neutral-300 p-10 rounded-lg grid place-items-center text-center text-lg text-neutral-50">
                <div class="relative w-[150px] h-[150px] grid place-items-center">
                    <LoaderWaiting />
                </div>
                Amor, primeiro precisa colar o link :)
            </div>

        </main>
    </section>
</template>
<script setup>
import LoaderError from "~/components/ui-custom/Loader/LoaderError.vue";
import LoaderWaiting from "~/components/ui-custom/Loader/LoaderWaiting.vue";
import LoaderLoading from "~/components/ui-custom/Loader/LoaderLoading.vue";

const props = defineProps({
    status: {type: String, default: ''},
    products: {type: [Array,Object]},
    pending: {type: Boolean, default: false},
    specificResult: {type: Boolean, default: false},
})

</script>
<style scoped>

</style>
