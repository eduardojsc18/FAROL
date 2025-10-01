<template>
    <NuxtLink to="/auth/login">
        <v-btn variant="flat" append-icon="mdi-arrow-right-circle" class="!bg-orange-600 hover:bg-orange-700 text-white" v-bind="$attrs">
            {{ text }}
        </v-btn>
    </NuxtLink>
</template>
<script setup>

defineOptions({
    inheritAttrs: false
})
defineProps({
    text: { type: String, default: 'Cadastrar' },
    classIcon: { type: String, default: 'size-5' },
})
</script>
<style scoped>

</style>
