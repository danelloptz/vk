<template>
    <div v-if="visibility1" class="modal_wrapper" id="modal_wrapper">
        <section class="modal">
            <div class="modal-background"></div>
            <img src="@/assets/images/close.png" class="close" @click="close">
            <h1>ПОЛУЧИ VIP ТАРИФ НА МЕСЯЦ В ПОДАРОК!</h1>
            <span>Розыгрыш проходит 1го числа каждого месяца. После розыгрыша все балы обнуляются. Условия участия в розыгрыше VIP тарифа:</span>
            <span>1. Собери 100 балов. 1 клик = 1 балл. Доступно 1 раз в час. <br>
                    2. Должно быть включено автопродвижение. Если оно выключено, то при нажатии на «Получить 1 балл», автопродвижение включается автоматически.</span>
            <AppGoodButton :text="text1" class="btn" @click="getPoint" />
            <img src="@/assets/images/auth_image.png" class="left_image">
            <img src="@/assets/images/auth_image.png" class="right_image">
            <img src="@/assets/images/gift_box.png" class="gift_image">
        </section>
    </div>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import { addGiftScore, setAutoposting } from "@/services/user";
    export default {
        components: { AppGoodButton },
        props: {
            visibility1: Boolean,
            vk_id: Number,
            autoposting: Boolean,
            id: String,
            time: Number    
        },
        data() {
            return {
                text1: "ПОЛУЧИТЬ 1 БАЛЛ",
                title: "",
                msg: "",
                disabled: false,
            }
        },  
        methods: {
            close() {
                if (this.visibility1) {
                    this.$emit('update:visibility1', false);
                }
                this.$emit('close'); 
            },
            async getPoint() {
                if (this.disabled) return;
                console.log(this.disabled);
                this.disabled = true;
                const time = this.time * 1000 || 86400000;
                const points = localStorage.getItem("points");
                const dif = new Date().getTime() - time;
                this.isModal = true;
                if (dif > 60 * 60 * 1000 && points < 100) {
                    await addGiftScore(this.vk_id);
                    if (!this.autoposting) {
                        const set_autoposting = await setAutoposting(this.id, true);
                        console.log("set_autoposting: ", set_autoposting);
                    }
                    this.disabled = false;
                    localStorage.setItem("points", +points + 1);
                    localStorage.setItem("last_point", new Date().getTime());
                    this.$emit('clicked');
                } else {
                    this.$emit('error');
                }
            }
        }
    };
</script>


<style scoped>
    @font-face {
        font-family: 'Tektur';
        src: url('@/assets/fonts/Tektur.ttf') format('truetype');
    }
    @font-face {
        font-family: 'OpenSans';
        src: url('@/assets/fonts/OpenSans.ttf') format('truetype');
    }

    h3 {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        font-weight: normal;
    }
    h1, h2, span, img {
        z-index: 5;
    }
    .modal_wrapper {
        width: 100vw;
        height: 100vh;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 900;
        background: #070a29;
        display: flex;
        justify-content: center;
        align-items: center;
        @media (max-width: 650px) {
            height: auto;
        }
    }

    .modal {
        width: 1160px;
        height: 450px;
        border-radius: 10px;
        position: relative;
        display: flex;
        flex-direction: column;
        /* align-items: center; */
        justify-content: center;
        padding: 50px;
        z-index: 10;
        overflow-y: auto;
        scrollbar-width: none;
        row-gap: 20px;
        box-sizing: border-box;
        margin-top: -50px;
        align-self: center;
        @media (max-width: 1400px) {
            width: 80vw;
            height: auto;
        }
        @media (max-width: 650px) {
            width: 90vw;
            height: auto;
            margin-top: 0px;
            padding: 30px 10px;
            padding-top: 61px;
        }
    }

    .modal::-webkit-scrollbar {
        width: 0;  
        height: 0;
    }

    .modal::-webkit-scrollbar-thumb {
        background: transparent;
    }

    .close {
        position: absolute;
        right: 30px;
        top: 30px;
        width: 21px;
        height: 21px;
        cursor: pointer;
        @media (max-width: 450px) {
            right: 20px;
            top: 20px;
        }
    }
    .modal-background {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url("@/assets/images/background.png");
        background-color: #1B1E3D;
        background-size: contain;
        background-position: center;
        background-blend-mode: multiply;
        background-repeat: repeat-y;
        opacity: 0.25; 
        background-size: 300%;
        filter: brightness(140%) contrast(80%);
        border-radius: 10px;
    }

    h1 {
        font-size: 48px;
        color: white;
        font-family: 'Tektur';
        line-height: 62.4px;
        font-weight: 400;
        @media (max-width: 900px) {
            font-size: 35px;
        }
        @media (max-width: 650px) {
            font-size: 24px;
            line-height: normal;
        }
    }
    span {
        font-size: 18px;
        font-family: 'OpenSans';
        font-weight: 400;
        line-height: 32.68px;
        color: white;
        text-wrap: wrap;
        text-align: left;
        font-family: 'OpenSans';
        width: 70%;
        @media (max-width: 1000px) {
            width: 100%;
        }
        @media (max-width: 900px) {
            font-size: 20px;
        }
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    .left_image {
        position: absolute;
        bottom: 30px;
        right: 190px;
        width: 60px;
        height: 60px;
        transform: rotate(153deg);
        @media (max-width: 1000px) {
            display: none;
        }
    }
    .right_image {
        position: absolute;
        bottom: 178px;
        right: 20px;
        width: 60px;
        height: 60px;
        transform: rotate(10deg);
        @media (max-width: 1000px) {
            display: none;
        }
    }
    .gift_image {
        position: absolute;
        bottom: 50px;
        right: 50px;
        width: 131px;
        height: 131px;
        transform: rotate(-20deg);
        @media (max-width: 1000px) {
            display: none;
        }
    }
    .btn {
        width: 200px;
        align-self: center;
        @media (max-width: 650px) {
            margin-bottom: 50px;
        }
    }
</style>