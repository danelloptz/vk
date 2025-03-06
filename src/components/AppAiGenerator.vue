<template>
    <section class="ai">
        <div class="switch">
            <span
                v-for="(item, index) in listSwtich"
                :key="index"
                :class="{ active: activeIndex === index }" 
                @click="setActive(index)"
            >{{ item }}</span>
        </div>  
        <AppAiGeneratorContent v-if="activeIndex == 0" />
        <AppAiAnalytics v-if="activeIndex == 1" />
        <AppAiScene v-if="activeIndex == 2" />
        <AppAiChat v-if="activeIndex == 3" />
    </section>
</template>

<script>
    import AppAiGeneratorContent from '@/components/AppAiGeneratorContent.vue';
    import AppAiAnalytics from '@/components/AppAiAnalytics.vue';
    import AppAiScene from '@/components/AppAiScene.vue';
    import AppAiChat from '@/components/AppAiChat.vue';
    
    export default {
        components: { AppAiGeneratorContent, AppAiAnalytics, AppAiScene, AppAiChat },
        data() {
            return {
                activeIndex: 0,
                listSwtich: ["ИИ контент", "ИИ анализ", "ИИ сценарий", "ИИ помощник", "ИИ менеджер"],
            }
        },
        methods: {
            setActive(index) {
                this.activeIndex = index;
            },
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
</style>