import { meliFetch } from '~/server/providers/providerMeli'

export default defineNitroPlugin((nitroApp) => {
    // Registre o provider para ser acessível por toda aplicação do lado do servidor
    nitroApp.meli = {
        fetch: meliFetch
    }
})
