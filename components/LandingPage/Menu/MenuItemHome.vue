<template>
    <li>
        <NuxtLink to="#inicio">
            <button class="rounded-full -ml-2 aspect-square size-8 flex items-center justify-center  border dark:text-gray-400 dark:hover:text-gray-300 hover:text-orange-700" :class="!isVisible ? '!text-gray-500 !border-transparent' : '!border-orange-600 !text-orange-600'">
                <Icon icon="radix-icons:home" class="size-5" />
                <slot />
                <span class="sr-only">Mudar tema</span>
            </button>
        </NuxtLink>
    </li>
</template>
<script setup>
import {Icon} from "@iconify/vue";

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
    observer.value = new IntersectionObserver(handleIntersection)
    const targetElement = document.querySelector(props.href)
    if (targetElement) {
        observer.value.observe(targetElement)
    }
})

onBeforeUnmount(() => {
    const targetElement = document.querySelector(props.href)
    if (targetElement) {
        observer.value.unobserve(targetElement)
    }
})
</script>
<style scoped>

</style>
