<template>
    <header class="z-[9999] max-md:sticky relative max-md:top-0 bg-orange-50 dark:bg-neutral-800 flex justify-between items-center p-3 md:p-4 gap-5 ">
        <SidebarButtonShow class="md:invisible" />
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
