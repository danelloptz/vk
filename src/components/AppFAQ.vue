<template>
    <section class="faq">
        <h1>Инструкции: </h1>
        <div class="item" 
            v-for="(item, index) in textData" 
            :key="index"
            @click="toggleItem(index)"
        >
            <div class="row">
                <h2 :class="{ active: activeIndex === index }">{{ item.title }}</h2>
                <img 
                    src="@/assets/images/arrow_diag.png"
                    :class="{ rotated: activeIndex === index }"
                >
            </div>
            <span v-show="activeIndex === index" class="text" v-html="item.text"></span>
        </div>
    </section>
</template>

<script>
    import { getConfig } from "@/services/config";
    export default {
        data() {
            return {
                activeIndex: null,
                textData: null,
            }
        },
        methods: {
            toggleItem(index) {
                this.activeIndex = this.activeIndex === index ? null : index;
            }
        },
        async created() {
            const resp = await getConfig("instructions", localStorage.getItem("token"));
            this.textData = resp.textData;
        }
    };
</script>

<style scoped>
    .faq {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    h1 {
        font-size: 24px;
        color: white;
        font-family: 'OpenSans';
        align-self: center;
        @media (max-width: 650px) {
            align-self: flex-start;
        }
    }
    .item {
        display: flex;
        flex-direction: column;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        width: 100%;
        row-gap: 20px;
        cursor: pointer;
        @media (max-width: 650px) {
            row-gap: 15px;
        }
    }
    .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    h2 {
        font-size: 20px;
        font-family: 'OpenSans';
        color: white;
        transition: .2s ease-in;
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    .row img {
        width: 28px;
        height: 28px;
        object-fit: cover;
        object-position: center;
        transition: transform 0.3s ease;
        @media (max-width: 650px) {
            width: 15px;
            height: 15px;
        }
    }
    .row img.rotated {
        transform: rotate(90deg);
    }
    .row h2.active {
        background: linear-gradient(to right, #7023EC, #A585DA); 
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }
    .text {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        transition: max-height 0.3s ease, opacity 0.3s ease;
        @media (max-width: 650px) {
            font-size: 14px;
        }
    }
</style>