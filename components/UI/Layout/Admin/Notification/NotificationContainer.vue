<template>
    <Transition
        enter-active-class="transition ease-out duration-500" enter-from-class="translate-x-full" enter-to-class="translate-x-0"
        leave-active-class="transition ease-out duration-500" leave-from-class="translate-x-0" leave-to-class="translate-x-full"
    >
        <div v-if="useNotification().show" v-click-away="() => useNotification().toggle()" class="fixed right-0 ring-[1px] ring-neutral-600/50 shadow-sm rounded-tl-xl bg-neutral-200/10 backdrop-blur min-h-full flex flex-col group/aside">
            <div class="w-[280px] flex flex-col p-2 divide-y divide-neutral-800/10 transition-[width]">
                <header class="py-4">
                    Header
                    <button @click="useNotification().toggle()">X</button>
                </header>
                <main class="py-4 space-y-px">
                    <slot />
                </main>
                <footer class="py-4">
                    Footer
                </footer>
            </div>
        </div>
    </Transition>
</template>
<script setup>
import {useNotification} from "~/stores/useNotification.js";

</script>
<style scoped>

</style>
