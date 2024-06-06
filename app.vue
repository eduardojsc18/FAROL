<template>
    <NuxtLoadingIndicator />
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
.page-enter-active,
.page-leave-active {
    transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
