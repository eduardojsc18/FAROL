<template>
    <div class="space-y-10">
        <HeaderPage
            title="Produtos"
            :description="`Produtos anunciados`"
        >
            <template #icon>
                <IconProduct />
            </template>
        </HeaderPage>
        <ProductTable>
            <ProductTableItem v-for="(product, index) in products.results" :key="index" :product="product" />
        </ProductTable>
    </div>
</template>
<script setup>
import HeaderPage from "~/components/UI/Layout/Admin/Header/HeaderPage.vue";
import {useHelpers} from "~/composables/useHelpers.js";
import {useMe} from "~/stores/useMe.js";
import ProductTable from "~/components/Admin/product/table/ProductTable.vue";
import ProductTableItem from "~/components/Admin/product/table/ProductTableItem.vue";
import IconProduct from "~/components/Admin/shared/icons/IconProduct.vue";

const { customFetch } = useHelpers()
const { me } = useMe()
const {data: products} = await useAsyncData(
    'products',
    () => customFetch(`/users/${me.id}/items/search`)
)
</script>
<style scoped>

</style>
