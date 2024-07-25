<template>
    <div class="flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto overflow-y-visible relative">
            <div class="inline-block min-w-full py-2 align-middle px-1">
                <div class="md:table border-spacing border-spacing-y-2 min-w-full relative">
                    <div class="md:table-header-group">
                        <div class="md:table-row *:px-3 *:py-3.5 dark:text-primary-50 *:bg-orange-700 font-semibold">
                            <div class="md:table-cell rounded-l-xl max-sm:rounded-r-xl w-full md:w-[500px] md:min-w-[500px] text-left text-sm">Produto</div>
                            <div class="table-cell max-sm:hidden text-center text-sm">Valor</div>
                            <div class="table-cell max-sm:hidden text-center text-sm">Estoque</div>
                            <div class="table-cell max-sm:hidden text-center text-sm">Vendas</div>
                            <div class="table-cell max-sm:hidden text-center text-sm">Tipo</div>
                            <div class="table-cell max-sm:hidden rounded-r-xl text-center text-sm">Transporte</div>
                        </div>
                    </div>
                    <div class="md:table-row-group max-sm:!divide-y-4 divide-orange-500/20">
                        <Suspense>
                            <slot />
                            <template #fallback>
                                <OrderTableItemLoading v-for="i in 10" :key="i" />
                            </template>
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import OrderTableItemLoading from "~/components/Admin/order/table/OrderTableItemLoading.vue";

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
