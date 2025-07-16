<template>
    <div>

        <HeaderPage
            title="Produtos"
            :description="`Produtos anunciados`"
        >
            <template #icon>
                <IconProduct />
            </template>
        </HeaderPage>

        <section>
            FILTROS
        </section>

        <v-card variant="flat" elevation="0" border rounded>
            <v-card-title class="!p-2 !border-b">
                <section class="flex flex-wrap *:grow !items-stretch justify-between gap-3">
                    <WidgetReportTotals
                        label="Em estoque"
                        :value="report.total_stock_available"
                        color="blue"
                        :loading="loading"
                    />
                    <WidgetReportTotals
                        label="Total Custo"
                        :value="`R$ ${toBRL(report.total_cost)}`"
                        color="red"
                        :loading="loading"
                    />
                    <WidgetReportTotals
                        label="Total Bruto"
                        :value="`R$ ${toBRL(report.total_gross)}`"
                        color="red"
                        :loading="loading"
                    />
                    <WidgetReportTotals
                        label="Total a Receber"
                        :value="`R$ ${toBRL(report.total_receivable)}`"
                        color="red"
                        :loading="loading"
                    />
                    <WidgetReportTotals
                        label="Lucro a receber"
                        :value="`R$ ${toBRL(report.total_net_revenue)} (${report.total_net_revenue_percent} %)`"
                        color="green"
                        :loading="loading"
                    />
                </section>
            </v-card-title>
            <v-card-text class="!p-0">
                <v-data-table
                    fixed-header
                    :headers="DEFAULT_ORDER_TABLE_HEADERS"
                    :items="products"
                    :loading="loading"
                    items-per-page="50"
                    items-per-page-text="por página"
                    no-data-text="Nenhum produto encontrado"
                    multi-sort
                >
                    <template #item="{ item, index }">
                        <tr class="*:!pb-5 group *:!pt-14" :class="{'bg-red-50': item.order_status === 'cancelled'}">
                            <td class="relative max-lg:whitespace-nowrap min-w-[400px]">
                                <div class="absolute flex items-center w-full gap-3 top-4 left-4">
                                    <div class="flex items-center *:px-2 leading-none divide-x text-xs p-1 bg-white rounded-md border group-hover:shadow-md transition-shadow">
                                        <div data-tooltip="Pedido criado em" class="whitespace-nowrap flex items-center gap-1 text-gray-500 min-w-[135px]">
                                            <v-icon icon="mdi-calendar" class="" size="12" />
                                            {{ dayjs(item.date_created).format('DD/MM/YYYY HH:mm') }}
                                        </div>
                                        <div data-tooltip="Status do pedido">
                                            <div class="flex items-center leading-none gap-2 text-xs" :class="CONFIG_STATUSES[item.order_status]?.classTextColor">
                                                <v-icon :icon="CONFIG_STATUSES[item.order_status]?.icon" size="10"/>
                                                {{ CONFIG_STATUSES[item.order_status]?.label }}
                                                {{ item.status }}
                                            </div>
                                        </div>
                                        <div data-tooltip="Tipo de transporte" class="flex justify-center text-[10px] min-w-10">
                                            <div :class="CONFIG_SHIPPING_TYPES[item.shipping_type]?.classTextColor" class="italic font-bold flex items-center leading-none ">
                                                <v-icon :icon="CONFIG_SHIPPING_TYPES[item.shipping_type]?.icon" size="15"/>
                                                {{ item.shipping_type }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <a :href="`https://www.mercadolivre.com.br/metricas/${item.item_id}/performance-item?start_period_evolutionary=custom|${request.date_range[0]}to${request.date_range[1]}`" target="_blank">
                                    <div class="flex items-center justify-start gap-3 hover:drop-shadow transition-shadow">
                                        <v-img :src="item.item_thumbnail" :alt="item.item_title" width="50" height="50" class="max-w-[50px] border rounded-md bg-white" rounded/>
                                        <div class="grow-0">
                                            <p class="text-base font-satoshi-medium">{{ item.item_title }}</p>
                                            <p class="mt-1 text-xs text-neutral-600 *:bg-white *:px-2 *:border *:rounded-md *:mr-2 *:py-0.5 *:leading-none">
                                                <span v-for="variation in item.item_variation_attributes">
                                                    {{ variation.name }}: {{ variation.value_name }}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </td>
                            <td class="text-center font-semibold text-blue-500 whitespace-nowrap">
                                R$ {{ toBRL(item.order_total) }}
                                <p v-if="item.quantity > 1" class="text-gray-400 text-[10px]">{{item.quantity}} x R${{ toBRL(item.unit_price) }}</p>
                            </td>
                            <td class="text-center whitespace-nowrap text-red-500">
                                R$ {{ toBRL(item.tax_marketplace) }}
                            </td>
                            <td class="text-center whitespace-nowrap" :class="item.tax_marketplace_shipping_after ? 'text-red-500' : 'text-gray-400'">
                                R$ {{ toBRL(item.tax_marketplace_shipping_after) }}
                            </td>
                            <td class="text-center whitespace-nowrap text-red-500">
                                R$ {{ toBRL(item.tax_nfe) }}
                            </td>
                            <td class="text-center whitespace-nowrap" :class="item.product_cost_total ? 'text-red-500' : 'text-gray-400'">
                                R$ {{ toBRL(item.product_cost_total) }}
                                <p v-if="item.quantity > 1" class="text-gray-400 text-[10px]">{{item.quantity}} x R${{ toBRL(item.product_cost_unit) }}</p>
                            </td>
                            <td class="text-center whitespace-nowrap" :class="item.product_cost_total ? 'text-red-500' : 'text-gray-400'">
                                R$ {{ toBRL(item.product_cost_total) }}
                                <p v-if="item.quantity > 1" class="text-gray-400 text-[10px]">{{item.quantity}} x R${{ toBRL(item.product_cost_unit) }}</p>
                            </td>
                            <td class="text-center whitespace-nowrap" :class="item.product_cost_total ? 'text-red-500' : 'text-gray-400'">
                                R$ {{ toBRL(item.product_cost_total) }}
                                <p v-if="item.quantity > 1" class="text-gray-400 text-[10px]">{{item.quantity}} x R${{ toBRL(item.product_cost_unit) }}</p>
                            </td>
                            <td class="text-center whitespace-nowrap" :class="item.product_cost_total ? 'text-red-500' : 'text-gray-400'">
                                R$ {{ toBRL(item.product_cost_total) }}
                                <p v-if="item.quantity > 1" class="text-gray-400 text-[10px]">{{item.quantity}} x R${{ toBRL(item.product_cost_unit) }}</p>
                            </td>
                            <td class="text-center whitespace-nowrap" :class="item.product_cost_total ? 'text-red-500' : 'text-gray-400'">
                                R$ {{ toBRL(item.product_cost_total) }}
                                <p v-if="item.quantity > 1" class="text-gray-400 text-[10px]">{{item.quantity}} x R${{ toBRL(item.product_cost_unit) }}</p>
                            </td>
                            <td class="text-center whitespace-nowrap" :class="item.product_cost_total ? 'text-red-500' : 'text-gray-400'">
                                R$ {{ toBRL(item.product_cost_total) }}
                                <p v-if="item.quantity > 1" class="text-gray-400 text-[10px]">{{item.quantity}} x R${{ toBRL(item.product_cost_unit) }}</p>
                            </td>
                            <td class="text-center whitespace-nowrap" :class="item.net_revenue > 0 ? 'text-green-500' : 'text-gray-400'">
                                R$ {{ toBRL(item.net_revenue) }} <small class="text-xs text-gray-400">({{item.net_revenue_percent}}%)</small>
                            </td>
                        </tr>
                    </template>
                    <template #loading>
                        <v-skeleton-loader type="table-row@8" height="500px" width="100%" loading-text="carregando..." />
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

    </div>
</template>
<script setup>
import HeaderPage from "~/components/UI/Layouts/Admin/Header/HeaderPage.vue";
import IconProduct from "~/components/UI/Icons/IconProduct.vue";
import dayjs from "dayjs";
import WidgetReportTotals from "~/components/UI/Widgets/ReportTotals/WidgetReportTotals.vue";

const route = useRoute()
const { $fetchSupabase } = useNuxtApp()
const { toBRL } = useHelpers()
const router = useRouter()

const DEFAULT_ORDER_TABLE_HEADERS = [
    { title: 'Produto', value: 'name' },
    { title: 'Transporte', value: 'type_shipping', align: 'center' },
    { title: 'Visitas', value: 'visiting', align: 'center' },
    { title: 'Estoque', value: 'stock_available', align: 'center' },
    { title: 'Anuncio', value: 'sale', align: 'center' },
    { title: 'Custo', value: 'cost', align: 'center' },
    { title: 'NFe 4%', value: 'tax_nfe', align: 'center' },
    { title: 'Lucro', value: 'profit_per_unit', align: 'center' },
    { title: 'Total Bruto', value: 'total_gross', align: 'center' },
    { title: 'Total a Receber', value: 'total_receivable', align: 'center' },
    { title: 'Total Custo', value: 'total_cost', align: 'center' },
    { title: 'Total Lucro', value: 'total_profit', align: 'center' },
]
const CONFIG_SHIPPING_TYPES = {
    'FULL': {styleColor: '#15803d', classBgColor: 'bg-green-700', classTextColor: 'text-green-700', icon: 'mdi-lightning-bolt'},
    'FLEX': {styleColor: '#22c55e', classBgColor: 'bg-green-500 ', classTextColor: 'text-green-500 ', icon: 'mdi-motorbike'},
    'COLETA': {styleColor: '#eab308', classBgColor: 'bg-yellow-500', classTextColor: 'text-yellow-500', icon: 'mdi-package-variant-closed'},
    'MERCADO ENVIOS': {styleColor: '#374151', classBgColor: 'bg-gray-700', classTextColor: 'text-gray-700', icon: 'mdi-handshake'},
}
const CONFIG_STATUSES = {
    'paused': { classTextColor: 'text-yellow-600 ', icon: 'mdi-circle', label: 'Pausado' },
    'active': { classTextColor: 'text-green-600', icon: 'mdi-circle', label: 'Ativo' },
    'no_stock': { classTextColor: 'text-red-600', icon: 'mdi-circle', label: 'Sem estoque' },
}

const request = ref({
    date_range: [dayjs().tz('America/Sao_Paulo').startOf('day').toISOString(), dayjs().tz('America/Sao_Paulo').endOf('day').toISOString()],
    ...route.query,
})
const products = ref([])
const report = ref({
    total_stock_available: 0,
    total_cost: 0,
    total_gross: 0,
    total_receivable: 0,
    total_net_revenue: 0,
    total_net_revenue_percent: 0,
})
const report_per_product = ref([])
const loading = ref(false)

const execGetProducts = async () => {

    loading.value = true

    const dataFilter = {
        date_range: [
            dayjs(request.value.date_range[0]).tz('America/Sao_Paulo').startOf('day').toISOString(),
            dayjs(request.value.date_range[1]).tz('America/Sao_Paulo').endOf('day').toISOString()]
    }

    try {
        const response = await $fetchSupabase('/api/products', {query: dataFilter })
        products.value = response.data.products || []
        report.value = response.data.report || []
        report_per_product.value = response.data.report_per_product || {}
        await router.push({query: dataFilter})
    } catch (e) {
        console.log(e)
    } finally {
        loading.value = false
    }

}

onMounted(() => {
    execGetProducts()
})
</script>
<style scoped>

</style>
