<template>
    <div class="antialiased scroll-smooth">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
<script setup>
const config = useRuntimeConfig()
await useHead( {
    titleTemplate: ( titleChunk ) => {
        return titleChunk ? `${ titleChunk } - ${config.public.appName}` : `${config.public.appName}`
    }
})
</script>
