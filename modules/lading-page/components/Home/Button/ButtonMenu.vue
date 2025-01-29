<template>
    <li class="relative">
        <a
            class="text-sm/6 flex items-center gap-1 py-2 px-4 font-medium transition-colors relative after:absolute after:-bottom-px after:inset-x-2 after:h-px after:rounded-full after:opacity-0 after:bg-orange-600 dark:after:bg-orange-600 after:transition-opacity text-orange-600 "
            :href="href"
            :class="{'after:!opacity-100': route.hash.included(href)}"
        >
            {{ text }}
        </a>
    </li>
</template>
<script setup>
defineProps({
    href: {type: String, default: ''},
    text: {type: String, default: ''},
})

const route = useRoute()
</script>
<style scoped>

</style>
