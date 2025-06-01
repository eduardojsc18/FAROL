<template>
    <v-card :loading="loading" variant="tonal" color="primary">
        <v-card-title>
            <v-skeleton-loader v-if="loading" width="100%" height="30px"/>
            <div v-else>
                <p class="text-2xl font-satoshi-bold">{{value}}</p>
                <p v-if="subvalue" class="text-sm">{{ subvalue }}</p>
            </div>
        </v-card-title>
        <v-card-text>
            <v-skeleton-loader v-if="loading" width="100%" height="12px"/>
            <v-skeleton-loader v-if="loading" width="100%" height="9px"/>
            <template v-else>
                <p>{{ label }}</p>
                <small v-if="subtitle" class="text-[10px] italic font-gray-300">{{ subtitle }}</small>
            </template>
        </v-card-text>
    </v-card>
</template>
<script setup>
defineProps({
    loading: { type: Boolean, default: false },
    value: { type: [String,Number], required: true },
    subvalue: { type: [String,Number] },
    label: { type: String },
    subtitle: { type: String },
})
</script>
<style scoped>

</style>
