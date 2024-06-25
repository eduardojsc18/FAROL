<template>
    <div class="flex items-center justify-center w-full min-h-screen bg-neutral-800 ">
        <div class="grow max-w-lg p-3">
            <div class="p-5 bg-neutral-700/20 shadow-md rounded-3xl">
                <section class="mb-5 flex gap-2">
                    <div class="self-center flex-shrink-0 text-neutral-200">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-14">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="grow relative z-50 ">
                        <h1 class="leading-1 font-bold text-2xl text-neutral-200 drop-shadow">Entrar</h1>
                        <h2 class="leading-1 text-sm text-neutral-400 drop-shadow">Preencha suas credencias para seguir</h2>
                    </div>
                </section>
                <NuxtPage />
            </div>
        </div>
    </div>
</template>
<script setup>
useHead({
    title: 'Entrar',
    description: 'Preencha suas credencias para seguir',
})
</script>
