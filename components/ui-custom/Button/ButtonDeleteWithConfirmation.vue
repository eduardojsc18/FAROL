<template>
    <v-dialog max-width="500" v-model="showDialog" z-index="100000000000">
        <template #activator="{ props: activatorProps }">
            <v-btn icon="mdi-trash-can" variant="text" rounded="100%" color="red" size="small" v-bind="activatorProps"></v-btn>
        </template>
        <v-card title="Deseja realmente excluir?">
            <v-card-text>
                Esta ação não pode ser desfeita
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    text="Cancelar"
                    density="compact"
                    variant="text"
                    color="gray"
                    @click="isActive.value = false"
                />
                <v-btn
                    text="Confirmar"
                    density="compact"
                    variant="flat"
                    :loading="props.loading"
                    @click="execEmit"
                />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
const emits = defineEmits(['execConfirmation'])

const props = defineProps({
    loading: Boolean,
})

const showDialog = defineModel('showDialog')

const execEmit = () => {
    emits('execConfirmation')
    showDialog.value = false
}
</script>
<style scoped>

</style>
