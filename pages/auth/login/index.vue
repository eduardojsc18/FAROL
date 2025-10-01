<template>
    <div class="min-h-screen w-full flex flex-col gap-5 bg-neutral-50 items-center py-10">
        <div class="grow flex flex-col justify-center w-full max-w-sm">
            <NuxtLink to="/">
                <v-btn size="small" class="mb-1 !px-2 !font-thin !py-0 h-6 hover:!bg-transparent" density="compact" variant="text" prepend-icon="mdi-arrow-left" v-bind="$attrs">
                    Voltar para o inicio
                </v-btn>
            </NuxtLink>
            <div class="rounded-sm w-full bg-white/75  backdrop-blur">
                <div class="px-4 py-5 sm:p-6">
                    <div class="">
                        <Logo class="!scale-75 origin-left" />
                    </div>

                    <div class="my-5">
                        <p class="text-lg text-neutral-700">Entrar com suas credenciais</p>
                        <p class="text-sm font-thin text-neutral-500">digite seu email e senha cadastrada</p>
                    </div>

                    <v-form>
                        <v-text-field
                            label="Email"
                            disabled
                            placeholder="Digite seu email"
                        />
                        <v-text-field
                            label="Senha"
                            disabled
                            placeholder="Digite sua senha"
                        />
                        <div class="flex justify-between gap-3">
                            <v-btn variant="text" color="gray" density="compact" size="small" class="text-neutral-500 !normal-case font-thin !py-0 px-2">
                                Não tenho conta ainda
                            </v-btn>
                            <v-btn append-icon="mdi-arrow-right">
                                 Entrar
                             </v-btn>
                        </div>
                    </v-form>
                </div>
                <div class="flex gap-5 items-center px-5">
                    <div class="h-px grow bg-neutral-200" />
                    <span class="text-neutral-700 font-thin">ou</span>
                    <div class="h-px grow bg-neutral-200" />
                </div>

                <div class="px-4 py-5 sm:p-6">
                    <div class="mb-5">
                        <p class="text-lg text-neutral-700">Entre com sua conta</p>
                        <p class="text-sm font-thin text-neutral-500">escolha com qual conta deseja entrar</p>
                    </div>
                    <div class="flex gap-1">
                        <v-btn
                                @click.prevent="signInWithGoogle"
                                variant="text"
                                density="comfortable"
                                size="x-large"
                                color="grey-darken-4"
                                icon
                                v-tooltip:top="'Entrar com GOOGLE'"
                        >
                            <svg class="size-5" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/></svg>
                        </v-btn>
                        <v-btn
                            @click.prevent="signInWithGithub"
                            icon="mdi-github"
                            variant="text"
                            density="comfortable"
                            size="x-large"
                            color="grey-darken-4"
                            v-tooltip:top="'Entrar com GITHUB'"
                        />
                        <v-btn
                            @click.prevent="signInWithGithub"
                            icon="mdi-facebook"
                            variant="text"
                            density="comfortable"
                            size="x-large"
                            color="blue-darken-4"
                            v-tooltip:top="'Em breve'"
                            disabled
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Logo from "~/components/shared/Logo/Logo.vue";

useSeoMeta({
    title: 'LOGIN - Entrar na sua conta'
})

definePageMeta({
    layout: 'auth',
})

const config = useRuntimeConfig()

const supabase = useSupabaseClient()
const session = useSupabaseSession()

if (!!session.value) {
    navigateTo('/auth/confirmation')
}

const form = ref({})



const signInWithGithub = async () => {
    return await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${config.public.siteUrl}/auth/confirmation`,
        },
    })
}

const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${config.public.siteUrl}/auth/confirmation`,
        },
    })
}
</script>
