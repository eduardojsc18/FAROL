<template>
    <button @click="useSidebar().minifyToggle()" :data-tooltip="!useSidebar().minify ? 'Ocultar' : 'Mostrar'" data-tooltip-position="right" type="button" class="text-neutral-800 hover:bg-orange-50 p-3 rounded-full max-md:after:!hidden max-md:before:!hidden">
        <svg class="size-6 transition-all" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" >
            <line x1="4" :x2="20" y1="12" y2="12"/>
            <line x1="4" :x2="useSidebar().minify ? 20 : 15" y1="6" y2="6"/>
            <line x1="4" :x2="useSidebar().minify ? 20 : 10" y1="18" y2="18"/>
        </svg>
    </button>
</template>
<script setup>
import {useSidebar} from "~/stores/useSidebar.js";
</script>
