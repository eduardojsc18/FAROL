<template>
    <tr class="*:px-3 *:py-4">
        <td class="text-sm font-medium dark:text-primary-200">
            <div class="flex gap-3 items-center">
                <LoaderSkeleton class="rounded-lg flex-shrink-0 aspect-square size-16" />
                <div class="space-y-1 flex-grow">
                    <LoaderSkeleton class="w-full h-4 rounded-full" />
                    <LoaderSkeleton class="w-1/3 h-4 rounded-full" />
                </div>
            </div>
        </td>
        <td class="">
            <div class="flex justify-center">
                <LoaderSkeleton class="w-14 h-4 rounded-full" />
            </div>
        </td>
        <td class="">
            <div class="flex justify-center">
                <LoaderSkeleton class="w-12 h-4 rounded-full" />
            </div>
        </td>
        <td class="">
            <div class="flex justify-center">
                <LoaderSkeleton class="w-10 h-4 rounded-full" />
            </div>
        </td>
        <td class="">
            <div class="flex justify-center">
                <LoaderSkeleton class="size-8 rounded-full" />
            </div>
        </td>
    </tr>
</template>
<script setup>
import LoaderSkeleton from "~/components/UI/Loader/LoaderSkeleton.vue";
</script>
