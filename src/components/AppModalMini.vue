<template>
    <section v-if="visibility1" class="modal_wrapper">
        <div class="modal">
            <img src="@/assets/images/close.png" class="close" @click="close">
            <div class="row">
                <div class="col">
                    <img :src="userData.avatar_url">
                    <span class="pckg_name">{{ userData?.packages[userData?.packages.length - 1]?.package_name }}</span>
                </div>
                <div class="col">
                    <h2>{{ `${userData.name}` }}</h2>
                    <span class="id">ID: {{ userData.vk_id || userData.tg_id }}</span>
                    <a style="cursor: pointer;" @click="openRef">Реферальные ссылки</a>
                    <span class="program">Партнерская программа активна до {{ endDate }}</span>
                </div>
            </div>
            <div class="row">
                <AppGoodButton :text="text1" class="btn" @click="openTarif"/>
                <a href="" v-if="windowWidth <= 600" @click.prevent="showNews">Новости</a>
                <a href="" v-if="windowWidth <= 600" @click.prevent="showHelp">Помощь</a>
                <AppBadButton :text="text2" class="btn" @click="exit" />
            </div>
        </div>
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import AppBadButton from "@/components/AppBadButton.vue";

    export default {
        components: { AppGoodButton, AppBadButton },
        props: {
            userData: Object,
            visibility1: Boolean,
            windowWidth: Number
        },
        data() {
            return {
                text1: "Тарифы",
                text2: "Выход"
            }
        },
        computed: {
            endDate() {
                const endDateSeconds = this.userData?.packages_datetime.find(el => el.tarif_id == this.userData.packages[this.userData?.packages.length - 1].id)?.date_end;
                if (!endDateSeconds) return "";

                const endDate = new Date(endDateSeconds * 1000);
                const day = String(endDate.getDate()).padStart(2, '0');
                const month = String(endDate.getMonth() + 1).padStart(2, '0');
                const year = endDate.getFullYear();

                return `${day}.${month}.${year}`;
            }
        },
        methods: {
            close() {
                if (this.visibility1) {
                    this.$emit('update:visibility1', false);
                }
                console.log('mini close');
                this.$emit('close'); 
            },
            openTarif() {
                this.$emit("isClicked");
                this.close();
            },
            exit() {
                localStorage.clear();
                this.$router.push('/');
            },
            openRef() {
                console.log('modal mini');
                this.$emit("isReffs");
                this.close();
            },
            showHelp() {
                this.$emit('isHelp');
                this.close();
            },
            showNews() {
                this.$emit('isNews');
                this.close();
            },
        }
    };
</script>


<style scoped>
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
        position: absolute;
        top: 0px;
        right: 0px;
        width: 438px;
        z-index: 999;
        @media (max-width: 600px) {
            width: 100vw;
            left: 0;
        }
    }
    .modal {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 22px;
        position: relative;
        padding: 40px;
        background: #111433;
        border-radius: 10px;
        @media (max-width: 600px) {
            padding: 20px;
        }
    }
    .row {
        display: flex;
        justify-content: space-between;
        column-gap: 30px;
        @media (max-width: 600px) {
            column-gap: 20px;
        }
    }
    .col {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .col img {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        object-position: center;
        object-fit: cover;
        outline: 1px solid white;
        outline-offset: 10px;
        @media (max-width: 600px) {
            width: 64px;
            height: 64px;
            outline-offset: 4px;
        }
    }
    h2 {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 600px) {
            font-size: 16px;
            width: fit-content;
        }
    }
    span {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 600px) {
            width: fit-content;
        }
    }
    .program {
        @media (max-width: 600px) {
            font-size: 14px;
        }
    }
    .pckg_name {
        text-align: center;
        margin-top: 15px;
    }
    .id {
        font-size: 18px;
    }
    a {
        font-size: 16px;
        font-family: 'OpenSans';
        text-decoration: underline;
        background: linear-gradient(to right, #7023EC, #A585DA); 
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        @media (max-width: 600px) {
            font-size: 14px;
        }
    }
    .btn {
        width: 110px;
        font-family: 'OpenSans';
        @media (max-width: 600px) {
            width: 70px;
            height: 31px;
            font-size: 10px;
        }

    }

    .close {
        position: absolute;
        right: 30px;
        top: 30px;
        width: 15px;
        height: 15px;
        cursor: pointer;
    }
    a {
        font-size: 16px;
        font-family: 'OpenSans';
        color: white;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
</style>