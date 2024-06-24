<template>
    <div class="space-y-5">
        <HeaderPage
            title="Vendas"
            :description="`Lista das ultimas ${orders.paging.limit} vendas  realizadas`"
        />
        <div>
            <OrderTable>
                <Suspense>
                    <OrderTableItem v-for="(order, index) in orders.results" :key="index" :order="order" />
                    <template #fallback>
                        <OrderTableItemLoading v-for="i in 10" :key="i"/>
                    </template>
                </Suspense>
            </OrderTable>
        </div>
    </div>
</template>
<script setup>
import {useGetOrders} from "~/stores/orders/useGetOrders.js";
import HeaderPage from "~/components/UI/Layout/Admin/Header/HeaderPage.vue";
import OrderTable from "~/components/Admin/vendas/table/OrderTable.vue";
const OrderTableItem  = defineAsyncComponent(() => import("~/components/Admin/vendas/table/OrderTableItem.vue"))
import OrderTableItemLoading from "~/components/Admin/vendas/table/OrderTableItemLoading.vue";

const orders = await useGetOrders().getOrders({limit: 50})


// function intersectionPagination() {
//     const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && this.loadMoreProducts(), {
//         rootMargin: "-400px 0px 0px 0px"
//     }));
//     observer.observe(this.$refs.loadMoreIntersect)
// }
//
// ,
//
// function loadMoreProducts() {
//     if (this.products.next_page_url === null) {
//         this.loading = false
//         return
//     }
//     if (this.loading) {
//         return
//     }
//     this.$inertia.post(this.products.path + (this.search ? `?search=${this.search}` : ''), {page: (this.products.current_page + 1)}, {
//         preserveState: true,
//         preserveScroll: true,
//         only: ['products'],
//         onBefore: () => {
//             this.loading = true
//         },
//         onSuccess: () => {
//             this.loading = false
//             this.productList.data = [...this.productList.data, ...this.products.data]
//         }
//     })
// }
//
// ,
</script>
