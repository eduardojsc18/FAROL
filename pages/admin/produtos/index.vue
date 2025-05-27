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

    </div>
</template>
<script setup>
import HeaderPage from "~/components/UI/Layouts/Admin/Header/HeaderPage.vue";
import IconProduct from "~/components/UI/Icons/IconProduct.vue";

</script>
<style scoped>

</style>
