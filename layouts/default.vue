<template>
    <div id="application" class="bg-neutral-50 font-[Nunito]">
        <div class="flex">
            <SidebarContainer>
                <template #header>
                    <Logo :class="{'px-8': !useSidebar().minify}"/>
                </template>
                <SidebarLinkItem to="/admin/dashboard" label="Dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                    </svg>
                </SidebarLinkItem>
                <SidebarLinkItem to="/admin/minha-conta" label="Minha conta">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                        <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
                    </svg>
                </SidebarLinkItem>
<!--                <SidebarLinkItem to="produtos" label="Produtos">-->
<!--                    <IconProduct/>-->
<!--                </SidebarLinkItem>-->
                <!--                <SidebarLinkItem to="estoque" label="Estoque">-->
                <!--                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">-->
                <!--                        <rect width="7" height="7" x="14" y="3" rx="1"/><path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"/>-->
                <!--                    </svg>-->
                <!--                </SidebarLinkItem>-->
<!--                <SidebarLinkItem to="vendas" label="Vendas">-->
<!--                    <IconOrder/>-->
<!--                </SidebarLinkItem>-->
<!--                <SidebarLinkItem to="perguntas" label="Perguntas">-->
<!--                    <IconQuestion/>-->
<!--                </SidebarLinkItem>-->
<!--                <SidebarLinkItem to="vendedores" label="Vendedores">-->
<!--                    <IconSeller/>-->
<!--                </SidebarLinkItem>-->
<!--                <SidebarLinkItem to="pesquisa-de-mercado" label="Pesquisa de Mercado">-->
<!--                    <IconMarketResearch/>-->
<!--                </SidebarLinkItem>-->
                <template #footer>
                    <SidebarLinkItem to="/auth/logout" label="Sair">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                            <path fill-rule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clip-rule="evenodd" />
                        </svg>
                    </SidebarLinkItem>
                </template>
            </SidebarContainer>
            <section class="flex flex-col min-h-screen grow overflow-x-hidden">
                <Header/>
                <main class="z-0 w-full grow mb-10 px-5 pt-7 ">
                    <div class="container mx-auto">
                        <NuxtPage/>
                    </div>
                </main>
                <Notification/>
            </section>
        </div>
    </div>
</template>
<script setup>
import SidebarLinkItem from "~/components/ui-custom/Layout/Admin/Sidebar/SidebarLinkItem.vue";
import SidebarContainer from "~/components/ui-custom/Layout/Admin/Sidebar/SidebarContainer.vue";
import Header from "~/components/ui-custom/Layout/Admin/Header/Header.vue";
import Notification from "~/components/ui-custom/Layout/Admin/Notification/Notification.vue";
import IconDashboard from "~/components/shared/icons/IconDashboard.vue";
import Logo from "~/components/shared/Logo/Logo.vue";
import {useSidebar} from "~/stores/useSidebar.js";
</script>
<style scoped>

</style>
