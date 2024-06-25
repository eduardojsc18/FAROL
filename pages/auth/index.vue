<template>
    <form @submit.prevent="execLogin" class="space-y-5">
        <section class="space-y-1">
            <label for="login" class="ml-3 font-medium text-sm text-neutral-300">Login</label>
            <label
                for="login"
                class="focus-within-default text-white flex items-center gap-2 p-3 rounded-md bg-neutral-500/10 backdrop-blur"
                :class="{'ring-red-500': !!error.login}"
            >
                <input
                    type="search"
                    v-model="form.login"
                    required
                    id="login"
                    placeholder="Login"
                    class="peer w-full p-0 m-0 text-sm bg-transparent placeholder-neutral-400 outline-none"
                >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 order-first text-neutral-400 peer-focus-within:text-neutral-200 peer-valid:text-neutral-200">
                    <path fill-rule="evenodd" d="M5.404 14.596A6.5 6.5 0 1 1 16.5 10a1.25 1.25 0 0 1-2.5 0 4 4 0 1 0-.571 2.06A2.75 2.75 0 0 0 18 10a8 8 0 1 0-2.343 5.657.75.75 0 0 0-1.06-1.06 6.5 6.5 0 0 1-9.193 0ZM10 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" clip-rule="evenodd" />
                </svg>
            </label>
            <div v-if="!!error.login" class="">
                <label for="login" class="text-xs leading-tight text-red-500">login não encontrado</label>
            </div>
        </section>
        <section class="space-y-1">
            <label for="password" class="ml-3 font-medium text-sm text-neutral-300">Senha</label>
            <label
                for="password"
                class="focus-within-default text-white flex items-center gap-2 p-3 rounded-md bg-neutral-500/10 backdrop-blur"
                :class="{'ring-red-500': !!error.password}"
            >
                <input
                    :type="!showPassword ? 'password' : 'text'"
                    v-model="form.password"
                    required
                    id="password"
                    placeholder="Senha"
                    class="peer w-full p-0 m-0 text-sm bg-transparent placeholder-neutral-400 outline-none"
                >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="flex-shrink-0 size-5 order-first text-neutral-400 peer-focus-within:text-neutral-200 peer-valid:text-neutral-200">
                    <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clip-rule="evenodd" />
                </svg>
                <button v-if="form.password" type="button" class="flex-shrink-0" @click="showPassword = !showPassword" :data-tooltip="!showPassword ? 'Mostrar' : 'Ocultar'">
                    <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                        <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                        <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                        <path fill-rule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z" clip-rule="evenodd" />
                        <path d="m10.748 13.93 2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
                    </svg>
                </button>
            </label>
            <div v-if="!!error.password" class="">
                <label for="login" class="text-xs leading-tight text-red-500">senha inválida</label>
            </div>
        </section>
        <section>
            <button type="submit" class="bg-orange-500 hover:bg-orange-600 hover:shadow-md active:scale-[0.99] rounded-2xl text-white p-3 w-full relative flex justify-center items-center font-bold transition-all ease-in-out">
                <span class="drop-shadow text-sm">Entrar</span>
                <span class="absolute right-3">
                    <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h4.59l-2.1 1.95a.75.75 0 0 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 1 0-1.02 1.1l2.1 1.95H6.75Z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5 animate-spin">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                </span>
            </button>
        </section>
    </form>
</template>
<script setup>
definePageMeta({layout: 'auth'})

const form = ref({login: '', password: ''})
const showPassword = ref(false)

const response = ref({})
const error = ref({})
const loading = ref(false)

async function execLogin() {

    let body = {...form.value}

    const {data, pending} = await useFetch('/api/auth', {
        method: "POST",
        body: body,
        onResponseError(context) {
            error.value = context.response._data.data
        },
        onResponse(context) {
            error.value = {}
        },
    })
    loading.value = pending.value


    if (!Object.keys(error.value).length) {
        const cookie = useCookie('auth', { secure: true })
        cookie.value = data.value
        navigateTo('dashboard')
    }



}

</script>
