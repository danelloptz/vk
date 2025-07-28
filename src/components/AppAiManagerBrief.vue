<template>
    <section class="brief">
        <div class="managers_switch">
            <span class="managers_switch_title">ИИ менеджер: </span>
            <div 
                class="switch" 
            >
                <span
                    v-for="(item, index) in listSwtich"
                    :key="index"
                    class="switch_item"
                    :class="{ active: activeIndex === item.index }" 
                    @click="setActive(item.index)"
                >{{ item.index + 1 }}</span>
            </div> 
        </div>
        <h2 class="m50">Для создания ИИ менеджера необходимо привязть Telegram бот к сервису Intelektaz и заполнить бриф:</h2>
        <div class="token_row">
            <span>Токен бота:</span>
            <input v-model="token" class="token_input" />
            <AppGoodButton :text="'ПРИВЯЗАТЬ'" class="token_btn" />
            <span style="text-decoration: underline;">Инструкция</span>
        </div>
        <div class="link_row">
            <span>Ссылка:</span>
            <div class="link">
               <span class="link_text">https://intelektaz.com/12345678</span> <img src="@/assets/images/copy.png" @click="copyLink('https://intelektaz.com/12345678')" /> <span class="green" v-if="isCopy">Скопировано!</span>
            </div>
        </div>
        <h2 class="m30">Бриф:</h2>
        <div class="container">
            <div class="col">
                <span class="counter">{{ allSymbols }}/{{ maxSymbols }}</span>
                <h2>Название компании:</h2>
                <input 
                    type="text"
                    v-model="label"
                    placeholder="Название"
                    @input="validateInput('label', $event)"
                    :class="{ saved: isSaved }"
                >
                <h2>Год основания компании:</h2>
                <input 
                    type="text"
                    v-model="year"
                    placeholder="Год"
                    @input="validateInput('year', $event)"
                    :class="{ saved: isSaved }"
                >
                <h2 class="pros">Конкурентные преимущества:</h2>
                <textarea class="h185" :class="{ saved: isSaved }" placeholder="Что выделяет компанию среди конкурентов?" v-model="pros" @input="validateInput('pros', $event)"></textarea>
                <h2>Какие боли или проблемы решает ваш продукт?</h2>
                <textarea class="h185" :class="{ saved: isSaved }" placeholder="Чем ваш продукт может помочь клиентам?" v-model="whats_solve" @input="validateInput('whats_solve', $event)"></textarea>
                <h2>Цена и ценовая политика:</h2>
                <input 
                    type="text"
                    v-model="price"
                    placeholder="Цена"
                    @input="validateInput('price', $event)"
                    :class="{ saved: isSaved }"
                >
                <h2>Какой тип партнерской программы в компании?</h2>
                <div class="dropdown">
                    <input
                        v-model="type"
                        type="text"
                        placeholder="Тип программы"
                        :class="{ saved: isSaved }"
                        @focus="isDropdownVisible = true"
                        @blur="hideDropdown"
                        readonly 
                    />
                    <img :class="{'rotated': isDropdownVisible}" src="@/assets/images/arrow_down.png" class="arrow_down">
                    <ul v-if="isDropdownVisible" class="dropdown-menu">
                        <li
                            v-for="(item, index) in types"
                            :key="index"
                            @mousedown.prevent="selectType(item)"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </div>
                <h2 class="tg">Телеграм для связи:</h2>
                <input 
                    type="text"
                    v-model="tg"
                    placeholder="Телеграм (введите имя пользователя)"
                    @input="validateInput('tg', $event)"
                    :class="{ saved: isSaved }"
                >
            </div>
            <div class="col">
                <h2>Имя, Фамилия или Компания:</h2>
                <input 
                    type="text"
                    v-model="fio"
                    placeholder="Данные, кого будет представлять бот"
                    @input="validateInput('fio', $event)"
                    :class="{ saved: isSaved }"
                >
                <h2 class="descr_comp">Описание компании:</h2>
                <textarea :class="{ saved: isSaved }" placeholder="Какие продукты или услуги предлагает компания?" v-model="description_company" @input="validateInput('description_company', $event)"></textarea>
                <h2>Описание продукта / услуги:</h2>
                <textarea :class="{ saved: isSaved }" placeholder="Подробное описание продуктов или услуг, которые необходимо продвигать" v-model="description_product" @input="validateInput('description_product', $event)"></textarea>
                <h2>Уникальные характеристики продукта:</h2>
                <textarea :class="{ saved: isSaved }" placeholder="Что отличает ваш продукт от других на рынке?" v-model="characteristics"  @input="validateInput('characteristics', $event)"></textarea>
                <h2>Часто задаваемые вопросы:</h2>
                <textarea :class="{ saved: isSaved }" placeholder="В этом разделе укажите самые частые вопросы, которые задают ваши клиенты и ответы на них. Используте формат «Вопрос: [текст вопроса]. Ответ: [текст ответа]». Каждый вопрос с новой строки" v-model="qu" @input="validateInput('qu', $event)"></textarea>
            </div>
        </div>
        <h2 class="m50">Ссылки и материалы:</h2>
        <div class="links">
            <div v-for="(link, index) in links" :key="index" class="row">
                <input 
                    placeholder="Ссылка"
                    v-model="link.link"
                    class="links_link"
                >
                <input 
                    placeholder="Описание"
                    v-model="link.descr"
                    class="links_descr"
                >
                <div class="sub_row"  >
                    <img 
                        v-if="link.isNew"
                        src="@/assets/images/delete_ai.png" 
                        @click="removeLink(index)"
                    >
                    <img 
                        v-if="index == links.length - 1"
                        src="@/assets/images/addPlus.png" 
                        @click="addLink(link, index)"
                    >
                </div>
            </div>
        </div>
        <h2 class="m50">Какую реакцию вы хотите получить от вашей аудитории?</h2>
        <div class="links">
            <div v-for="(goal, index) in goals" :key="index" class="row">
                <input 
                    placeholder="Цель"
                    v-model="goal.goal"
                    class="links_link"
                >
                <input 
                    placeholder="Описание"
                    v-model="goal.descr"
                    class="links_descr"
                >
                <div class="sub_row"  >
                    <img 
                        v-if="goal.isNew"
                        src="@/assets/images/delete_ai.png" 
                        @click="removeGoal(index)"
                    >
                    <img 
                        v-if="index == goals.length - 1"
                        src="@/assets/images/addPlus.png" 
                        @click="addGoal(goal, index)"
                    >   
                </div>
            </div>
        </div>
        <div class="btns_row">
            <AppGoodButton :text="'СОХРАНИТЬ'" class="btn_long" />
            <AppGoodButton :text="'РЕДАКТИРОВАТЬ'" class="btn_long" />
            <AppGoodButton :text="'УДАЛИТЬ БОТА'" class="btn_long" />
        </div>
        <div class="conv_style_wrapper m50">
            <h2>Стиль общения: </h2>
            <div class="conv_style">
                <div 
                    v-for="(item, index) in conv_styles"
                    :key="index"
                    class="conv_style_row"
                >
                    <div class="conv_style_row_row">
                        <div class="checkbox-wrapper-18">
                            <div class="round">
                                <input type="checkbox" :id="`checkbox-${index}`" @click="setActiveConvStyle(item)" :checked="active_conv_style === item && active_conv_style !== ''" />
                                <label :for="`checkbox-${index}`"></label>
                            </div>
                        </div>
                        <span>{{ item }}</span>
                    </div>
                    <div class="conv_style_faq">?</div>
                </div>
            </div>
        </div>
    <div class="start_msg m50">
        <h2>Приветственное сообщение</h2>
        <span>Здравствуйте! Я Intelektaz, ИИ-менеджер {{ fio }}...</span>
        <AppGoodButton :text="'СГЕНЕРИРОВАТЬ'" class="generate_msg_btn"/>
        <textarea class="start_msg_text"></textarea>
        <div class="start_msg_row_btns">
            <AppGoodButton :text="'СОХРАНИТЬ'" class="start_msg_row_btn_sm" />
            <AppGoodButton :text="'РЕДАКТИРОВАТЬ'" class="start_msg_row_btn_bg" />
        </div>
    </div>
    </section>
</template>

<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';
    export default {
        props: {
            userData: Object
        },
        components: { AppGoodButton },
        data() {
            return {
                activeIndex: 0,
                listSwtich: [
                    {
                        index: 0,
                    },
                    {
                        index: 1,
                    },
                    {
                        index: 2,
                    }, 
                    {
                        index: 3,
                    }, 
                    {
                        index: 4,
                    }, 
                ],
                fio: "",
                year: "",
                label: "",
                description_company: "",
                pros: "",
                description_product: "",
                whats_solve: "",
                characteristics: "",
                price: "",
                audience: "",
                link: "",
                qu: "",
                tg: "",
                type: "",
                maxSymbols: 10000,
                types: ["Нет", "Линейный маркетинг", "Бинарный маркетинг", "Гибридный маркетинг", "Матрица", "Шахматный маркетинг"],
                isDropdownVisible: false,
                links: [
                    {
                        "link": "https://intelektaz.com/12345678",
                        "descr": "Какое-то описание",
                        "isNew": false
                    }
                ],
                goals: [
                    {
                        "goal": "Цель 1",
                        "descr": "Какое-то описание",
                        "isNew": false
                    }
                ],
                conv_styles: ["Эксперт", "Друг", "Профессионал"],
                active_conv_style: ""
            }
        },
        computed: {
            allSymbols() {
                return this.year.length + this.label.length + this.description_company.length + this.pros.length + this.description_product.length + this.whats_solve.length + this.characteristics.length + this.price.length + this.audience.length + this.link.length + this.qu.length + this.tg.length;
            }
        },
        methods: {
            setActiveConvStyle(style) {
                this.active_conv_style = style;
            },
            addLink(link, index) {
                this.links.splice(index + 1, 0, { type: link.type, link: "", isNew: true });
            },
            removeLink(index) {
                this.links.splice(index, 1);
                this.saveSocial();
            },
            addGoal(goal, index) {
                this.goals.splice(index + 1, 0, { type: goal.type, goal: "", isNew: true });
            },
            removeGoal(index) {
                this.goals.splice(index, 1);
                this.saveSocial();
            },
            setActive(index) {
                this.activeIndex = index;
            },
            async copyLink(link) {
                await navigator.clipboard.writeText(link);
                setTimeout(() => { this.isCopy = 0; console.log(this.isCopy);}, 2000);
            },
            validateInput(field) {
                const currentLength = this.allSymbols;

                // Если текущая длина + новая длина превышает лимит, обрезаем ввод
                if (currentLength > this.maxSymbols) {
                    this[field] = this[field].slice(0, this[field].length - (currentLength - this.maxSymbols));
                }
            },
            hideDropdown() {
                this.isDropdownVisible = false;
            },
            selectType(item) {
                this.type = item;
                this.hideDropdown();
            },
        }
    };
</script>

<style scoped>
    .m50 {
        margin-top: 50px;
    }
    .m30 {
        margin-top: 30px;
    }
    .brief {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .managers_switch {
        display: flex;
        column-gap: 21px;
        align-items: center;
    }
    .managers_switch_title {
        color: white;
        font-size: 20px;
        font-family: 'OpenSans';
    }
    .switch {
        width: 149px;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
    }
    .switch_item {
        width: 30px;
        height: 30px;
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
    .active {
        background: #7023EC;
        font-weight: bold;
    }
    h2 {
        color: white;
        font-size: 20px;
        font-family: 'OpenSans';
    }
    .token_row {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin-top: 35px;
    }
    .token_row span {
        color: white;
        font-size: 20px;
        font-family: 'OpenSans';
    }
    .token_input {
        width: 444px;
        height: 50px;
        background: none;
        border: 1px solid white;
        border-radius: 10px;
        font-size: 16px;
        padding-left: 20px;
    } 
    .token_btn {
        width: 150px;
        height: 51px;
    }
    .link_row {
        display: flex;
        align-items: center;
        column-gap: 57px;
        margin-top: 30px;
    }
    .link_row span {
        color: white;
        font-size: 20px;
        font-family: 'OpenSans';
        line-height: 1.5;
    }
    .link_text {
        font-size: 18px !important;
        font-weight: bold;
        text-decoration: underline;
    }
    .link {
        display: flex;
        column-gap: 10px;
    }
    .link img {
        width: 20px;
        height: 20px;
    }
    .green {
        color: green;
        animation: ShowEasy 2s ease-in;
        opacity: 0;
        @media (max-width: 650px) {
            display: none;
        }
    }

    .container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        column-gap: 50px;
        row-gap: 20px;
        @media (max-width: 650px) {
            grid-template-columns: 1fr;
        }
    }
    .col {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        margin-top: 30px;
        position: relative;
    }
    .item {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        position: relative;
    }
    .dropdown {
        position: relative;
        width: 100%
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
        @media (max-width: 650px) {
            height: 50px;
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
        @media (max-width: 650px) {
            height: 160px;
            padding: 10px;
        }
    }

    .arrow_down {
        position: absolute;
        top: 23px;
        right: 23px;
        width: 13px;
        height: 13px;
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
        @media (max-width: 650px) {
            font-size: 16px;
        }
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
    .counter {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 14px;
        color: white;
        opacity: .5;
        font-family: 'OpenSans';
        width: min-content;
        line-height: 2;
        height: min-content;
    }
    .descr_comp {
        margin-top: 35px !important;
    }
    .pros {
        margin-top: 10px;
    }
    .tg {
        margin-top: 25px;
    }
    .h185 {
        height: 185px !important;
    }
    .links {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
        margin-top: 20px;
    }
    .row {
        display: flex;
        column-gap: 30px;
    }
    .links_link {
        width: 280px;
    }
    .links_descr {
        width: 518px;
    }
    .sub_row {
        display: flex;
        align-items: center;
        column-gap: 20px;
        @media (max-width: 650px) {
            column-gap: 15px;
        }
    }
    .sub_row img {
        width: 45px;
        object-fit: contain;
        cursor: pointer;
        @media (max-width: 650px) {
            width: 39px;
            height: auto;
        }
    }
    .btns_row {
        display: flex;
        justify-content: space-between;
        margin-top: 50px;
    }
    .btn_long {
        width: 260px;
        height: 51px;
    }
    .checkbox-wrapper-18 .round {
        position: relative;
    }

    .checkbox-wrapper-18 .round label {
        background-color: none;
        border: 1px solid white;
        cursor: pointer;
        height: 23px;
        width: 23px;
        display: block;
    }

    .checkbox-wrapper-18 .round label:after {
        border: 3px solid #66bb6a;
        border-top: none;
        border-right: none;
        content: "";
        height: 6px;
        left: 5px;
        opacity: 0;
        position: absolute;
        top: 3px;
        transform: rotate(-45deg);
        width: 18px;
    }

    .checkbox-wrapper-18 .round input[type="checkbox"] {
        visibility: hidden;
        display: none;
        opacity: 0;
    }

    .checkbox-wrapper-18 .round input[type="checkbox"]:checked + label {
        background-color: none;
        border-color: white;
    }

    .checkbox-wrapper-18 .round input[type="checkbox"]:checked + label:after {
        opacity: 1;
    }
    .conv_style_wrapper {
        display: flex;
        column-gap: 30px;
    }
    .conv_style {
        display: flex;
        flex-direction: column;
        row-gap: 15px;
        position: relative;
    }
    .conv_style_row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 210px;
    }
    .conv_style_row_row {
        display: flex;
        column-gap: 10px;
        align-items: center;
    }
    .conv_style_row_row span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .conv_style_faq {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #2F3251;
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .start_msg {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    .start_msg span {
        color: white;
        font-size: 18px;
        font-family: 'OpenSans';
    }
    .generate_msg_btn {
        width: 260px;
        height: 51px;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .start_msg_text {
        width: 100%;
        height: 210px;
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
        @media (max-width: 650px) {
            height: 160px;
            padding: 10px;
        }
    }
    .start_msg_row_btns {
        display: flex;
        column-gap: 20px;
        margin-top: 10px;
    }
    .start_msg_row_btn_sm {
        width: 200px;
        height: 51px;
    }
    .start_msg_row_btn_bg {
        width: 250px;
        height: 51px;
    }
</style>