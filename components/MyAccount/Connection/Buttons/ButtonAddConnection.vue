<template>
    <v-dialog scrollable v-model="showDialog" @update:model-value="closeDialog" max-width="500" :z-index="10000000">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" variant="tonal" prepend-icon="mdi-plus" density="compact" color="orange" class="rounded-md cursor-pointer">
                Nova conexão
            </v-btn>
        </template>
        <v-card class="rounded-sm">
            <v-card-title class="flex justify-between">
                <p class="font-normal">Nova conexão</p>
                <v-btn @click="closeDialog(false)" icon="mdi-close" variant="text" color="grey-lighten-1" rounded="full" size="small"/>
            </v-card-title>
            <v-divider opacity="50"/>
            <v-window v-model="step">
                <v-window-item :value="1">
                    <v-card-text>
                        <p class="text-xl text-neutral-700">Primeiro identifique a conexão</p>
                        <p class="text-sm text-neutral-400">preencha os campos abaixo para personalizar essa conexão</p>
                    </v-card-text>
                    <FormConnectionData v-model="form" />
                </v-window-item>
                <v-window-item :value="2">
                    <v-card-text>
                        <p class="text-xl text-neutral-700">Agora, vamos estabelecer a conexão</p>
                        <p class="text-sm text-neutral-400">clique no botão abaixo e autorize o acesso</p>
                    </v-card-text>
                    <FormConnectionOAuth v-model="form" />
                </v-window-item>
                <v-window-item :value="3">
                    <v-card-text class="px-6 space-y-1">
                        <v-img
                            class="mb-4"
                            height="128"
                            src="https://cdn.vuetifyjs.com/images/logos/v.svg"
                        />
                        <h3 class="text-h6 font-weight-light mb-2">
                            Welcome to Vuetify
                        </h3>
                        <span class="text-caption text-grey">Thanks for signing up!</span>
                    </v-card-text>
                </v-window-item>
            </v-window>
            <v-divider opacity="50" />
            <v-card-actions>
                <v-spacer />
                <v-btn
                    color="orange"
                    class="text-white px-5"
                    variant="flat"
                    @click="execCreateConnection"
                    append-icon="mdi-arrow-right"
                >
                    Salvar conexão
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
import FormConnectionData from "~/components/MyAccount/Connection/Forms/FormConnectionData.vue";
import FormConnectionOAuth from "~/components/MyAccount/Connection/Forms/FormConnectionOAuth.vue";
import {useFetchSupabase} from "~/composables/useFetchSupabase.js";
const { $fetchSupabase } = useNuxtApp()

const showDialog = ref(false)
const step = ref(1)
const form = ref({
    type: 'meli'
})
const loading = ref(false)

const execCreateConnection = async () => {
    try {
        const payload = {...form.value}
        const response = await $fetchSupabase('/api/connections/create', {
            method: 'POST',
            body: payload,
        })
    } catch (e) {

    } finally {

    }
}
const execSaveConnection = async () => {

}
const closeDialog = (item) => {
    if(!!item) {
        return
    }

    form.value = {}
    loading.value = false
    showDialog.value = false
    step.value = 1
}
</script>
<style scoped>

</style>
