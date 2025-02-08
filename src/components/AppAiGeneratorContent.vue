<template>
    <section class="ai">
        <div class="switch">
            <span
                v-for="(item, index) in listSwtich"
                :key="index"
                :class="{ active: activeIndex === index }" 
                @click="setActive(index)"
            >{{ item }}</span>
        </div> 
        <h1>Для создания качественного контент плана вам необходимо заполнить подробный бриф:</h1> 
        <div class="container">
            <div class="item">
                <h2>Название компании:</h2>
                <input 
                    type="text"
                    v-model="label"
                    placeholder="Название"
                    :class="{ saved: isSaved }"
                >
                <h2>Год основания компании:</h2>
                <input 
                    type="number"
                    v-model="year"
                    placeholder="Год"
                    :class="{ saved: isSaved }"
                >
            </div>
            <div class="item">
                <h2>Описание компании:</h2>
                <textarea :class="{ saved: isSaved }" placeholder="Какие продукты или услуги предлагает компания?" v-model="description_company"></textarea>
            </div>
            <div class="item">
                <h2>Конкурентные преимущества:</h2>
                <textarea :class="{ saved: isSaved }" placeholder="Что выделяет компанию среди конкурентов?" v-model="pros"></textarea>
            </div>
            <div class="item">
                <h2>Описание продукта / услуги:</h2>
                <textarea :class="{ saved: isSaved }" placeholder="Подробное описание продуктов или услуг, которые необходимо продвигать" v-model="description_product"></textarea>
            </div>
            <div class="item">
                <h2>Какие боли или проблемы решает ваш продукт?</h2>
                <textarea :class="{ saved: isSaved }" placeholder="Чем ваш продукт может помочь клиентам?" v-model="whats_solve"></textarea>
            </div>
            <div class="item">
                <h2>Уникальные характеристики продукта:</h2>
                <textarea :class="{ saved: isSaved }" placeholder="Что отличает ваш продукт от других на рынке?" v-model="characteristics"></textarea>
            </div>
            <div class="item">
                <h2>Цена и ценовая политика:</h2>
                <input 
                    type="text"
                    v-model="price"
                    placeholder="Цена"
                    :class="{ saved: isSaved }"
                >
                <h2>Какой тип партнерской программы в компании?</h2>
                <input 
                    type="number"
                    v-model="type"
                    placeholder="Типа"
                    :class="{ saved: isSaved }"
                >
            </div>
            <div class="item">
                <h2>Кто ваша основная целевая аудитория?</h2>
                <textarea :class="{ saved: isSaved }" placeholder="Возраст, пол, профессия, уровень дохода" v-model="audience"></textarea>
            </div>
            <div class="item">
                <h2>Ссылка:</h2>
                <input 
                    type="text"
                    v-model="link"
                    placeholder="Ссылка"
                    :class="{ saved: isSaved }"
                >
            </div>
            <div class="item">
                <h2>Какую реакцию вы хотите получить от вашей аудитории?</h2>
                <input 
                    type="text"
                    v-model="reaction"
                    placeholder="Покупки, регистрация в системе"
                    :class="{ saved: isSaved }"
                >
            </div>
        </div>
        <div class="row">
            <AppGoodButton :text="text1" @click="saveSettings"/>
            <AppGoodButton :text="text2" @click="editSettings" />
            <AppGoodButton :text="text3" @click="generateThemes" />
        </div>  
        <table>
            <thead>
                <tr class="head">
                    <th>
                        <input type="checkbox" v-model="allCheckboxes">
                    </th>
                    <th>День</th>
                    <th>Тема</th>
                    <th>Пост</th>
                    <th>Баннер</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in themes" :key="index">
                    <td>
                        <input type="checkbox" :checked="allCheckboxes">
                    </td>
                    <td>
                        <span>{{ index + 1 }}</span>
                    </td>
                    <td>
                        <span :contenteditable="isEditable">{{ themes?.[index] }}</span>
                    </td>
                    <td>
                        <span :contenteditable="isEditable">{{ posts?.[index] }}</span>
                    </td>
                    <td>
                        <img :src="banners?.[index]" />
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="row">
            <AppGoodButton :text="text4" />
            <AppGoodButton :text="text5" />
            <AppGoodButton :text="text6" @click="editInfo" />
        </div>
    </section>
    
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    export default {
        components: { AppGoodButton },
        data() {
            return {
                activeIndex: 0,
                listSwtich: ["Бриф", "Контент план"],
                text1: "СОХРАНИТЬ",
                text2: "РЕДАКТИРОВАТЬ",
                text3: "СГЕНЕРИРОВАТЬ ПЛАН",
                text4: "ОДОБРИТЬ",
                text5: "ЗАМЕНИТЬ",
                text6: "РЕДАКТИРОВАТЬ",
                themes: [
                    "Обзор сервиса Best Followers. Видео-инструктаж о том, как сервис может помочь в развитии вашего Telegram-канала и увеличении доходов",
                    "Обзор сервиса Noise Pollution. Видео-инструктаж о том, как сервис может помочь в развитии вашего Telegram-канала и увеличении доходов",
                    "Обзор сервиса Typeguru. Видео-инструктаж о том, как сервис может помочь в развитии вашего Telegram-канала и увеличении доходов",
                ],
                posts: [
                    "Пост 1. йцукенгшщзх",
                    "Пост 2. йцукенгшщзх",
                    "Пост 3. йцукенгшщзх",
                ],
                banners: [
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvkUFmp5jSF-DhrD5102bzHU7RbidetfqYfA&s",
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvkUFmp5jSF-DhrD5102bzHU7RbidetfqYfA&s",
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvkUFmp5jSF-DhrD5102bzHU7RbidetfqYfA&s",
                ],
                allCheckboxes: false,
                isSaved: false,
                isEditable: false,
            }
        },
        methods: {
            setActive(index) {
                this.activeIndex = index;
            },
            saveSettings() {
                // TODO: отправка на сервер данных брифа
                this.isSaved = true;
            },
            editSettings() {
                this.isSaved = false; 
            },
            editInfo() {
                this.isEditable = true;

            },
            generateThemes() {
                this.saveSettings();
                // TODO: просить сервер сгенерировать темы по текущему брифу 
            }
        },
    };
</script>

<style scoped>
    .active {
        background: #7023EC;
        font-weight: bold;
    }
    .ai {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 50px;
        /* z-index: 4; */
    }
    .switch {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }
    span {
        width: 100%;
        height: 40px;
        color: white;
        font-size: 18px;
        font-family: 'OpenSans';
        cursor: pointer;
        text-align: center;
        align-content: center;
        transition: .1s ease-in;
        @media (max-width: 1300px) {
            font-size: 16px;
        }
        @media (max-width: 1100px) {
            font-size: 14px;
            height: 50px;
            padding: 5px 10px;
        }
        @media (max-width: 700px) {
            height: 50px;
        }
        @media (max-width: 500px) {
            font-size: 12px;
        }
        @media (max-width: 360px) {
            font-size: 10px;
        }   
    }

    h1 {
        font-size: 20px;
        color: white;
        font-family: 'OpenSans';
        text-align: center;
    }
    h2 {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        column-gap: 50px;
        row-gap: 30px;
    }
    .item {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    .dropdown {
        position: relative;
        width: 360px;
        @media (max-width: 500px) {
            width:70vw;
        }
    }

    input[type="checkbox"] {
        width: 24px;
        height: 24px;
        appearance: none; /* Убираем стандартный стиль */
        border: 2px solid #333;
        border-radius: 4px;
        background-color: white;
        cursor: pointer;
        padding: 0;
    }

    input[type="checkbox"]:checked {
        background-color: #4CAF50; /* Цвет при активации */
        border-color: #4CAF50;
        position: relative;
    }

    input[type="checkbox"]:checked::after {
        font-size: 18px;
        color: white;
        position: absolute;
        top: 1px;
        left: 4px;
    }

    input {
        width: 100%;
        height: 60px;
        padding: 0 20px;
        box-sizing: border-box;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.5);
        background: none;
        border: 1px solid white;
        border-radius: 10px;
        font-family: 'OpenSans';
        position: relative;
        transition: .2s ease-in;
        @media (max-width: 500px) {
            width: 70vw;
        }
    }
    textarea {
        width: 100%;
        height: 190px;
        padding: 20px;
        box-sizing: border-box;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.5);
        background: none;
        border: 1px solid white;
        border-radius: 10px;
        font-family: 'OpenSans';
        position: relative;
        transition: .2s ease-in;
        @media (max-width: 500px) {
            width: 70vw;
        }
    }

    .arrow_down {
        position: absolute;
        top: 23px;
        right: 23px;
        transition: transform 0.3s ease;
    }

    .arrow_down.rotated {
        transform: rotate(180deg);
    }

    .dropdown-menu {
        position: absolute;
        width: 100%;
        border: 1px solid white;
        border-radius: 10px;
        max-height: 200px;
        overflow-y: scroll;
        list-style: none;
        margin: 0;
        padding: 0;
        z-index: 1000;
        color: rgba(255, 255, 255, 0.5);
        font-size: 20px;
        font-weight: normal;
        letter-spacing: 1px;
        scrollbar-width: none;
        z-index: 15;
    }
    .dropdown::-webkit-scrollbar {
        width: 0;  
        height: 0;
    }

    .dropdown::-webkit-scrollbar-thumb {
        background: transparent;
    }

    .dropdown-menu li {
        padding: 20px;
        cursor: pointer;
        border-bottom: 1px solid white;
        background: #070a29;
        font-family: 'OpenSans'
    }

    .dropdown-menu li:hover {
        background: #0c103e;
    }
    .table {
        border: none;
        border-collapse: collapse;
        width: 100%;
    }
    th {
        line-height: 3;
    }
    td {
        padding: 0px 10px;
    }
    span, td, th {
        color: white;
        font-family: 'OpenSans';
        font-size: 20px;
        text-align: center;
        align-self: center;
        z-index: 9;
        padding: 10px;
        position: relative;
    }
    tr:nth-child(2n+1) {
        background: #111433;
    }
    .head {
        background: none !important;
    }
    .row {
        display: flex;
        justify-content: space-between;
    }
    .saved {
        border-color: #4caf4f8e; 
    }
</style>