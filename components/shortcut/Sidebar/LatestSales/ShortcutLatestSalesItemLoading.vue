<template>
    <div class="rounded-lg group relative overflow-hidden text-red-500 min-w-28 w-28 !flex flex-col">
        <LoaderSkeleton class="!size-full aspect-square !bg-neutral-500 !rounded-xl"/>
        <LoaderSkeleton class="max-w-full mt-1 h-6 rounded-full !bg-neutral-600"/>
        <div class="flex mt-1 gap-1">
            <LoaderSkeleton class="w-12 block h-3 rounded-full !bg-neutral-600"/>
            <LoaderSkeleton class="w-7 block h-3 rounded-full !bg-neutral-600"/>
        </div>
    </div>
</template>
<script setup>
import LoaderSkeleton from "~/components/ui-custom/Loader/LoaderSkeleton.vue";
</script>
