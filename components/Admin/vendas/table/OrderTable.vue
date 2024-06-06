<template>
    <div class="flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table class="min-w-full divide-y divide-gray-700">
                    <thead>
                    <tr class="dark:text-primary-50">
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold">Name</th>
                        <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold">Valor</th>
                        <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold">Quantidade</th>
                        <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold">Tipo</th>
                        <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold">Transporte</th>
                    </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-800">
                    <slot  />
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script setup>
</script>
