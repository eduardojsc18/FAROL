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
    </div>
</template>
<script setup>
//Props
import HeaderPage from "~/components/UI/Layout/Admin/Header/HeaderPage.vue";
import IconSeller from "~/components/Admin/shared/icons/IconSeller.vue";

useHead({
    title: 'Vendedores'
})
//Emits

//Variables

//Watch

//Computed

//Methods

</script>
<style scoped>

</style>
