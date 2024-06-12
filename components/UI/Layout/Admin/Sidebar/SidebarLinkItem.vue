<template>
    <div v-bind="useSidebar().minify ? {'data-tooltip': `${tooltip ?? label}`} : {}" data-tooltip-position="right">
        <NuxtLink :to="props.to" class="flex items-center gap-2 group text-color-default focus-default hover-default p-1.5 pl-2 rounded-md text-sm *:has-[svg]:flex-shrink-0 overflow-hidden" active-class="item-active">
            <slot />
            <span class="whitespace-nowrap flex-1" v-text="props.label"/>
            <!--        <button class="max-md:opacity-20 lg:opacity-0 group-hover:!opacity-100 group-hover/aside:opacity-20">-->
            <!--            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="rotate-90 size-4">-->
            <!--                <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>-->
            <!--            </svg>-->
            <!--        </button>-->
        </NuxtLink>
    </div>
</template>
<script setup>
//Props
import {useSidebar} from "~/stores/useSidebar.js";

const props = defineProps({
    to: {type: [String, Object]},
    label: {type: String},
    tooltip: {type: String},
})
//Emits

//Variables

//Watch

//Computed

//Methods

</script>
<style scoped>

</style>
