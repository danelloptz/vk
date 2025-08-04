<template>
    <AppAiManagerNewStep 
        v-if="isNewStep" 
        :isFirstStep="steps.length == 0 || firstStep" 
        :editData="editStep"
        @backup="isNewStep = false"
        @create_new_step="updateSteps"
    />
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
                    <span>Аудитория ({{ sendData.subs }})</span>
                </div>
            </div>
            <AppGoodButton :text="'ДОБАВИТЬ ШАГ'" v-if="steps.length == 0" class="add_step" @click="openNewStep"/>
            <div class="steps" v-else>
                <div class="steps_header">
                    <span style="justify-self: center;">Имя</span>
                    <span>Сценарий</span>
                    <span>Задержка/Время</span>
                    <span>Статистика</span>
                </div>
                <div 
                    v-for="(step, index) in steps"
                    :key="index"
                    class="step"
                >
                    <div class="step_name">
                        <img src="@/assets/images/squares.png" />
                        <span>{{ step.name }}</span>
                    </div>
                    <span>{{ step.scene }}</span>
                    <span>{{ step.time }}</span>
                    <div class="step_end">
                        <span>{{ step.stats.subs }} · {{ step.stats.unsubs }} · {{ step.stats.conv }}</span>
                        <div class="step_icons">
                            <img src="@/assets/images/manager_edit.png" @click="edit(step, index)"/>
                            <img src="@/assets/images/trash.png" @click="deleteStep(index)"/>
                        </div>
                    </div>
                </div>
                <div class="steps_btns">
                    <AppGoodButton :text="'ДОБАВИТЬ ШАГ'" class="addNextStep" @click="openNewStep" />
                    <AppGoodButton :text="'ЗАПУСТИТЬ'" class="startStep" />
                </div>
            </div>
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
                steps: [
                    {
                        name: '111',
                        title: 'Заголовок',
                        text: 'Раз два три четыре пять',
                        image: 'https://sun6-22.vkuserphoto.ru/s/v1/ig2/LgVFW7BY5QJDAfIMu6FxBZ65WkxQIPs9-YVYQVGqdims6hVhlyD1HjUqSQFvUYDSXpid2Rgxm-PQLsAzYIlH2yiP.jpg?quality=95&crop=192,130,768,768&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200',
                        scene: 1,
                        time: '31 июля 2025, 13:36',
                        stats: {
                            subs: 0,
                            unsubs: 0,
                            conv: 0
                        }
                    },
                    {
                        name: '22',
                        title: 'Заголовок',
                        text: 'Раз два три четыре пять',
                        image: 'https://sun6-22.vkuserphoto.ru/s/v1/ig2/spP1ei8ErOIPpJ7MXBamz5tqj6q0DLTUu9Y4_YxoFjWgr_mDA7IshsqtNzfJRMHbLT6EEsiR-QHEVvx0cotvisze.jpg?quality=95&crop=107,110,857,857&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200',
                        scene: 2,
                        time: '1 день',
                        stats: {
                            subs: 0,
                            unsubs: 0,
                            conv: 0
                        }
                    },
                ],
                isNewStep: false,
                editStep: null,
                firstStep: false
            }
        },
        methods: {
            updateSteps() {
                this.isNewStep = false;
            },
            edit(step, index) {
                this.editStep = step;
                this.firstStep = index == 0;
                this.isNewStep = true;
            },
            deleteStep(index) {
                this.steps.splice(1, index);
            },
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
    .step_end {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    .startStep {
        background: #16A253;
    }
    .addNextStep, .startStep {
        width: 120px;
        height: 35px;
        font-size: 10px;
        letter-spacing: 0px;
        border-radius: 5px;
    }
    .steps_btns {
        display: flex;
        column-gap: 20px;
        margin-top: 26px;
        align-self: self-start;

    }
    .step_icons img {
        width: 15px;
        height: 15px;
    }
    .step_icons {
        display: flex;
        align-items: center;
        column-gap: 10px;
        margin-right: 10px;
    }
    .step span {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
        font-weight: 500;
    }
    .step_name img {
        width: 8px;
        height: 8px;
    }
    .step_name {
        display: flex;
        align-items: center;
        column-gap: 10px;
        margin-left: 79px;
    }
    .step {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        padding: 10px 0px;
    }
    .steps_header span {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.5);
        font-family: 'OpenSans';
        font-weight: 500;
    }
    .steps_header {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    }
    .steps {
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0px 30px 50px 30px;
    }
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