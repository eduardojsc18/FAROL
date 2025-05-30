<template>
    <header class="z-[9999999999999999] sticky top-0 w-full flex justify-between bg-white shadow-sm items-center px-3 py-2 gap-5 ">
        <SidebarButtonShow class="-translate-x-1" />
        <div class="flex items-center gap-px">
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-list-item
                        active
                        variant="text"
                        color="transparent"
                        v-bind="props"
                        class="!p-2 !pr-6 rounded-xl"
                    >
                        <template #prepend>
                            <div class="bg-white p-1 mr-3 shadow-sm rounded-full">
                                <v-img rounded="full" width="30" height="30" loading="lazy" :src="me.user_metadata.avatar_url" :alt="me.user_metadata.full_name" />
                            </div>
                        </template>
                        <template #default>
                            <p class="font-semibold text-neutral-800">{{ me.user_metadata.full_name }}</p>
                        </template>
                    </v-list-item>
                </template>
                <v-list class="!shadow-md !z-[9999999999999999999999] relative">
                    <NuxtLink to="/admin/minha-conta">
                        <v-list-item>
                            <v-list-item-title>Minha conta</v-list-item-title>
                        </v-list-item>
                    </NuxtLink>
                    <v-list-item @click="signOut">
                        <v-list-item-title>Sair</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </header>
</template>
<script setup>
import SidebarButtonShow from "~/components/UI/Layouts/Admin/Sidebar/Button/SidebarButtonShow.vue";

const supabase = useSupabaseClient()
const router = useRouter()
const { $fetchSupabase } = useNuxtApp()

const { data: me } = await useAsyncData('me', () => $fetchSupabase('/api/me'))

const signOut = async () => {
    try {
        await supabase.auth.signOut()
    } catch (error) {
        console.log(error)
    } finally {
        await router.push('/auth/login')
    }
}
</script>
<style scoped>

</style>
