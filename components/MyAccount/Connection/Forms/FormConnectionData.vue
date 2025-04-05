<template>
    <v-card-text class="space-y-1">
        <v-text-field
            v-model="form.title"
            required
            label="Apelido"
            placeholder="Exemplo: Conta Principal"
        />
        <v-text-field
            v-model="form.description"
            label="Descrição"
            placeholder="Descreva essa conexão caso necessário"
        />
    </v-card-text>
</template>
<script setup>
const form = defineModel('modelValue')


</script>
<style scoped>

</style>
