<template>
    <v-card-text class="space-y-1">

        <v-btn
            v-if="!configCode?.length"
            @click="execOauth"
            color="green"
            variant="tonal"
            :text="loading ? 'conectando...' : 'conectar conta'"
            :disabled="loading"
            class="!w-full"
        >
            <template #prepend>
                <v-icon v-if="loading" icon="mdi-loading" class="animate-spin" />
                <v-icon v-else-if="!connected" icon="mdi-checkbox-blank-circle-outline" />
                <v-icon v-else-if="form.code" icon="mdi-checkbox-marked-circle" />
            </template>
        </v-btn>

        <v-btn @click="configCode = !configCode" variant="text" class="!text-[10px] !px-1 !py-1" color="blue" density="compact">
            algum problema? adicione o code manualmente aqui
        </v-btn>

        <v-text-field
                v-if="configCode"
                v-model="form.code"
                required
                label="CODE"
                placeholder="Cole aqui o CODE que vem na URL"
        >
            <template #append-inner>
                <v-btn
                    icon="mdi-content-paste"
                    variant="text"
                    v-tooltip:top="'colar o code'"
                    @click="getClipboardData"
                />
            </template>
        </v-text-field>


    </v-card-text>
</template>
<script setup>
const config = useRuntimeConfig()

const form = defineModel('modelValue')
const loading = ref(false)
const connected = ref(false)
const configCode = ref([])

const openOAuthWindow = (url, name) => {

    const width = 940
    const height = 700
    const left = (window.screen.width / 2) - (width / 2)
    const top = (window.screen.height / 2) - (height / 2)

    return window.open(url, name, `width=${width},height=${height},top=${top},left=${left}`)

}
const execOauth = async () => {

    loading.value = true

    const authUrl = config.public.meliUrlOAuth
    const authWindow = openOAuthWindow(authUrl, 'OAuthLogin')

    const pollTimer = window.setInterval(() => {
        if (authWindow.closed) {
            window.clearInterval(pollTimer)
            loading.value = false
            connected.value = false
        }
        try {

            const urlParams = new URLSearchParams(authWindow.location.hash.substring(1))
            const code = urlParams.get('code')

            if (code) {
                window.clearInterval(pollTimer)
                form.value.code = code
                connected.value = true
                loading.value = false
                authWindow.close()
            }

        } catch (e) {
            console.log(e)
        }
    }, 1000)

}
const getClipboardData = async () => {
    try {
        form.value.code = await navigator.clipboard.readText()
        connected.value = true
    } catch (err) {
        console.error('Não foi possível acessar a area de transferência', err)
    }
}
</script>
<style scoped>

</style>
