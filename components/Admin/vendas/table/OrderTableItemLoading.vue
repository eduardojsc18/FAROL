<template>
    <tr>
        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-primary-200 sm:pl-0">
            <div class="flex gap-2 items-center">
                <LoaderSkeleton class="aspect-square min-w-28 rounded-lg object-center object-cover w-28 h-28" />
                <LoaderSkeleton class="w-full h-4 rounded-full" />
            </div>
        </td>
        <td class="whitespace-nowrap px-3 py-4 text-sm text-center dark:text-gray-300">
            <LoaderSkeleton class="w-14 h-4 rounded-full" />
        </td>
        <td class="whitespace-nowrap px-3 py-4 text-sm text-center dark:text-gray-300">
            <LoaderSkeleton class="w-12 h-4 rounded-full" />
        </td>
        <td class="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-300">
            <LoaderSkeleton class="w-10 h-4 rounded-full" />
        </td>
        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-0">
            <div class="flex justify-center">
                <LoaderSkeleton class="size-8 rounded-full" />
            </div>
        </td>
    </tr>
</template>
<script setup>
import LoaderSkeleton from "~/components/UI/Loader/LoaderSkeleton.vue";
</script>
