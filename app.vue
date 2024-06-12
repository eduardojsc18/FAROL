<template>
    <NuxtLoadingIndicator color="repeating-linear-gradient(to right, #c2410c, #b83d0b, #ae3a0b, #a5360a, #9b3309, #913009, #882d09, #7e2a09, #722609, #672208, #5c1f07, #511b05)"/>
    <div class="antialiased scroll-smooth">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
<script setup>
const config = useRuntimeConfig()
useHead( {
    titleTemplate: ( titleChunk ) => {
        return titleChunk ? `${titleChunk} - ${config.public.appName}` : `${config.public.appName}`
    }
})
</script>
<style>
.page-enter-active, .page-leave-active {
    transition: all 0.4s;
}
.page-enter-from, .page-leave-to {
    opacity: 0; transform: translateY(20px);
}
</style>
