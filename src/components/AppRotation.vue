<template>
    <section class="balance">
        <div class="switch_main" v-if="!isPackage" :key="isPackage">
            <span
                v-for="(item, index) in listMainSwtich"
                :key="index"
                :class="{ active: mainActiveIndex === item.index }" 
                @click="setMainActive(item.index)"
            >{{ item.name }}</span>
        </div>
        <div class="switch" v-if="!isPackage && windowWidth > 650 && mainActiveIndex == 1" :key="isPackage">
            <span
                v-for="(item, index) in listSwtich"
                :key="index"
                :class="{ active: activeIndex === item.index }" 
                @click="setActive(item.index)"
            >{{ item.name }}</span>
        </div>
        <div class="switch" v-if="!isPackage && windowWidth > 650 && mainActiveIndex == 0" :key="isPackage">
            <span
                v-for="(item, index) in listSwtichTg"
                :key="index"
                :class="{ active: activeIndex === item.index }" 
                @click="setActive(item.index)"
            >{{ item.name }}</span>
        </div>
        <AppDropdown v-if="windowWidth <= 650" :listSwtich="mainActiveIndex ? listSwtich : listSwtichTg" @update-index="setActive" />
            <AppRotationGroup v-if="!noVk && ((mainActiveIndex == 1 && activeIndex === 0))" :userData="userData" :isTarif="isPackage" @openPlans="openPlans" @update:isTarif="changeIsTariff($event)" />
            <AppRotationVideo v-if="!noVk && ((mainActiveIndex == 1 && activeIndex === 1))" :userData="userData" />
            <AppRotationPosts v-if="!noVk && ((mainActiveIndex == 1 && activeIndex === 2))" :userData="userData" />
        <AppRotationGroupTg v-if="!noTg && mainActiveIndex == 0 && activeIndex == 0" :userData="userData" :isTarif="isPackage" @openPlans="openPlans" @update:isTarif="changeIsTariff($event)" />
        <AppRotationStories v-if="!noTg && mainActiveIndex == 0 && activeIndex == 1" :userData="userData" :isTarif="isPackage" @openPlans="openPlans" @update:isTarif="changeIsTariff($event)" />
        <AppRotationTgPosts v-if="!noTg && mainActiveIndex == 0 && activeIndex == 2" :userData="userData" :isTarif="isPackage" @openPlans="openPlans" @update:isTarif="changeIsTariff($event)" />
        <span class="err" v-if="noVk && mainActiveIndex == 1">Платформа не подключена. Перейдите в настройки, чтобы активировать.</span>
        <span class="err" v-if="noTg && mainActiveIndex == 0">Платформа не подключена. Перейдите в настройки, чтобы активировать.</span>
    </section>
</template>

<script>
    import AppRotationGroup from '@/components/AppRotationGroup.vue';
    import AppRotationVideo from '@/components/AppRotationVideo.vue';
    import AppRotationPosts from '@/components/AppRotationPosts.vue';
    import AppRotationGroupTg from '@/components/AppRotationGroupTg.vue';
    import AppRotationStories from '@/components/AppRotationStories.vue';
    import AppRotationTgPosts from '@/components/AppRotationTgPosts.vue';
    import AppDropdown from '@/components/AppDropdown.vue';
    // import { getConfig } from '@/services/config';
    export default {
        components: { AppRotationGroup, AppRotationVideo, AppRotationPosts, AppDropdown, AppRotationGroupTg, AppRotationStories, AppRotationTgPosts },
        props: {
            isTarif: Boolean,
            userData: Object,
            windowWidth: Number
        },
        async created() {
            // this.testers = await getConfig('tg_testers');
            this.isPackage = this.isTarif;
            this.$emit("update:isTarif", false);
            console.log('АЙДИ: ', this.userData.vk_id, this.userData.tg_id);
            if (!this.userData.vk_id) 
                this.noVk = true;
            if (!this.userData.tg_id) 
                this.noTg = true;
        },
        data() {
            return {
                listMainSwtich: [
                    {
                        index: 0,
                        name: "Telegram"
                    },
                    {
                        index: 1,
                        name: "Вконтакте"
                    },
                ],
                listSwtich: [
                    {
                        index: 0,
                        name: "Ротация групп"
                    },
                    {
                        index: 1,
                        name: "Ротация видео"
                    },
                    {
                        index: 2,
                        name: "Ротация постов"
                    }
                ],
                listSwtichTg: [
                    {
                        index: 0,
                        name: "Ротация каналов"
                    },
                    {
                        index: 1,
                        name: "Ротация сторис"
                    },
                    {
                        index: 2,
                        name: "Ротация постов"
                    }
                ],
                activeIndex: 0,
                mainActiveIndex: 0,
                isPackage: false,
                testers: [],
                noVk: false,
                noTg: false
            }
        },
        methods: {
            setActive(index) {
                this.activeIndex = index;
            },
            setMainActive(index) {
                this.noTg = false;
                this.noVk = false;
                this.mainActiveIndex = index;
                if (index == 1 && !this.userData.vk_id) 
                    this.noVk = true;
                if (index == 0 && !this.userData.tg_id) 
                    this.noTg = true;
            },
            changeIsTariff(status) {
                console.log('ИЗМЕНЕНИЕ ТАРИФА: ', status);
                this.isPackage = status;
            },
            openPlans() {
                this.$emit('openPlans');
            }
        },
        watch: {
            isTarif(newValue) {
                console.log('поменялось значение');
                this.isPackage = newValue;
                if (newValue) {
                    this.$emit("update:isTarif", false);
                }
            },
        }
    };
</script>

<style scoped>
    .active {
        background: #7023EC;
        font-weight: bold;
    }
    .balance {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 50px;
        /* z-index: 4; */
    }
    .switch {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
    }
    .switch_main {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        @media (max-width: 650px) {
            display: flex;
            flex-direction: column;
            row-gap: 10px;
        }
    }
    .err {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
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