<template>
    <header class="z-0">
        <div class="relative flex items-center gap-2">
            <div v-if="$slots.icon" class="relative z-20">
                <slot name="icon"/>
            </div>
            <div class="relative z-20">
                <h1 class="font-bold text-xl tracking-wide">{{ props.title }}</h1>
                <p v-if="props.description" class="text-sm text-neutral-400">{{ props.description }}</p>
            </div>
        </div>
    </header>
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
