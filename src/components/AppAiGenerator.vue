<template>
    <section class="no_package" v-if="!(userData.packages.at(-1).package_name == 'Leader' || userData.packages.at(-1).package_name == 'Business')">
        <img src="@/assets/images/robot.png">
        <h1>У вас нет доступа к данному разделу, чтобы получить доступ активируйте пакет Leader или Business! </h1>
        <AppGoodButton :text="text1" style="width: 200px; margin-top: 40px;" @click="openTatiff" />
    </section>
    <section class="ai" v-if="userData.packages.at(-1).package_name == 'Leader' || userData.packages.at(-1).package_name == 'Business'">
        <div class="switch" v-if="windowWidth > 650">
            <span
                v-for="(item, index) in listSwtich"
                :key="index"
                :class="{ active: activeIndex === item.index }" 
                @click="setActive(item.index)"
            >{{ item.name }}</span>
        </div>  
        <AppDropdown v-if="windowWidth <= 650" :listSwtich="listSwtich" @update-index="setActive" />
        <AppAiGeneratorContent v-if="activeIndex == 0" :windowWidth="windowWidth" />
        <AppAiAnalytics v-if="activeIndex == 1" :windowWidth="windowWidth" />
        <AppAiScene v-if="activeIndex == 2" :userData="userData" />
        <AppAiChat v-if="activeIndex == 3" :userData="userData" />
        <AppAiManager v-if="activeIndex == 4" />
    </section>
</template>

<script>
    import AppAiGeneratorContent from '@/components/AppAiGeneratorContent.vue';
    import AppAiAnalytics from '@/components/AppAiAnalytics.vue';
    import AppAiScene from '@/components/AppAiScene.vue';
    import AppAiChat from '@/components/AppAiChat.vue';
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppAiManager from '@/components/AppAiManager.vue';
    import AppDropdown from '@/components/AppDropdown.vue';
    
    export default {
        props: { 
            userData: Object,
            windowWidth: Number
        },
        components: { AppAiGeneratorContent, AppAiAnalytics, AppAiScene, AppAiChat, AppGoodButton, AppAiManager, AppDropdown },
        data() {
            return {
                activeIndex: 0,
                listSwtich: [
                    {
                        index: 0,
                        name: "ИИ контент"
                    },
                    {
                        index: 1,
                        name: "ИИ анализ"
                    }, 
                    {
                        index: 2,
                        name: "ИИ сценарий"
                    }, 
                    {
                        index: 3,
                        name: "ИИ помощник"
                    }, 
                    {
                        index: 4,
                        name: "ИИ менеджер"
                    },
                ],
                text1: "ВЫБРАТЬ ПАКЕТ"
            }
        },
        methods: {
            setActive(index) {
                this.activeIndex = index;
            },
            openTatiff() {
                this.$emit('openTariff')
            }
        },
    };
</script>

<style scoped>
    .active {
        background: #7023EC;
        font-weight: bold;
    }
    .ai {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 50px;
        /* z-index: 4; */
    }
    .switch {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
    }
    span {
        width: 100%;
        height: 40px;
        color: white;
        font-size: 18px;
        font-family: 'OpenSans';
        cursor: pointer;
        text-align: center;
        align-content: center;
        transition: .1s ease-in;
        @media (max-width: 1300px) {
            font-size: 16px;
        }
        @media (max-width: 1100px) {
            font-size: 14px;
            height: 50px;
            padding: 5px 10px;
        }
        @media (max-width: 700px) {
            height: 50px;
        }
        @media (max-width: 500px) {
            font-size: 12px;
        }
        @media (max-width: 360px) {
            font-size: 10px;
        }
    }
    .no_package {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .no_package img {
        width: 379px;
        height: 379px;
    }
    .no_package h1 {
        font-family: 'OpenSans';
        font-size: 24px;
        color: #FF6666;
        font-weight: bold;
        text-align: center;
    }
</style>