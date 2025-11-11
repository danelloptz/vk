<template>
    <section class="main" v-if="!isLinks">
        <div class="item">
            <h1>РАСШИРЬТЕ ГРАНИЦЫ СВОЕГО БИЗНЕСА С ИИ Intelektaz</h1>
            <span>Подключите эффективное продвижения с искуственным интеллектом. Выберите тариф прямо сейчас:</span>
            <AppGoodButton :text="text1" class="tarif_btn" @click="openTarif" />
        </div>
        <div class="item">
            <h2>Делитесь своей реферальной ссылкой:</h2>
            <span>&mdash; Получайте еще больше целевых подписчиков по реферальной программе в свою группу;</span>
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
            <span>Реферальная ссылка:</span>
            <div class="row2">
                <strong><span>{{ refLink }}</span></strong>
                <img src="@/assets/images/copy.png" @click="copyLink(refLink, 1)">
                <span class="green" v-if="isCopy == 1">Скопировано!</span>
            </div>
            <span class="green_mob" v-if="isCopy == 1">Скопировано!</span>
        </div>
        <div class="item2">
            <span>Реферальная ссылка для ВК:</span>
            <div class="row2">
                <strong><span>{{ refVkLink }}</span></strong>
                <img src="@/assets/images/copy.png" @click="copyLink(refVkLink, 2)">
                <span class="green" v-if="isCopy == 2">Скопировано!</span>
            </div>
            <span class="green_mob" v-if="isCopy == 2">Скопировано!</span>
        </div>
        <div class="item2">
            <span>Премиальная ссылка для обладателей пакетов Business, Leader:</span>
            <div class="row2">
                <strong><span v-if="packages.includes(userData?.packages[userData?.packages.length - 1]?.package_name)">{{ refPremiumLink }}</span></strong>
                <img v-if="packages.includes(userData?.packages[userData?.packages.length - 1]?.package_name)" src="@/assets/images/copy.png" @click="copyLink(refPremiumLink, 3)">
                <span class="green" v-if="isCopy == 3">Скопировано!</span>
            </div>
            <span class="green_mob" v-if="isCopy == 3">Скопировано!</span>
            <strong><span v-if="!packages.includes(userData?.packages[userData?.packages.length - 1]?.package_name)">Не доступно</span></strong>
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
                refLinks: []
            }
        },
        computed: {
            refLink() {
                if (this.userData?.vk_id) {
                    return `https://${this.refLinks.default}/?ref=${this.userData.vk_id}`;
                } else {
                    return `https://t.me/test_intelekt_bot?start=ref=tg${this.userData?.tg_id}`;
                }
            },
            refVkLink() {
                if (this.userData?.vk_id) {
                    return `https://${this.refLinks.vk}/?ref=${this.userData.vk_id}`;
                } else {
                    return `https://t.me/test_intelekt_bot?start=ref=tg${this.userData?.tg_id}`;
                }
            },
            refPremiumLink() {
                if (this.userData?.vk_id) {
                    return `https://${this.refLinks.premium}/?ref=${this.userData.vk_id}`;
                } else {
                    return `https://t.me/test_intelekt_bot?start=ref=tg${this.userData?.tg_id}`;
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
                    const refer = await getReferer(val.vk_id);
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
                window.open("https://api.intelektaz.com/assets/9762b603-68ed-4f4b-b8f0-516bb60f0605", "_blank");
            }
        }
    };
</script>

<style scoped>
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