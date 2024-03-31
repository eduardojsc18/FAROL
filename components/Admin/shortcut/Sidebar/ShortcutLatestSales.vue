<template>
    <div class="space-y-3 group/shortcut">
        <div class="pl-4 pr-2 flex justify-between items-center">
            <div>
                <p class="text-sm font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">Ultimas vendas</p>
                <p class="text-[10px] text-neutral-400 whitespace-nowrap">Atualizado em DD/MM/YYYY HH:MM:SS</p>
            </div>
            <button @click="execFresh" data-tooltip="Clique para atualizar" class="btn-header-style lg:invisible group-hover/aside:visible text-neutral-400 hover:text-neutral-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3" :class="{'animate-spin': refresh}">
                    <path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
        <div>
            <Swiper :navigation="{nextEl: '.button-latest-sales-next', prevEl: '.button-latest-sales-prev'}" :modules="[SwiperNavigation]" :slides-per-view="2.2" space-between="5" :effect="'creative'" class="pb-3 !pl-4 relative h-40">
                <SwiperSlide v-for="i in 10" :key="i" class="rounded-lg group relative bg-neutral-600 shadow-md !w-full !max-w-28 !flex flex-col p-2">
                    <div class="!flex-grow ">

                    </div>
                    <div class="absolute w-full left-0 bottom-0 p-1">
                        <div class="flex gap-2">
                            <div class="w-full p-5 rounded-lg bg-neutral-400/50 backdrop-blur group-hover:shadow-md group-hover:-translate-y-px transition-all"/>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide class="rounded-lg relative !flex flex-col justify-center border text-lg text-neutral-400 border-neutral-500 shadow-md !w-full !max-w-28 p-2 font-medium !mr-0">
                    <div class="leading-tight">
                        Tudo certo por aqui!
                    </div>
                    <button class="text-xs absolute bottom-2 mt-2 flex items-center justify-between leading-none gap-1 rounded-full border border-neutral-500 hover:bg-neutral-800 px-2 py-1.5">
                        Atualizar
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3" :class="{'animate-spin': refresh}">
                            <path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </SwiperSlide>
            </Swiper>
            <div class="mt-1 max-md:hidden flex justify-end text-neutral-400">
                <button class="button-latest-sales-prev disabled:opacity-10 disabled:cursor-not-allowed hover:text-neutral-200">
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
                <button class="button-latest-sales-next disabled:opacity-10 disabled:cursor-not-allowed hover:text-neutral-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h4.59l-2.1 1.95a.75.75 0 0 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 1 0-1.02 1.1l2.1 1.95H6.75Z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
const refresh = ref(false)

function execFresh() {
    refresh.value = true
    setTimeout(() => refresh.value = false, 1000)
}

</script>
<style scoped>

</style>
