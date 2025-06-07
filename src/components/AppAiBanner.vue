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
                <h2 class="aspect_title">Соотношение сторон</h2>
                <div class="aspect_wrapper">
                    <div class="aspect_wrapper_left">
                        <div 
                            class="aspect_rect"
                            :style="{ aspectRatio: aspects_choices[selectedAspect] == '1:1 (квадратная)' ? '1/1' : currAspect }"
                        >
                            <span>{{ aspects_choices[selectedAspect] }}</span>
                        </div>
                        <input type="range" class="custom-range custom-range-big" v-model.number="imgWidth" min="300" max="2000" step="1" @change="captureState" />
                        <span class="sm_txt">Ширина: <span style="opacity: .7;">{{ imgWidth + ' ' }}px</span></span>
                        <span class="sm_txt">Высота: <span style="opacity: .7;">{{ computedHeight + ' ' }}px</span></span>
                    </div>
                    <div class="aspect_wrapper_right">
                        <div class="asp_wr_cols">
                            <div class="aspect_wrapper_right_col">
                                <div class="aspect_wrapper_right_col_item">
                                    <div class="rect_figure_vert"></div>
                                    <span>портретная</span>
                                </div>
                                <div 
                                    class="aspect_wrapper_right_col_item"
                                    v-for="(item, index) in aspects_choices.slice(0, 7)"
                                    :key="index"
                                    :style="{ background: index == selectedAspect ? '#2F3251' : 'none'}"
                                    @click="selectAspect(index)"
                                >
                                    {{ item }}
                                </div>
                            </div>
                            <div class="aspect_wrapper_right_col">
                                <div class="aspect_wrapper_right_col_item">
                                    <div class="rect_figure_album"></div>
                                    <span>альбомная</span>
                                </div>
                                <div 
                                    class="aspect_wrapper_right_col_item"
                                    v-for="(item, index) in aspects_choices.slice(7, 14)"
                                    :key="index"
                                    :style="{ background: index + 7 == selectedAspect ? '#2F3251' : 'none'}"
                                    @click="selectAspect(index + 7)"
                                >
                                    {{ item }}
                                </div>
                            </div>
                        </div>
                        <span
                            class="aspect_wrapper_right_col_item"
                            :style="{ background: 14 == selectedAspect ? '#2F3251' : 'none'}"
                            style="align-self: center;"
                            @click="selectAspect(14)"
                        >{{ aspects_choices[14] }}</span>
                        
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
                <AppGoodButton 
                    :text="'СГЕНЕРИРОВАТЬ'" 
                    class="generate_btn"
                />
            </div>
        </div>
    </section>
</template>

<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';

    export default {
        components: { AppGoodButton },
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
                selectedColors: 0,
                selectedAspect: 14,
                aspects_choices: ["1:3", "1:2", "9:16", "10:16", "2:3", "3:4", "4:5", "3:1", "2:1", "16:9", "16:10", "3:2", "4:3", "5:4", "1:1 (квадратная)"],
                imgWidth: 700,
                imgHeight: 1,
            }
        },
        computed: {
            currAspect() {
                return this.aspects_choices[this.selectedAspect].replace(":", "/");
            },
            computedHeight() {
                if (this.currAspect == "1/1 (квадратная)") return this.imgWidth;

                const [widthRatio, heightRatio] = this.currAspect.split("/").map(Number);
                console.log(this.currAspect, widthRatio, heightRatio);
                return Math.round((this.imgWidth * heightRatio) / widthRatio); 
            }
        },
        methods: {
            selectColors(index) {
                this.selectedColors = index;
            },
            selectStyle(index) {
                this.active_style = index;
            },
            selectAspect(index) {
                this.selectedAspect = index;
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
    /* Стилизация трека (полосы) */
    .custom-range {
        -webkit-appearance: none; /* Убираем стандартный вид */
        width: 100%;
        height: 1px;
        background: rgba(255, 255, 255, 0.502);
        border-radius: 5px;
        outline: none;
    }
    .custom-range-big {
        width: 195px;
    }
    .custom-range-sm {
        width: 74px;
    }


    /* Стилизация для thumb (кругляшка) */
    .custom-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18.23px;
        height: 18.23px;
        background: white;
        border-radius: 50%;
        cursor: pointer;
    }
    .custom-range-sm::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 8.67px;
        height: 8.67px;
        background: white;
        border-radius: 50%;
        cursor: pointer;
    }
    .custom-range-sm::-moz-range-thumb {
        width: 8.67px;
        height: 8.67px;
        background: white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        border: none;
    }

    /* Для Firefox */
    .custom-range-big::-moz-range-thumb {
        width: 18.23px;
        height: 18.23px;
        background: white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        border: none;
    }

    /* Стилизация трека для Firefox */
    .custom-range::-moz-range-track {
        width: 100%;
        height: 1px;
        background: rgba(255, 255, 255, 0.504);
        border-radius: 5px;
    }
    .aspect_wrapper {
        display: flex;
        column-gap: 20px;
    }
    .aspect_wrapper_left, .aspect_wrapper_right {
        display: flex;
        flex-direction: column;
        row-gap: 16px;
    }
    .aspect_rect {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 220px;
        border: 1px solid white;
        border-radius: 10px;
    }
    .aspect_rect span {
        font-size: 20px;
        color: white;
        font-family: 'OpenSans';
    }
    .sm_txt {
        font-size: 12px;
        color: white;
        font-family: 'OpenSans';
    }
    .asp_wr_cols {
        display: flex;
        column-gap: 30px;
    }
    .aspect_wrapper_right_col {
        display: flex;
        flex-direction: column;
        row-gap: 5px;
    }
    .aspect_wrapper_right_col_item {
        display: flex;
        flex-direction: column;
        row-gap: 5px;
        color: white;
        font-size: 14px;
        font-family: 'OpenSans';
        padding: 0px 8px;
        border-radius: 2px;
    }
    .aspect_wrapper_right_col_item span {
        color: white;
        font-size: 14px;
        font-family: 'OpenSans';
    }
    .rect_figure_vert {
        width: 10px;
        height: 18px;
        border: 1px solid white;
    }
    .rect_figure_album {
        width: 18px;
        height: 10px;
        border: 1px solid white;
    }
    .aspect_title {
        margin-top: 30px;
    }
    .generate_btn {
        width: 220px;
        height: 51px;
        align-self: end;
        margin-top: 120px;
    }
</style>