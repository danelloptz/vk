<template>
    <AppMandatoryChannels 
        v-if="isMandatory"
        :visibility1="isMandatory"
        :channels="channels"
        @update:visibility1="isMandatory = $event"
        @close="reload"
    />
    <section class="modal">
        <img src="@/assets/images/close.png" class="close" @click=reboot>
        <div class="text_wrapper">
            <h1>АВТОРИЗАЦИЯ</h1>
            <span class="text_wrapper_text">Чтобы авторизироваться воспользуйся VK ID</span>
        </div>
        <hr class="line">
        <div class="btn_wrapper">
            <div 
                style="z-index: 999;" 
                ref="tgButton" 
            ></div> <!-- Контейнер для кнопки Telegram -->
            <AppBadButton class="btn" :text="'РЕГИСТРАЦИЯ ТЕЛЕГРАММ'" @click="signUpTg" />
            <AppGoodButton class="btn vk_btn" :text="'ВХОД ВК'" :disabled="isDisabled" @click="tap"/>
            <AppBadButton class="btn" :text="'РЕГИСТРАЦИЯ ВК'" :disabled="isDisabled" @click="tap"/>
        </div>
        <img src="@/assets/images/auth_image.png" class="left_image">
        <img src="@/assets/images/auth_image.png" class="right_image">
    </section>
</template>

<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppBadButton from '@/components/AppBadButton.vue';
    import AppMandatoryChannels from '@/components/AppMandatoryChannels.vue';
    import { getToken, addReferer, refreshToken } from '@/services/auth';
    import { getUserInfo } from '@/services/user';
    import { tgLogin, getTokensByCode, getMandatoryChannels, getVkToken } from '@/services/tg';


    export default {
        components: { AppGoodButton, AppMandatoryChannels, AppBadButton },
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
                btnHtml: "",
                isMandatory: false,
                channels: null
            }
        },
        async mounted() {
            this.handleUrlParams();
            // Загружаем кнопку Telegram
            const script = document.createElement("script");
            script.async = true;
            script.src = "https://telegram.org/js/telegram-widget.js?22";
            script.setAttribute("data-telegram-login", "IntelektazTGBot");
            script.setAttribute("data-size", "large");
            script.setAttribute("data-auth-url", "https://lk.intelektaz.com/login");
            script.setAttribute("data-request-access", "write");
            script.setAttribute("data-userpic", "false");
            script.setAttribute("data-radius", "10");

            // Добавляем в контейнер, чтобы кнопка встроилась в нужное место
            this.$refs.tgButton.appendChild(script);

            // Наблюдаем появление кнопки
            const observer = new MutationObserver(() => {
                const btn = document.getElementById("telegram-login-IntelektazTGBot");
                if (btn) {
                    btn.style.height = "51px";
                    observer.disconnect(); // перестаём слушать
                }
            });

            observer.observe(this.$refs.tgButton, { childList: true, subtree: true });
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
                        if (user?.tg_id) {
                            this.channels = await getMandatoryChannels(localStorage.getItem('token'));
                            if (this.channels.length == 0) 
                                this.$router.push('/home')
                            else {
                                localStorage.clear();
                                this.isMandatory = true;
                            }
                            return;
                        }
                        else {
                            this.$router.push('/home');
                        }
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
                const referer = localStorage.getItem("referer");
                const addGroups = localStorage.getItem("addGroups");
                const watchedVideos = localStorage.getItem("watchedVideos");
                const addPosts = localStorage.getItem("addPosts");
                const sponsor_platform = localStorage.getItem("sponsor_platform");
                localStorage.clear(); // почистить хранилище, если пользователь первый раз зашёл
                const urlParams = new URLSearchParams(window.location.search); // сохраняем реферера, если по реф ссылке перешёл юзер
                localStorage.setItem("referer", urlParams.get('ref') || referer);
                localStorage.setItem("sponsor_platform", urlParams.get('platform') || sponsor_platform);
                if (addGroups) localStorage.setItem("addGroups", addGroups);
                if (watchedVideos) localStorage.setItem("watchedVideos", watchedVideos);
                if (addPosts) localStorage.setItem("addPosts", addPosts);
                console.log(urlParams.get('ref'))
                localStorage.setItem("first", true); // будет редирект с вк сюда, так что нельзя чистить после него
        }
            
        },
        methods: {
            reload() {
                location.reload();
            },
            signUpTg() {
                const referer = localStorage.getItem('referer');
                console.log(referer);
                if (referer) 
                    window.location.href = `https://t.me/IntelektazTGBot?start=ref=${referer}`
                else 
                    window.location.href = `https://t.me/IntelektazTGBot?start`;
            },
            reboot() {
                console.log("HERE");    
                const ref = localStorage.getItem("referer");
                const addGroups = localStorage.getItem("addGroups");
                const watchedVideos = localStorage.getItem("watchedVideos");
                const addPosts = localStorage.getItem("addPosts");
                localStorage.clear();
                localStorage.setItem("referer", ref);
                if (addGroups) localStorage.setItem("addGroups", addGroups);
                if (watchedVideos) localStorage.setItem("watchedVideos", watchedVideos);
                if (addPosts) localStorage.setItem("addPosts", addPosts);

                // const cleanUrl = window.location.origin + window.location.pathname; 
                // window.history.replaceState({}, document.title, cleanUrl);

                location.reload();
            },
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
                        const addGroups = localStorage.getItem("addGroups");
                        const watchedVideos = localStorage.getItem("watchedVideos");
                        const addPosts = localStorage.getItem("addPosts");
                        localStorage.clear();
                        if (addGroups) localStorage.setItem("addGroups", addGroups);
                        if (watchedVideos) localStorage.setItem("watchedVideos", watchedVideos);
                        if (addPosts) localStorage.setItem("addPosts", addPosts);
                        localStorage.setItem("first", true);
                        localStorage.setItem("referer", ref);
                    }
                }
                
            },
            base32Decode(input) {
                const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
                let bits = "";
                let output = "";

                input = input.replace(/=+$/, ""); // убрать padding

                for (let i = 0; i < input.length; i++) {
                    const val = alphabet.indexOf(input.charAt(i).toUpperCase());
                    if (val === -1) continue;
                    bits += val.toString(2).padStart(5, "0");
                }

                for (let i = 0; i + 8 <= bits.length; i += 8) {
                    const byte = bits.substring(i, i + 8);
                    output += String.fromCharCode(parseInt(byte, 2));
                }

                try {
                    // Декодировать UTF-8 (чтобы русские и emoji отображались нормально)
                    return decodeURIComponent(escape(output));
                } catch {
                    return output;
                }
            },

            async handleUrlParams() {
                const isAddVk = localStorage.getItem('isAddVK');
                if (isAddVk) {
                    const params = new URLSearchParams(window.location.search);
                    const code = params.get("code");
                    const state = params.get("state");
                    const device_id = params.get("device_id");
                    const code_verifier = localStorage.getItem("code_verifier");
                    const userId = localStorage.getItem('userId');

                    const response = await getVkToken(code, state, code_verifier, device_id, this.redirectUrl, userId);
                    if (response.is_new_user) {
                        localStorage.setItem("token", response.access_token);
                        localStorage.setItem("token_refresh", response.refresh_token);
                        localStorage.setItem("is_new_user", response.is_new_user);
                        this.$router.push('/signup_1');
                    } else {
                        this.$router.push('/home');
                    }
                }
                // считываем параметры, которые вк отдаёт
                const params = new URLSearchParams(window.location.search);
                const dlink = params.get("dlink");
                if (dlink) {
                    const resp = await getTokensByCode(dlink);
                    if (resp) {
                        localStorage.setItem("token", resp.access_token);
                        localStorage.setItem("token_refresh", resp.refresh_token);
                        localStorage.setItem("is_new_user", resp.is_new_user);
                        this.channels = await getMandatoryChannels(localStorage.getItem('token'));
                        if (this.channels.length == 0) 
                            this.$router.push('/home')
                        else {
                            localStorage.clear();
                            this.isMandatory = true;
                        }
                        // this.$router.push('/home');
                    }
                }
                const code = params.get("code");
                const state = params.get("state");
                const device_id = params.get("device_id");
                const code_verifier = localStorage.getItem("code_verifier");

                const sponsor_platform = localStorage.getItem('sponsor_platform');
                console.log(sponsor_platform);
                const tg_id = decodeURIComponent(params.get("id") || "");
                const first_name = decodeURIComponent(params.get("first_name") || "");
                const last_name = decodeURIComponent(params.get("last_name") || "");
                const username = decodeURIComponent(params.get("username") || "");
                const photo_url = decodeURIComponent(params.get("photo_url") || "");
                const auth_date = decodeURIComponent(params.get("auth_date") || "");
                const hash = params.get("hash") || "";
                let sponsor_id = localStorage.getItem('referer');
                if (sponsor_id.startsWith('tg')) {
                    sponsor_id = sponsor_id.slice(2);
                }

                const tg_ref = decodeURIComponent(params.get("ref") || "");
                if (tg_ref != "" && tg_ref.startsWith('tg')) {
                    localStorage.setItem('referer', tg_ref);
                }


                if (tg_id != "") {
                    const resp = await tgLogin(tg_id, first_name, last_name, username, photo_url, auth_date, hash, sponsor_id, sponsor_platform);
                    localStorage.setItem("token", resp.access_token);
                    localStorage.setItem("token_refresh", resp.refresh_token);
                    localStorage.setItem("is_new_user", resp.is_new_user);
                    console.log(resp);
                    if (resp) {
                        if (resp.is_new_user) this.$router.push('/signup_1')
                        else {
                            this.channels = await getMandatoryChannels(localStorage.getItem('token'));
                            if (this.channels.length == 0) 
                                this.$router.push('/home')
                            else {
                                localStorage.clear();
                                this.isMandatory = true;
                            }
                        } 
                    }
                    // this.$router.push('/signup_1');
                }

                if (code && state && device_id) {
                    let response;
                    try {
                        response = await getToken(code, state, code_verifier, device_id, this.redirectUrl);
                    } catch (err) {

                        const referal = localStorage.getItem("referer");
                        const addGroups = localStorage.getItem("addGroups");
                        const watchedVideos = localStorage.getItem("watchedVideos");
                        const addPosts = localStorage.getItem("addPosts");
                        localStorage.clear();
                        if (addGroups) localStorage.setItem("addGroups", addGroups);
                        if (watchedVideos) localStorage.setItem("watchedVideos", watchedVideos);
                        if (addPosts) localStorage.setItem("addPosts", addPosts);
                        localStorage.setItem("referer", referal);

                        const cleanUrl = window.location.origin + window.location.pathname; 
                        window.history.replaceState({}, document.title, cleanUrl);

                        location.reload();
                    }
                    if (response.status == 200) {
                        // оставляем только эти три поля, которые будут использоваться на страницах
                        const ref = localStorage.getItem("referer");
                        const addGroups = localStorage.getItem("addGroups");
                        const watchedVideos = localStorage.getItem("watchedVideos");
                        const addPosts = localStorage.getItem("addPosts");
                        localStorage.clear();
                        if (addGroups) localStorage.setItem("addGroups", addGroups);
                        if (watchedVideos) localStorage.setItem("watchedVideos", watchedVideos);
                        if (addPosts) localStorage.setItem("addPosts", addPosts);
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
                                if (addGroups) this.$router.push('/signup_2')
                                else this.$router.push('/signup_2');
                            }
                            else {
                                localStorage.setItem("points", 0);
                                localStorage.setItem("page", 1);
                                if (user?.tg_id) {
                                    this.channels = await getMandatoryChannels(localStorage.getItem('token'));
                                    if (this.channels.length == 0) 
                                        this.$router.push('/home')
                                    else {
                                        localStorage.clear();
                                        this.isMandatory = true;
                                    }
                                } else {
                                    this.$router.push('/home');
                                }
                            }
                        } catch(err) {
                            const referal = localStorage.getItem("referer");
                            const addGroups = localStorage.getItem("addGroups");
                            const watchedVideos = localStorage.getItem("watchedVideos");
                            const addPosts = localStorage.getItem("addPosts");
                            localStorage.clear();
                            if (addGroups) localStorage.setItem("addGroups", addGroups);
                            if (watchedVideos) localStorage.setItem("watchedVideos", watchedVideos);
                            if (addPosts) localStorage.setItem("addPosts", addPosts);
                            localStorage.setItem("first", true);
                            localStorage.setItem("referer", referal);
                            location.reload();
                        }
                        
                    } else {
                        const ref = localStorage.getItem("referer");
                        const addGroups = localStorage.getItem("addGroups");
                        const watchedVideos = localStorage.getItem("watchedVideos");
                        const addPosts = localStorage.getItem("addPosts");
                        localStorage.clear();
                        if (addGroups) localStorage.setItem("addGroups", addGroups);
                        if (watchedVideos) localStorage.setItem("watchedVideos", watchedVideos);
                        if (addPosts) localStorage.setItem("addPosts", addPosts);
                        localStorage.setItem("first", true);
                        localStorage.setItem("referer", ref);
                        // const cleanUrl = window.location.origin + window.location.pathname; 
                        // window.history.replaceState({}, document.title, cleanUrl);
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

    .line {
        @media (max-width: 500px) {
            margin-top: 30px;
        }
    }

    .modal {
        width: 960px;
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
        @media (max-width: 1000px) {
            width: 80vw;
            min-height: 300px;
            height: auto;
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
            /* height: 390px; */
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
        z-index: 999;
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
        @media (max-width: 500px) {
            row-gap: 0px;
        }
    }
    .text_wrapper_text {
        @media (max-width: 500px) {
            max-width: 227px;
            text-align: center;
            font-size: 16px !important;
            line-height: normal !important;
        }
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
        display: grid;
        grid-template-columns: 1fr 1fr;
        row-gap: 30px;
        column-gap: 20px;
        @media (max-width: 1000px) {
            display: flex;
            flex-direction: column;
            margin-top: 30px;
            row-gap: 10px;
        }
    }

    .vk_btn {
        @media (max-width: 1000px) {
            margin-top: 10px;
        }
    }

    .btn {
        width: 280px;
        @media (max-width: 500px) {
            width: 280px !important;
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
            width: 58px;
            height: 58px;
            left: 15px;
            top: 5px;
        }
        @media (max-width: 550px) {
            width: 58px;
            height: 58px;
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
            width: 50px;
            height: 50px;
            top: 140px;
            right: 5px;
        }
        @media (max-width: 550px) {
            width: 50px;
            height: 50px;
        }
    }
</style>