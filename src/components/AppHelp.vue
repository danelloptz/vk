<template>
    <section class="help" v-if="!isQu">
        <span class="big">Для начала посмотрите раздел «Инструкции», здесь есть ответы  на большинство вопросов: </span>
        <AppGoodButton class="btn" :text="text1" @click="gotoInstructions" />
        <span>Также рекомендуем обратиться к вашему рефереру:</span>
        <AppGroupOrUser :objectData="refererData" class="card" />
        <div class="row">
            <span>Если вы не смогли найти ответ на ваш вопрос, то напишите в службу поддержки Intelektaz, и мы обязательно ответим вам:</span>
            <AppGoodButton :text="text2" @click="openQu" class="btn" />
        </div>
    </section>
    <section class="qu" v-if="isQu">
        <h2>Выберите тему вашего вопроса:</h2>
        <div class="item" 
            v-for="(item, index) in textData" 
            :key="index"
            @click="toggleItem(index)"
        >
            <div class="row">
                <h2 :class="{ active: activeIndex === index }">{{ item.title }}</h2>
            </div>
            <div v-show="activeIndex === index" class="text" v-for="(qu, index_2) in item.qu" :key="index_2">
                <h3>{{ qu }}</h3>
                <span v-html="item.answ[index_2]"></span>
            </div>
        </div>
        <span>Если вы не нашли ответ на свой вопрос, напишите оператору, указав в первом сообщении ваш ID, если необходимо, группу и всю детальную информацию по вашему вопросу текстом.</span>
        <AppGoodButton :text="text3" @click="redirectBot" class="btn2"/>
    </section>
    
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import AppGroupOrUser from "@/components/AppGroupOrUser.vue";
    import { getReferer } from "@/services/user";
    import { getConfig } from "@/services/config";

    export default {
        components: { AppGoodButton, AppGroupOrUser },
        props: { userData: Object },
        data() {
            return {
                activeIndex: null,
                isQu: false,
                text1: "ИНСТРУКЦИИ",
                text2: "ЗАДАТЬ ВОПРОС",
                text3: "НАПИСАТЬ ОПЕРАТОРУ",
                refererData: [],
                isMessageModal: false,
                textData: null
            }
        },
        async created() {
            const refer = await getReferer(this.userData.vk_id);
            this.refererData = refer;
            const resp = await getConfig("help", localStorage.getItem("token"));
            this.textData = resp.data;
        },
        methods: {
            gotoInstructions() {
                this.$emit("update-isInstructions", true);
            },
            toggleItem(index) {
                this.activeIndex = this.activeIndex === index ? null : index;
            },
            openQu() {
                this.isQu = true;
            },
            openModalMessage() {
                this.isMessageModal = true;
            },
            redirectBot() {
                window.open('https://t.me/IntelektazBot', '_blank');
            }
        }
    };
</script>

<style scoped>
    .help {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
        width: 100%;
    }
    .big {
        font-size: 24px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 16px;;
        }
    }
    .item {
        display: flex;
        flex-direction: column;
        padding-bottom: 20px;
        width: 100%;
        row-gap: 20px;
        cursor: pointer;
    }
    .row {
        width: 100%;
        display: flex;
        align-items: center;
        column-gap: 20px;
        justify-content: space-between;
        @media (max-width: 650px) {
            flex-direction: column;
            align-items: start;
            row-gap: 20px;
        }
    }
    h2 {
        font-size: 20px;
        font-family: 'OpenSans';
        color: white;
        transition: .2s ease-in;
        @media (max-width: 650px) {
            font-size: 18px;
        }
    }
    .row img {
        width: 28px;
        height: 28px;
        object-fit: cover;
        object-position: center;
        transition: transform 0.3s ease;
    }
    .row img.rotated {
        transform: rotate(90deg);
    }
    .row h2.active {
        background: linear-gradient(to right, #7023EC, #A585DA); 
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }
    .text {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        transition: max-height 0.3s ease, opacity 0.3s ease;
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .text h3, .text span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        transition: max-height 0.3s ease, opacity 0.3s ease;
        @media (max-width: 650px) {
            font-size: 14px;
        }
    }
    .qu {
        display: flex;
        flex-direction: column;
        row-gap: 38px;
    }
    .btn {
        min-width: 200px;
        font-size: 16px;
        @media (max-width: 650px) {
            width: 180px;
            height: 40px;
            font-size: 14px;
        }
    }
    .btn2 {
        width: 230px;
        font-size: 16px;
        @media (max-width: 650px) {
            width: 200px;
            height: 40px;
            font-size: 14px;
        }
    }
    .card {
        @media (max-width: 650px) {
            width: 100%;
        }
    }
</style>