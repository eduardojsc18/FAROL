<template>
    <div class="space-y-10">
        <HeaderPage
            title="Minha conta"
            description="Configure as preferencias de sua conta"
        >
            <template #icon>
                <div class="bg-white p-1 shadow-sm rounded-full">
                    <v-img rounded="full" class="size-12" :src="me.user_metadata.avatar_url" :alt="me.user_metadata.full_name" />
                </div>
            </template>
        </HeaderPage>
        <v-card class="" id="connection">
            <v-card-text>
                <section>
                    <header class="flex items-center gap-4">
                        <div class="grow">
                            <p class="font-medium text-neutral-700 text-lg">Configurações de conexão</p>
                            <p class="text-sm text-neutral-500">Configure aqui sua conexão com o MercadoLivre</p>
                        </div>
                        <ButtonAddConnection @created="refresh" />
                    </header>
                    <div class="mt-5 flex justify-start">
                        <v-data-table
                            :headers="DEFAULT_CONNECTIONS_HEADERS"
                            :items="me.connections"
                            no-data-text="Nenhuma conexão encontrada"
                            hide-default-footer
                        >
                            <template #item.title="{ item }">
                                <p class="font-semibold">{{ item.title }}</p>
                                <p class="text-xs">{{ item.description }}</p>
                            </template>
                            <template #item.account_info="{ item }">
                                <div v-if="!item.account_info" class="text-xs italic text-neutral-500">
                                    Nenhuma conta vinculada
                                </div>
                            </template>
                            <template #item.actions="{ item }">
                                <div class="flex justify-end">
                                    <ButtonDeleteWithConfirmation
                                        @exec-confirmation="execDeleteConnection(item.id)"
                                    />
                                </div>
                            </template>
                        </v-data-table>
                    </div>
                </section>
            </v-card-text>
        </v-card>
    </div>
</template>
<script setup>
import HeaderPage from "~/components/ui-custom/Layout/Admin/Header/HeaderPage.vue";
import ButtonAddConnection from "~/components/MyAccount/Connection/Buttons/ButtonAddConnection.vue";
import ButtonDeleteWithConfirmation from "~/components/ui-custom/Button/ButtonDeleteWithConfirmation.vue";

const { $fetchSupabase } = useNuxtApp()

const { data: me, refresh } = await useAsyncData('me', () => $fetchSupabase('/api/me'))

const DEFAULT_CONNECTIONS_HEADERS = [
    { title: 'Título', key: 'title', value: 'title', },
    { title: 'Tipo', key: 'type', value: 'type', },
    { title: 'Conta', key: 'account_info', value: 'account_info.name', },
    { title: '', key: 'actions'},
]

const loadingDeleteConnection = ref(false)

const execDeleteConnection = async (id) => {
    try {
        loadingDeleteConnection.value = true

        const response = await $fetchSupabase(`/api/connections/${id}/delete`, {method: 'DELETE'})
        if (response.status !== 400) {
            await refresh()
        }
    } catch (e) {

    } finally {
        loadingDeleteConnection.value = false
    }
}

</script>
<style scoped>

</style>
