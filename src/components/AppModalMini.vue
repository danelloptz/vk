<template>
    <section v-if="visibility1" class="modal_wrapper">
        <div class="modal">
            <img src="@/assets/images/close.png" class="close" @click="close">
            <div class="row">
                <div class="col">
                    <img :src="userData.avatar">
                    <span class="pckg_name">{{ userData.package_name }}</span>
                </div>
                <div class="col">
                    <h2>{{ `${userData.first_name} ${userData.last_name}` }}</h2>
                    <span class="id">ID: {{ userData.vk_id }}</span>
                    <a>Реферальные ссылки</a>
                    <span>Партнерская программа активна до {{ userData.sub_date_end }}</span>
                </div>
            </div>
            <div class="row">
                <AppGoodButton :text="text1" class="btn" @click="openTarif"/>
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
        },
        data() {
            return {
                text1: "Тарифы",
                text2: "Выход"
            }
        },
        methods: {
            close() {
                if (this.visibility1) {
                    this.$emit('update:visibility1', false);
                }
                this.$emit('close'); 
            },
            openTarif() {
                this.$emit("isClicked");
                this.close();
            },
            exit() {
                localStorage.clear();
                location.reload();
                location.reload();
            }
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
    }
    .row {
        display: flex;
        justify-content: space-between;
        column-gap: 30px;
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
    }
    h2 {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    span {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
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
    }
    .btn {
        width: 110px;
        font-family: 'OpenSans';
    }

    .close {
        position: absolute;
        right: 30px;
        top: 30px;
        width: 15px;
        height: 15px;
        cursor: pointer;
    }
</style>