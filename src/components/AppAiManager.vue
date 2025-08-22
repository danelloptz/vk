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
        <div class="managers_switch" v-if="managers.length > 0">
            <span class="managers_switch_title">ИИ менеджер: </span>
            <div 
                class="switch2" 
            >
                <span
                    v-for="(_, index) in 5"
                    :key="index"
                    class="switch_item"
                    :class="{ active: activeIndex2 === index }" 
                    @click="setActive2(index)"
                >{{ index + 1 }}</span>
            </div> 
        </div>
        <div class="no_package" v-if="noAccess">
            <img src="@/assets/images/robot.png">
            <h1>Чтобы увеличить количество менеджеров до 5, активируйте пакет Leader!</h1>
            <AppGoodButton :text="'ВЫБРАТЬ ПАКЕТ'" style="width: 200px; margin-top: 40px;" @click="openTatiff" />
        </div>
        <AppAiManagerBrief 
            v-if="activeIndex == 0 && !noAccess" 
            :userData="userData" 
            :managers="managers"
            :activeIndex="activeIndex2"
            @openTariff="openTariff"
            @update_managers="updateManagers"
        />
        <AppAiManagerSends v-if="activeIndex == 1 && !noAccess" :userData="userData" :activeIndex="activeIndex2" />
        <AppAiManagerDialog v-if="activeIndex == 2 && !noAccess" />
    </section>
</template>

<script>
    import { getConfig } from '@/services/config';
    import { 
        getManagers, 
    } from '@/services/manager';
    import AppAiManagerBrief from '@/components/AppAiManagerBrief.vue';
    import AppAiManagerSends from '@/components/AppAiManagerSends.vue';
    import AppAiManagerDialog from '@/components/AppAiManagerDialog.vue';
    export default {
        components: { AppAiManagerBrief, AppAiManagerSends, AppAiManagerDialog },
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
                managers: null,
                noAccess: false,
                isLeader: false,
                activeIndex2: 0
            }
        },
        async created() {
            this.testers = await getConfig('manager_testers', localStorage.getItem('token'));
            this.isLeader = this.userData.packages.at(-1).package_name == 'Leader';
            await this.updateManagers();
        },
        methods: {
            async updateManagers() {
                const managers = await getManagers(this.userData.id);
                if (managers) {
                    this.managers = managers;
                }
            },
            setActive2(index) {
                this.activeIndex2 = index;
                this.activeIndex = 0;
                if (!this.isLeader && index > 0) {
                    this.noAccess = true;
                    return;
                }
                this.noAccess = false;
            },
            openTariff() {
                this.$emit("openTariff");
            },
            setActive(index) {
                this.activeIndex = index;
            },
        }
    };
</script>

<style scoped>
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
    .managers_switch {
        display: flex;
        column-gap: 21px;
        align-items: center;
    }
    .managers_switch_title {
        color: white;
        font-size: 20px;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    .switch2 {
        width: 149px;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
    }
    .switch_item {
        width: 30px;
        height: 30px;
        color: white;
        font-size: 18px;
        font-family: 'OpenSans';
        cursor: pointer;
        text-align: center;
        align-content: center;
        transition: .1s ease-in;
        @media (max-width: 650px) {
            font-size: 20px;
        }
    }
    .active {
        background: #7023EC;
    }
    h2 {
        color: white;
        font-size: 20px;
        font-family: 'OpenSans';
    }
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
        @media (max-width: 650px) {
            row-gap: 30px;
        }
    }
    .switch {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        column-gap: 30px;
        @media (max-width: 650px) {
            display: flex;
            flex-direction: column;
            row-gap: 10px;
        }
    }
    .switch span {
        width: 100%;
        height: 40px;
        color: white;
        font-size: 18px;
        font-family: 'OpenSans';
        cursor: pointer;
        text-align: center;
        align-content: center;
        transition: .1s ease-in;
        border: 1px solid white;
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    .active {
        background: #7023EC;
        border: none !important;
    }
</style>