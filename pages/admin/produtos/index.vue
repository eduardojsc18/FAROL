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

<!--        <section>-->
<!--            FILTROS-->
<!--        </section>-->

        <v-card variant="flat" elevation="0" border rounded>
            <v-card-title class="!p-2 !border-b">
                <section class="flex flex-wrap *:grow !items-stretch justify-between gap-3">
                    <WidgetReportTotals
                        :label="`Anuncios / ativo: ${report.total_products_active} / pausado: ${report.total_products_paused}`"
                        :value="report.total_products"
                        color="blue"
                        :loading="loading"
                    />
                    <WidgetReportTotals
                        label="Em estoque"
                        :value="report.total_stock_available"
                        color="purple"
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
                        label="Lucro a receber"
                        :value="`R$ ${toBRL(report.total_profit)}`"
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
                    height="70vh"
                    :header-props="{ class: 'whitespace-nowrap' } "
                >
                    <template #item="{ item, index }">
                        <tr class="*:!pb-5 group *:!pt-14" :class="CONFIG_STATUSES[item.status].classTrBgColor">
                            <td class="relative max-lg:whitespace-nowrap min-w-[400px]">
                                <div class="absolute flex items-center w-full gap-3 top-4 left-4">
                                    <div class="flex items-center *:px-2 leading-none divide-x text-[10px] p-1 bg-white rounded-md border group-hover:shadow-md transition-shadow">
                                        <a :href="`https://www.mercadolivre.com.br/anuncios/${item.id_meli}/modificar`" target="_blank" class="hover:underline text-gray-500 hover:text-blue-700">
                                            <div data-tooltip="editar anuncio" class="whitespace-nowrap flex items-center gap-1 ">
                                               {{ item.id_meli }}
                                            </div>
                                        </a>
                                        <div data-tooltip="criado em" class="whitespace-nowrap flex items-center gap-1 text-gray-500">
                                            <v-icon icon="mdi-calendar" class="" size="12" />
                                            {{ dayjs(item.created_at).format('DD/MM/YYYY HH:mm') }}
                                        </div>
                                        <div data-tooltip="atualizado em" class="whitespace-nowrap flex items-center gap-1 text-gray-500">
                                            <v-icon icon="mdi-pencil" class="" size="12" />
                                            {{ dayjs(item.updated_at).format('DD/MM/YYYY HH:mm') }}
                                        </div>
                                        <div data-tooltip="Status do pedido">
                                            <div class="flex items-center leading-none whitespace-nowrap gap-2 text-xs" :class="CONFIG_STATUSES[item.status]?.classTextColor">
                                                <v-icon :icon="CONFIG_STATUSES[item.status]?.icon" size="10"/>
                                                {{ CONFIG_STATUSES[item.status]?.label }}
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
                                <a :href="item.permalink" target="_blank">
                                    <div class="flex items-center justify-start gap-3 hover:drop-shadow transition-shadow">
                                        <v-img :src="item.thumbnail" :alt="item.title" width="50" height="50" class="max-w-[50px] border rounded-md bg-white" rounded/>
                                        <div class="grow-0">
                                            <p class="text-base font-satoshi-medium">{{ item.title }}</p>
                                        </div>
                                    </div>
                                </a>
                            </td>
                            <td class="text-center font-semibold whitespace-nowrap">
                                {{ item.total_visits }}
                            </td>
                            <td class="text-center font-semibold whitespace-nowrap">
                                {{ item.total_sold }}
                            </td>
                            <td class="text-center font-semibold whitespace-nowrap" :class="item.stock_available > 0 ? 'text-green-500' : 'text-red-500'">
                                {{ item.stock_available }}
                            </td>
                            <td class="text-center whitespace-nowrap text-blue-500">
                                R$ {{ toBRL(item.sale_price) }}
                            </td>
                            <td class="text-center whitespace-nowrap text-red-500" >
                                R$ {{ toBRL(item.tax_meli_unit) }}
                                <template v-if="item.shipping_free">
                                    <p class="text-gray-400 text-[10px]">frete R$ {{item.estimated_shipping_cost}} </p>
                                    <p class="text-gray-400 text-[10px]"> + tax R$ {{ toBRL(item.marketplace_fee_total) }}</p>
                                </template>
                            </td>
                            <td class="text-center whitespace-nowrap text-red-500">
                                R$ {{ toBRL(item.cost_unit) }}
                            </td>
                            <td class="text-center whitespace-nowrap text-red-500" >
                                R$ {{ toBRL(item.tax_nfe_unit) }}
                            </td>
                            <td class="text-center whitespace-nowrap text-green-500">
                                R$ {{ toBRL(item.selling_fees?.total_fee) }} <small class="text-[9px]">({{item.profit_unit_percent}}%)</small>
                            </td>
                            <td class="text-sm whitespace-nowrap text-blue-500">
                                R$ {{ toBRL(item.receivable_total_gross) }}
                            </td>
                            <td class="text-sm whitespace-nowrap text-red-500">
                                R$ {{ toBRL(item.receivable_total_cost) }}
                            </td>
                            <td class="text-sm whitespace-nowrap text-green-600">
                                R$ {{ toBRL(item.receivable_total_profit) }}
                            </td>
                        </tr>
                        <template v-if="!!item.variations">
                            <tr v-for="variation in item.variations" class="bg-gray-50 text-xs" :class="variation.available_quantity > 0 ? 'bg-gray-50' : 'text-red-600 italic bg-red-50'">
                                <td class="text-center whitespace-nowrap pl-9">
                                    <div class="flex items-center justify-start gap-3 hover:drop-shadow transition-shadow">
                                        <v-img :src="variation.thumbnail" :alt="variation.title" width="30" height="30" class="max-w-[30px] border rounded-md bg-white" rounded/>
                                        <div class="grow-0">
                                            <p class="">{{ variation.title }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-center whitespace-nowrap"> -  </td>
                                <td class="text-center whitespace-nowrap"> {{ variation.sold_quantity }} </td>
                                <td class="text-center whitespace-nowrap"> {{ variation.available_quantity }} </td>
                                <td class="text-center whitespace-nowrap"> - </td>
                                <td class="text-center whitespace-nowrap"> - </td>
                                <td class="text-center whitespace-nowrap"> - </td>
                                <td class="text-center whitespace-nowrap"> - </td>
                                <td class="text-center whitespace-nowrap"> - </td>
                                <td class="whitespace-nowrap"> R$ {{ toBRL(variation.receivable_total_gross) }} </td>
                                <td class="whitespace-nowrap"> R$ {{ toBRL(variation.receivable_total_cost) }} </td>
                                <td class="whitespace-nowrap"> R$ {{ toBRL(variation.receivable_total_profit) }} <small>({{ variation.receivable_total_profit_percent }}%)</small> </td>
                            </tr>
                        </template>
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
    { title: 'Produto', value: 'name', class: 'whitespace-nowrap' },
    { title: 'Visitas', value: 'total_visits', align: 'center' },
    { title: 'Vendas', value: 'total_sold', align: 'center' },
    { title: 'Estoque', value: 'stock_available', align: 'center' },
    { title: 'Anuncio', value: 'sale', align: 'center' },
    { title: 'Taxa Meli', value: 'tax_meli_unit', align: 'center' },
    { title: 'Custo', value: 'cost', align: 'center' },
    { title: 'NFe 4%', value: 'tax_nfe', align: 'center', class: 'whitespace-nowrap' },
    { title: 'Lucro Unitário', value: 'profit_per_unit', align: 'center' },
    { title: 'Total Bruto', value: 'total_gross'},
    { title: 'Total Custo', value: 'total_cost'},
    { title: 'Total Lucro', value: 'total_profit'},
]
const CONFIG_SHIPPING_TYPES = {
    'FULL': {styleColor: '#15803d', classBgColor: 'bg-green-700', classTextColor: 'text-green-700', icon: 'mdi-lightning-bolt'},
    'FLEX': {styleColor: '#22c55e', classBgColor: 'bg-green-500 ', classTextColor: 'text-green-500 ', icon: 'mdi-motorbike'},
    'COLETA': {styleColor: '#eab308', classBgColor: 'bg-yellow-500', classTextColor: 'text-yellow-500', icon: 'mdi-package-variant-closed'},
    'MERCADO ENVIOS': {styleColor: '#374151', classBgColor: 'bg-gray-700', classTextColor: 'text-gray-700', icon: 'mdi-handshake'},
}
const CONFIG_STATUSES = {
    'paused': { classTextColor: 'text-yellow-600', classTrBgColor: 'bg-yellow-50/50', icon: 'mdi-circle', label: 'Pausado' },
    'closed': { classTextColor: 'text-orange-600', classTrBgColor: 'bg-orange-50/50', icon: 'mdi-circle', label: 'Encerrado' },
    'active': { classTextColor: 'text-green-600', classTrBgColor: '', icon: 'mdi-circle', label: 'Ativo' },
    'no_stock': { classTextColor: 'text-red-600', classTrBgColor: 'bg-red-50/50', icon: 'mdi-circle', label: 'Sem estoque' },
}

const request = ref({
    // date_range: [dayjs().tz('America/Sao_Paulo').startOf('day').toISOString(), dayjs().tz('America/Sao_Paulo').endOf('day').toISOString()],
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
        // date_range: [
        //     dayjs(request.value.date_range[0]).tz('America/Sao_Paulo').startOf('day').toISOString(),
        //     dayjs(request.value.date_range[1]).tz('America/Sao_Paulo').endOf('day').toISOString()]
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
