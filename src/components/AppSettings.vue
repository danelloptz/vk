<template>
    <AppModalSubscribe
        :visibility1="isModal"
        :checkboxState="isCheckboxChecked"
        @update:visibility1="isModal = $event"
        @update:checkboxState="isCheckboxChecked = $event"
        @close="closeModal" 
    />
    <section class="settings" v-if="!isAuto">
        <h2>Настройки</h2>
        <h3>Контактные данные</h3>
        <div class="links">
            <span v-if="tgData?.link">Telegram: {{ tgData.link }}</span>
            <span v-if="whtData?.link">WhatsApp: {{ whtData.link }}</span>
        </div>
        
        <div class="row">
            <input 
                v-model="telegramLink" 
                placeholder="Telegram">
            <span @click="addTelegram">ДОБАВИТЬ</span>
        </div>
        <div class="row">
            <input 
                v-model="whatsappLink" 
                placeholder="WhatsApp">
            <span @click="addWhatsapp">ДОБАВИТЬ</span>
        </div>
        <h3>Региональные данные</h3>
        <div class="dropdown">
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Введите страну*"
                @focus="isDropdownVisibleCountry = true"
                @blur="hideDropdown"
            />
            <img :class="{'rotated': isDropdownVisibleCountry}" src="@/assets/images/arrow_down.png" class="arrow_down">
            <ul v-if="isDropdownVisibleCountry" class="dropdown-menu">
            <li
                v-for="country in filteredCountries"
                :key="country"
                @mousedown.prevent="selectCountry(country)"
            >
                {{ country }}
            </li>
            </ul>
        </div>
        <div class="dropdown">
            <input
                v-model="selectedCity" 
                placeholder="Город" >
        </div>
        
        <div class="dropdown" style="margin-top: 70px;">
            <input
                v-model="searchQueryGender"
                type="text"
                placeholder="Пол*"
                @focus="isDropdownVisibleGender = true"
                @blur="hideDropdown"
                ref="genderInput"
                readonly 
            />
            <img :class="{'rotated': isDropdownVisibleGender}" src="@/assets/images/arrow_down.png" class="arrow_down">
            <ul v-if="isDropdownVisibleGender" class="dropdown-menu">
                <li
                    @mousedown.prevent="selectGender(genders[0])"
                >
                    {{ genders[0] }}
                </li>
                <li
                    @mousedown.prevent="selectGender(genders[1])"
                >
                    {{ genders[1] }}
                </li>
            </ul>
        </div>
        <span v-if="isNotSelectGender" class="error_message">Не выбран пол!</span>

        <h3>ВК группа для продвижения:</h3>
        <div class="row">
            <input  
                v-model="vkGroupLink" 
                placeholder="ВК группа" >
            <span @click="addVKGroup">ДОБАВИТЬ</span>
            <h3 v-if="userData">Подписки: {{ userData.group?.rotation_count }}</h3>
        </div>
        <div class="row2">
            <input type="checkbox" class="checkbox" v-model="isCheckboxChecked" @change="handleCheckboxChange">
            <span>Подписки</span>
        </div>
        
        <h3>ВК видео для продвижения:</h3>
        <div class="row">
            <input  
                v-model="vkVideoLink" 
                placeholder="ВК видео" >
            <span @click="addVKVideo">ДОБАВИТЬ</span>
            <h3 v-if="userData">Просмотры: {{ userData.videoStat }}</h3>
        </div>

        <div v-if="selectedInterests.length > 0" class="selected-countries">
            <span v-for="(interest, index) in selectedInterests" :key="index" class="selected-interest">
            {{ interest }}
            <img src="@/assets/images/close.png" @click="removeInterest(index)" class="remove-btn">
            </span>
        </div>
        <div class="dropdown">
            <input
                type="text"
                v-model="searchQueryInterest"
                placeholder="Интересы"
                @focus="isDropdownVisibleInterest = true"
                @blur="hideDropdown"
                ref="selectInterest"
            />
            <img :class="{'rotated': isDropdownVisibleInterest}" src="@/assets/images/arrow_down.png" class="arrow_down">
            <ul v-if="isDropdownVisibleInterest" class="dropdown-menu">
                <li
                v-for="interest in interests"
                :key="interest"
                @mousedown.prevent="selectInterest(interest)"
                >
                {{ interest }}
                </li>
            </ul>
        </div>
        <span v-if="isNotSelectInterest" class="error_message">Не выбраны интересы!</span>
        <a @click="nextStep">Автопродвижение</a>
        <div class="auto">
            <span>Блок <strong>«Ваше предложение»</strong> - отображается только у обладателей пакетов <strong>Business и Leader</strong> в виде большого центрального рекламного блока, и на тарифе <strong>VIP и пакетах Business и Leader</strong>  в левом рекламном блоке. У пользователей  Free, Start и Standard - эта информация отображается только в разделе структура.</span>
            <span><i><strong>Сделайте свое предложение пользователям INTELEKTAZ, прямо сейчас</strong></i></span>
        </div>
        <h3>Ваше предложение:</h3>
        <textarea
            v-model="sentence"
            placeholder="Описание"
        ></textarea>
        <input  
            v-model="siteLink" 
            placeholder="Сайт" >
        <AppGroupOrUser 
            :objectData="userData"
            :isBusiness="isBusiness"
            class="card"
        />
        <span style="font-size: 14px;"><i>Для продвижения запрещены порнографические материалы, призывы к насилию, оскорбления и другие темы запрещенные законодательством вашей страны и правилами Вконтакте.</i></span>
        <AppGoodButton :text="text1" class="btn" @click="saveSettings" />
   </section>
   <AppSettingsAuto v-if="isAuto" />
</template>

<script>
    import { getUserInfo, sendNewSettings } from "@/services/user";
    import AppGroupOrUser from '@/components/AppGroupOrUser.vue';
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppModalSubscribe from '@/components/AppModalSubscribe.vue';
    
    import AppSettingsAuto from '@/components/AppSettingsAuto.vue';
    import { editGroup, editVideo } from "@/services/groups";

export default {
    components: { AppGroupOrUser, AppGoodButton, AppModalSubscribe, AppSettingsAuto },
    data() {
        return {
            userData: null,
            telegramLink: "",
            whatsappLink: "",
            vkGroupLink: "",
            vkVideoLink: "",
            sentence: "",
            siteLink: "",
            text1: "СОХРАНИТЬ ИЗМЕНЕНИЯ",
            isCheckboxChecked : true,
            countries: [],
            genders: ["Мужской", "Женский"],
            interests: ["Интернет бизнес", "МЛМ", "Инвестиции", "Недвижимость", "Здоровье и красота", "Трейдинг", "Криптовалюта", "Технологии", "Туризм и путешествия", "Мотивация", "Авто", "Одежда", "Еда и кулинария", "Развлечения и досуг", "Другое"],
            searchQuery: "",
            searchQueryGender: "",
            searchQueryInterest: "",
            selectedCountry: "",
            selectedGender: "",
            selectedCity: "",
            selectedInterests: [],
            isDropdownVisibleCountry: false,
            isDropdownVisibleGender: false,
            isDropdownVisibleInterest: false,
            isNotSelectCountry: false,
            isNotSelectGender: false,
            isNotSelectInterest: false,
            isBusiness: true,
            isNotCheckboxChecked: false,
            isAuto: false,
            isModal: false,
            tgData: null,
            whtData: null,
            beforeLinks: null
        };
    },
    computed: {
        filteredCountries() {
            return this.countries.filter((country) =>
                country.toLowerCase().startsWith(this.searchQuery.toLowerCase())
            );
        },
    },
    async created() {
        const response = await getUserInfo(localStorage.getItem("token"));
        this.userData = response;

        this.beforeLinks = [...this.userData.social_links];

        try {
            const response = await fetch('https://namaztimes.kz/ru/api/country');
            const data = await response.json();
            
            for (const value of Object.values(data)) {
                this.countries.push(value);
            }

        } catch (error) {
            console.error('Ошибка при загрузке данных о странах:', error);
        }
 
        console.log("сработал инит");
        this.initLinks();
    },
    watch: {
        userData: {
            immediate: true,
            handler(newData) {
                if (newData?.social_links) {
                    this.telegramLink = newData.social_links.telegram || "";
                    this.whatsappLink = newData.social_links.whatsapp || "";
                }
            }
        }
    },
    methods: {
        selectCountry(country) {
                this.selectedCountry = country;
                this.searchQuery = country;
                this.isDropdownVisibleCountry = false;
            },

            selectGender(gender) {
                this.selectedGender = gender;
                this.searchQueryGender = gender;
                this.isDropdownVisibleGender = false;
                this.$refs.genderInput.blur();
            },
            selectInterest(interest) {
                if (!this.selectedInterests.includes(interest)) {
                    this.selectedInterests.push(interest);
                }
                this.searchQueryInterest = '';
                this.isDropdownVisibleInterest = false;
                this.$refs.selectInterest.blur();
            },
            removeInterest(index) {
                this.selectedInterests.splice(index, 1);
            },

            hideDropdown() {
                this.isDropdownVisibleCountry = false;
                this.isDropdownVisibleGender = false;
                this.isDropdownVisibleInterest = false;
            },
            nextStep() {
                this.isAuto = true;
            },
            addTelegram() {
                this.tgData = { "type": "telegram", "link": this.telegramLink };
                this.userData.social_links.push(this.tgData);
            },
            addWhatsapp() {
                this.whtData = { "type": "whatsapp", "link": this.whatsappLink };
                this.userData.social_links.push(this.whtData);
            },
            async addVKGroup() {
                const response = await editGroup(this.vkGroupLink, this.userData.vk_id);
                console.log(response.status);
            },
            async addVKVideo() {
                const response = await editVideo(this.vkVideoLink, this.userData.vk_id);
                console.log(response.status);
            },
            closeModal() {
                this.isModal = false;
            },
            handleCheckboxChange() {
                if (!this.isCheckboxChecked) {
                    this.isModal = true;
                }
            },

            initLinks() { 
                this.tgData = this.userData.social_links.find(link => link.type === "telegram");
                this.whtData = this.userData.social_links.find(link => link.type === "whatsapp");
                if (this.tgData?.link) {
                    this.telegramLink = this.tgData.link;
                }
                if (this.whtData?.link) {
                    this.whatsappLink = this.whtData.link;
                }
                if (this.userData.group?.group_link)
                    this.vkGroupLink = this.userData.group.group_link;
                if (this.userData.video?.video_link)
                    this.vkVideoLink = this.userData.video?.video_link;
                if (this.userData.country)
                    this.searchQuery = this.userData.country;
                if (this.userData.city)
                    this.selectedCity = this.userData.city;
                if (this.userData.sex)
                    this.searchQueryGender = this.userData.sex_db;
                if (this.userData.interests) 
                    this.selectedInterests = [...this.userData.interests];
                if (this.userData.group?.vip_offer) {
                    this.sentence = this.userData.group.vip_offer_text;
                    this.siteLink = this.userData.group.group_link;
                }
            },
            async saveSettings() {
                console.log(this.beforeLinks);

                const payload = {
                    country: this.searchQuery != this.userData.country ? this.searchQuery : null,
                    city: this.selectedCity != this.userData.city ? this.selectedCity : null,
                    sex: this.searchQueryGender != this.userData.sex_db ? this.searchQueryGender : null,
                    interests: this.selectedInterests != this.userData.interests ? this.selectedInterests : null,
                    social_links: this.userData.social_links != this.beforeLinks ? this.userData.social_links : null,
                    vip_offer: this.sentence,
                    group_link: this.siteLink,
                };

                console.log(payload);
                console.log(this.userData);
                await sendNewSettings(payload, localStorage.getItem("token")); 
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

    .btn {
        width: 300px;
        @media (max-width: 900px) {
            width: 250px;
        }
        @media (max-width: 500px) {
            height: 50px;
            width: 200px;
        }
    }
    .card {
        height: 276px;
        background: #2F3251;
        border-radius: 10px;
        padding: 30px 50px;
        @media (max-width: 1500px) {
            width: 100%;
        }
        @media (max-width: 700px) {
            height: auto;
        }
        @media (max-width: 500px) {
            padding: 50px;
        }
    }

    a {
        color: #60ADDC;
        font-size: 20px;
        font-weight: bold;
        font-family: 'OpenSans';
        text-decoration: underline;
    }
    .auto {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        padding: 30px;
        background: #2F3251;
        border-radius: 10px;
    }
    .auto span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .settings {
        display: flex;
        flex-direction: column;
        row-gap: 25px;
    }

    .links {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .row {
        display: flex;
        align-items: center;
        column-gap: 20px;
        flex-wrap: wrap;
        row-gap: 10px;
    }
    .row2 {
        display: flex;
        align-items: center;
        column-gap: 10px;
    }
    .row2 span {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
    }
    .row span {
        font-size: 16px;
        color: white;
        font-family: 'Tektur';
        font-weight: bold;
        padding: 0px 28px;
        background: none;
        border: 1px solid white;
        border-radius: 10px;
        text-align: center;
        align-content: center;
        height: 60px;
        transition: .2s ease-in;
        cursor: pointer;
    }
    .row span:hover {
        background: rgba(255, 255, 255, 0.167);
    }

    h3 {
        font-size: 20px;
        color: white;
        font-family: 'OpenSans';
        font-weight: bold;
    }
    h1, h2, span, img {
        z-index: 5;
    }
    .dropdown {
        position: relative;
        width: 360px;
        @media (max-width: 500px) {
            width:70vw;
        }
    }

    input {
        width: 360px;
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
    textarea {
        width: 360px;
        height: 190px;
        padding: 20px;
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

    .arrow_down {
        position: absolute;
        top: 23px;
        right: 23px;
        transition: transform 0.3s ease;
    }

    .arrow_down.rotated {
        transform: rotate(180deg);
    }

    .dropdown-menu {
        position: absolute;
        width: 100%;
        border: 1px solid white;
        border-radius: 10px;
        max-height: 200px;
        overflow-y: scroll;
        list-style: none;
        margin: 0;
        padding: 0;
        z-index: 1000;
        color: rgba(255, 255, 255, 0.5);
        font-size: 20px;
        font-weight: normal;
        letter-spacing: 1px;
        scrollbar-width: none;
        z-index: 15;
    }
    .dropdown::-webkit-scrollbar {
        width: 0;  
        height: 0;
    }

    .dropdown::-webkit-scrollbar-thumb {
        background: transparent;
    }

    .dropdown-menu li {
        padding: 20px;
        cursor: pointer;
        border-bottom: 1px solid white;
        background: #070a29;
        font-family: 'OpenSans'
    }

    .dropdown-menu li:hover {
        background: #0c103e;
    }

    h1 {
        font-size: 48px;
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
        font-size: 24px;
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
        @media (max-width: 550px) {
            font-size: 15px;
        }
        @media (max-width: 450px) {
            font-size: 13px;
        }
    }
    hr {
        width: 100%;
        height: 1px;
        background-color: white;
        @media (max-width: 900px) {
            width: 95%;
        }
    }
    h2 {
        font-family: 'OpenSans';
        font-size: 40px;
        color: white;
    }

    span {
        color: white;
        font-size: 18px;
        font-family: 'OpenSans';
    }

    .selected-countries {
        display: flex;
        flex-wrap: wrap;
        column-gap: 10px;
        row-gap: 10px;
        width: 360px;
    }

    .selected-interest {
        display: inline-flex;
        align-items: center;
        column-gap: 10px;
        padding: 10px;
        background: #1B1E3D;
        border-radius: 10px;
        color: rgba(255, 255, 255, 0.669);
    }

    .remove-btn {
        width: 15px;
        height: 15px;
        cursor: pointer;
    }

    a {
        text-decoration: underline;
        cursor: pointer;
    }

    .error_message {
        font-size: 14px;
        font-family: 'OpenSans';
        color: red;
    }

    .checkbox {
        width: 30px;
        height: 30px;
        background: none;
        border: 1px solid white;
        border-radius: 3px;
    }
</style>