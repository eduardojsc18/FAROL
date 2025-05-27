<template>
    <div class="space-y-10">

        <HeaderPage
            title="Vendas"
            description="lista das ultimas vendas realizadas"
        >
            <template #icon>
                <IconOrder class="!size-10" />
            </template>
            <template #right>
                <div class="flex items-center">
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
                </div>
            </template>
        </HeaderPage>

        <v-card variant="flat" elevation="0" border rounded>
            <v-card-title class="!p-2 !border-b">
                <section class="flex flex-wrap *:grow !items-stretch justify-between gap-3">
                    <WidgetReportTotals
                        :label="`Vendas Brutas / ${report.total_orders} pedidos / ${report.total_products} produtos`"
                        :value="`R$ ${toBRL(report.total_gross_revenue)}`"
                        color="blue"
                        :loading="loading"
                    />
                    <WidgetReportTotals
                        label="- taxas meli"
                        :value="`R$ ${toBRL(report.total_tax_marketplace)}`"
                        color="red"
                        :loading="loading"
                    />
                    <WidgetReportTotals
                        label="- taxas transporte"
                        :value="`R$ ${toBRL(report.total_tax_marketplace_shipping_before)}`"
                        color="red"
                        :loading="loading"
                    />
                    <WidgetReportTotals
                        label="- taxas NFe"
                        :value="`R$ ${toBRL(report.total_tax_nfe)}`"
                        color="red"
                        :loading="loading"
                    />
                    <WidgetReportTotals
                        label="- custos produto"
                        :value="`R$ ${toBRL(report.total_product_cost)}`"
                        color="red"
                        :loading="loading"
                    />
                    <WidgetReportTotals
                        label="= lucro"
                        :value="`R$ ${toBRL(report.total_net_revenue)} (${report.total_net_revenue_percent} %)`"
                        color="green"
                        :loading="loading"
                    />
                    <WidgetReportTotals
                        :label="`cancelamentos / ${report.total_canceled_orders} pedidos / ${report.total_canceled_products} produtos`"
                        :value="`R$ ${toBRL(report.total_canceled_gross_revenue)}`"
                        color="gray"
                        :loading="loading"
                    />
                </section>
            </v-card-title>
            <v-card-text class="!p-0">

                <v-data-table
                    fixed-header
                    :headers="DEFAULT_ORDER_TABLE_HEADERS"
                    :items="orders"
                    :loading="loading"
                    items-per-page="50"
                    items-per-page-text="por página"
                    no-data-text="Nenhum pedido encontrado"
                    multi-sort
                >
                    <template #item="{ item, index }">
                        <tr class="*:!pb-5 group *:!pt-14" :class="{'bg-red-50': item.order_status === 'cancelled'}">
                            <td class="relative max-lg:whitespace-nowrap min-w-[400px]">
                                <div class="absolute flex items-center w-full gap-3 top-4 left-4">
<!--                                    <div>-->
<!--                                        <v-btn-->
<!--                                            color="grey"-->
<!--                                            variant="text"-->
<!--                                            icon="mdi-cog"-->
<!--                                            text="ajustar"-->
<!--                                            density="compact"-->
<!--                                            size="25"-->
<!--                                            rounded="full"-->
<!--                                            class="hover:!shadow-md group-hover:!text-gray-500 hover:!bg-white"-->
<!--                                            @click.prevent="makeDialogEditOrder(index, {...item})"-->
<!--                                        />-->
<!--                                    </div>-->
                                    <div class="flex items-center *:px-2 leading-none divide-x text-xs p-1 bg-white rounded-md border group-hover:shadow-md transition-shadow">
                                        <div data-tooltip="Numero pedido Mercado Livre" class="min-w-[146px]">
                                            #{{ item.order_number }}
                                        </div>
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
                                <div class="flex items-center justify-start gap-3">
                                    <v-img :src="item.item_thumbnail" :alt="item.item_title" width="60" height="60" class="max-w-[60px] border rounded-md bg-white" rounded/>
                                    <div class="grow-0">
                                        <p class="text-base font-satoshi-medium">{{ item.item_title }}</p>
                                        <p class="mt-1 text-xs text-neutral-600 *:bg-white *:px-2 *:border *:rounded-md *:mr-2 *:py-0.5 *:leading-none">
                                            <span v-for="variation in item.item_variation_attributes">
                                                {{ variation.name }}: {{ variation.value_name }}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td class="text-center font-semibold text-blue-500">
                                R$ {{ toBRL(item.order_total) }}
                                <p v-if="item.quantity > 1" class="text-gray-400 text-[10px]">{{item.quantity}} x R${{ toBRL(item.unit_price) }}</p>
                            </td>
                            <td class="text-center whitespace-nowrap text-red-500">
                                R$ {{ toBRL(item.tax_marketplace) }}
                            </td>
                            <td class="text-center whitespace-nowrap" :class="item.tax_marketplace_shipping_after ? 'text-red-500' : 'text-gray-400'">
                                R$ {{ toBRL(item.tax_marketplace_shipping_after) }}
                            </td>
                            <td class="text-center whitespace-nowrap text-blue-500">
                                R$ {{ toBRL(item.tax_nfe) }}
                            </td>
                            <td class="text-center whitespace-nowrap" :class="item.product_cost_total ? 'text-red-500' : 'text-gray-400'">
                                R$ {{ toBRL(item.product_cost_total) }}
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
        <v-dialog width="700" v-model="editOrder.showDialog">
            <v-card>
                <v-card-text>
                    <div class="border rounded-lg shadow-md bg-white mt-2 p-3 flex justify-between">
                        <div class="items-center gap-2">
                            <p>SKU Pedido: {{editOrder.meli_sku}}</p>
                            <p>Custo Pedido: {{toBRL(editOrder.product_cost, true)}}</p>
                        </div>
                        <div>
                            <div>#{{ editOrder.meli_order_id }}</div>
                            <div class="whitespace-nowrap flex items-center gap-1">
                                <v-icon icon="mdi-calendar" class="" size="20" />
                                {{ dayjs(editOrder.order_at).format('DD/MM/YYYY HH:mm') }}
                            </div>
                        </div>
                    </div>
                </v-card-text>
                <v-form @submit.prevent="execFixOrderCost">
                    <v-card-text>
                        <div>
                            <div class="flex justify-between items-center gap-2">
                                <p class="flex items-center gap-2 justify-start text-xl font-satoshi-bold">
                                    <v-icon icon="mdi-information" size="25"/>
                                    Selecione o produto para atualizar:
                                </p>
                            </div>
                            <div class="mt-5">
<!--                                <ProductInputSearchAll-->
<!--                                    return-object-->
<!--                                    v-model="editOrder.product"-->
<!--                                />-->
                            </div>
                            <div class="">
                                <v-checkbox-btn
                                    v-model="editOrder.apply_all"
                                    :label="`Corrigir custos anteriores?`"
                                    class="px-4 text-red-600"
                                    color="red"
                                />
                                <div class="ml-14 -mt-2 text-gray-500">
                                    Ao salvar você irá corrigir todos os pedidos anteriores sem custo que contenham o <span
                                        class="font-bold whitespace-nowrap">SKU: {{ editOrder.meli_sku }}</span>
                                </div>
                            </div>
                            <div class="py-2">
                                <v-checkbox-btn
                                        v-model="editOrder['save_for_next']"
                                        :label="`Salvar para os próximos pedidos?`"
                                        class="px-4 text-red-500"
                                        color="red"
                                />
                                <div class="ml-14 -mt-2 text-gray-500">
                                    Ao salvar você irá registrar o SKU errado relacionando com o Correto para corrigir automaticamente todos os pedidos futuros que contenham o <span
                                        class="font-bold whitespace-nowrap">SKU: {{ editOrder.meli_sku }}</span>
                                </div>
                            </div>
                        </div>
                    </v-card-text>
                    <v-card-actions class="pb-5 px-5">
                        <v-spacer />
                        <v-btn
                                type="button"
                                text="Fechar"
                                variant="text"
                                @click="editOrder.showDialog = false"
                                size="large"
                        />
                        <v-btn
                                v-if="!saveConfirm"
                                class="px-6"
                                color="green"
                                size="large"
                                text="Salvar"
                                type="button"
                                variant="flat"
                                @click="saveConfirm = true"
                        />
                        <v-btn
                                v-else
                                :loading="loading"
                                class="px-6"
                                color="red"
                                size="large"
                                text="Tem certeza?"
                                type="submit"
                                variant="flat"
                        />
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>
<script setup>
import IconOrder from "~/components/UI/Icons/IconOrder.vue";
import HeaderPage from "~/components/UI/Layouts/Admin/Header/HeaderPage.vue";
import WidgetReportTotals from "~/components/UI/Widgets/ReportTotals/WidgetReportTotals.vue";
import dayjs from "dayjs";
import InputDate from "~/components/UI/Inputs/InputDate/InputDate.vue";

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
    date_range: [dayjs().startOf('month').toISOString(), dayjs().toISOString()],
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

const execReport = async () => {

    loading.value = true

    const dataFilter = {
        ...route.query,
        ...request.value,
    }

    try {
        const response = await $fetchSupabase('/api/orders', {query: dataFilter })
        orders.value = response.data.orders || []
        report.value = response.data.report || []
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
