<template>
    <a
        :href="me.permalink"
        target="_blank"
        class="rounded-3xl backdrop-blur flex items-center gap-2 p-2 overflow-hidden bg-orange-100 dark:bg-orange-700 transition-all duration-500 max-h-80 max-w-[1000px]"
        :class="{'md:!p-0 md:!max-h-8 md:!max-w-8 ml-1 !shadow-md !shadow-orange-700/50': useSidebar().minify}"
    >
        <img class="size-10 flex-shrink-0 bg-white rounded-3xl aspect-square object-cover object-center transition-all" :class="{'md:!size-8': useSidebar().minify}" :src="logoDefault" :alt="me.nickname">
        <div class="space-y-1">
            <p class="font-bold text-orange-600 dark:text-[#f9e2b8] line-clamp-1 leading-none">{{ me.nickname }}</p>
            <p class="text-xs text-orange-600 dark:text-orange-200 leading-none">{{ me.email }}</p>
        </div>
    </a>
</template>
<script setup>
import logoDefault from "assets/img/IMG_20240228_140009_538-removebg-preview.png";
import { useSidebar } from "~/stores/useSidebar.js";
import { useMe } from "~/stores/useMe.js";

const me = useMe().me
</script>
