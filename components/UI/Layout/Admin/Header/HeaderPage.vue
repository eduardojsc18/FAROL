<template>
    <header class="relative flex items-center gap-2 after:hidden md:after:block md:after:absolute after:-top-8 after:-left-8 after:size-28 after:bg-gradient-to-br after:from-neutral-900/50 after:z-0 after:rounded-3xl after:shadow-[-35px_-34px_30px_-45px] after:shadow-orange-500">
        <div class="relative z-20 *:size-8 *:aspect-square *:stroke-[1.5]">
            <slot name="icon"/>
        </div>
        <div class="relative z-20">
            <h1 class="font-semibold tracking-wide">{{ props.title }}</h1>
            <p v-if="props.description" class="text-xs text-neutral-400">{{ props.description }}</p>
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
