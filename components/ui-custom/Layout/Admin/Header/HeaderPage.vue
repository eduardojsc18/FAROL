<template>
    <header class="z-0">
        <div class="relative flex items-center gap-2 after:hidden md:after:block md:after:absolute after:-top-2 after:-left-3 after:w-1/2 after:h-14 after:bg-gradient-to-br after:from-neutral-900/20 after:via-neutral-800 after:z-0 after:rounded-2xl">
            <div class="relative z-20 *:size-8 *:aspect-square *:stroke-[1.5]">
                <slot name="icon"/>
            </div>
            <div class="relative z-20">
                <h1 class="font-semibold tracking-wide">{{ props.title }}</h1>
                <p v-if="props.description" class="text-xs text-neutral-400">{{ props.description }}</p>
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
