<template>
    <section class="main" v-if="!isLinks">
        <div class="item">
            <h1>РАСШИРЬТЕ ГРАНИЦЫ СВОЕГО БИЗНЕЦА С ИИ Intelektaz</h1>
            <span>Подключите эффективное продвижения с искуственным интеллектом. Выберите тариф прямо сейчас:</span>
            <AppGoodButton :text="text1" class="tarif_btn" @click="openTarif" />
        </div>
        <div class="item">
            <h2>Делитесь своей реферальной ссылкой:</h2>
            <span>&mdash; Получайте еще больше целевых подписчиков по реферальной программе в свою группу;</span>
            <span>&mdash; Зарабатывайте неприлично много в максимально выгодном маркетинге в истории партнерских программ — гибридный бинар с бесконечной глубиной, до 96% в сеть.</span>
            <div class="row">
                <AppGoodButton :text="text2" class="ref_btn" @click="openLinks"/>
                <AppBadButton :text="text3" class="ref_btn"/>
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
            <AppGroupOrUser :objectData="referData" />
        </div>
    </section>
    <section class="links" v-if="isLinks">
        <h1>Ваши реферальные ссылки</h1>
        <div class="item2">
            <span>Реферальная ссылка:</span>
            <strong><span>https://lk.intelektaz.com/?ref={{ userData.vk_id }}</span></strong>
        </div>
        <div class="item2">
            <span>Реферальная ссылка для ВК:</span>
            <strong><span>https://lk.intelektaz.com/?ref={{ userData.vk_id }}</span></strong>
        </div>
        <div class="item2">
            <span>Премиальная ссылка для обладателей пакетов Business, Leader:</span>
            <strong><span v-if="packages.includes(userData?.packages[userData?.packages.length - 1]?.package_name)">https://lk.intelektaz.com/?ref={{ userData.vk_id }}</span></strong>
            <strong><span v-if="!packages.includes(userData?.packages[userData?.packages.length - 1]?.package_name)">Не доступно</span></strong>
        </div>
        <span>Для максимального охвата аудитории используйте все доступные вам информационные источники. Чем больше пользователей перейдет по вашей реферальной ссылке, тем успешнее будет ваш бизнес - больше подписчиков, больше клиентов, больше доход по партнерской программе.</span>
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import AppBadButton from "@/components/AppBadButton.vue";
    import AppGroupOrUser from "@/components/AppGroupOrUser.vue";
    import { getUserInfoById, getUserInfo } from "@/services/user";
    import { refreshToken } from "@/services/auth";

    export default {
        components: { AppGoodButton, AppBadButton, AppGroupOrUser },
        props: {
            links: Boolean
        },
        data() {
            return {
                text1: "ВЫБРАТЬ ТАРИФ",
                text2: "РЕФЕРАЛЬНЫЕ ССЫЛКИ",
                text3: "ПРЕЗЕНТАЦИЯ INTELEKTAZ",
                text4: "РОТАЦИЯ",
                referData: [],
                userData: [],
                packages: ["Business", "Leader"],
                isLinks: false
            }
        },
        async created() {
            const refer = await getUserInfoById(842052594, localStorage.getItem("token"));
            if (!refer) {
                const isAuthorized = await refreshToken(localStorage.getItem("token_refresh"));
                if (isAuthorized) {
                    localStorage.setItem("token", isAuthorized.access_token);
                    localStorage.setItem("token_refresh", isAuthorized.refresh_token);
                } else {
                    localStorage.clear();
                    this.$router.push('/');
                    return;
                }
            }
            this.referData = refer;

            const user = await getUserInfo(localStorage.getItem("token"));
            if (!user) {
                const isAuthorized = await refreshToken(localStorage.getItem("token_refresh"));
                if (isAuthorized) {
                    localStorage.setItem("token", isAuthorized.access_token);
                    localStorage.setItem("token_refresh", isAuthorized.refresh_token);
                } else {
                    localStorage.clear();
                    this.$router.push('/');
                    return;
                }
            }

            this.userData = user;

            this.isLinks = this.links;
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
            }
        }
    };
</script>

<style scoped>
    .main {
        display: flex;
        flex-direction: column;
        row-gap: 50px;
    }
    h1 {
        font-size: 32px;
        color: white;
        font-family: 'OpenSans';
    }
    span, h2 {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .tarif_btn, .ref_btn, .rot_btn {
        height: 51px;
    }
    .tarif_btn {
        width: 189px;
    }
    .ref_btn {
        width: 250px;
    }
    .rot_btn {
        width: 133px;
    }
    .item {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    .row {
        display: flex;
        column-gap: 30px;
    }
    .footer {
        width: 100%;
        display: flex;
        justify-content: space-between;
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
    }
    .item2 {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
</style>