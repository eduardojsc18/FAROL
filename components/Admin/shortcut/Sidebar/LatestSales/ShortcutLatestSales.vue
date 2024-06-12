<template>
    <div class="space-y-3 group/shortcut min-h-[240px] overflow-x-hidden relative">
        <div class="pl-4 pr-2 flex justify-between items-center " >
            <div class="transition-all origin-top-left" :class="{'md:[writing-mode:vertical-rl] md:leading-none': useSidebar().minify}">
                <p class="text-sm font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">Ultimas vendas</p>
<!--                <p class="text-[10px] text-neutral-400 whitespace-nowrap">Atualizado em {{ dateRefresh }}</p>-->
            </div>
            <div v-if="!useSidebar().minify" class="mt-1 max-md:hidden lg:group-hover/aside:visible lg:invisible flex justify-end text-neutral-500">
                <button class="button-latest-sales-prev disabled:opacity-10 disabled:cursor-not-allowed hover:text-neutral-400">
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
                <button class="button-latest-sales-next disabled:opacity-10 disabled:cursor-not-allowed hover:text-neutral-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h4.59l-2.1 1.95a.75.75 0 0 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 1 0-1.02 1.1l2.1 1.95H6.75Z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
        <div
            v-show="!useSidebar().minify"
            class="
                max-md:!block min-w-[280px] relative
                after:z-10 after:absolute after:top-0 after:w-5 after:h-full after:bg-gradient-to-l after:from-transparent after:to-orange-50 dark:after:to-neutral-800
                before:z-10 before:absolute before:top-0 before:right-0 before:w-5 before:h-full before:bg-gradient-to-l before:to-transparent before:from-orange-50 dark:before:from-neutral-800
            "
        >
            <Swiper
                :navigation="{nextEl: '.button-latest-sales-next', prevEl: '.button-latest-sales-prev'}"
                :modules="[SwiperNavigation]"
                grab-cursor
                :slides-per-view="2.2"
                space-between="10"
                class="pb-3 !pl-4 !py-2 relative !flex"
            >
                <SwiperSlide class="!flex group group-has-[.swiper-slide-active]:bg-neutral-300" v-for="(order, index) in orders.results" :key="index" >
                    <Suspense>
                        <ShortcutLatesSalesItem :order="order" />
                        <template #fallback>
                            <ShortcutLatestSalesItemLoading />
                        </template>
                    </Suspense>
                </SwiperSlide>
                <SwiperSlide >
                    <div class="rounded-lg relative text-lg text-center flex flex-col justify-between text-neutral-400 item-active !h-[177px] p-2 font-medium">
                        <div class="leading-tight">
                            Tudo certo por aqui!
                        </div>
                        <div class="text-[10px] font-base w-full leading-tight text-neutral-400 gap-1">
                            essas foram as ultimas 10 vendas
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide />
            </Swiper>
        </div>
    </div>
</template>
<script setup>
import {useSidebar} from "~/stores/useSidebar.js";
import {useGetOrders} from "~/stores/orders/useGetOrders.js";
import ShortcutLatestSalesItemLoading from "~/components/Admin/shortcut/Sidebar/LatestSales/ShortcutLatestSalesItemLoading.vue";
const ShortcutLatesSalesItem = defineAsyncComponent(() => import("~/components/Admin/shortcut/Sidebar/LatestSales/ShortcutLatestSalesItem.vue"));

const orders = await useGetOrders().getOrders()
</script>
