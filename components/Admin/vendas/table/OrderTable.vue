<template>
    <div class="flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto overflow-y-visible">
            <div class="inline-block min-w-full py-2 align-middle px-1">
                <table class="min-w-full">
                    <thead class="min-w-full ">
                    <tr class="*:px-3 *:py-3.5 dark:text-primary-50 *:bg-orange-700 font-semibold">
                        <th scope="col" class="rounded-l-xl w-[500px] min-w-[500px] text-left text-sm">Produto</th>
                        <th scope="col" class="text-center text-sm">Valor</th>
                        <th scope="col" class="text-center text-sm">Quantidade</th>
                        <th scope="col" class="text-center text-sm">Tipo</th>
                        <th scope="col" class="rounded-r-xl text-center text-sm">Transporte</th>
                    </tr>
                    </thead>
                    <tbody class="divide-y divide-orange-500/10">
                    <slot  />
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script setup>
</script>
