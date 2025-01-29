<template>
    <Button variant="ghost" @click="toggleTheme" class="rounded-full aspect-square size-8 !p-0 dark:text-white">
        <Icon icon="radix-icons:moon" class="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Icon icon="radix-icons:sun" class="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span class="sr-only">Mudar tema</span>
    </Button>
</template>
<script setup>
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'

const colorMode = useColorMode()
const toggleTheme = () => {
    colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light'
}
</script>
