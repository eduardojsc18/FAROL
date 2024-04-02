<template>
    <header class="max-md:sticky relative max-md:top-0 max-md:bg-[#fffbf6] dark:max-md:bg-[#18181920] max-md:backdrop-blur flex justify-between items-center py-2.5 gap-2 lg:gap-5 px-3">
        <SidebarButtonShow />
        <InputSearchAll />
        <div class="flex items-center gap-px">
            <ButtonDarkModeToggle />
            <NotificationButtonShow />
        </div>
    </header>
</template>
<script setup>
import SidebarButtonShow from "~/components/UI/Layout/Admin/Sidebar/Button/SidebarButtonShow.vue";
import NotificationButtonShow from "~/components/UI/Layout/Admin/Notification/Button/NotificationButtonShow.vue";
import InputSearchAll from "~/components/Admin/shared/InputSearchAll/InputSearchAll.vue";
import ButtonDarkModeToggle from "~/components/UI/Button/ButtonDarkModeToggle.vue";

//Props

//Emits

//Variables

//Watch

//Computed

//Methods

</script>
<style scoped>

</style>
