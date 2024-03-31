<template>
    <a
        :href="me.permalink"
        target="_blank"
        class="item-active rounded-3xl backdrop-blur flex items-center gap-3 p-3 overflow-hidden transition-all max-h-80"
        :class="{'lg:!p-1 lg:!max-h-10': useSidebar().minify}"
    >
        <img class="size-10 flex-shrink-0 bg-white rounded-full aspect-square transition-all" :class="{'lg:!size-8': useSidebar().minify}" :src="logoDefault" :alt="me.nickname">
        <div>
            <p class="font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-1">{{ me.nickname }}</p>
            <p class="text-xs leading-none text-neutral-600 dark:text-neutral-400">{{ me.email }}</p>
        </div>
    </a>
</template>
<script setup>
import helpers from "~/composables/helpers.js";
import logoDefault from "assets/img/IMG_20240228_140009_538-removebg-preview.png";
import { useSidebar } from "~/stores/useSidebar.js";

const { customFetch } = helpers()

const {data: me} = await useAsyncData('ME',
    () => customFetch(`/users/me`),
    {immediate: true}
)
</script>
<style scoped>

</style>
