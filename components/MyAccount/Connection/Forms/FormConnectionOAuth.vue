<template>
    <v-card-text class="space-y-1">
        <ButtonOAuth v-model="form" />
    </v-card-text>
</template>
<script setup>
import ButtonOAuth from "~/components/MyAccount/Connection/Buttons/ButtonOAuth.vue";

const form = defineModel('modelValue')
</script>
<style scoped>

</style>
