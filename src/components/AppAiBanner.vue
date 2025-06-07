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
                <div class="style_items">
                    <div 
                        v-for="(item, index) in icons"
                        :key="index"
                        class="style_item_wrapper"
                        :class="{ active: active_style == index }"
                        :style="{ padding: active_style == index ? '10px' : '10px 0px' }"
                        @click="selectStyle(index)"
                    >
                        <div class="style_item">
                            <img :src="require(`@/assets/images/${item.src}`)"  />
                        </div>
                        <span>{{ item.name }}</span>
                    </div>
                </div>
            </div>
            <div class="color">
                <h2>Цвет</h2>
                <div class="colors">
                    <div 
                        class="colors_item"
                        v-for="(item, index) in colors_choices"
                        :key="index"
                        :style="{ background: index == selectedColors ? '#2F3251' : 'none'}"
                        @click="selectColors(index)"
                    >
                        <span class="colors_item_name">{{ item.name }}</span>
                        <div class="colors_item_square_wrapper">
                            <div 
                                class="colors_item_square"
                                v-for="(color, index2) in item.colors"
                                :key="index2"
                                :style="{ background: color }"
                            ></div>
                        </div>
                        <img 
                            src="@/assets/images/ok.png" 
                            class="ok" 
                            v-if="index == selectedColors"
                        />
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
                icons: [
                    {
                        name: "Автоматический",
                        src: "default.png"
                    },
                    {
                        name: "Случайный",
                        src: "random.png"
                    }, 
                    {
                        name: "Общий",
                        src: "free.png"
                    },
                    {
                        name: "Реализм",
                        src: "realism.png"
                    },
                    {
                        name: "Дизайн",
                        src: "design.png"
                    }
                ],
                active_style: 0,

                colors_choices: [
                    {
                        name: "Авто",
                        colors: []
                    },
                    {
                        name: "Жаркие",
                        colors: ["#CF064F", "#303440", "#D95953", "#B90656"]
                    },
                    {
                        name: "Свежие",
                        colors: ["#F0C073", "#F17356", "#2056F3", "#89EF97"]
                    },
                    {
                        name: "Тропические",
                        colors: ["#013F35", "#018B64", "#02573A", "#038A3C"]
                    },
                    {
                        name: "Волшебные",
                        colors: ["#E2B3D0", "#ACA5CE", "#2579A9", "#2F219D"]
                    },
                    {
                        name: "Дынные",
                        colors: ["#F04C54", "#25518D", "#F2AE32", "#F17B33"]
                    },
                    {
                        name: "Мозайка",
                        colors: ["#F24B56", "#48D902", "#A9DA19", "#F6AFA0"]
                    },
                    {
                        name: "Пастельные",
                        colors: ["#F2B5BD", "#AFE5E5", "#F8E7C9", "#BEF7C9"]
                    },
                    {
                        name: "Ультрамарин",
                        colors: ["#050930", "#001261", "#0425F6", "#93C1E6"]
                    }
                ],
                selectedColors: 0
            }
        },
        methods: {
            selectColors(index) {
                this.selectedColors = index;
            },
            selectStyle(index) {
                this.active_style = index;
            }
        }
    };
</script>

<style scoped>
    .banner {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 30px;
    }
    h1 {
        font-size: 32px;
        font-family: 'OpenSans';
        color: white;
    }
    .descr {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        position: relative;
    }
    .counter {
        position: absolute;
        right: 0;
        top: -30px;
        font-size: 14px;
        color: white;
        opacity: .5;
        font-family: 'OpenSans';
    }
    textarea {
        width: 100%;
        height: 270px;
        padding: 20px;
        box-sizing: border-box;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.5);
        background: none;
        border: 1px solid white;
        border-radius: 10px;
        font-family: 'OpenSans';
        position: relative;
        margin-top: 8px;
    }
    .tools {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .style {
        max-width: 430px;
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .style_items {
        display: flex;
        flex-wrap: wrap;
        row-gap: 10px;
        column-gap: 20px;
    }
    h2 {
        font-size: 20px;
        color: white;
        font-family: 'OpenSans';
    }
    .style_item_wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 10px;
        border-radius: 10px;
        transition: .2s ease-out;
    }
    .style_item_wrapper span {
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
    }
    .style_item {
        width: 120px;
        height: 70px;
        border: 1px solid white;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .style_item img {
        width: 25px;
        height: 25px;
    }
    .active {
        background: linear-gradient(to right, #A139DE, #E14ABB, #E14A7A);
    }

    .color {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    .colors {
        display: flex;
        flex-direction: column;
        padding: 19px 15px;
        background: #111433;
        border-radius: 10px;
        max-width: 340px;
    }
    .colors_item {
        padding: 6px 10px;
        display: grid;
        grid-template-columns: 3fr 4fr 1fr;
        cursor: pointer;
        align-items: center;
        border-radius: 10px;
        min-height: 31px;
    }
    .colors_item_name {
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
    }
    .colors_item_square_wrapper {
        display: flex;
        column-gap: 10px;
    }
    .colors_item_square {
        width: 30px;
        height: 30px;
        border-radius: 5px;
    }
    .ok {
        width: 18px;
        height: 12px;
        justify-self: end;
    }
</style>