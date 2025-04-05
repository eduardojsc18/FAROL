<template>
    <div
        @click="closeSidebar"
        class="flex items-center"
        :class="{'!overflow-hidden': animation}"
        v-bind="useSidebar().minify ? {'data-tooltip': `${tooltip ?? label}`, 'data-tooltip-position': 'right'} : {}"

    >
        <span class="w-1 shrink-0 h-6 rounded-full " :class="{'bg-orange-600': route.path.startsWith(props.to)}"/>
        <NuxtLink
            :to="props.to"
            class="grow flex items-center -ml-1 gap-5 group py-2 transition-all text-neutral-300 hover:text-orange-400 rounded-md text-sm *:has-[svg]:flex-shrink-0 overflow-hidden"
            :class="!useSidebar().minify ? 'px-8' : 'px-[18px]'"
            active-class="text-orange-500 hover:text-orange-500"
        >
            <slot />
            <span class="whitespace-nowrap leading-none text-lg tracking-wide" v-text="props.label" />
        </NuxtLink>
    </div>
</template>
<script setup>
import {useSidebar} from "~/stores/useSidebar.js";

const route = useRoute();

const props = defineProps({
    to: {type: [String, Object]},
    label: {type: String},
    tooltip: {type: String},
})

const minify = computed(() => useSidebar().minify)
const animation = ref(false)


watch(minify, (newValue) => {
    animation.value = true
    setTimeout(() => animation.value = false, 500)
})

function closeSidebar() {
    if (window.innerWidth < 1024) {
        useSidebar().minifyToggle()
    }
}

</script>
<style scoped>

</style>
