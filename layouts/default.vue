<template>
    <div id="application">
        <Header />
        <div class="flex relative">
            <SidebarContainer>
                <template #header>
                    <MyAccount />
                </template>
                <template #footer>
                    <ShortcutLatestSales />
<!--                    <ShortcutMarketResearch />-->
                </template>
                <SidebarLinkItem to="dashboard" label="Dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>
                    </svg>
                </SidebarLinkItem>
                <SidebarLinkItem to="produto" label="Produtos">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/><circle cx="18.5" cy="15.5" r="2.5"/><path d="M20.27 17.27 22 19"/>
                    </svg>
                </SidebarLinkItem>
                <SidebarLinkItem to="estoque" label="Estoque">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="7" height="7" x="14" y="3" rx="1"/><path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"/>
                    </svg>
                </SidebarLinkItem>
                <SidebarLinkItem to="venda" label="Vendas">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/>
                    </svg>
                </SidebarLinkItem>
                <SidebarLinkItem to="vendedores" label="Vendedores">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                </SidebarLinkItem>
                <SidebarLinkItem to="pesquisa-de-mercado" label="Pesquisa de Mercado">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                    </svg>
                </SidebarLinkItem>
            </SidebarContainer>
            <section class="flex flex-col min-h-screen w-full overflow-x-hidden xl:container xl:mx-auto px-5 pt-7 ">
                <main class="z-0 w-full grow space-y-5 pb-20">
                    <NuxtPage />
                </main>
                <Notification />
            </section>
        </div>
    </div>
</template>
<script setup>
import SidebarLinkItem from "~/components/UI/Layout/Admin/Sidebar/SidebarLinkItem.vue";
import SidebarContainer from "~/components/UI/Layout/Admin/Sidebar/SidebarContainer.vue";
import Header from "~/components/UI/Layout/Admin/Header/Header.vue";
import Notification from "~/components/UI/Layout/Admin/Notification/Notification.vue";
import MyAccount from "~/components/UI/Layout/Admin/Sidebar/MyAccount.vue";
import ShortcutLatestSales from "~/components/Admin/shortcut/Sidebar/LatestSales/ShortcutLatestSales.vue";
import ShortcutMarketResearch from "~/components/Admin/shortcut/Sidebar/ShortcutMarketResearch.vue";
import { useSidebar } from "~/stores/useSidebar.js";

</script>
<style scoped>

</style>
