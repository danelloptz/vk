<template>
    <section class="assistant">
        <h2>ИИ помощник</h2>
        <h2>Вы можете задать любой вопрос ИИ помощнику, или создать индивидуальный, нестандартный контент, просто описав подробный промпт.</h2>
        
        <div class="chat">
            <div class="header">
                <h3>Новый разговор</h3>
                <span>{{ messages.length }} сообщений</span>
            </div>

            <!-- Блок сообщений -->
            <div class="messages">
                <div v-for="(message, index) in messages" :key="index" :class="message.type">
                    {{ message.text }}
                </div>
            </div>

            <!-- Поле ввода -->
            <div class="input_field">
                <span class="counter">{{ msg.length }}/2000</span>
                <textarea 
                    v-model="msg"
                    placeholder="Ваше сообщение"
                    maxlength="2000"
                    @keydown.enter.prevent="sendMessage"
                ></textarea>
                <AppGoodButton :text="text1" class="btn" @click="sendMessage" />
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
            msg: "",
            text1: "ОТПРАВИТЬ",
            messages: [] // Список всех сообщений
        };
    },
    mounted() {
        // При загрузке страницы добавляем приветственное сообщение от ИИ
        this.addMessage("ai_msg", "Здравствуйте! Чем могу помочь?");
    },
    methods: {
        sendMessage() {
            if (!this.msg.trim()) return; // Игнорируем пустые сообщения

            // Добавляем сообщение пользователя
            this.addMessage("user_msg", this.msg);

            // Очищаем поле ввода
            this.msg = "";

            // Заглушка для ответа ИИ
            setTimeout(() => {
                this.addMessage("ai_msg", "Это заглушка для ответа ИИ.");
            }, 1000);
        },
        addMessage(type, text) {
            this.messages.push({ type, text });
        }
    }
};
</script>

<style scoped>
    .asistant {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
    }
    h2 {
        font-size: 20px;
        color: white;
        font-family: 'OpenSans';
        line-height: 2;
    }
    .chat {
        display: flex;
        flex-direction: column;
        width: 100%;
        background: #1B1E3D;
        padding-bottom: 30px;
        border-radius: 10px;
    }
    .header {
        padding: 50px 30px;
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        background: #141433;
        border-radius: 10px 10px 0px 0px;
        border-bottom: 1px solid white;
    }
    .header h3 {
        font-family: 'OpenSans';
        color: white;
        font-size: 24px;
    }
    .header span {
        font-family: 'OpenSans';
        color: white;
        font-size: 18px;
    }
    .messages {
       display: flex;
       flex-direction: column;
       row-gap: 30px;
       height: 500px;
       padding: 50px 0px;
       overflow: hidden;
       overflow-y: scroll;
    }
    .messages::-webkit-scrollbar {
        width: 0;  
        height: 0;
    }

    .messages::-webkit-scrollbar-thumb {
        background: transparent;
    }
    .ai_msg, .user_msg {
        width: 60%;
        padding: 20px;
        color: white;
        font-size: 16px;
        font-family: 'OpenSans';
    }
    .ai_msg {
        align-self: flex-start;
        background: #282847;
        border-radius: 0px 10px 10px 0px;
    }
    .user_msg {
        align-self: flex-end;
        background: #50506F;
        border-radius: 10px 0px 0px 10px;
    }
    .input_field {
        width: 90%;
        position: relative;
        display: flex;
        flex-direction: column;
        row-gap: 15px;
        align-self: center;
    }
    .counter {
        position: absolute;
        top: -40px;
        right: 10px;
        color: white;
        font-size: 14px;
        opacity: .5;
        font-family: 'OpenSans';
    }
    textarea {
        width: 100%;
        height: 170px;
        padding: 20px;
        box-sizing: border-box;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.5);
        background: none;
        border: 1px solid white;
        border-radius: 10px;
        font-family: 'OpenSans';
        position: relative;
        
    }
    .btn {
        align-self: flex-end;
        width: 100px;
        font-size: 12px;
    }
</style>