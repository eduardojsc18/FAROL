<template>
    <div class="space-y-3 min-h-[280px]">
        <div class="pl-4 pr-2 flex justify-between items-center">
            <div class="transition-all origin-top-left" :class="{'lg:[writing-mode:vertical-rl] lg:leading-none': useSidebar().minify}">
                <p class="text-sm font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">Pesquisas de Mercado</p>
                <p class="text-[10px] text-neutral-400 whitespace-nowrap">Ultimas pesquisas feitas</p>
            </div>
        </div>
        <div v-show="!useSidebar().minify" class="max-md:!block">
            <Swiper :navigation="{nextEl: '.button-market-research-next', prevEl: '.button-market-research-prev'}" :modules="[SwiperNavigation]" :slides-per-view="2.2" space-between="5" :effect="'creative'" class="pb-3 !pl-4 relative h-40">
                <SwiperSlide v-for="i in 10" :key="i" class="rounded-lg group relative bg-neutral-600 shadow-md !w-full !max-w-28 !flex flex-col p-2">
                    <div class="!flex-grow grid grid-cols-2 gap-2">
                        <div v-for="o in 4" class="bg-neutral-500 rounded-lg"/>
                    </div>
                    <div class="absolute w-full left-0 bottom-0 p-1">
                        <div class="flex gap-2">
                            <div class="w-full p-5 rounded-lg bg-neutral-400/50 backdrop-blur group-hover:shadow-md group-hover:-translate-y-px transition-all"/>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide class="rounded-lg relative !flex flex-col justify-center border text-lg text-neutral-400 border-neutral-500 shadow-md !w-full !max-w-28 p-2 font-medium !mr-0">
                    <div class="leading-tight">
                        É tudo por aqui!
                    </div>
                </SwiperSlide>
            </Swiper>
            <div class="max-md:hidden lg:group-hover/aside:visible lg:invisible mt-1 px-4 flex justify-end text-neutral-500">
                <button class="button-market-research-prev disabled:opacity-10 disabled:cursor-not-allowed hover:text-neutral-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                        <g clip-path="url(#a)">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.25-7.25a.75.75 0 0 0 0-1.5H8.66l2.1-1.95a.75.75 0 1 0-1.02-1.1l-3.5 3.25a.75.75 0 0 0 0 1.1l3.5 3.25a.75.75 0 0 0 1.02-1.1l-2.1-1.95h4.59Z" clip-rule="evenodd" />
                        </g>
                        <defs>
                            <clipPath id="a">
                                <path d="M0 0h20v20H0z" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>
                <button class="button-market-research-next disabled:opacity-10 disabled:cursor-not-allowed hover:text-neutral-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h4.59l-2.1 1.95a.75.75 0 0 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 1 0-1.02 1.1l2.1 1.95H6.75Z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useSidebar } from "~/stores/useSidebar.js";

</script>
