<template>
    <section 
        class="add_container"
        :style="{ 
            flexDirection: orientation === 'vertical' ? 'column' : 'row'
         }"
    >
        <div 
            class="img_wrapper"
            :style="{
                gridTemplateColumns: orientation === 'vertical' ? '1fr' : `repeat(${data.length}, 1fr)`
            }"
        >
            <img 
                v-for="(item, index) in data"
                :key="index"
                :src="require(`@/assets/images/${item.img}`)"
            >
        </div>
        <div 
            class="text_wrapper"
            :style="{
                flexDirection: orientation === 'vertical' ? 'row' : 'column'
            }"
        >
            <div class="add">
                <img src="@/assets/images/add.png">
                <h2>Реклама</h2>
            </div>
            <AppGoodButton :text="text1" />
        </div>
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue"
    export default {
        components: { AppGoodButton },
        props: {
            orientation: String,
            data: Array
        },
        data() {
            return {
                text1: "ЗАКАЗАТЬ"
            }
        }
    };
</script>

<style scoped>
    .add_container {
        display: flex;
        row-gap: 20px;
        column-gap: 20px;
        width: 100%;
        padding: 10px;
    }
    .img_wrapper {
        display: grid;
        column-gap: 10px;
        row-gap: 10px;
    }
    .img_wrapper img {
        width: 100%;
        object-fit: cover;
        object-position: center;
    }
    .add {
        display: flex;
    }
    .text_wrapper {
        display: flex;
        align-items: center;
        column-gap: 22px;
        row-gap: 10px;
    }
</style>