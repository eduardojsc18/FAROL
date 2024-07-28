<template>
    <div id="application">
        <div class="flex relative trans">
            <SidebarContainer>
                <template #header>
                    <MyAccount />
                </template>
                <template #footer>
                    <ShortcutLatestSales />
                    <!--                    <ShortcutMarketResearch />-->
                </template>
                <SidebarLinkItem to="dashboard" label="Dashboard">
                    <IconDashboard />
                </SidebarLinkItem>
                <SidebarLinkItem to="produto" label="Produtos">
                    <IconProduct />
                </SidebarLinkItem>
<!--                <SidebarLinkItem to="estoque" label="Estoque">-->
<!--                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">-->
<!--                        <rect width="7" height="7" x="14" y="3" rx="1"/><path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"/>-->
<!--                    </svg>-->
<!--                </SidebarLinkItem>-->
                <SidebarLinkItem to="venda" label="Vendas">
                    <IconOrder />
                </SidebarLinkItem>
                <SidebarLinkItem to="pergunta" label="Perguntas">
                    <IconQuestion />
                </SidebarLinkItem>
                <SidebarLinkItem to="vendedores" label="Vendedores">
                    <IconSeller />
                </SidebarLinkItem>
                <SidebarLinkItem to="pesquisa-de-mercado" label="Pesquisa de Mercado">
                    <IconMarketResearch />
                </SidebarLinkItem>
            </SidebarContainer>
            <section class="flex flex-col min-h-screen w-full overflow-x-hidden ">
                <Header />
                <main class="z-0 w-full grow mb-10 px-5 pt-7 ">
                    <div class="xl:container xl:mx-auto">
                        <NuxtPage />
                    </div>
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
import IconDashboard from "~/components/Admin/shared/icons/IconDashboard.vue";
import IconProduct from "~/components/Admin/shared/icons/IconProduct.vue";
import IconOrder from "~/components/Admin/shared/icons/IconOrder.vue";
import IconQuestion from "~/components/Admin/shared/icons/IconQuestion.vue";
import IconSeller from "~/components/Admin/shared/icons/IconSeller.vue";
import IconMarketResearch from "~/components/Admin/shared/icons/IconMarketResearch.vue";

</script>
<style scoped>

</style>
