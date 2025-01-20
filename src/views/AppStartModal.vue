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
            <!-- <span style="font-size: 14px; position: absolute; bottom: 0; left: 10; cursor: pointer;" @click="result">userVKInfo</span> -->
        </div>
        <img src="@/assets/images/auth_image.png" class="left_image">
        <img src="@/assets/images/auth_image.png" class="right_image">
    </section>
</template>

<!-- <script src="https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js"></script> -->
<script>

    import AppBadButton from '@/components/AppBadButton.vue';
    import AppGoodButton from '@/components/AppGoodButton.vue';
    // import { checkUserAuthorization } from '@/services/auth';
    import { getToken } from '@/services/auth';
    import * as VKID from '@vkid/sdk';
    // import { useRoute } from 'vue-router';

    // const route = useRoute();

    export default {
        components: { AppBadButton, AppGoodButton },
        data() {
            return {
                text: "ВОЙТИ",
                text2: "ОТМЕНИТЬ",
                text3: "userVKInfo",
                code_verifier: "",
                code_challenge: "",
                code_challenge_method: "S256",
                state: "grehthrtjui7643trr",
                code: "",
                device_id: ""
            }
        },
        mounted() {
            

            this.generatePKCE().then((pkce) => {
                console.log('Code Verifier:', pkce.codeVerifier);
                console.log('Code Challenge:', pkce.codeChallenge);
                console.log('Code Challenge Method:', pkce.codeChallengeMethod);
            });
            VKID.Config.init({
                app: 52936208, 
                state: this.state,
                codeChallenge: this.code_challenge,
                redirectUrl: "https://lk.intelektaz.com/signup_1", // сюда полный путь, какой будет на проде
            });

            const oneTap = new VKID.OneTap();

            const container = document.getElementById('VkIdSdkOneTap');

            oneTap.render({
                container: container,
                scheme: VKID.Scheme.LIGHT,
                lang: VKID.Languages.RUS
            })
            .on(VKID.WidgetEvents.ERROR, (error) => { console.log(error); })
            .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, async function (payload) {
                const code = payload.code;
                const device_id = payload.device_id;
                const state = payload.state;
                console.log("On", this.codeVerifier);

                const user_info = await getToken(code, state, device_id, this.codeVerifier);
                console.log(user_info);
                // VKID.Auth.exchangeCode(code, deviceId)
                // .then(vkidOnSuccess)
                // .catch(vkidOnError);
            });

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

            // Функция для генерации случайной строки
            generateCodeVerifier(length = 64) {
                const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.';
                let codeVerifier = '';
                for (let i = 0; i < length; i++) {
                    codeVerifier += validChars.charAt(Math.floor(Math.random() * validChars.length));
                }
                return codeVerifier;
            },

            // Преобразование строки в Base64 URL-safe
            base64UrlEncode(buffer) {
                return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=+$/, '');
            },
            async generatePKCE() {
                const codeVerifier = this.generateCodeVerifier();
                const codeChallenge = await this.generateCodeChallenge(codeVerifier); 
                const codeChallengeMethod = 'S256'; 

                return {
                    codeVerifier,
                    codeChallenge,
                    codeChallengeMethod
                };
            },

            // Генерация code_challenge из code_verifier
            async generateCodeChallenge(codeVerifier) {
                const encoder = new TextEncoder();
                const data = encoder.encode(codeVerifier);
                const digest = await crypto.subtle.digest('SHA-256', data);
                return this.base64UrlEncode(digest);
            },
        },      
        
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