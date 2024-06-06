<template>
    <aside class="min-w-fit self-stretch group/aside max-lg:fixed lg:sticky lg:top-0 z-[99999] top-0 left-0 h-dvh max-lg:bg-[#fffbf6] lg:overflow-y-auto lg:hover:overflow-x-hidden scrollbar !scrollbar-w-0.5 scrollbar-thumb-neutral-100 scrollbar-track-transparent dark:!scrollbar-thumb-neutral-800 dark:max-lg:bg-[#1b1b1c] sm:transition-transform sm:transform-gpu sm:duration-1000 sm:will-change-auto" :class="{'max-lg:-translate-x-full': useSidebar().minify}">
        <nav class="w-full max-w-[280px] flex flex-col max-md:h-dvh overflow-x-hidden max-lg:pb-10 max-lg:overflow-y-auto lg:min-h-full transition-[max-width] duration-500 z-10" :class="{'lg:!max-w-[55px]': useSidebar().minify}">
            <div class="lg:hidden flex justify-between p-2">
                <SidebarButtonShow />
                <ButtonDarkModeToggle />
            </div>
            <header class="h-24 flex flex-col p-2 justify-center">
                <slot name="header" />
            </header>
            <main class="py-4 px-2 space-y-px">
                <slot />
            </main>
            <footer  class="py-4 space-y-5">
                <slot name="footer" />
            </footer>
        </nav>
    </aside>
    <Transition
        enter-active-class="md:transition ease-out md:duration-500" enter-from-class="md:opacity-0" enter-to-class="md:opacity-100"
        leave-active-class="md:transition ease-out md:duration-500" leave-from-class="md:opacity-100" leave-to-class="md:opacity-0"
    >
        <div @click.exact="useSidebar().minifyToggle()" v-if="!useSidebar().minify" class="lg:hidden bg-neutral-200/90 dark:bg-neutral-900/90 fixed top-0 left-0 z-[9999] size-full"/>
    </Transition>
</template>
<script setup>
import { useSidebar } from "~/stores/useSidebar.js";
import SidebarButtonShow from "~/components/UI/Layout/Admin/Sidebar/Button/SidebarButtonShow.vue";
import ButtonDarkModeToggle from "~/components/UI/Button/ButtonDarkModeToggle.vue";
</script>
