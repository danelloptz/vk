<template>
    <section class="modal">
        <img src="@/assets/images/close.png" class="close">
        <div class="text_wrapper">
            <h1>АВТОРИЗАЦИЯ</h1>
            <span>Чтобы авторизироваться воспользуйся VK ID</span>
        </div>
        <hr>
        <div class="btn_wrapper">
            <AppGoodButton :text="text" @click="tap"/>
            <!-- <AppGoodButton :text="text" @click="routNextPage" /> -->
            <AppBadButton :text="text2" />
            <!-- <div id="VkIdSdkOneTap"></div> -->
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
    import { getToken, addReferer } from '@/services/auth';
    import { getUserInfo } from '@/services/user';
    // import { getUserInfo } from '@/services/user';
    // import * as VKID from '@vkid/sdk';
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
                device_id: "",
                redirectUrl: "https://lk.intelektaz.com",
            }
        },
        mounted() {
            this.handleUrlParams();
        },
        async created() {
            if (!localStorage.getItem("first")) localStorage.clear();
            localStorage.setItem("first", true);
            const urlParams = new URLSearchParams(window.location.search);
            localStorage.setItem("referer", urlParams.get('ref'));
        },
        methods: {
            async tap() {
                const isParams = localStorage.getItem("isParams");
                if (isParams != "true") {
                    const pkce = await this.generatePKCE();
                    this.code_verifier = pkce.codeVerifier;
                    this.code_challenge = pkce.codeChallenge;
                    localStorage.setItem("isParams", "true");
                }

                const clientId = "52191705";
                const redirectUri = this.redirectUrl;
                const state = this.state;
                const code_challenge = this.code_challenge;
                const code_challenge_method = this.code_challenge_method;

                const vkAuthUrl = `https://id.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}&code_challenge=${code_challenge}&code_challenge_method=${code_challenge_method}`;
                window.location.href = vkAuthUrl;
            },
            async handleUrlParams() {
                const params = new URLSearchParams(window.location.search);
                const code = params.get("code");
                const state = params.get("state");
                const device_id = params.get("device_id");
                const code_verifier = localStorage.getItem("code_verifier");

                if (code && state && device_id) {
                    console.log("Параметры найдены:", { code, state, device_id });

                    const response = await getToken(code, state, code_verifier, device_id, this.redirectUrl);
                    if (response.status == 200) {
                        localStorage.clear();
                        localStorage.setItem("token", response.data.access_token);
                        localStorage.setItem("token_refresh", response.data.refresh_token);
                        localStorage.setItem("is_new_user", response.data.is_new_user);

                        const user = await getUserInfo(localStorage.getItem("token"));
                        const refererId = localStorage.getItem("referer");
                        if (refererId) {
                            const resp = await addReferer(refererId, user.id);
                            if (!resp.status) console.log(resp.message);
                        }
                        if (response.data.is_new_user) 
                            this.$router.push('/signup_1')
                        else 
                            this.$router.push('/home');
                    } 
                } else {
                    console.warn("Параметры code, state или device_id отсутствуют в URL.");
                }
            },
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
                console.log("генерация code_verifier");
                const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                let codeVerifier = "";
                for (let i = 0; i < length; i++) {
                    codeVerifier += validChars.charAt(Math.floor(Math.random() * validChars.length));
                }
                if (localStorage.getItem("code_verifier") === null)
                    localStorage.setItem("code_verifier", codeVerifier);
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