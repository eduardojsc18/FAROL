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
</script>
