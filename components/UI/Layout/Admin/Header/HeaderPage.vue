<template>
    <section class="">
        <h1 class="font-semibold tracking-wide">{{ props.title }}</h1>
        <p v-if="props.description" class="text-xs text-neutral-400">{{ props.description }}</p>
    </section>
</template>
<script setup>
const props = defineProps({
    title: {type: String, required: true, default: ''},
    description: String,
})
useHead({
    title: props.title,
    description: props.description
})
</script>
<style scoped>

</style>
