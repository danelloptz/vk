<template>
    <section class="modal">
        <div class="modal-background"></div>
        <img src="@/assets/images/close.png" class="close" @click="this.$router.push('/signup_2')">
        <div class="text_wrapper">
            <h1>ШАГ 3 - УКАЖИТЕ ВАШУ ГРУППУ ДЛЯ ПРОДВИЖЕНИЯ</h1>
        </div>
        <hr>
        <div class="info_block">
            <div class="user_info">
                <img v-if="userData" :src="userData.avatar" class="avatar">
                <div class="user_info_text">
                    <h2 v-if="userData">{{ `${userData.first_name} ${userData.last_name}` }}</h2>
                    <span v-if="userData">ID: {{ userData.vk_id }}</span>
                </div>
            </div>
            <div class="user_data">
                <h2>Ваша группа ВК</h2>
                <input
                    v-model="selectedGroup" 
                    placeholder="Вставьте ссылку" >
                <span v-if="isErorr" class="error">Не существует такой группы!</span>
                <span>*Вы в любое время можете добавить или изменить свою группу для продвижения в разделе «Настройки» в личном кабинете.</span>
                <div class="wrapper_btn">
                    <AppGoodButton :text="text1" @click="checkLink" />
                    <AppBadButton :text="text2" @click="skip" />
                </div>
            </div>
        </div>
    </section>

    <AppModal 
        :title="linkGroupTitle" 
        :message="linkGroupMessage" 
        :visibility1="modalVisible" 
        @update:visibility1="modalVisible = $event"
        @close="openSecondModal" 
    />
    <AppModal 
        :title="linkEndTitle" 
        :message="linkEndMessage" 
        :visibility2="modalEndVisible" 
        @update:visibility2="modalEndVisible = $event" 
        @close="redirect" 
    />
</template>

<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppBadButton from '@/components/AppBadButton.vue';
    import AppModal from '@/components/AppModal.vue';
    import { getUserInfo } from '@/services/user';
    import { setNewUser } from '@/services/auth';
    import { checkGroupLink } from '@/services/groups';

    export default {
        components: { AppGoodButton, AppBadButton, AppModal },
        data() {
            return {
                text1: "ПРИВЯЗАТЬ",
                text2: "ПРОПУСТИТЬ",
                userData: null,
                selectedGroup: "",
                linkGroupTitle: "УСПЕШНО!",
                linkEndTitle: "ПОЗДРАВЛЯЮ!",
                linkEndMessage: "Вы успешно прошли регистрацию! Ваш тариф FREE",
                linkGroupMessage: "Ваша группа ВК привязана",
                modalVisible: false,      
                modalEndVisible: false,  
                isErorr: false
            };
        },
        async created() {
            const response = await getUserInfo(localStorage.getItem("token"));
            this.userData = response;
        },
        methods: {
            async checkLink() {
                if (this.selectedGroup !== "") {
                    const regex = /^https:\/\/vk\.com\/.+$/;
                    if (!regex.test(this.selectedGroup)) {
                        this.isErorr = true;
                        return;
                    }

                    const response = await checkGroupLink(this.selectedGroup, this.userData.vk_id, "registration");
                    if (response.status) {
                        localStorage.setItem("vk_link", this.selectedGroup);
                        const dataToSend = this.getAllParams();
                        await setNewUser(dataToSend);
                        this.modalVisible = true; // Открыть первое модальное окно
                    } else {
                        this.isErorr= true;
                    }

                    
                }
            },
            async skip() {
                const dataToSend = this.getAllParams();
                await setNewUser(dataToSend);
                this.modalVisible = false; // Закрыть первое модальное окно
                this.modalEndVisible = true; // Открыть второе модальное окно
            },
            redirect() {
                // Перенаправление, если нужно
                this.$router.push('/home');
            },
            openSecondModal() {
                this.modalVisible = false; // Закрыть первое окно, если оно открыто
                this.modalEndVisible = true; // Открыть второе окно
            },
            getAllParams() {
                const data = {
                    "payload": {
                        "vk_id": this.userData.vk_id,
                        "country": localStorage.getItem("country"),
                        "city": localStorage.getItem("city"),
                        "sex": localStorage.getItem("sex"),
                        "interests": JSON.parse(localStorage.getItem("interests")),
                        "vk_link": localStorage.getItem("vk_link") ? localStorage.getItem("vk_link") : "",
                    }
                }
                console.log(data);
                return data;
            }
        }
    };
</script>





<style scoped>
    @font-face {
        font-family: 'Tektur';
        src: url('@/assets/fonts/Tektur.ttf') format('truetype');
    }
    @font-face {
        font-family: 'OpenSans';
        src: url('@/assets/fonts/OpenSans.ttf') format('truetype');
    }

    h3 {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        font-weight: normal;
    }
    h1, h2, span, img {
        z-index: 5;
    }

    .modal {
        width: 1160px;
        border-radius: 10px;
        position: relative; /* Обеспечиваем позиционирование для псевдоэлемента */
        display: flex;
        flex-direction: column;
        /* align-items: center; */
        padding: 50px;
        z-index: 2;
        overflow-y: auto;
        scrollbar-width: none;
        row-gap: 30px;
        box-sizing: border-box;
        margin-top: -50px;
        align-self: center;
        @media (max-width: 1400px) {
            width: 80vw;
        }
        @media (max-width: 650px) {
            width: 90vw;
            padding: 30px 15px;
        }
    }

    .modal::-webkit-scrollbar {
        width: 0;  
        height: 0;
    }

    .modal::-webkit-scrollbar-thumb {
        background: transparent;
    }

    .close {
        position: absolute;
        right: 30px;
        top: 30px;
        width: 21px;
        height: 21px;
        cursor: pointer;
        @media (max-width: 450px) {
            right: 20px;
            top: 20px;
        }
    }
    .modal-background {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url("@/assets/images/background.png");
        background-color: #1B1E3D;
        background-size: contain;
        background-position: center;
        background-blend-mode: multiply;
        background-repeat: repeat-y;
        opacity: 0.25; 
        background-size: 300%;
        filter: brightness(140%) contrast(80%);
        border-radius: 10px;
    }
    .text_wrapper {
        display: flex;
        flex-direction: column;
        align-items: start;
        row-gap: 20px;
    }
    h1 {
        font-size: 36px;
        color: white;
        font-family: 'Tektur';
        line-height: 62.4px;
        font-weight: 400;
        @media (max-width: 900px) {
            font-size: 35px;
        }
        @media (max-width: 500px) {
            font-size: 30px;
        }
    }
    span {
        font-size: 18px;
        font-family: 'OpenSans';
        font-weight: 400;
        line-height: 32.68px;
        color: white;
        text-wrap: wrap;
        text-align: left;
        font-family: 'OpenSans';
        @media (max-width: 900px) {
            font-size: 20px;
        }
        @media (max-width: 650px) {
            font-size: 17px;
        }
    }
    hr {
        width: 100%;
        height: 1px;
        background-color: white;
        margin-bottom: 20px;
        @media (max-width: 900px) {
            width: 95%;
        }
    }
    .info_block {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: start;
        @media (max-width: 1200px) {
            grid-template-columns: 1fr;
            row-gap: 20px;
        }
    }
    .user_info {
        display: flex;
        column-gap: 30px;
        align-items: center;
    }
    .user_data {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    .avatar {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        object-position: center;
        object-fit: cover;
        @media (max-width: 560px) {
            width: 100px;
            height: 100px;
        }
    }
    input {
        width: 100%;
        height: 60px;
        padding: 0 20px;
        box-sizing: border-box;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.5);
        background: none;
        border: 1px solid white;
        border-radius: 10px;
        font-family: 'OpenSans';
        position: relative;
        @media (max-width: 500px) {
            width: 70vw;
        }
    }
    .wrapper_btn {
        display: flex;
        column-gap: 20px;
    }
    h2 {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .user_info_text h2 {
        font-family: 'OpenSans';
        font-size: 20px;
        background: linear-gradient(to right, #7023EC, #A585DA); 
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }
</style>