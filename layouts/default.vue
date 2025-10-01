<template>
    <div id="application" class="bg-[#FEF9F2] font-['Nunito']">
        <div class="flex">
            <SidebarContainer>
                <template #header>
                    <div class="flex justify-start">
                        <div class="flex items-center justify-start gap-2 bg-[#FE7C01]">
                            <Logo />
                            <div v-if="!useSidebarStore.minify" class="text-orange-50 font-semibold text-lg pr-3">
                                FAROL
                            </div>
                        </div>
                    </div>
                </template>
                <SidebarLinkItem to="/admin/dashboard" label="Dashboard">
                    <IconDashboard />
                </SidebarLinkItem>
                <SidebarLinkItem to="/admin/vendas" label="Vendas">
                    <IconOrder />
                </SidebarLinkItem>
                <SidebarLinkItem to="/admin/produtos" label="Produtos">
                    <IconProduct />
                </SidebarLinkItem>
                <!--                <SidebarLinkItem to="estoque" label="Estoque">-->
                <!--                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">-->
                <!--                        <rect width="7" height="7" x="14" y="3" rx="1"/><path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"/>-->
                <!--                    </svg>-->
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
            <section class="z-0 flex flex-col min-h-screen flex-1 min-w-0 bg-[#FEF9F2] md:w-auto w-0">
                <TheHeader class="w-full"/>
                <main class="flex-1 w-full px-2 md:px-5 pt-7 lg:border lg:rounded-tl-md bg-white pb-10">
                    <div class="3xl:container mx-auto w-full">
                        <!-- Container responsivo para o conteúdo -->
                        <div class="w-full min-w-0 max-w-full *:space-y-10">
                            <NuxtPage/>
                        </div>
                    </div>
                </main>
                <Notification/>
            </section>
        </div>
    </div>
</template>
<script setup>
import SidebarLinkItem from "~/components/UI/Layouts/Admin/Sidebar/SidebarLinkItem.vue";
import SidebarContainer from "~/components/UI/Layouts/Admin/Sidebar/SidebarContainer.vue";
import TheHeader from "~/components/UI/Layouts/Admin/Header/TheHeader.vue";
import Notification from "~/components/UI/Layouts/Admin/Notification/Notification.vue";
import Logo from "~/components/shared/Logo/Logo.vue";
import { useSidebar } from "~/stores/useSidebar.js";
import IconOrder from "~/components/UI/Icons/IconOrder.vue";
import IconProduct from "~/components/UI/Icons/IconProduct.vue";
import IconDashboard from "~/components/UI/Icons/IconDashboard.vue";

const useSidebarStore = useSidebar();

</script>
<style scoped>

</style>
