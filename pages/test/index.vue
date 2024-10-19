<template>
<pre>{{ data }}</pre>
</template>
<script setup>
definePageMeta({layout: false})

const data = await $fetch('/api/meli/test')
</script>
<style scoped>

</style>
