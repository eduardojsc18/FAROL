<template>
    <div>

        <HeaderPage
            title="Produtos"
            :description="`Produtos anunciados`"
        >
            <template #icon>
                <IconProduct />
            </template>
            <template #right>
                <div class="flex items-center gap-2">
                    <v-select
                        label="Mostrar produtos"
                        :items="Object.values(CONFIG_STATUSES)"
                        v-model="request.status"
                        item-value="key"
                        item-title="label"
                        density="compact"
                        hide-details
                        :loading="loading"
                        class="max-w-[200px]"
                    />
                    <v-btn
                        :loading="loading"
                        prepend-icon="mdi-magnify"
                        text="buscar"
                        color="orange-darken-2"
                        rounded="lg"
                        type="submit"
                        class="max-sm:!w-full"
                        @click="execGetProducts"
                    />
                </div>
            </template>
        </HeaderPage>

        <v-card variant="flat" elevation="0" border rounded>
            <v-card-title class="!p-2 !border-b">
                <section class="flex flex-wrap *:grow !items-stretch justify-between gap-3">
                    <WidgetReportTotals
                        :label="`Anuncios / ativo: ${report.total_products_active ?? 0} / pausado: ${report.total_products_paused ?? 0}`"
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
                                        <div v-if="item.product_data.catalog_listing" class="font-medium">CATÁLOGO</div>
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
                            <td class="text-center font-semibold whitespace-nowrap leading-none">
<!--                                <p>hoje: {{ item.visits_last_3_days.today }}</p>-->
                                <p data-tooltip="total de visitas">{{ item.total_visits }}</p>
                                <p class="text-neutral-900 font-normal">
                                    <small class="text-[9px] pr-1 border-r">ontem: {{ item.visits_last_3_days.yesterday }}</small>
                                    <small class="text-[9px] pl-1">anteontem: {{ item.visits_last_3_days.day_before_yesterday }}</small>
                                </p>
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
                                R$ {{ toBRL(item.profit_unit) }}
                                <p class="leading-none"><small class="text-[9px]">(Venda: {{item.profit_unit_percent}}%)</small></p>
                                <p class="leading-none"><small class="text-[9px]">(Custo: {{item.markup_percent}}%)</small></p>
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
    { title: 'Produto', key: 'title', class: 'whitespace-nowrap' },
    { title: 'Visitas', key: 'total_visits', align: 'center' },
    { title: 'Vendas', key: 'total_sold', align: 'center' },
    { title: 'Estoque', key: 'stock_available', align: 'center' },
    { title: 'Anuncio', key: 'sale_price', align: 'center' },
    { title: 'Taxa Meli', key: 'tax_meli_unit', align: 'center' },
    { title: 'Custo', key: 'cost_unit', align: 'center' },
    { title: 'NFe 4%', key: 'tax_nfe_unit', align: 'center', class: 'whitespace-nowrap' },
    { title: 'Lucro Unitário', key: 'profit_unit', align: 'center' },
    { title: 'Total Bruto', key: 'receivable_total_gross'},
    { title: 'Total Custo', key: 'receivable_total_cost'},
    { title: 'Total Lucro', key: 'receivable_total_profit'},
]
const CONFIG_SHIPPING_TYPES = {
    'FULL': {styleColor: '#15803d', classBgColor: 'bg-green-700', classTextColor: 'text-green-700', icon: 'mdi-lightning-bolt'},
    'FLEX': {styleColor: '#22c55e', classBgColor: 'bg-green-500 ', classTextColor: 'text-green-500 ', icon: 'mdi-motorbike'},
    'COLETA': {styleColor: '#eab308', classBgColor: 'bg-yellow-500', classTextColor: 'text-yellow-500', icon: 'mdi-package-variant-closed'},
    'MERCADO ENVIOS': {styleColor: '#374151', classBgColor: 'bg-gray-700', classTextColor: 'text-gray-700', icon: 'mdi-handshake'},
}
const CONFIG_STATUSES = {
    'all_products': { classTextColor: 'text-blue-600', classTrBgColor: 'bg-blue-50/50', icon: 'mdi-circle', label: 'Todos produtos', key: 'all_products' },
    'active': { classTextColor: 'text-green-600', classTrBgColor: '', icon: 'mdi-circle', label: 'Ativo', key: 'active' },
    'no_stock': { classTextColor: 'text-red-600', classTrBgColor: 'bg-red-50/50', icon: 'mdi-circle', label: 'Sem estoque', key: 'no_stock' },
    'paused': { classTextColor: 'text-yellow-600', classTrBgColor: 'bg-yellow-50/50', icon: 'mdi-circle', label: 'Pausado', key: 'paused' },
    'closed': { classTextColor: 'text-orange-600', classTrBgColor: 'bg-orange-50/50', icon: 'mdi-circle', label: 'Encerrado', key: 'closed' },
}

const request = ref({
    // date_range: [dayjs().tz('America/Sao_Paulo').startOf('day').toISOString(), dayjs().tz('America/Sao_Paulo').endOf('day').toISOString()],
    status: 'all_products',
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
        ...request.value
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
