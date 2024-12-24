<template>
    <div class="space-y-10">
        <HeaderPage
            title="Pesquisa de Mercado"
            description="Busque por produtos e classifique-os da melhor forma"
        >
            <template #icon>
                <IconMarketResearch />
            </template>
        </HeaderPage>
        <section class="flex justify-start overflow-x-auto gap-2 pb-5 [&:not(:has(.ghost))]:snap-x [&:not(:has(.ghost))]:snap-mandatory -mx-5 px-5 min-h-screen">
            <div v-for="(item, index) in items" :key="item.id" class="snap-center min-w-[300px] max-w-[300px] p-2 bg-neutral-900 rounded-2xl">
                <div class="p-3">
                    {{ item.title }}
                </div>
                <Draggable
                    v-model="item.products"
                    :animation="200"
                    class="gap-3 min-h-[60vh] flex flex-col"
                    :id="`stage-id-${item.id}`"
                    ghost-class="ghost"
                    group="product"
                    item-key="id"
                    @change="changeLeadStage($event)"
                >
                    <template #item="{element: item}">
                        <div class="bg-neutral-500 rounded-xl p-3">
                            <div class="title">{{item.name}}</div>
                            <!--                    <div class="handle">Sort</div>-->
                        </div>
                    </template>
                </Draggable>
            </div>
        </section>
    </div>
</template>
<script setup>
import HeaderPage from "~/components/ui/Layout/Admin/Header/HeaderPage.vue";
import Draggable from "vuedraggable";
import IconMarketResearch from "~/components/Admin/shared/icons/IconMarketResearch.vue";

const items = ref([
    {id: 1, title: 'Produtos', products: [{id: 1111, name: 'Fone de Ouvido'}, {id: 2222, name: 'Carregador'}, {id: 3333, name: 'Carrinho de BEBE'}]},
    {id: 2, title: 'Bom', products: [{id: 213123, name: 'Touca de cabelo'}]},
    {id: 3, title: 'Lucrativo', products: [{id: 23121321, name: 'Teclado'}]},
    {id: 4, title: 'Comprar este', products: [{id: 2313121, name: 'mouse'}]},
    {id: 5, title: 'Ruim', products: [{id: 312323, name: 'Sensor'}]},
])

function changeLeadStage(e) {
    console.log(e)
}
</script>
