<template>
    <NuxtLink to="/auth/login">
        <Button variant="ghost" class="rounded-full" v-bind="$attrs">
            {{ text }}
        </Button>
    </NuxtLink>
</template>
<script setup>
import {Button} from "~/components/ui/button";

defineOptions({
    inheritAttrs: false
})
defineProps({
    text: { type: String, default: 'Entrar' }
})
</script>
<style scoped>

</style>
