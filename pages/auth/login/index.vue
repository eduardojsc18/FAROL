<template>
    <div class="h-screen flex flex-col gap-5 items-center justify-center">
        <NuxtLink to="/">
            <v-btn rounded="xl" variant="text" prepend-icon="mdi-home" class="rounded-full flex items-center  hover:bg-orange-500 hover:text-white" v-bind="$attrs">
                Voltar para o inicio
            </v-btn>
        </NuxtLink>
        <div class="flex-shrink-0 max-w-sm w-full">
            <div class="rounded-xl divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white/75 dark:bg-white/5 backdrop-blur">
                <div class="px-4 py-5 sm:p-6">
                    <form @submit.prevent="execLogin()">
                        <v-text-field
                            v-model="form.phone"
                            placeholder="phone"
                        />
                        <div class="flex justify-end">
                             <v-btn type="submit">Entrar</v-btn>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
useSeoMeta({
    title: 'LOGIN - Entrar na sua conta'
})

const supabase = useSupabaseClient()
const form = ref({})

const execLogin = async () => {
    const data = form.value

    const { data: response, error } = await supabase.auth.signInWithOtp(data)

    console.log(response)

}
</script>
