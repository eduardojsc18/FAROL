<template>
    <v-card-text class="space-y-1">
        <div v-if="connected" class="flex items-center gap-2 p-3 bg-green-50 rounded-md">
            <v-icon icon="mdi-check-circle" color="green"/>
            <span class="text-sm text-green-700">Conectado com sucesso!</span>
        </div>

        <v-btn
            v-if="!configCode?.length"
            @click="execOauth"
            color="green"
            variant="tonal"
            :text="loading ? 'Conectando...' : connected ? 'Reconectar' : 'Conectar conta'"
            :disabled="loading"
            class="!w-full"
        >
            <template #prepend>
                <v-icon v-if="loading" icon="mdi-loading" class="animate-spin" />
                <v-icon v-else-if="!connected" icon="mdi-checkbox-blank-circle-outline" />
                <v-icon v-else icon="mdi-checkbox-marked-circle" />
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

let authWindow = null
let messageHandler = null

const openOAuthWindow = (url, name) => {
    const width = 940
    const height = 700
    const left = (window.screen.width / 2) - (width / 2)
    const top = (window.screen.height / 2) - (height / 2)

    return window.open(url, name, `width=${width},height=${height},top=${top},left=${left}`)
}

const execOauth = async () => {
    loading.value = true
    connected.value = false

    // Remove listener anterior se existir
    if (messageHandler) {
        window.removeEventListener('message', messageHandler)
    }

    // Cria novo listener para receber o code
    messageHandler = (event) => {
        // Verifica se a mensagem vem da mesma origem
        if (event.origin !== window.location.origin) {
            return
        }

        if (event.data.type === 'MELI_AUTH_SUCCESS') {
            form.value.code = event.data.code
            connected.value = true
            loading.value = false

            // Remove o listener após receber o code
            window.removeEventListener('message', messageHandler)
            messageHandler = null
        } else if (event.data.type === 'MELI_AUTH_ERROR') {
            console.error('Erro na autenticação:', event.data.error)
            loading.value = false
            connected.value = false

            window.removeEventListener('message', messageHandler)
            messageHandler = null
        }
    }

    window.addEventListener('message', messageHandler)

    // Abre a janela de autenticação
    const authUrl = config.public.meliUrlOAuth
    authWindow = openOAuthWindow(authUrl, 'OAuthLogin')

    // Monitora se a janela foi fechada manualmente
    const checkWindowClosed = setInterval(() => {
        if (authWindow && authWindow.closed) {
            clearInterval(checkWindowClosed)

            // Se a janela foi fechada mas não recebemos o code
            if (!connected.value) {
                loading.value = false
                if (messageHandler) {
                    window.removeEventListener('message', messageHandler)
                    messageHandler = null
                }
            }
        }
    }, 500)
}

const getClipboardData = async () => {
    try {
        form.value.code = await navigator.clipboard.readText()
        connected.value = true
    } catch (err) {
        console.error('Não foi possível acessar a área de transferência', err)
    }
}

// Cleanup ao desmontar o componente
onUnmounted(() => {
    if (messageHandler) {
        window.removeEventListener('message', messageHandler)
    }
    if (authWindow && !authWindow.closed) {
        authWindow.close()
    }
})
</script>
<style scoped>

</style>
