<template>
    <li>
        <NuxtLink to="#inicio">
            <Button variant="outline" class="rounded-full -ml-2 aspect-square size-8 !p-0 text-gray-500 dark:text-gray-400 !border-transparent hover:text-gray-700 dark:hover:text-gray-300 !bg-transparent" :class="{'!border-orange-600 !text-orange-600': isVisible}">
                <Icon icon="radix-icons:home" class="size-5" />
                <span class="sr-only">Mudar tema</span>
            </Button>
        </NuxtLink>
    </li>
</template>
<script setup>
import {Icon} from "@iconify/vue";
import {Button} from "~/components/ui/button";

const props = defineProps({
    href: {type: String, default: ''},
    text: {type: String, default: ''},
})

const isVisible = ref(false)

const handleIntersection = (entries) => {
    entries.forEach(entry => {
        isVisible.value = entry.isIntersecting;
    })
}

onMounted(() => {
    const observer = new IntersectionObserver(handleIntersection)
    const targetElement = document.querySelector(props.href)
    if (targetElement) {
        observer.observe(targetElement)
    }
})

onBeforeUnmount(() => {
    const targetElement = document.querySelector(props.href)
    if (targetElement) {
        observer.unobserve(targetElement)
    }
})
</script>
<style scoped>

</style>
