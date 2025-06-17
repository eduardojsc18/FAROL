<template>

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

    <v-card variant="outlined" rounded border>
        <v-card-title class="!pt-3">
            <div class="flex items-start justify-start gap-5">
                <v-img class="size-28 max-w-28 aspect-square bg-gray-100" />
                <div>
                    <p class="text-xl mb-2 font-semibold leading-none">Opa</p>
                    <div class="flex justify-start gap-3">
                        <div v-for="i in 5" class="bg-blue-100 rounded-md p-3">
                            <p class="text-xs">Preço de Venda</p>
                            <p>R$ 00,00</p>
                        </div>
                    </div>
                </div>
            </div>
        </v-card-title>
        <v-card-text>

        </v-card-text>
    </v-card>

</template>
<script setup>
import HeaderPage from "~/components/UI/Layouts/Admin/Header/HeaderPage.vue";
import IconProduct from "~/components/UI/Icons/IconProduct.vue";
import dayjs from "dayjs";

const route = useRoute()
const { $fetchSupabase } = useNuxtApp()
const { toBRL } = useHelpers()
const router = useRouter()

const request = ref({
    date_range: [dayjs().tz('America/Sao_Paulo').startOf('day').toISOString(), dayjs().tz('America/Sao_Paulo').endOf('day').toISOString()],
    ...route.query,
})

const products = ref([])
const report = ref({})
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
        products.value = response.data.orders || []
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
