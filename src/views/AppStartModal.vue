<template>
    <section class="modal">
        <img src="@/assets/images/close.png" class="close">
        <div class="text_wrapper">
            <h1>АВТОРИЗАЦИЯ</h1>
            <span>Чтобы авторизироваться воспользуйся VK ID</span>
        </div>
        <hr>
        <div class="btn_wrapper">
            <AppGoodButton class="btn" :text="text" :disabled="isDisabled" @click="tap"/>
            <AppBadButton class="btn" :text="text2" />
        </div>
        <img src="@/assets/images/auth_image.png" class="left_image">
        <img src="@/assets/images/auth_image.png" class="right_image">
    </section>
</template>

<script>

    import AppBadButton from '@/components/AppBadButton.vue';
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import { getToken, addReferer, refreshToken } from '@/services/auth';
    import { getUserInfo } from '@/services/user';

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
                isDisabled: true,
            }
        },
        mounted() {
            this.handleUrlParams();
        },
        async created() {
            // тут делаем редирект в ЛК, если живой пользователь решит перейти в lk.intelektaz.com (а не в /home)
            if (localStorage.length == 0) window.location.reload();
            this.isDisabled = localStorage.getItem("isDisabled") || false;
            const token = localStorage.getItem("token_refresh");
            if (token) {
                const resp = await refreshToken(token); // проверяем, что токен валидный
                if (resp) {
                    localStorage.setItem("token_refresh", resp.refresh_token);
                    localStorage.setItem("token", resp.access_token);
                    const user = await getUserInfo(localStorage.getItem("token"));
                    if (user && user.activation) {
                        localStorage.setItem("page", 1);
                        localStorage.setItem("points", 0);
                        this.$router.push('/home');
                        return;
                    }
                    if (user && !user.activation) {
                        localStorage.setItem("points", 0);
                        this.$router.push('/signup_1');
                        return;
                    }
                }
            }

            // 210966706
            console.log(!localStorage.getItem("first"));
            if (!localStorage.getItem("first")) {
                localStorage.clear(); // почистить хранилище, если пользователь первый раз зашёл
                const urlParams = new URLSearchParams(window.location.search); // сохраняем реферера, если по реф ссылке перешёл юзер
                localStorage.setItem("referer", urlParams.get('ref'));
                console.log(urlParams.get('ref'))
                localStorage.setItem("first", true); // будет редирект с вк сюда, так что нельзя чистить после него
        }
            
        },
        methods: {
            async tap() {
                if (!this.isDisabled) {
                    this.isDisabled = true;
                    localStorage.setItem("isDisabled", this.isDisabled);
                    // штука, чтобы параметры только один раз генерировались
                    const isParams = localStorage.getItem("isParams"); 
                    if (isParams != "true") {
                        console.log("генерируются параметры новые");
                        const pkce = await this.generatePKCE();
                        this.code_verifier = pkce.codeVerifier;
                        this.code_challenge = pkce.codeChallenge;
                        localStorage.setItem("isParams", "true");
                    }

                    // схема "Обмен на бэкенде без SDK"
                    const clientId = "52191705";
                    const redirectUri = this.redirectUrl;
                    const state = this.state;
                    const code_challenge = this.code_challenge;
                    const code_challenge_method = this.code_challenge_method;
                    const scopes = "groups,photos,wall,video,stats";
                    localStorage.setItem('zopa', code_challenge);   

                    const vkAuthUrl = `https://id.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}&code_challenge=${code_challenge}&code_challenge_method=${code_challenge_method}&scope=${scopes}`;
                    try {
                        window.location.href = vkAuthUrl;
                    } catch(err) {
                        const ref = localStorage.getItem("referer");
                        localStorage.clear();
                        localStorage.setItem("first", true);
                        localStorage.setItem("referer", ref);
                    }
                }
                
            },
            async handleUrlParams() {

                // считываем параметры, которые вк отдаёт
                const params = new URLSearchParams(window.location.search);
                const code = params.get("code");
                const state = params.get("state");
                const device_id = params.get("device_id");
                const code_verifier = localStorage.getItem("code_verifier");

                if (code && state && device_id) {
                    const response = await getToken(code, state, code_verifier, device_id, this.redirectUrl);
                    if (response.status == 200) {
                        // оставляем только эти три поля, которые будут использоваться на страницах
                        const ref = localStorage.getItem("referer");
                        localStorage.clear();
                        localStorage.setItem("token", response.data.access_token);
                        localStorage.setItem("token_refresh", response.data.refresh_token);
                        localStorage.setItem("is_new_user", response.data.is_new_user);

                        try {
                            const user = await getUserInfo(localStorage.getItem("token"));
                            const refererId = ref; // если есть рефер, то отмечаем это
                            console.log("refererId", refererId);
                            
                            if (response.data.is_new_user) {
                                if (refererId) {
                                    const resp = await addReferer(refererId, user.id);
                                    console.log(resp);
                                    if (!resp.status) console.log(resp.message);
                                }   
                                localStorage.setItem("points", 0);
                                this.$router.push('/signup_1');
                            }
                            else {
                                localStorage.setItem("points", 0);
                                localStorage.setItem("page", 1);
                                this.$router.push('/home');
                            }
                        } catch(err) {
                            const referal = localStorage.getItem("referer");
                            localStorage.clear();
                            localStorage.setItem("first", true);
                            localStorage.setItem("referer", referal);
                            location.reload();
                        }
                        
                    } else {
                        const ref = localStorage.getItem("referer");
                        localStorage.clear();
                        localStorage.setItem("first", true);
                        localStorage.setItem("referer", ref);
                        location.reload();
                    }
                     
                } else {
                    console.warn("Параметры code, state или device_id отсутствуют в URL.");
                }
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
            min-height: 300px;
        }
        @media (max-width: 650px) {
            /* padding: 25px 20px; */
            min-height: 300px;
        }
        @media (max-width: 500px) {
            padding-top: 61px;
            padding-bottom: 51px;
            padding-left: 20px;
            padding-right: 20px;
            height: 390px;
            min-width: 331px;
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
            min-height: 300px;
        }
        @media (max-width: 650px) {
            min-height: 300px;
        }
        @media (max-width: 500px) {
            min-height: 390px;
            min-width: 331px;
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
            font-size: 32px;
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
        @media (max-width: 400px) {
            font-size: 16px;
        }
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
        @media (max-width: 500px) {
            width: 100%;
            margin-top: 30px;
            margin-bottom: 30px;
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

    .btn {
        @media (max-width: 500px) {
            width: 170px !important;
            height: 51px !important;
            font-size: 14px;
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
        @media (max-width: 550px) {
            width: 58px;
            height: 58px;
            bottom: 73px;
            left: 5px;
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
        @media (max-width: 550px) {
            width: 50px;
            height: 50px;
            bottom: 33px;
            right: 5px;
        }
    }
</style>