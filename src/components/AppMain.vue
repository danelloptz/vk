<template>
    <section class="main" v-if="!isLinks">
        <div class="item">
            <h1>От привлечения до продажи — полный цикл автоматизации с ИИ Intelektaz</h1>
            <span style="margin-top: 10px;">Автоматизируйте продвижение на подключенных платформах:</span>
            <div class="row_2">
                <img src="@/assets/images/vk.png" />
                <span>ВКонтакте</span>
                <img v-if="userData?.vk_id" src="@/assets/images/ok_green2.png" class="ok_green"/>
                <AppGoodButton v-else class="active_tg_btn" :text="'АКТИВИРОВАТЬ'" :disabled="isDisabled" @click="tap"/>
            </div>
            <div class="row_2">
                <img src="@/assets/images/telegram.png" />
                <span>Telegram</span>
                <img v-if="userData?.tg_id" src="@/assets/images/ok_green2.png" class="ok_green"/>
                <AppGoodButton v-else class="active_tg_btn" :text="'АКТИВИРОВАТЬ'" :disabled="isDisabled" @click="activateTg"/>
            </div>
            <span style="margin-top: 10px;">Подключите эффективное продвижения с искуственным интеллектом. Выберите тариф прямо сейчас:</span>
            <AppGoodButton :text="text1" class="tarif_btn" @click="openTarif" />
        </div>
        <div class="item">
            <h2>Делитесь своей реферальной ссылкой:</h2>
            <span>&mdash; Получайте еще больше целевых подписчиков по реферальной программе в свой ТГ / ВК канал;</span>
            <span>&mdash; Зарабатывайте неприлично много в максимально выгодном маркетинге в истории партнерских программ — гибридный бинар с бесконечной глубиной, до 96% в сеть.</span>
            <div class="row">
                <AppGoodButton :text="text2" class="ref_btn" @click="openLinks"/>
                <AppBadButton :text="text3" class="ref_btn" @click="openPres"/>
            </div>
        </div>
        <div class="item">
            <span>Проходите ротации и получайте еще больше качественного трафика совершенно бесплатно:</span>
            <AppGoodButton :text="text4" class="rot_btn" @click="openRot"/>
        </div>
        <span>Тысячи пользователей с бизнес интересами ежедневно и многократно посещают кабинет Intelektaz. У нас точно есть ваши клиенты. Покажите им свое предложение на нашем сайте.</span>
        <div class="footer">
            <div class="col">
                <h1>Возникли вопросы?</h1>
                <span>Обратитесь за помощью к Вашему личному консультанту (рефереру):</span>
            </div>
            <AppGroupOrUser :objectData="referData" style="width: auto;" />
        </div>
    </section>
    <section class="links" v-if="isLinks">
        <h1>Ваши реферальные ссылки</h1>
        <div class="item2">
            <span>Реферальная ссылка на лендинг:</span>
            <div class="row2">
                <strong><span>{{ lendingLink }}</span></strong>
                <img src="@/assets/images/copy.png" @click="copyLink(lendingLink, 1)">
                <span class="green" v-if="isCopy == 1">Скопировано!</span>
            </div>
            <span class="green_mob" v-if="isCopy == 1">Скопировано!</span>
        </div>
        <!-- <div class="item2">
            <span>Реферальная ссылка для ВК:</span>
            <div class="row2">
                <strong><span>{{ refVkLink }}</span></strong>
                <img src="@/assets/images/copy.png" @click="copyLink(refVkLink, 2)">
                <span class="green" v-if="isCopy == 2">Скопировано!</span>
            </div>
            <span class="green_mob" v-if="isCopy == 2">Скопировано!</span>
        </div> -->
        <div class="item2">
            <span>Реферальная ссылка Telegram:</span>
            <div class="row2">
                <strong><span>{{ telegramLink }}</span></strong>
                <img src="@/assets/images/copy.png" @click="copyLink(telegramLink, 3)">
                <span class="green" v-if="isCopy == 3">Скопировано!</span>
            </div>
            <span class="green_mob" v-if="isCopy == 3">Скопировано!</span>
            <!-- <strong><span v-if="!packages.includes(userData?.packages[userData?.packages.length - 1]?.package_name)">Не доступно</span></strong> -->
        </div>
        <span>Для максимального охвата аудитории используйте все доступные вам информационные источники. Чем больше пользователей перейдет по вашей реферальной ссылке, тем успешнее будет ваш бизнес - больше подписчиков, больше клиентов, больше доход по партнерской программе.</span>
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import AppBadButton from "@/components/AppBadButton.vue";
    import AppGroupOrUser from "@/components/AppGroupOrUser.vue";
    import { getReferer } from "@/services/user";
    import { getConfig } from "@/services/config";
    import { activeTg } from '@/services/tg';
    import { getUserInfo } from '@/services/user';
    import { getVkToken } from '@/services/tg';

    export default {
        components: { AppGoodButton, AppBadButton, AppGroupOrUser },
        props: {
            links: Boolean,  
            userData: Object
        },
        data() {
            return {
                text1: "ВЫБРАТЬ ТАРИФ",
                text2: "РЕФЕРАЛЬНЫЕ ССЫЛКИ",
                text3: "ПРЕЗЕНТАЦИЯ INTELEKTAZ",
                text4: "РОТАЦИЯ",
                referData: [],
                packages: ["Business", "Leader"],
                isLinks: false,
                isCopy: 0,
                refLinks: [],
                isDisabled: false,
                code_verifier: "",
                code_challenge: "",
                code_challenge_method: "S256",
                state: "grehthrtjui7643trr",
                redirectUrl: "https://lk.intelektaz.com",
            }
        },
        computed: {
            lendingLink() {
                if (this.userData?.user_platform == 'vk') {
                    return `https://intelektaz.com/?ref=${this.userData.vk_id}`;
                } else {
                    return `https://intelektaz.com/?ref=tg${this.userData?.tg_id}`;
                }
            },
            telegramLink() {
                if (this.userData?.user_platform == 'vk') {
                    return `https://t.me/IntelektazTGBot?start=ref=vk${this.userData?.vk_id}`;
                } else {
                    return `https://t.me/IntelektazTGBot?start=ref=tg${this.userData?.tg_id}`;
                }
            },
            refLink() {
                if (this.userData?.vk_id) {
                    return `https://${this.refLinks.default}/?ref=${this.userData.vk_id}`;
                } else {
                    return `https://t.me/IntelektazTGBot?start=ref=tg${this.userData?.tg_id}`;
                }
            },
            refVkLink() {
                if (this.userData?.vk_id) {
                    return `https://${this.refLinks.vk}/?ref=${this.userData.vk_id}`;
                } else {
                    return `https://t.me/IntelektazTGBot?start=ref=tg${this.userData?.tg_id}`;
                }
            },
            refPremiumLink() {
                if (this.userData?.vk_id) {
                    return `https://${this.refLinks.premium}/?ref=${this.userData.vk_id}`;
                } else {
                    return `https://t.me/IntelektazTGBot?start=ref=tg${this.userData?.tg_id}`;
                }
            }
        },
        watch: {
            links(newValue) {
                this.isLinks = newValue;
                // this.$emit("update:links", false);
                console.log("КИНУЛ FALSE"); 
            },
            userData: {
                handler: async function(val) {
                    console.log("ХОБА", val);
                    const refer = await getReferer(val.id);
                    this.referData = refer;
                },
                deep: true
            }
        },
        async created() {
            const resp = await getConfig('referal_domains', localStorage.getItem("token"));
            this.refLinks = resp;
            this.isLinks = this.links;
            if (this.links) {
                this.openLinks();
                // this.$emit("update:links", false);
            }
        },
        methods: {
            async activateTg() {
                const code = await activeTg(localStorage.getItem('token'));
                window.open(`https://t.me/IntelektazTGBot?start=code=${code}`, "_blank", "width=800, height=600")
            },
            openTarif() {
                this.$emit("update-isTarif", true);
            },
            openRot() {
                this.$emit("update-isRot", true);
            },
            openLinks() {
                this.isLinks = true;
            },
            async copyLink(link, index) {
                this.isCopy = index;
                await navigator.clipboard.writeText(link);
                setTimeout(() => { this.isCopy = 0; console.log(this.isCopy);}, 2000);
            },
            openPres() {
                window.open("https://api.intelektaz.com/assets/dd85f197-c7fc-4986-8ab4-6ffe13d19b9c.pdf", "_blank");
            },
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
        async handleUrlParams() {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");
            const state = params.get("state");
            const device_id = params.get("device_id");
            const code_verifier = localStorage.getItem("code_verifier");

            const sponsor_platform = localStorage.getItem('sponsor_platform');
            console.log(sponsor_platform);
            let sponsor_id = localStorage.getItem('referer');
            if (sponsor_id.startsWith('tg')) {
                sponsor_id = sponsor_id.slice(2);
            }



            if (code && state && device_id) {
                let response;
                try {
                    localStorage.setItem("token", response.data.access_token);
                    localStorage.setItem("token_refresh", response.data.refresh_token);
                    response = await getVkToken(code, state, code_verifier, device_id, this.redirectUrl, this.userData.id);
                } catch (err) {

                    const referal = localStorage.getItem("referer");
                    const addGroups = localStorage.getItem("addGroups");
                    const watchedVideos = localStorage.getItem("watchedVideos");
                    const addPosts = localStorage.getItem("addPosts");
                    const code_verifier = localStorage.getItem("code_verifier");
                    localStorage.clear();
                    if (addGroups) localStorage.setItem("addGroups", addGroups);
                    if (watchedVideos) localStorage.setItem("watchedVideos", watchedVideos);
                    if (addPosts) localStorage.setItem("addPosts", addPosts);
                    localStorage.setItem("referer", referal);
                    localStorage.setItem("code_verifier", code_verifier);

                    const cleanUrl = window.location.origin + window.location.pathname; 
                    window.history.replaceState({}, document.title, cleanUrl);

                    // location.reload();
                }
                if (response.status == 200) {
                    // оставляем только эти три поля, которые будут использоваться на страницах
                    const ref = localStorage.getItem("referer");
                    const addGroups = localStorage.getItem("addGroups");
                    const watchedVideos = localStorage.getItem("watchedVideos");
                    const addPosts = localStorage.getItem("addPosts");
                    const code_verifier = localStorage.getItem("code_verifier");
                    const token = localStorage.getItem("token");
                    const token_refresh = localStorage.getItem("token_refresh");
                    localStorage.clear();
                    if (addGroups) localStorage.setItem("addGroups", addGroups);
                    if (watchedVideos) localStorage.setItem("watchedVideos", watchedVideos);
                    if (addPosts) localStorage.setItem("addPosts", addPosts);
                    localStorage.setItem("token", token);
                    localStorage.setItem("token_refresh", token_refresh);
                    localStorage.setItem("is_new_user", response.data.is_new_user);
                    localStorage.setItem("code_verifier", code_verifier);

                    try {
                        await getUserInfo(localStorage.getItem("token"));
                        const refererId = ref; // если есть рефер, то отмечаем это
                        console.log("refererId", refererId);
                        
                        localStorage.setItem("points", 0);
                        localStorage.setItem("page", 1);
                        this.$router.push('/home')

                    } catch(err) {
                        const referal = localStorage.getItem("referer");
                        const addGroups = localStorage.getItem("addGroups");
                        const watchedVideos = localStorage.getItem("watchedVideos");
                        const addPosts = localStorage.getItem("addPosts");
                        const code_verifier = localStorage.getItem("code_verifier");
                        localStorage.clear();
                        if (addGroups) localStorage.setItem("addGroups", addGroups);
                        if (watchedVideos) localStorage.setItem("watchedVideos", watchedVideos);
                        if (addPosts) localStorage.setItem("addPosts", addPosts);
                        localStorage.setItem("first", true);
                        localStorage.setItem("referer", referal);
                        localStorage.setItem("code_verifier", code_verifier);
                        // location.reload();
                    }
                    
                } else {
                    const ref = localStorage.getItem("referer");
                    const addGroups = localStorage.getItem("addGroups");
                    const watchedVideos = localStorage.getItem("watchedVideos");
                    const addPosts = localStorage.getItem("addPosts");
                    const code_verifier = localStorage.getItem("code_verifier");
                    localStorage.clear();
                    if (addGroups) localStorage.setItem("addGroups", addGroups);
                    if (watchedVideos) localStorage.setItem("watchedVideos", watchedVideos);
                    if (addPosts) localStorage.setItem("addPosts", addPosts);
                    localStorage.setItem("first", true);
                    localStorage.setItem("referer", ref);
                    localStorage.setItem("code_verifier", code_verifier);
                    // const cleanUrl = window.location.origin + window.location.pathname; 
                    // window.history.replaceState({}, document.title, cleanUrl);
                    // location.reload();
                }
                    
            } else {
                console.warn("Параметры code, state или device_id отсутствуют в URL.");
            }
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
                localStorage.setItem('isAddVK', true);
                localStorage.setItem('userId', this.userData.id);

                const vkAuthUrl = `https://id.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}&code_challenge=${code_challenge}&code_challenge_method=${code_challenge_method}&scope=${scopes}`;
                try {
                    window.location.href = vkAuthUrl;
                } catch(err) {
                    const ref = localStorage.getItem("referer");
                    const addGroups = localStorage.getItem("addGroups");
                    const watchedVideos = localStorage.getItem("watchedVideos");
                    const addPosts = localStorage.getItem("addPosts");
                    const code_verifier = localStorage.getItem("code_verifier");
                    localStorage.clear();
                    if (addGroups) localStorage.setItem("addGroups", addGroups);
                    if (watchedVideos) localStorage.setItem("watchedVideos", watchedVideos);
                    if (addPosts) localStorage.setItem("addPosts", addPosts);
                    localStorage.setItem("first", true);
                    localStorage.setItem("referer", ref);
                    localStorage.setItem("code_verifier", code_verifier);
                }
            }
            
        },
        }
    };
</script>

<style scoped>
    .row_2 {
        display: flex;
        column-gap: 20px;
        align-items: center;
    }
    .ok_green {
        margin-left: 30px;
        width: 18px;
        height: 13px;
    }

    .active_tg_btn {
        width: 148px;
        height: 40px;
        font-size: 14px;
        letter-spacing: 0px;
        margin-left: 22px;
    }
    .main {
        display: flex;
        flex-direction: column;
        row-gap: 50px;
        @media (max-width: 650px) {
            row-gap: 30px;
        }
    }
    h1 {
        font-size: 32px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 20px;
        }
    }
    span, h2 {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    .tarif_btn, .ref_btn, .rot_btn {
        height: 51px;
    }
    .tarif_btn {
        width: 189px;
        @media (max-width: 650px) {
            width: 160px;
            height: 45px;
        }
    }
    .ref_btn {
        width: 250px;
        @media (max-width: 650px) {
            width: 230px;
            height: 45px;
        }
    }
    .rot_btn {
        width: 133px;
         @media (max-width: 650px) {
            width: 115px;
            height: 45px;
        }
    }
    .item {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    .row {
        display: flex;
        column-gap: 30px;
        @media (max-width: 650px) {
            flex-direction: column;
            row-gap: 20px;
        }
    }
    .row2 {
        display: flex;
        align-items: center;
        column-gap: 10px;
        @media (max-width: 650px) {
            align-items: start;
        }
    }
    .row2 img {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
    .row2 span {
        line-height: 2;
        @media (max-width: 650px) {
            line-height: 1.5;
            word-break: break-all;
        }
    }
    .footer {
        width: 100%;
        display: flex;
        justify-content: space-between;
        column-gap: 50px;
        @media (max-width: 650px) {
            flex-direction: column;
            row-gap: 20px;
        }
    }
    .col {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
    }
    .links {
        display: flex;
        flex-direction: column;
        row-gap: 50px;
        @media (max-width: 650px) {
            row-gap: 30px;
        }
    }
    .item2 {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .green {
        color: green;
        animation: ShowEasy 2s ease-in;
        opacity: 0;
        @media (max-width: 650px) {
            display: none;
        }
    }
    .green_mob {
        color: green;
        animation: ShowEasy 2s ease-in;
        opacity: 0;
        display: none;
        font-size: 10px;
        @media (max-width: 650px) {
            display: block;
        }
    }
    @keyframes ShowEasy {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
</style>