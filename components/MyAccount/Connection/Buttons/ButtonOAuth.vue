<template>
    <v-btn @click="execOauth" color="primary" height="80px" variant="tonal" prepend-icon="mdi-plus" class="w-full">
        Conectar Mercado Livre
    </v-btn>
</template>
<script setup>
const form = defineModel('modelValue')
const loading = ref(false)

const config = useRuntimeConfig()

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
        }
        try {

            const urlParams = new URLSearchParams(authWindow.location.hash.substring(1))
            const code = urlParams.get('code')

            if (code) {
                window.clearInterval(pollTimer)
                form.value.code = code
                loading.value = false
                authWindow.close()
            }

        } catch (e) {
            console.log(e)
        }
    }, 1000)

}
</script>
<style scoped>

</style>
