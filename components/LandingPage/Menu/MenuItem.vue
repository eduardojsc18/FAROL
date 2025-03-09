<template>
    <li class="relative">
        <NuxtLink
            :to="props.href"
            class="text-sm/6 flex items-center gap-1 py-2 px-4 font-medium transition-colors relative after:absolute after:-bottom-px after:inset-x-2 after:h-px after:rounded-full after:opacity-0 after:bg-gray-900 dark:after:bg-white after:transition-opacity text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            :class="{'after:bg-orange-600 dark:after:bg-orange-600 after:transition-opacity text-orange-600 hover:text-orange-700  after:opacity-100': isVisible}"
        >
            {{ props.text }}
        </NuxtLink>
    </li>
</template>
<script setup>
const props = defineProps({
    href: {type: String, default: ''},
    text: {type: String, default: ''},
})

const isVisible = ref(false)
const observer = ref()
const handleIntersection = (entries) => {
    entries.forEach(entry => {
        isVisible.value = entry.isIntersecting;
    })
}

onMounted(() => {
    observer.value = new IntersectionObserver(handleIntersection, {rootMargin: "-100px"})
    const targetElement = document.querySelector(props.href)
    if (targetElement) {
        observer.value.observe(targetElement)
    }
})

onUnmounted(() => {
    if (!observer.value) {
        return
    }
    const targetElement = document.querySelector(props.href)
    if (targetElement) {
        observer.value.unobserve(targetElement)
    }
})
</script>
<style scoped>

</style>
