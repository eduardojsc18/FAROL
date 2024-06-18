<template>
    <div class="flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto overflow-y-visible relative">
            <div class="inline-block min-w-full py-2 align-middle px-1">
                <table class="min-w-full">
                    <thead  class="min-w-full">
                    <tr class="*:px-3 *:py-3.5 dark:text-primary-50 *:bg-orange-700 font-semibold">
                        <th id="thead-order-table" scope="col" class="rounded-l-xl w-[500px] min-w-[500px] text-left text-sm">Produto</th>
                        <th scope="col" class="text-center text-sm">Valor</th>
                        <th scope="col" class="text-center text-sm">Quantidade</th>
                        <th scope="col" class="text-center text-sm">Tipo</th>
                        <th scope="col" class="rounded-r-xl text-center text-sm">Transporte</th>
                    </tr>
                    </thead>
                    <tr v-show="!fixed" :class="{'-top-10': fixed}" class="fixed transition-[top] delay-200 mx-auto top-1 max-sm:!top-[54px] z-10 *:px-3 *:py-1 *:text-[9px] dark:text-primary-50 *:bg-orange-700 drop-shadow divide-x-0 *:font-medium">
                        <th scope="col" class="rounded-l-md text-left">Produto</th>
                        <th scope="col" class="text-center">Valor</th>
                        <th scope="col" class="text-center">Quantidade</th>
                        <th scope="col" class="text-center">Tipo</th>
                        <th scope="col" class="rounded-r-md text-center">Transporte</th>
                    </tr>
                    <tbody class="divide-y divide-orange-500/10">
                    <slot  />
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script setup>
const fixed = ref()

onMounted(() => {
    let total = document.getElementById("thead-order-table")
    if (total) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                fixed.value = entry.isIntersecting
            })
        }, {threshold: 1, rootMargin: '20px'})
        observer.observe(total)
    }
})
</script>
