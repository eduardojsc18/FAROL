<template>
    <aside class="self-stretch group/aside max-md:fixed z-[100] top-0 left-0 h-dvh lg:min-h-full max-md:bg-[#fffbf6] dark:max-md:bg-[#1b1b1c] transition-transform transform-gpu duration-500 will-change-auto" :class="{'max-md:-translate-x-full': useSidebar().minify}">
        <nav class="w-[280px] flex flex-col h-dvh max-md:overflow-x-hidden max-md:pb-80 max-md:overflow-y-auto lg:min-h-full transition-[width] z-10" :class="{'lg:!w-[55px]': useSidebar().minify}">
            <div class="lg:hidden p-2">
                <SidebarButtonShow />
            </div>
            <header class="h-24 flex flex-col p-2 justify-center">
                <slot name="header" />
            </header>
            <main class="py-4 px-2 space-y-px">
                <slot />
            </main>
            <footer v-if="!useSidebar().minify" class="py-4 space-y-5">
                <slot name="footer" />
            </footer>
        </nav>
    </aside>
    <div @click.exact="useSidebar().minifyToggle()" v-if="!useSidebar().minify" class="lg:hidden bg-neutral-200/30 dark:bg-neutral-900/30 backdrop-blur fixed top-0 left-0 size-full"/>
</template>
<script setup>
import { useSidebar } from "~/stores/useSidebar.js";
import SidebarButtonShow from "~/components/UI/Layout/Admin/Sidebar/Button/SidebarButtonShow.vue";
</script>
