<template>
    <div v-if="visibility1" class="modal_wrapper" id="modal_wrapper">
        <section class="modal">
            <img src="@/assets/images/close.png" class="close" @click="close">
            <span>{{ message }}</span>
            <div class="row">
                <AppBadButton :text="'ДА'" class="btn" @click="yes" />
                <AppBadButton :text="'ОТМЕНА'" class="btn" @click="no" />
            </div>
        </section>
    </div>
</template>

<script>
    import AppBadButton from '@/components/AppBadButton.vue';
    export default {
        components: { AppBadButton },
        props: {
            title: String,
            message: String,
            visibility1: Boolean,
        },
        watch: {
            visibility1(newValue) {
                console.log("ЭТО В МОДАЛ: ", newValue);
            }
        },
        methods: {
            yes() {
                this.$emit('yes');
            },
            no() {
                this.$emit('no');
            },
            close() {
                if (this.visibility1) {
                    this.$emit('update:visibility1', false);
                }
                this.$emit('close'); 
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

    .row {
        display: flex;
        column-gap: 30px;
        margin-top: 34px;
    }
    .btn {
        width: 170px;
        height: 51px;
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
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal {
        width: 560px;
        height: 182px;
        border-radius: 10px;
        position: relative; /* Обеспечиваем позиционирование для псевдоэлемента */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 50px;
        z-index: 2;
        overflow-y: auto;
        scrollbar-width: none;
        /* row-gap: 20px; */
        box-sizing: border-box;
        margin-top: -50px;
        align-self: center;
        background: #1B1E3D;
        border-radius: 10px;
        @media (max-width: 1400px) {
            width: 80vw;
        }
        @media (max-width: 650px) {
            width: 90vw;
            padding: 30px 15px;
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
        @media (max-width: 500px) {
            font-size: 30px;
        }
    }
    span {
        font-size: 18px;
        font-family: 'OpenSans';
        color: white;
        text-wrap: wrap;
        text-align: center;
        font-family: 'OpenSans';
        @media (max-width: 900px) {
            font-size: 20px;
        }
        @media (max-width: 650px) {
            font-size: 17px;
        }
    }
    .left_image {
        position: absolute;
        bottom: 47px;
        left: 37px;
        width: 60px;
        height: 60px;
        transform: rotate(-140deg);
        @media (max-width: 900px) {
            width: 70px;
            height: 70px;
        }
        @media (max-width: 650px) {
            width: 81px;
            height: 81px;
            top: 23px;
            left: 5px;
        }
    }
    .right_image {
        position: absolute;
        top: 17px;
        right: 89px;
        width: 112px;
        height: 112px;
        transform: rotate(16deg);
        @media (max-width: 900px) {
            width: 70px;
            height: 70px;
        }
        @media (max-width: 650px) {
            width: 50px;
            height: 50px;
            right: 15px;
            bottom: 45px;
            top: auto;
        }
    }
</style>