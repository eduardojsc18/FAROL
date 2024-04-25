<template>
    <div class="animate-pulse bg-primary-100 overflow-hidden rounded-full relative loader-skeleton" v-bind="{...$attrs}" >
        <slot />
    </div>
</template>
<script>
export default{
    name: "LoaderSkeleton",
}
</script>
<style scoped>
.loader-skeleton:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(110deg, transparent, transparent, transparent, transparent, #6b6a6a,  transparent, transparent, transparent, transparent);
    animation: gradient-animation_2 1000ms linear infinite;
}
@keyframes gradient-animation_2 {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100%);
    }
}
</style>
