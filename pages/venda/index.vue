<template>
    <div class="flex flex-col gap-5">
        <HeaderPage title="Vendas" description="Lista das ultimas vendas realizadas" />
        <section>
            <OrderTable>
                <Suspense>
                    <OrderTableItem v-for="(order, index) in orders.results" :key="index" :order="order" />
                    <template #fallback>
                        <OrderTableItemLoading v-for="i in 10" :key="i"/>
                    </template>
                </Suspense>
            </OrderTable>
        </section>
    </div>
</template>
<script setup>
import {useGetOrders} from "~/stores/orders/useGetOrders.js";
import ShortcutLatestSalesItem from "~/components/Admin/shortcut/Sidebar/LatestSales/ShortcutLatestSalesItem.vue";
import HeaderPage from "~/components/UI/Layout/Admin/Header/HeaderPage.vue";
import OrderTable from "~/components/Admin/vendas/table/OrderTable.vue";
import OrderTableItem from "~/components/Admin/vendas/table/OrderTableItem.vue";
import OrderTableItemLoading from "~/components/Admin/vendas/table/OrderTableItemLoading.vue";

const orders = await useGetOrders().getOrders({limit: 50})
</script>
