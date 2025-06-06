<template>
    <section class="banner">
        <h1>Создайте уникальный баннер c Intelektaz</h1>
        <div class="descr">
            <span class="counter">{{ descr.length }}/2000</span>
            <textarea 
                v-model="descr"
                type="text"
                placeholder="Подробно опишите детали сюжета"
                maxlength="2000"
            ></textarea>
        </div>
        <div class="tools">
            <div class="style">
                <h2>Стиль</h2>
                <div 
                    v-for="(item, index) in icons"
                    :key="index"
                    class="style_item"
                    :class="{ active: active_style == index }"
                >
                    <img :src="require(`@/assets/images/${item}`)"  />
                </div>
            </div>
            <div class="color">
                <h2>Цвет</h2>
                <div class="colors">
                    <div 
                        class="colors_item"
                    >

                    </div>
                </div>
            </div>

        </div>
        
    </section>
</template>

<script>
    export default {
        data() {
            return {
                descr: "",
                icons: ["default.png", "random.png", "free.png", "realism.png", "design.png"],
                active_style: 0,
                colors_choices: [
                    {
                        name: "auto",
                        colors: []
                    },
                    {
                        name: "Жаркие",
                        colors: ["#CF064F", "#303440"]
                    }
                ]
            }
        }
    };
</script>

<style scoped>

</style>