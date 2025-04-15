<template>
    <section class="balance">
        <div class="switch" v-if="!isPackage && windowWidth > 650" :key="isPackage">
            <span
                v-for="(item, index) in listSwtich"
                :key="index"
                :class="{ active: activeIndex === item.index }" 
                @click="setActive(item.index)"
            >{{ item.name }}</span>
        </div>
        <AppDropdown v-if="windowWidth <= 650" :listSwtich="listSwtich" @update-index="setActive" />
            <AppRotationGroup v-if="activeIndex === 0" :userData="userData" :isTarif="isPackage" @openPlans="openPlans" @update:isTarif="changeIsTariff($event)" />
            <AppRotationVideo v-if="activeIndex === 1" :userData="userData" />
            <AppRotationPosts v-if="activeIndex === 2" :userData="userData" />
    </section>
</template>

<script>
    import AppRotationGroup from '@/components/AppRotationGroup.vue';
    import AppRotationVideo from '@/components/AppRotationVideo.vue';
    import AppRotationPosts from '@/components/AppRotationPosts.vue';
    import AppDropdown from '@/components/AppDropdown.vue';
    export default {
        components: { AppRotationGroup, AppRotationVideo, AppRotationPosts, AppDropdown },
        props: {
            isTarif: Boolean,
            userData: Object,
            windowWidth: Number
        },
        async created() {
            this.isPackage = this.isTarif;
            this.$emit("update:isTarif", false);
        },
        data() {
            return {
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
                activeIndex: 0,
                isPackage: false
            }
        },
        methods: {
            setActive(index) {
                this.activeIndex = index;
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
            }
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