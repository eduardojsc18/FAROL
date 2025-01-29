<template>
    <NuxtLink to="/auth/sign-in">
        <Button class="rounded-full bg-orange-600 hover:bg-orange-700" v-bind="$attrs">
            {{ text }}
            <LucideArrowRightCircle class="size-5" :class="classIcon"/>
        </Button>
    </NuxtLink>
</template>
<script setup>
import {Button} from "~/components/ui/button";

defineOptions({
    inheritAttrs: false
})
defineProps({
    text: { type: String, default: 'Cadastrar' },
    classIcon: { type: String, default: 'size-5' },
})
</script>
<style scoped>

</style>
