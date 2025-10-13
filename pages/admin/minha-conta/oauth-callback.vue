<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-50">
        <div class="text-center space-y-4">
            <v-progress-circular indeterminate color="orange" size="64"/>
            <p class="text-lg text-gray-600">Processando autenticação...</p>
        </div>
    </div>
</template>

<script setup>
onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')

    if (window.opener) {
        if (code) {
            window.opener.postMessage(
                { type: 'MELI_AUTH_SUCCESS', code },
                window.location.origin
            )
        } else if (error) {
            window.opener.postMessage(
                { type: 'MELI_AUTH_ERROR', error },
                window.location.origin
            )
        }

        window.close()
    } else {
        // Se não há window.opener, redireciona para a página principal
        navigateTo('/admin/minha-conta')
    }
})
</script>
