<template>
    <AppModalMessage
        :visibility1="isMessageModal"
        @update:visibility1="isMessageModal = $event"
    />
    <section class="help" v-if="!isQu">
        <h1>Для начала посмотрите раздел «Инструкции», здесь есть ответы  на большинство вопросов: </h1>
        <AppGoodButton :text="text1" @click="gotoInstructions" />
        <span>Также рекомендуем обратиться к вашему рефереру:</span>
        <AppGroupOrUser :objectData="refererData" />
        <div class="row">
            <span>Если вы не смогли найти ответ на ваш вопрос, то напишите в службу поддержки Intelektaz, и мы обязательно ответим вам:</span>
            <AppGoodButton :text="text2" @click="openQu" />
        </div>
    </section>
    <section class="qu" v-if="isQu">
        <div class="item" 
            v-for="(item, index) in textData" 
            :key="index"
            @click="toggleItem(index)"
        >
            <div class="row">
                <h2 :class="{ active: activeIndex === index }">{{ item.title }}</h2>
            </div>
            <div v-show="activeIndex === index" class="text" v-html="item.text">
            </div>
        </div>
        <span>Если вы не нашли ответ на свой вопрос, напишите оператору, указав в первом сообщении ваш ID, если необходимо, группу и всю детальную информацию по вашему вопросу текстом.</span>
        <AppGoodButton :text="text3" @click="openModalMessage" />
    </section>
    
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import AppGroupOrUser from "@/components/AppGroupOrUser.vue";
    import AppModalMessage from "@/components/AppModalMessage.vue";
    import { getUserInfoById } from "@/services/user";

    export default {
        components: { AppGoodButton, AppGroupOrUser, AppModalMessage },
        data() {
            return {
                activeIndex: null,
                isQu: false,
                text1: "ИНСТРУКЦИИ",
                text2: "ЗАДАТЬ ВОПРОС",
                text3: "НАПИСАТЬ ОПЕРАТОРУ",
                referData: [],
                isMessageModal: false,
                textData: [
                    { 
                        title: "ВВОД / ВЫВОД",
                        text: "<h2 class='text_h2'>Если у вас возникли трудности с пополнением баланса через USDT TRC-20.</h2><span class='text_span'>Обратитесь к своему рефереру и попросите его помочь вам с оплатой через внутренний перевод. Вы отправляется ему средства удобным для вас способом по курсу, а он вам перевод внутри бота. Контакт своего реферера вы можете найти в разделе «Структура».</span><h2 class='text_h2'>Если вы перевели средства на баланс, но на балансе этих средств нет, то скорее всего вы не отправили хэш данной транзакции боту, или отправили не в соответствующий раздел.</h2><span class='text_span'>Необходимо отправить хэш транзакции для подтверждения своего перевода. Все переводы осуществляются автоматически. Хэш необходимо взять с того источника (кошелька или биржи), откуда вы отправили средства. Для этого зайдите в своем кошельке в детали перевода или «Открыть обозреватель». Далее, если вы перешли в другой раздел бота, необходимо повторно перейти в раздел пополнения баланса, вписать и отправить сумму пополнения и отправить хэш для пополнения счета.</span>"
                    },
                    {
                        title: "ПРИВЯЗКА ГРУППЫ",
                        text: "Нет, вашу группу за использование сервиса не заблокируют. Но если вы будете публиковать контент, нарушающий правила «ВКонтакте», то на вашу группу могут быть наложены ограничения."
                    },
                    {
                        title: "ПАРТНЁРСКАЯ ПРОГРАММА",
                        text: "Нет, вашу группу за использование сервиса не заблокируют. Но если вы будете публиковать контент, нарушающий правила «ВКонтакте», то на вашу группу могут быть наложены ограничения."
                    },
                    {
                        title: "ИИ ГЕНЕРАТОР",
                        text: "Нет, вашу группу за использование сервиса не заблокируют. Но если вы будете публиковать контент, нарушающий правила «ВКонтакте», то на вашу группу могут быть наложены ограничения."
                    },
                    {
                        title: "РОТАЦИЯ",
                        text: "Нет, вашу группу за использование сервиса не заблокируют. Но если вы будете публиковать контент, нарушающий правила «ВКонтакте», то на вашу группу могут быть наложены ограничения."
                    },
                    {
                        title: "ДРУГОЙ",
                        text: "Нет, вашу группу за использование сервиса не заблокируют. Но если вы будете публиковать контент, нарушающий правила «ВКонтакте», то на вашу группу могут быть наложены ограничения."
                    }
                ]
            }
        },
        async created() {
            const refer = await getUserInfoById(842052594, localStorage.getItem("token"));
            this.referData = refer;

            console.log(this.referData);
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
            }
        }
    };
</script>

<style scoped>
    .help {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
    }
    h1 {
        font-size: 24px;
        color: white;
        font-family: 'OpenSans';
    }
    span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
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
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    h2 {
        font-size: 20px;
        font-family: 'OpenSans';
        color: white;
        transition: .2s ease-in;
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
    .text_h2, .text_span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        transition: max-height 0.3s ease, opacity 0.3s ease;
    }
    .qu {
        display: flex;
        flex-direction: column;
        row-gap: 38px;
    }
</style>