<template>
    <section class="modal">
        <img src="@/assets/images/close.png" class="close">
        <div class="text_wrapper">
            <h1>АВТОРИЗАЦИЯ</h1>
            <span>Чтобы авторизироваться воспользуйся VK ID</span>
        </div>
        <hr>
        <div class="btn_wrapper">
            <AppGoodButton :text="text" @click="routNextPage" />
            <AppBadButton :text="text2" />
            <div id="VkIdSdkOneTap"></div>
            <!-- <span style="font-size: 14px; position: absolute; bottom: 0; left: 10; cursor: pointer;" @click="userVKInfo">userVKInfo</span> -->
        </div>
        <img src="@/assets/images/auth_image.png" class="left_image">
        <img src="@/assets/images/auth_image.png" class="right_image">
    </section>
</template>

<script>

    import AppBadButton from '@/components/AppBadButton.vue';
    import AppGoodButton from '@/components/AppGoodButton.vue';
    // import { checkUserAuthorization } from '@/services/auth';
    import { silentTokenBack } from '@/services/auth';
    import * as VKID from '@vkid/sdk';
    import { useRoute } from 'vue-router';

    const route = useRoute();

    export default {
        components: { AppBadButton, AppGoodButton },
        mounted() {
            VKID.Config.init({
                app: 52936208, 
                state: 'bhbt4h3vtv6v6b34',
                scopes: [
                    "phone"
                ],
                redirectUrl: "https://lk.intelektaz.com/auth/start_process_auth", // сюда полный путь, какой будет на проде
                code_verifier: "t4bth45by54hby54"
            });
            const oneTap = new VKID.OneTap();

            const container = document.getElementById('VkIdSdkOneTap');

            if (container) {
                oneTap.render({ container: container, scheme: VKID.Scheme.LIGHT, lang: VKID.Languages.RUS });
            } else {
                console.error('Container not found!');
            }
        },
        methods: {
            async routNextPage() {
                // ЗДЕСЬ ПРОВЕРКА, АВТОРИЗОВАН ПОЛЬЗОВАТЕЛЬ ИЛИ НЕТ
                // const isAuthorized = await checkUserAuthorization();
                // if (isAuthorized) {
                //     this.$router.push('/home');
                // } else {
                //     this.$router.push('/signup_1');
                // }
                // this.$router.push('/home');
                this.$router.push('/signup_1');
            },
            async userVKInfo() {
                // аналогично функции submitSilentTockenToBack из видео
                const payload = route.query.payload;
                console.log('Полученные данные:', payload);

                const user_info = await silentTokenBack(payload);
                console.log(user_info);
            }
        },      
        data() {
            return {
                text: "ВОЙТИ",
                text2: "ОТМЕНИТЬ",
                text3: "userVKInfo"
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

    .modal {
        width: 760px;
        height: 437px;
        border-radius: 10px;
        position: relative; /* Обеспечиваем позиционирование для псевдоэлемента */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 50px 0px;
        z-index: 2;
        align-self: center;
        margin-top: -50px;
        @media (max-width: 900px) {
            width: 80vw;
            height: 60vh;
        }
        @media (max-width: 650px) {
            padding: 25px 20px;
            height: 300px;
        }
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

    .modal::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url("@/assets/images/background.png");
        background-color: #1B1E3D;
        background-size: cover;
        background-position: center;
        background-blend-mode: multiply;
        opacity: 0.25; /* Прозрачность только для фона */
        background-size: 300%;
        filter: brightness(140%) contrast(80%);
        border-radius: 10px;
        @media (max-width: 900px) {
            width: 80vw;
            height: 60vh;
        }
        @media (max-width: 650px) {
            height: 300px;
        }
    }

    .text_wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 10px;
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
        font-size: 24px;
        font-family: 'OpenSans';
        font-weight: 400;
        line-height: 32.68px;
        color: white;
        text-wrap: wrap;
        text-align: center;
        @media (max-width: 900px) {
            font-size: 20px;
        }
        @media (max-width: 650px) {
            font-size: 17px;
        }
        @media (max-width: 550px) {
            font-size: 15px;
        }
        @media (max-width: 450px) {
            font-size: 13px;
        }
    }
    hr {
        width: 640px;
        height: 1px;
        background-color: white;
        @media (max-width: 900px) {
            width: 80%;
        }
    }

    .btn_wrapper {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        @media (max-width: 420px) {
            row-gap: 10px;
        }
    }

    .left_image {
        position: absolute;
        bottom: 120px;
        left: 69px;
        width: 85px;
        height: 85px;
        transform: rotate(157deg);
        @media (max-width: 900px) {
            width: 70px;
            height: 70px;
        }
        @media (max-width: 650px) {
            display: none;
        }
    }
    .right_image {
        position: absolute;
        bottom: 30px;
        right: 51px;
        width: 101px;
        height: 101px;
        transform: rotate(16deg);
        @media (max-width: 900px) {
            width: 70px;
            height: 70px;
        }
        @media (max-width: 650px) {
            display: none;
        }
    }
</style>