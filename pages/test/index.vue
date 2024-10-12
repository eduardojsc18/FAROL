<template>
<pre>{{ data }}</pre>
</template>
<script setup>
definePageMeta({layout: false})

const data = await $fetch('/api/meli/token/test')
</script>
<style scoped>

</style>
