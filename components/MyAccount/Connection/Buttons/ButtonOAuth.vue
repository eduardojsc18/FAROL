<template>
    <v-btn
        v-if="!configCode?.length"
        @click="execOauth"
        color="green"
        variant="tonal"
        :text="loading ? 'conectando...' : 'conectar conta'"
        :disabled="loading"
    >
        <template #prepend>
            <v-icon v-if="loading" icon="mdi-loading" class="animate-spin" />
            <v-icon v-else-if="!connected" icon="mdi-checkbox-blank-circle-outline" />
            <v-icon v-else-if="form.code" icon="mdi-checkbox-marked-circle" />
        </template>
    </v-btn>

    <v-expansion-panels v-model="configCode" variant="accordion" class="border" elevation="0">
        <v-expansion-panel value="code">
            <v-expansion-panel-title expand-icon="mdi-cog" class="text-xs">
                Adicionar código manualmente
            </v-expansion-panel-title>
            <v-expansion-panel-text class="border-t pt-5">
                <v-text-field
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
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>

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
