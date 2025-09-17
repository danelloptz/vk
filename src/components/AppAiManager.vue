<template>
    <AppAiManagerLimitsModal 
        :visibility1="isBuyModal"
        :user_id="userData.id"
        :balance="userData.balance"
        :isMoreText="isMoreText"
        @update:visibility1="isBuyModal = $event"
        @good="openModal(true)"
        @bad="openModal(false)"
    />
     <AppAiManagerConfirmModal 
        :message="msg" 
        :isOptions="false"
        :visibility1="isConfirmModal"
        @update:visibility1="isConfirmModal = $event"
    />
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
            >{{ index == 3? item.name + ` (${audience?.length || 0})` : item.name }}</span>
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
        <div class="generations_wrapper">
            <span class="generations_item" @click="openGeneratorModal(false)">
                Отправлено писем: {{ limits?.free.remains == -1 ? '∞' : formatNumber(limits.free.remains) }} / {{ limits?.free.remains == -1 ? '∞' : formatNumber(limits.free.total) }}
            </span>
            <span class="generations_item" @click="openGeneratorModal(true)">
                Пакет писем: {{ formatNumber(limits.paid.remains) }} / {{ formatNumber(limits?.paid.total) }}
            </span>
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
        <AppAiManagerSends 
            v-if="activeIndex == 1 && !noAccess" 
            :manager_id="managers[activeIndex2]?.id"
            :userData="userData" 
            :activeIndex="activeIndex2" 
            @openBrief="openBrief"
        />
        <AppAiManagerDialog 
            v-if="activeIndex == 2 && !noAccess" 
            :bot_id="managers[activeIndex2]?.id" 
            :userTags="userTags"
            :isLeader="isLeader"
            :userData="userData"
            :telegram_id="telegram_id"
        />
        <AppAiManagerContacts
            v-if="activeIndex == 3 && !noAccess"
            :bot_id="managers[activeIndex2]?.id" 
            :bot_token="managers[activeIndex2]?.bot_token" 
            :user_id="userData?.id"
            :userTags="userTags"
            @openMsg="openMsg"
        />
    </section>
</template>

<script>
    import { getConfig } from '@/services/config';
    import { 
        getManagers, 
        getAllDialogs,
        getLimits
    } from '@/services/manager';
    import AppAiManagerBrief from '@/components/AppAiManagerBrief.vue';
    import AppAiManagerSends from '@/components/AppAiManagerSends.vue';
    import AppAiManagerDialog from '@/components/AppAiManagerDialog.vue';
    import AppAiManagerContacts from '@/components/AppAiManagerContacts.vue';
    import AppAiManagerLimitsModal from '@/components/AppAiManagerLimitsModal.vue';
    import AppAiManagerConfirmModal from '@/components/AppAiManagerConfirmModal.vue';
    export default {
        components: { AppAiManagerBrief, AppAiManagerSends, AppAiManagerDialog, AppAiManagerContacts, AppAiManagerLimitsModal, AppAiManagerConfirmModal },
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
                activeIndex2: 0,
                userTags: null,
                telegram_id: null,
                audience: null,
                isBuyModal: false,
                isConfirmModal: false,
                msg: "",
                limits: null,
                isMoreText: false
            }
        },
        async created() {
            this.testers = await getConfig('manager_testers', localStorage.getItem('token'));
            this.isLeader = this.userData.packages.at(-1).package_name == 'Leader';
            await this.updateManagers();
            if (this.managers[this.activeIndex2]?.id)
                this.audience = await getAllDialogs(this.managers[this.activeIndex2].id);
            this.limits = await getLimits(this.userData.id);
        },
        methods: {
            formatNumber(num) {
                return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            },
            openGeneratorModal(flag) {
                this.isMoreText = flag;
                this.isBuyModal = true;
            },
            async openModal(status) {
                this.msg = status ? 'Пакет писем успешно куплен.' : 'При покупке писем произошла ошибка.';
                this.isConfirmModal = true;
                if (status) this.limits = await getLimits(this.userData.id);
            },
            openBrief() {
                this.activeIndex = 0;
            },
            openMsg(telegram_id) {
                this.telegram_id = telegram_id;
                this.activeIndex = 2;
            },
            async updateManagers() {
                const managers = await getManagers(this.userData.id);
                if (managers) {
                    this.managers = managers;
                    if (this.managers[this.activeIndex2]?.assistant.assistant_config.user_filters)
                        this.userTags = JSON.parse(this.managers[this.activeIndex2]?.assistant.assistant_config.user_filters);
                }
            },
            async setActive2(index) {
                this.activeIndex2 = index;
                this.activeIndex = 0;
                if (!this.isLeader && index > 0) {
                    this.noAccess = true;
                    return;
                }
                this.noAccess = false;
                this.audience = this.managers[this.activeIndex2]?.id ? await getAllDialogs(this.managers[this.activeIndex2].id) : 0;
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
    .generations_wrapper {
        display: flex;
        column-gap: 30px;
        @media (max-width: 750px) {
            flex-direction: column;
        }
    }
    .generations_item {
        padding: 10px 20px;
        background: #111433;
        border-radius: 10px;
        color: white;
        font-size: 20px;
        font-family: 'OpenSans';
        width: fit-content;
        height: fit-content;
        margin-bottom: 10px;
        cursor: pointer;
        @media (max-width: 750px) {
            width: 100%;
            font-size: 16px;
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
        row-gap: 40px;
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