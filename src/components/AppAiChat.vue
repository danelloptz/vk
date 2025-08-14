<template>
    <section class="ass">
        <h2>ИИ помощник</h2>
        <h2>Вы можете задать любой вопрос ИИ помощнику, или создать индивидуальный, нестандартный контент, просто описав подробный промпт.</h2>
        
        <div class="chat">
            <div class="header">
                <h3>Новый разговор</h3>
                <span>{{ messages.length }} сообщений</span>
            </div>

            <!-- Блок сообщений -->
            <div class="messages">
                <div v-for="(message, index) in messages" :key="index" :class="message.creator" v-html="formatedMessage(message.text)"></div>
            </div>

            <div class="loader" v-if="isWaiting"></div>
            <!-- Поле ввода -->
            <div class="input_field">
                <span class="counter">{{ msg.length }}/2000</span>
                <textarea 
                    v-model="msg"
                    placeholder="Ваше сообщение"
                    maxlength="2000"
                    @keydown="handleKeyDown"
                ></textarea>
                <AppGoodButton :text="text1" class="btn" @click="sendMessage" />
            </div>
        </div>
    </section>
</template>

<script>
import AppGoodButton from '@/components/AppGoodButton.vue';
import { getChat, sendChatMessage } from '@/services/ai';

export default {
    components: { AppGoodButton },
    props: {
        userData: Object
    },
    data() {
        return {
            msg: "",
            text1: "ОТПРАВИТЬ",
            messages: [], // Список всех сообщений,
            data: [],
            isWaiting: false
        };
    },
    methods: {
        async sendMessage() {
            if (!this.msg.trim() || this.isWaiting) return;

            this.addMessage(this.msg);
            const message = this.msg;
            this.msg = "";

            this.isWaiting = true;
            if (this.messages.length > 50) {
                this.messages = this.messages.slice(-50);
            }
            const resp = await sendChatMessage(message, this.messages, this.data.thread_id, this.data.dialog_id);
            this.data = resp;
            this.messages = resp.messages;
            if (this.messages.length > 50) {
                this.messages = this.messages.slice(-50);
            }
            this.isWaiting = false;
            this.scrollToBottom();
        },
        addMessage(text) {
            const date = new Date();
            this.messages.push({
                "creator": "user",
                "text": text,
                "date_created": String(Math.floor(date / 1000))
            });
        },
        formatedMessage(message) {
            let parsedMessage = message;
            try {
                parsedMessage = JSON.parse(message);
            } catch (error) {
                console.warn("Строка не является JSON, оставляем как есть:", error);
            }

            const new_msg = parsedMessage.replace(/"/g, "").replace(/\n/g, "<br>");
            console.log(new_msg);
            return new_msg;
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const messagesContainer = this.$el.querySelector('.messages');
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            });
        },
        handleKeyDown(event) {
            // Если нажат Enter и не зажат Ctrl
            if (event.key === "Enter" && !event.ctrlKey) {
                event.preventDefault(); // Отменяем стандартное поведение (перенос строки)
                this.sendMessage(); // Отправляем сообщение
            }

            // Если нажат Enter и зажат Ctrl
            if (event.key === "Enter" && event.ctrlKey) {
                event.preventDefault(); // Отменяем стандартное поведение
                this.msg += "\n"; // Добавляем перенос строки
            }
        },
    },
    async created() {
        const resp = await getChat(this.userData.id);
        this.data = resp;
        this.messages = resp.messages;
        if (this.messages.length > 50) {
            this.messages = this.messages.slice(-50);
        }
        this.scrollToBottom();
    }
};
</script>

<style scoped>
    .ass {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
        @media (max-width: 650px) {
            row-gap: 10px;
        }
    }
    h2 {
        font-size: 20px;
        color: white;
        font-family: 'OpenSans';
        line-height: 2;
        @media (max-width: 650px) {
            font-size: 16px;
        }
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
        @media (max-width: 650px) {
            padding: 10px;
        }
    }
    .header h3 {
        font-family: 'OpenSans';
        color: white;
        font-size: 24px;
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    .header span {
        font-family: 'OpenSans';
        color: white;
        font-size: 18px;
        @media (max-width: 650px) {
            font-size: 14px;
        }
    }
    .messages {
       display: flex;
       flex-direction: column;
       row-gap: 30px;
       height: 500px;
       padding: 50px 6px;
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
    .assistant, .user {
        width: 60%;
        padding: 20px;
        color: white;
        font-size: 16px;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            max-width: 200px;
            padding: 10px;
            font-size: 14px;
        }
    }
    .assistant {
        align-self: flex-start;
        background: #282847;
        border-radius: 0px 10px 10px 0px;
    }
    .user {
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
        @media (max-width: 650px) {
            width: 100%;
            padding: 0px 6px;
        }
    }
    .counter {
        position: absolute;
        top: -40px;
        right: 10px;
        color: white;
        font-size: 14px;
        opacity: .5;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 12px;
        }
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
        @media (max-width: 650px) {
            height: 160px;
        }
    }
    .btn {
        align-self: flex-end;
        width: 100px;
        font-size: 12px;
        @media (max-width: 650px) {
            font-size: 10px;
            width: 90px;
            height: 29px;
        }
    }
    /* HTML: <div class="loader"></div> */
    .loader {
    width: 60px;
    aspect-ratio: 2;
    --_g: no-repeat radial-gradient(circle closest-side,white 90%,rgba(255, 255, 255, 0));
    background: 
        var(--_g) 0%   50%,
        var(--_g) 50%  50%,
        var(--_g) 100% 50%;
    background-size: calc(100%/3) 50%;
    animation: l3 1s infinite linear;
    margin-left: 30px;
    margin-bottom: 30px;
    @media (max-width: 650px) {
        width: 30px;
        margin-left: 10px;
        margin-bottom: 10px;
    }
    }
    @keyframes l3 {
        20%{background-position:0%   0%, 50%  50%,100%  50%}
        40%{background-position:0% 100%, 50%   0%,100%  50%}
        60%{background-position:0%  50%, 50% 100%,100%   0%}
        80%{background-position:0%  50%, 50%  50%,100% 100%}
    }
</style>