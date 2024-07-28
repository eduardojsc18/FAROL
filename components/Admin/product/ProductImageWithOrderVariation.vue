<template>
    <div class="flex-shrink-0">
        <img
            v-if="!props.product.variations.length"
            :src="props?.product?.pictures[0].url"
            alt=""
            class="aspect-square size-full rounded-lg object-center object-cover"
        >
        <div v-else class="w-full aspect-square size-full bg-no-repeat bg-center rounded-md overflow-hidden object-contain object-center" :style="`background-image: url(${imageDefault})`">
            <template v-for="variation in props.product.variations">
                <img
                    v-if="variation?.id === props.order.order_items[0].item.variation_id"
                    :src="`http://http2.mlstatic.com/D_${variation.picture_ids[0]}-O.jpg`"
                    alt=""
                    class="aspect-square rounded-lg object-center object-cover size-full"
                >
            </template>
        </div>
    </div>
</template>
<script setup>
import imageDefault from "assets/img/default-image.png";

const props = defineProps({
    product: {type: Object},
    order: {type: Object},
})
</script>
<style scoped>

</style>
