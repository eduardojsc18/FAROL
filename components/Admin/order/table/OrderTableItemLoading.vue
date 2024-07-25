<template>
    <div class="md:table-row max-sm:grid grid-cols-4 w-full *:px-3 *:py-4">
        <div class="md:table-cell align-middle max-sm:col-span-full">
            <div class="flex gap-3 items-center">
                <LoaderSkeleton class="rounded-lg flex-shrink-0 aspect-square size-16" />
                <div class="space-y-1 flex-grow">
                    <LoaderSkeleton class="w-full h-4 rounded-full" />
                    <LoaderSkeleton class="w-1/3 h-4 rounded-full" />
                </div>
            </div>
        </div>
        <div class="md:table-cell align-middle">
            <div class="flex justify-center">
                <LoaderSkeleton class="w-14 h-4 rounded-full" />
            </div>
        </div>
        <div class="md:table-cell align-middle">
            <div class="flex justify-center">
                <LoaderSkeleton class="w-12 h-4 rounded-full" />
            </div>
        </div>
        <div class="md:table-cell align-middle">
            <div class="flex justify-center">
                <LoaderSkeleton class="w-10 h-4 rounded-full" />
            </div>
        </div>
        <div class="md:table-cell align-middle">
            <div class="flex justify-center">
                <LoaderSkeleton class="size-8 rounded-full" />
            </div>
        </div>
    </div>
</template>
<script setup>
import LoaderSkeleton from "~/components/UI/Loader/LoaderSkeleton.vue";
</script>
