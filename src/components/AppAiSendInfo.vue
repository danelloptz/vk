<template>
    <AppAiManagerNewStep v-if="isNewStep" />
    <section class="send_info" v-if="!isNewStep">
        <h2>Информация о рассылке</h2>
        <div class="managers_switch">
            <span class="managers_switch_title">ИИ менеджер: </span>
            <div 
                class="switch" 
            >
                <span
                    v-for="(item, index) in listSwtich"
                    :key="index"
                    class="switch_item"
                    :class="{ active: activeIndex === item.index }" 
                    @click="setActive(item.index)"
                >{{ item.index + 1 }}</span>
            </div> 
        </div>
        <div class="stats">
            <div class="stats_card">
                <div class="stats_card_header">Подписчики</div>
                <span class="stats_card_num">{{ sendData.subs }}</span>
            </div>
            <div class="stats_card">
                <div class="stats_card_header">Отписки</div>
                <span class="stats_card_num">{{ sendData.unsubs }}</span>
            </div>
            <div class="stats_card">
                <div class="stats_card_header">Конверсия</div>
                <span class="stats_card_num">{{ sendData.conv }}</span>
            </div>
        </div>
        <div class="menu">
            <div class="menu_header">
                <div class="menu_header_back">
                    <img src="@/assets/images/arrow.png" class="menu_header_back_arrow">
                    <span>Назад</span>
                </div>
                <div class="menu_header_nav">
                    <span>Настройки</span>
                    <span>Шаги</span>
                    <span>Аудитория {{ sendData.subs }}</span>
                </div>
            </div>
            <AppGoodButton :text="'ДОБАВИТЬ ШАГ'" v-if="steps.length == 0" class="add_step" @click="openNewStep"/>
        </div>
        <div class="button_wrapper">
            <AppBadButton :text="'НАЗАД'" class="backup_btn" @click="backup"/>
        </div>
    </section>
    
</template>

<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppBadButton from '@/components/AppBadButton.vue';
    import AppAiManagerNewStep from '@/components/AppAiManagerNewStep.vue';

    export default {
        components: { AppGoodButton, AppBadButton, AppAiManagerNewStep },
        props: {
            sendData: Object
        },
        data() {
            return {
                listSwtich: [
                    {
                        index: 0,
                    },
                    {
                        index: 1,
                    },
                    {
                        index: 2,
                    }, 
                    {
                        index: 3,
                    }, 
                    {
                        index: 4,
                    }, 
                ],
                activeIndex: 0,
                steps: [],
                isNewStep: false
            }
        },
        methods: {
            openNewStep() {
                this.isNewStep = true;
            },
            backup() {
                this.$emit('backup');
            }
        }
    };
</script>

<style scoped>
    .backup_btn {
        width: 150px;
        height: 51px;
    }
    .button_wrapper {
        width: 100%;
        display: flex;
        justify-content: end;
        margin-top: 50px;
    }
    .add_step {
        width: 166px;
        height: 45px;
        font-size: 14px;
        align-self: center;
        margin: 37px 0px;
    }
    .menu_header_nav span {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
        font-weight: 500;
        cursor: pointer;
    }
    .menu_header_nav {
        display: flex;
        column-gap: 30px;
        align-items: center;
    }
    .menu_header_back span {
        font-size: 16px;
        color: white;
        opacity: .5;
        font-family: 'OpenSans';
        font-weight: 500;
    }
    .menu_header_back_arrow {
        width: 30px;
        transform: rotate(180deg);
        opacity: .5;
    }
    .menu_header_back {
        position: absolute;
        left: 30px;
        top: 19px;
        display: flex;
        column-gap: 20px;
        align-items: center;
    }
    .menu_header {
        position: relative;
        display: flex;
        justify-content: center;
        padding: 20px 30px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    }
    .menu {
        margin-top: 25px;
        display: flex;
        flex-direction: column;
        background: #1B1E3D;
        border-radius: 10px;
    }
    .stats_card_num {
        font-size: 64px;
        color: white;
        font-family: 'OpenSans';
        padding: 10px 22px 16px 22px;
    }
    .stats_card_header {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
        padding: 20px 20px 30px 22px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    }
    .stats_card {
        display: flex;
        flex-direction: column;
        background: #1B1E3D;
        border-radius: 10px;
    }
    .stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        column-gap: 25px;
        width: 100%;
        margin-top: 50px;
    }
    .send_info {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    h2 {
        font-size: 24px;
        color: white;
        font-family: 'OpenSans';
    }
    .managers_switch {
        display: flex;
        column-gap: 21px;
        align-items: center;
        margin-top: 50px;
    }
    .managers_switch_title {
        color: white;
        font-size: 20px;
        font-family: 'OpenSans';
    }
    .switch {
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