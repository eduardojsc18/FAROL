<template>
    <div class="space-y-10">

        <HeaderPage
            title="Vendas por Produtos"
            description="lista das ultimas vendas agrupando-as por produto"
        >
            <template #icon>
                <IconProduct class="!size-10" />
            </template>
            <template #right>
                <form @submit.prevent="execReport" class="flex max-sm:flex-col items-center gap-2">
                    <InputDate
                        v-model="request.date_range"
                        placeholder="DD/MM/YYYY - DD/MM/YYYY"
                        label="periodo"
                        density="compact"
                        hide-details
                        multiple="range"
                        show-select-period
                        min-width="300"
                    />
                    <v-btn
                        prepend-icon="mdi-magnify"
                        text="buscar"
                        color="orange-darken-2"
                        rounded="lg"
                        type="submit"
                        class="max-sm:!w-full"
                    />
                </form>
            </template>
        </HeaderPage>
    </div>
</template>
<script setup>
import HeaderPage from "~/components/UI/Layouts/Admin/Header/HeaderPage.vue";
import InputDate from "~/components/UI/Inputs/InputDate/InputDate.vue";
import IconProduct from "~/components/UI/Icons/IconProduct.vue";
import IconOrder from "~/components/UI/Icons/IconOrder.vue";
import WidgetReportTotals from "~/components/UI/Widgets/ReportTotals/WidgetReportTotals.vue";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const { $fetchSupabase } = useNuxtApp()
const { toBRL } = useHelpers()
const route = useRoute()
const router = useRouter()

const DEFAULT_ORDER_TABLE_HEADERS = [
    { title: 'Produto', value: 'item_title' },
    { title: 'Venda', value: 'order_total', align: 'center' },
    { title: 'Tax. Meli', value: 'tax_marketplace', align: 'center' },
    { title: 'Tax. Transporte', value: 'tax_marketplace_shipping_after', align: 'center' },
    { title: 'NFe', value: 'tax_nfe', align: 'center' },
    { title: 'Custo', value: 'product_cost_total', align: 'center' },
    { title: 'Lucro', value: 'net_revenue', align: 'center' },
]
const CONFIG_SHIPPING_TYPES = {
    'FULL': {styleColor: '#15803d', classBgColor: 'bg-green-700', classTextColor: 'text-green-700', icon: 'mdi-lightning-bolt'},
    'FLEX': {styleColor: '#22c55e', classBgColor: 'bg-green-500 ', classTextColor: 'text-green-500 ', icon: 'mdi-motorbike'},
    'COLETA': {styleColor: '#eab308', classBgColor: 'bg-yellow-500', classTextColor: 'text-yellow-500', icon: 'mdi-package-variant-closed'},
    'MERCADO ENVIOS': {styleColor: '#374151', classBgColor: 'bg-gray-700', classTextColor: 'text-gray-700', icon: 'mdi-handshake'},
}
const CONFIG_STATUSES = {
    'paid': { classTextColor: 'text-green-600 ', icon: 'mdi-circle', label: 'Pago' },
    'cancelled': { classTextColor: 'text-red-600', icon: 'mdi-circle', label: 'Cancelado' },
}

const request = ref({
    date_range: [dayjs().tz('America/Sao_Paulo').startOf('day').toISOString(), dayjs().tz('America/Sao_Paulo').endOf('day').toISOString()],
    ...route.query,
})

const loading = ref(true)
const saveConfirm = ref(false)
const editOrder = ref({})

const orders = ref([])
const report = ref({
    total_orders: 0,
    total_gross_revenue: 0,
    total_net_revenue: 0,
    period_summary: {
        first_order_date: null,
        last_order_date: null
    },
    total_products: 0,
    total_unit_price: 0,
    total_bonus: 0,
    total_tax_marketplace: 0,
    total_tax_marketplace_shipping_before: 0,
    total_tax_marketplace_shipping_after: 0,
    total_tax_nfe: 0,
    total_product_cost: 0,
    total_net_revenue_percent: 0,
    total_canceled_orders: 0,
    total_canceled_products: 0,
    total_canceled_gross_revenue: 0,
})
const report_per_product = ref({})

const execReport = async () => {

    loading.value = true

    const dataFilter = {
        date_range: [
            dayjs(request.value.date_range[0]).tz('America/Sao_Paulo').startOf('day').toISOString(),
            dayjs(request.value.date_range[1]).tz('America/Sao_Paulo').endOf('day').toISOString()]
    }

    try {
        const response = await $fetchSupabase('/api/orders', {query: dataFilter })
        orders.value = response.data.orders || []
        report.value = response.data.report || []
        report_per_product.value = response.data.report_per_product || {}
        await router.push({query: dataFilter})
    } catch (e) {
        console.log(e)
    } finally {
        loading.value = false
    }

}
const makeDialogEditOrder = (index, item) => {
    saveConfirm.value = false
    editOrder.value = {
        index: index,
        showDialog: true,
        order_id: item.id,

        original_product: {...item.product},
        product: item.product ?? {id: null, sku: null, name: null, cost_price: null, photo: null, attachments: []},

        meli_order_id: item.meli_order_id,
        meli_sku: item.meli_sku,
        product_cost: item.product_cost,
        order_at: item.order_at,

        apply_all: false,
        save_for_next: false,
    }
}
const execFixOrderCost = () => {

}
onMounted(() => {
    execReport()
})
</script>
<style scoped>

</style>
