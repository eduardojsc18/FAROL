<template>
    <li>
        <NuxtLink to="#inicio">
            <button :class="{'text-orange-600 ring-1 ring-orange-600': isVisible}" class="rounded-full -ml-[9px] aspect-square size-8 flex items-center justify-center text-gray-500 hover:text-orange-700">
                <Icon icon="radix-icons:home" class="size-5" />
                <slot />
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
    observer.value = new IntersectionObserver(handleIntersection, {
        threshold: 0,
    })
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
