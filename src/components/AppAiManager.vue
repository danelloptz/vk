<template>
    <section class="unworked" v-if="!testers.includes(userData?.vk_id)">
        <img src="@/assets/images/unworked.png">
        <h1>Раздел находится в разработке</h1>
    </section>
    <section class="menu" v-if="testers.includes(userData?.vk_id)">
        <div 
            class="switch" 
        >
            <span
                v-for="(item, index) in listSwtich"
                :key="index"
                :class="{ active: activeIndex === item.index }" 
                @click="setActive(item.index)"
            >{{ item.name }}</span>
        </div> 
        <AppAiManagerBrief v-if="activeIndex == 0" :userData="userData"/>
        <AppAiManagerSends v-if="activeIndex == 1" />
    </section>
</template>

<script>
    import { getConfig } from '@/services/config';
    import AppAiManagerBrief from '@/components/AppAiManagerBrief.vue';
    import AppAiManagerSends from '@/components/AppAiManagerSends.vue';
    export default {
        components: { AppAiManagerBrief, AppAiManagerSends },
        props: {
            userData: Object
        },
        data() {
            return {
                testers: [],
                activeIndex: 0,
                listSwtich: [
                    {
                        index: 0,
                        name: "Бриф"
                    },
                    {
                        index: 1,
                        name: "Рассылки"
                    },
                    {
                        index: 2,
                        name: "Диалоги"
                    }, 
                    {
                        index: 3,
                        name: "Контакты"
                    }, 
                ],
            }
        },
        async created() {
            this.testers = await getConfig('manager_testers', localStorage.getItem('token'));
            console.log(this.testers, this.userData.vk_id);
        },
        methods: {
            setActive(index) {
                this.activeIndex = index;
            },
        }
    };
</script>

<style scoped>
    .unworked {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .unworked img {
        width: 540px;
        @media (max-width: 650px) {
            max-width: 330px;
        }
    }
    .unworked h1 {
        font-size: 40px;
        color: #FF6666;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    .menu {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 50px;
        margin-top: -20px;
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
    .active {
        background: #7023EC;
        font-weight: bold;
    }
</style>