<template>
    <AppModal 
        :title="title" 
        :message="msg" 
        :visibility1="isModal"
        @close="close"
        @update:visibility1="isModal = $event"
    />
    <AppAiEditor 
        v-if="isEditor" 
        :imageSrc="generatedImage"
        :userData="userData"
        @update:visibility1="isEditor = $event"
        @update:save="updateImage"
    />
    <section class="banner">
        <h1 :style="{ alignSelf: isBanner ? 'center' : 'start' }">{{ isBanner ? 'ИИ баннер' : 'Создайте уникальный баннер c Intelektaz' }}</h1>
        <div class="generations_wrapper">
            <span class="generations_item" @click="openGeneratorModal(false)">
                Генерация баннеров: {{ generations?.free.remains }} / {{ generations?.free.total }}
            </span>
            <span class="generations_item" @click="openGeneratorModal(true)">
                Пакет генераций: {{ generations?.paid.remains }} / {{ generations?.paid.total }}
            </span>
        </div>
        <div class="descr">
            <span class="counter">{{ descr.length }}/2000</span>
            <textarea 
                v-model="descr"
                type="text"
                placeholder="Опишите, что вы хотите увидеть"
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
                        <!-- <input type="range" class="custom-range custom-range-big" v-model.number="imgWidth" min="300" max="2000" step="1" @change="captureState" /> -->
                        <!-- <span class="sm_txt">Ширина: <span style="opacity: .7;">{{ imgWidth + ' ' }}px</span></span>
                        <span class="sm_txt">Высота: <span style="opacity: .7;">{{ computedHeight + ' ' }}px</span></span> -->
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
                                <div class="aspect_wrapper_right_col_item" style="margin-top: 8px;">
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
                <div class="col">
                    <h2 style="align-self: self-start;">Цвет</h2>
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
                
                <div class="btns_row">
                    <AppBadButton 
                        :text="'ВАШЕ ФОТО'" 
                        class="generate_btn_sm"
                        @click="uploadUserPhoto"
                    />
                    <AppGoodButton 
                        :text="'СГЕНЕРИРОВАТЬ'" 
                        class="generate_btn"
                        @click="generate"
                    />
                </div>
                
            </div>
        </div>
        <span class="loading_text" v-if="isLoading">Генерация ...</span>
        <div class="line_wrapper" v-if="isLoading">
            <div class="line"></div>
        </div>
        <img 
            v-if="generatedImage"
            :src="generatedImage"
            class="generated_image"
        />
        <div class="row">
            <AppGoodButton
                v-for="(item, index) in variants"
                :key="index"
                :text="`Вариант ${index + 1}`"
                :class="{ not_active: index !== selectedVariant }"
                @click="selectVariant(item)"
                class="btn btn_sm"
            />
        </div>
        <div class="row" v-if="generatedImage">
            <AppGoodButton 
                class="btn"
                :text="'РЕДАКТОР'"
                @click="openEditor"
            />
            <AppGoodButton 
                v-if="isBanner"
                class="btn"
                :text="'ОДОБРИТЬ'"
                @click="confirmImage"
            />
            <AppGoodButton 
                class="btn"
                :text="'СКАЧАТЬ'"
                @click="download"
            />
        </div>
    </section>
</template>

<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppBadButton from '@/components/AppBadButton.vue';
    import AppAiEditor from '@/components/AppAiEditor.vue';
    import AppModal from '@/components/AppModal.vue';
    import { generateCustomImage, getGenerations } from '@/services/ai';

    export default {
        props: {
            userData: Object,
            isBanner: Boolean
        },
        components: { AppGoodButton, AppModal, AppAiEditor, AppBadButton },
        data() {
            return {
                descr: "",
                icons: [
                    {
                        name: "Автоматический",
                        tag: "AUTO",
                        src: "default.png"
                    },
                    {
                        name: "Случайный",
                        tag: "RANDOM",
                        src: "random.png"
                    }, 
                    {
                        name: "Общий",
                        tag: "GENERAL",
                        src: "free.png"
                    },
                    {
                        name: "Реализм",
                        tag: "REALISTIC",
                        src: "realism.png"
                    },
                    {
                        name: "Дизайн",
                        tag: "DESIGN",
                        src: "design.png"
                    }
                ],
                active_style: 0,

                colors_choices: [
                    {
                        name: "Авто",
                        tag: "AUTO",
                        colors: []
                    },
                    {
                        name: "Жаркие",
                        tag: "EMBER",
                        colors: ["#CF064F", "#303440", "#D95953", "#B90656"]
                    },
                    {
                        name: "Свежие",
                        tag: "FRESH",
                        colors: ["#F0C073", "#F17356", "#2056F3", "#89EF97"]
                    },
                    {
                        name: "Тропические",
                        tag: "JUNGLE",
                        colors: ["#013F35", "#018B64", "#02573A", "#038A3C"]
                    },
                    {
                        name: "Волшебные",
                        tag: "MAGIC",
                        colors: ["#E2B3D0", "#ACA5CE", "#2579A9", "#2F219D"]
                    },
                    {
                        name: "Дынные",
                        tag: "MELON",
                        colors: ["#F04C54", "#25518D", "#F2AE32", "#F17B33"]
                    },
                    {
                        name: "Мозайка",
                        tag: "MOSAIC",
                        colors: ["#F24B56", "#48D902", "#A9DA19", "#F6AFA0"]
                    },
                    {
                        name: "Пастельные",
                        tag: "PASTEL",
                        colors: ["#F2B5BD", "#AFE5E5", "#F8E7C9", "#BEF7C9"]
                    },
                    {
                        name: "Ультрамарин",
                        tag: "ULTRAMARINE",
                        colors: ["#050930", "#001261", "#0425F6", "#93C1E6"]
                    }
                ],
                selectedColors: 0,
                selectedAspect: 14,
                aspects_choices: ["1:3", "1:2", "9:16", "10:16", "2:3", "3:4", "4:5", "3:1", "2:1", "16:9", "16:10", "3:2", "4:3", "5:4", "1:1 (квадратная)"],
                imgWidth: 700,
                imgHeight: 1,
                generatedImage: null,
                isLoading: false,
                title: "",
                msg: "",
                isModal: false,
                isEditor: false,
                variants: [],
                selectedVariant: null,
                generations: null,
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
        async created() {
            const gener = await getGenerations(this.userData.id);
            this.generations = gener;
        },
        methods: {
            uploadUserPhoto() {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (event) => {
                    const file = event.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = new Image(); // Создаем объект Image для загрузки изображения
                        img.src = e.target.result; // Устанавливаем источник изображения

                        img.onload = () => {
                            this.generatedImage = img.src;
                            if (this.variants.length < 5) {
                                this.variants.push({
                                    id: this.variants.length + 1,
                                    src: img.src
                                });
                            } else {
                                this.variants[this.variants.length - 1].src = img.src;
                            }
                            this.selectedVariant = this.variants.length - 1;
                            
                        };
                    };
                    reader.readAsDataURL(file);
                };
                input.click();
            },
            updateImage(link) {
                this.generatedImage = link;
                this.variants[this.selectedVariant] = link;
            },
            close() {
                this.$emit('changePosition');
            },
            confirmImage() {
                this.$emit('confirm', this.generatedImage);
            },
            selectVariant(item) {
                this.selectedVariant = item.id - 1;
                this.generatedImage = item.src;
            },
            openEditor() {
                this.isEditor = true;
            },
            download() {
                const link = document.createElement('a');

                fetch(this.generatedImage)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Ошибка загрузки изображения: ${response.status}`);
                        }
                        return response.blob();
                    })
                    .then(blob => {
                        const url = window.URL.createObjectURL(blob);

                        link.href = url;
                        link.download = `generated-image.png`;

                        document.body.appendChild(link);
                        link.click();

                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(link);
                    })
                    .catch(error => {
                        console.error('Ошибка при скачивании изображения:', error);
                    });
            },
            selectColors(index) {
                this.selectedColors = index;
            },
            selectStyle(index) {
                this.active_style = index;
            },
            selectAspect(index) {
                this.selectedAspect = index;
            },
            async generate() {
                if (this.isLoading) return;
                if (this.generations.free.remains + this.generations.paid.remains <= 0) return;
                this.isLoading = true;
                this.Timer(1, 20000);
                const aspect = this.aspects_choices[this.selectedAspect] == "1:1 (квадратная)" ? "1x1" : this.aspects_choices[this.selectedAspect].replace(":", "x");
                const resp = await generateCustomImage(this.descr, aspect, this.colors_choices[this.selectedColors].tag, this.icons[this.active_style].tag, this.userData.id);
                this.isLoading = false;
                if (resp.isError) {
                    console.log("Код ошибки: ", resp.code);
                    this.title = "ОШИБКА!";
                    switch (resp.code) {
                        case 505:
                            this.msg = "Обратитесь, пожалуйста, в техническую поддержку сервиса, чтобы получить лимиты на генерацию изображений."
                            break;
                        case 402:
                            this.msg = "У вас закончился месячный лимит на генерацию изображений. Чтобы продолжить пользоваться этим инстурментом в этом месяце, купите дополнительные лимиты."
                            break;
                        default:
                            this.msg = "Произошла непридвиденная ошибка. Перезагрузите страницу. Если проблема останется, то обратитесь в техническую поддержку.";
                            break;
                    }
                    this.isModal = true;
                    return;
                }
                if (!resp) return;
                this.generatedImage = resp;
                if (this.variants.length < 5) {
                    this.variants.push({
                        id: this.variants.length + 1,
                        src: resp
                    });
                } else {
                    this.variants[this.variants.length - 1].src = resp;
                }
                this.selectedVariant = this.variants.length - 1;
                this.download();
                const gener = await getGenerations(this.userData.id);
                this.generations = gener;

                this.$emit('changePosition');
                this.isModal = true;
                this.title = "УСПЕШНО!";
                this.msg = "Картинка сохранена на ваше устройство.";
            },
            Timer(countOfPosts, time) {
                let initialLineWidth = 0; // Начальная ширина полосы загрузки (в пикселях)
                let maxLineWidth = 233; // Максимальная ширина полосы загрузки (в пикселях)
                let totalDuration = time ? time : (Math.ceil(countOfPosts / 7)) * 60 * 1000; // Общее время анимации (3 секунды в миллисекундах)

                let startTime = Date.now(); // Время начала анимации

                function updateProgress() {
                    let lines = document.querySelectorAll('.line');
                    let elapsedTime = Date.now() - startTime;
                    let progress = Math.min(elapsedTime / totalDuration, 1);

                    let newLineWidth = initialLineWidth + (maxLineWidth - initialLineWidth) * progress;
                    lines.forEach(line => line.style.width = `${newLineWidth}px`);

                    if (progress < 1) {
                        requestAnimationFrame(updateProgress);
                    }
                }
                // Запускаем анимацию
                requestAnimationFrame(updateProgress);
            },
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
        @media (max-width: 900px) {
            font-size: 15px;
        }
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
        @media (max-width: 900px) {
            font-size: 12px;
        }
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
        @media (max-width: 900px) {
            flex-direction: column;
            row-gap: 30px;
        }
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
        @media (max-width: 900px) {
            justify-content: space-between;
        }
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
        cursor: pointer;
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
        @media (max-width: 900px) {
            width: 140px;
        }
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
        align-items: end;
    }
    .col {
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
        @media (max-width: 900px) {
            flex-direction: column;
            align-items: center;
            row-gap: 30px;
        }
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
        @media (max-width: 900px) {
            width: 169px;
        }
    }
    .generate_btn_sm {
        width: 180px;
        height: 51px;
        align-self: end;
        @media (max-width: 900px) {
            width: 151px;
        }
    }
    .generated_image {
        max-width: 785px;
        max-height: 400px;
        align-self: center;
        @media (max-width: 900px) {
            max-width: 100%;
        }
    }
    .line_wrapper {
        max-width: 685px;
        width: 80vw;
        height: 44px;
        border: 2.94px solid white;
        /* padding: 5px; */
        border-radius: 29.42px;
        position: relative;
        display: flex;
        align-items: center;
        padding: 7.88px 8.83px;
        align-self: center;
    }
    .line {
        width: 0px;
        height: 28.37px;
        background: #7023EC;
        transition: .2s ease-in;
        border-radius: 29.42px;
    }
    .loading_text {
        font-size: 41.19px;
        color: white;
        font-family: 'OpenSans';
        margin-top: 100px;
        text-align: center;
        align-self: center;
    }
    .row {
        display: flex;
        column-gap: 30px;
        align-self: center;
        @media (max-width: 900px) {
            flex-wrap: wrap;
            column-gap: 10px;
            row-gap: 10px;
        }
    }
    .btn {
        width: 180px;
        @media (max-width: 900px) {
            width: 150px;
            height: 40px;
            font-size: 14px;
        }
    }
    .btn_sm {
        @media (max-width: 900px) {
            width: 100px;
            height: 35px;
            font-size: 12px;
        }
    }
    .not_active {
        background: none;
        border: 1px solid white;
    }
    .generations_wrapper {
        display: flex;
        column-gap: 30px;
        @media (max-width: 750px) {
            flex-direction: column;
        }
    }
    .generations_item {
        padding: 10px 20px;
        background: #111433;
        border-radius: 10px;
        color: white;
        font-size: 20px;
        font-family: 'OpenSans';
        width: fit-content;
        height: fit-content;
        margin-bottom: 10px;
        cursor: pointer;
        @media (max-width: 750px) {
            width: 100%;
            font-size: 16px;
        }
    }
    .btns_row {
        display: flex;
        column-gap: 29px;
        margin-top: 120px;
        @media (max-width: 900px) {
            column-gap: 10px;
        }
    }
</style>