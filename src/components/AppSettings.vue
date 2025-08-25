<template>
    <AppModal 
        :title="title" 
        :message="msg" 
        :visibility1="isSaveModal"
        @update:visibility1="isSaveModal = $event"
    />
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
            <span v-if="windowWidth > 650">Вконтакте: https://vk.com/id{{ userData.vk_id }}</span>
            <span v-if="tgData?.link && windowWidth > 650">Telegram: {{ tgData.link }}</span>
            <span v-if="whtData?.link && windowWidth > 650">WhatsApp: {{ whtData.link }}</span>
            <span v-if="windowWidth > 650 && emailData">Почта: {{ emailData }}</span>
            <div class="mobile_links_row" v-if="windowWidth <= 650">
                <span>Вконтакте: </span>
                <span>https://vk.com/id{{ userData.vk_id }}</span>
            </div>
            <div class="mobile_links_row" v-if="tgData?.link && windowWidth <= 650">
                <span>Telegram: </span>
                <span>{{ tgData.link }}</span>
            </div>
            <div class="mobile_links_row" v-if="whtData?.link && windowWidth <= 650">
                <span>WhatsApp: </span>
                <span>{{ whtData.link }}</span>
            </div>
            <div class="mobile_links_row" v-if="emailData && windowWidth <= 650">
                <span>Почта: </span>
                <span>{{ emailData }}</span>
            </div>
        </div>
        
        <div class="row">
            <input 
                v-model="emailLink" 
                placeholder="Почта">
            <span @click="addEmail">ДОБАВИТЬ</span>
        </div>
        <div class="row">
            <input 
                v-model="telegramLink" 
                placeholder="Telegram (введите имя пользователя)">
            <span @click="addTelegram">ДОБАВИТЬ</span>
        </div>
        <div class="row">
            <input 
                v-model="whatsappLink" 
                type="number"
                placeholder="WhatsApp (введите номер телефона)">
            <span @click="addWhatsapp">ДОБАВИТЬ</span>
            <!-- <span class="error_message" v-if="notTelegram">Введите номер телефона</span> -->
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
        
        <div class="dropdown" :style="{ marginTop: windowWidth > 650 ? '70px' : '30px' }">
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
            <h3 v-if="userData">Подписки: {{ userData.group?.count_subs_from_service || 0}}</h3>
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
            <h3 v-if="userData">Просмотры: {{ userData?.video?.count_subs_from_service || 0 }}</h3>
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
            <span>Блок <strong>«Ваше предложение»</strong> - отображается только у обладателей пакетов <strong>Business и Leader</strong> в виде большого центрального рекламного блока, и на тарифе <strong>VIP и пакетах Business и Leader</strong>  в левом рекламном блоке.</span>
            <span><i><strong>Сделайте свое предложение пользователям INTELEKTAZ, прямо сейчас:</strong></i></span>
        </div>
        <h3>Ваше предложение:</h3>
        <span>*В вип-предложении будет показываться только первые 90 символов. Полностью предложение будет видно в бизнес-предложении.</span>
        <div class="row">
            <textarea
                v-model="sentence"
                placeholder="Ваше предложение"
                maxlength="200"
            ></textarea>
            <AppVipUser 
                v-if="windowWidth > 650"
                :vipUser="newUserData" 
                :vkData="vkData"
                :tgData="tgData"
                :whtData="whtData"
                :windowWidth="windowWidth"
            />
        </div>
        <input  
            v-model="siteLink" 
            placeholder="Сайт" >
        <AppVipUser 
            v-if="windowWidth <= 650"
            :vipUser="newUserData" 
            :vkData="vkData"
            :tgData="tgData"
            :whtData="whtData"
            :windowWidth="windowWidth"
        />
        <AppGroupOrUser 
            :objectData="newUserData"
            :isSettings="true"
            :isBusiness="isBusiness"
            class="card"
        />
        <span style="font-size: 14px;"><i>Для продвижения запрещены порнографические материалы, призывы к насилию, оскорбления и другие темы запрещенные законодательством вашей страны и правилами Вконтакте.</i></span>
        <AppGoodButton :text="text1" class="btn" @click="saveSettings" />
   </section>
   <AppSettingsAuto v-if="isAuto" :userData="userData" />
</template>

<script>
    import { getUserInfo, sendNewSettings } from "@/services/user";
    import AppGroupOrUser from '@/components/AppGroupOrUser.vue';
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppModalSubscribe from '@/components/AppModalSubscribe.vue';
    import AppModal from '@/components/AppModal.vue';
    import AppVipUser from "@/components/AppVipUser.vue";
    import AppSettingsAuto from '@/components/AppSettingsAuto.vue';
    import { editGroup, editVideo } from "@/services/groups";
    import { refreshToken } from "@/services/auth";

export default {
    components: { AppGroupOrUser, AppGoodButton, AppModalSubscribe, AppSettingsAuto, AppModal, AppVipUser },
    props: { 
        businessUser: Object,
        windowWidth: Number
    },
    data() {
        return {
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
            beforeLinks: null,
            isSaveModal: false,
            title: "",
            msg: "",
            notTelegram: false,
            emailLink: "",
            emailData: "",
            userData: [],
            disabled: false,
        };
    },
    computed: {
        filteredCountries() {
            return this.countries.filter((country) =>
                country.toLowerCase().startsWith(this.searchQuery.toLowerCase())
            );
        },
        first60Chars() {
            // Первые 60 символов
            return this.sentence.slice(0, 90);
        },
        newUserData() {
            if (this.userData?.packages) {
                return {
                    "avatar": this.userData?.avatar_url,
                    "name": this.userData?.name,
                    "package_name": this.userData?.packages.at(-1)?.package_name,
                    "vip_offer_text": this.sentence,
                    "group_link": this.siteLink,
                    "group": this.userData?.group,
                    "packages": this.userData?.packages,
                    "vk_id": this.userData?.vk_id,
                    "social_links": this.userData?.social_links
                }
            } else return {};
            
        },
        vkData() {
            return `https://vk.com/id${this.userData.vk_id}`;
        },
    },
    async created() {
        const response = await getUserInfo(localStorage.getItem("token"));
        if (!response) {
            const isAuthorized = await refreshToken(localStorage.getItem("token_refresh"));
            if (isAuthorized) {
                localStorage.setItem("token", isAuthorized.access_token);
                localStorage.setItem("token_refresh", isAuthorized.refresh_token);
            } else {
                localStorage.clear();
                this.$router.push('/');
                return;
            }
        }
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
        },
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
                this.telegramLink = this.telegramLink.replace("@", "");
                this.tgData = { "type": "Telegram", "link": `https://t.me/${this.telegramLink}`};
                this.userData.social_links.push(this.tgData);
            },
            addEmail() {
                this.emailData = this.emailLink;
            },
            addWhatsapp() {
                this.whtData = { "type": "Whatsapp", "link": `https://wa.me/${this.whatsappLink}` };
                this.userData.social_links.push(this.whtData);
            },
            async addVKGroup() {
                const response = await editGroup(this.vkGroupLink, this.userData.vk_id);
                this.isSaveModal = true;
                this.title = response.status ? "УСПЕШНО!" : "ОШИБКА!";
                this.msg = response.status ? "Группа была добавлена в ваш личный кабинет" : "При добавлении группы возникла ошибка!";
            },
            async addVKVideo() {
                const response = await editVideo(this.vkVideoLink, this.userData.vk_id, localStorage.getItem("token"));
                this.isSaveModal = true;
                this.title = response.status ? "УСПЕШНО!" : "ОШИБКА!";
                this.msg = response.status ? "Видео было добавлено в ваш личный кабинет" : "При добавлении видео возникла ошибка!";
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
                this.tgData = this.userData.social_links.filter(link => link.type === "Telegram").at(-1);
                this.whtData = this.userData.social_links.filter(link => link.type === "Whatsapp").at(-1);
                console.log(this.whtData);
                if (this.tgData?.link) {
                    this.telegramLink = this.tgData.link.replace("https://t.me/", "");
                }
                if (this.whtData?.link) {
                    this.whatsappLink = +this.whtData.link.replace("https://wa.me/", "");
                }
                if (this.userData.group?.group_link)
                    this.vkGroupLink = this.userData.group.group_link;
                if (this.userData?.video?.video_link)
                    this.vkVideoLink = this.userData?.video?.video_link;
                if (this.userData.email)
                    this.emailData = this.userData.email == '""' ? "" : this.userData.email;
                if (this.userData.country)
                    this.searchQuery = this.userData.country == '""' ? "" : this.userData.country;
                if (this.userData.city)
                    this.selectedCity = this.userData.city == '""' ? "" : this.userData.city;
                if (this.userData.sex_db)
                    this.searchQueryGender = this.userData.sex_db;
                if (this.userData.interests) 
                    this.selectedInterests = [...this.userData.interests];
                    this.sentence = this.userData?.vip_offer_text == '""' ? "" : this.userData?.vip_offer_text;
                    this.siteLink = this.userData?.vip_offer_link == '""' ? "" : this.userData?.vip_offer_link;
            },
            async saveSettings() {
                if (this.disabled) return;
                this.disabled = true;
                const payload = {
                    email: this.emailData != this.userData.email ? this.emailData : null,
                    country: this.searchQuery != this.userData.country ? this.searchQuery : null,
                    city: this.selectedCity != this.userData.city ? this.selectedCity : null,
                    sex: this.searchQueryGender != this.userData.sex_db ? this.searchQueryGender : null,
                    interests: this.selectedInterests != this.userData.interests ? this.selectedInterests : null,
                    social_links: this.userData.social_links != this.beforeLinks ? this.userData.social_links : null,
                    vip_offer_text: this.sentence,
                    vip_offer_link: this.siteLink,
                };

                const response = await sendNewSettings(payload, localStorage.getItem("token")); 
                console.log(response);
                this.isSaveModal = true;
                this.title = response == 200 ? "УСПЕШНО!" : "ОШИБКА!";
                this.msg = response == 200 ? "Настройки сохранены." : "При сохранении настроек возникла ошибка!";
                this.disabled = false;
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

    .textarea-container {
        position: relative;
        width: 100%;
    }

    .btn {
        width: 300px;
        @media (max-width: 900px) {
            width: 250px;
        }
        @media (max-width: 650px) {
            height: 51px;
            width: 210px;
            align-self: center;
        }
    }
    .card {
        width: 100%;
        background: #2F3251;
        border-radius: 10px;
        padding: 30px 50px;
        @media (max-width: 1500px) {
            width: 100%;
        }
        @media (max-width: 700px) {
            height: auto;
        }
        @media (max-width: 650px) {
            padding: 15px;
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
        @media (max-width: 650px) {
            padding: 20px 10px;
        }
    }
    .auto span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 14px;
        }
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
    .mobile_links_row {
        display: grid;
        grid-template-columns: 100px 1fr;
        column-gap: 20px;
    }
    .mobile_links_row span {
        word-break: break-all;
    }
    .row {
        display: flex;
        align-items: center;
        column-gap: 20px;
        flex-wrap: wrap;
        row-gap: 10px;
        @media (max-width: 650px) {
            row-gap: 20px;
        }
    }
    .row2 {
        display: flex;
        align-items: center;
        column-gap: 10px;
        width: fit-content;
    }
    .row2 span {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 14px;
        }
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
        display: flex;
        align-items: center;
        @media (max-width: 650px) {
            font-size: 14px !important;
            height: 41px;
            padding: 12px 28px;
        }
    }
    .row span:hover {
        background: rgba(255, 255, 255, 0.167);
    }

    h3 {
        font-size: 20px;
        color: white;
        font-family: 'OpenSans';
        font-weight: bold;
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    h1, h2, span, img {
        z-index: 5;
    }
    .dropdown {
        position: relative;
        width: 360px;
        display: flex;
        align-items: center;
        @media (max-width: 650px) {
            width: 100%;
            height: 50px;
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
        @media (max-width: 650px) {
            width: 100% !important;
            height: 50px;
        }
    }
    textarea {
        width: 360px;
        height: 190px;
        padding: 20px;
        box-sizing: border-box;
        font-size: 16px;
        background: none;
        border: 1px solid white;
        border-radius: 10px;
        font-family: 'OpenSans';
        position: relative;
        z-index: 888;
        color: rgba(255, 255, 255, 0.5);
        word-wrap: break-word;
        resize: none;
        @media (max-width: 650px) {
            width: 100%;
        }
    }
    .highlighted-text {
        position: absolute;
        top: 0;
        left: 0;
        width: 360px;
        height: 190px;
        padding: 20px;
        box-sizing: border-box;
        font-size: 16px;
        /* color: rgba(255, 255, 255, 0.5); */
        pointer-events: none; /* Чтобы клики проходили через div к textarea */
        z-index: 899;
        white-space: pre-wrap; /* Сохраняет пробелы и переводы строк */
        color: transparent; /* Скрываем текст, чтобы он не перекрывал textarea */
        word-wrap: break-word;
    }

    .bold {
        font-weight: bold;
        line-height: normal;
    }
    .normal {
        font-weight: normal;
        line-height: normal;
    }


    .arrow_down {
        position: absolute;
        right: 23px;
        transition: transform 0.3s ease;
        width: 13px;
        height: 13px;
    }

    .arrow_down.rotated {
        transform: rotate(180deg);
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        width: 100%;
        border: 1px solid white;
        border-radius: 0px 0px 10px 10px;
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
            font-size: 14px;
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
        @media (max-width: 650px) {
            font-size: 20px;
        }
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
        width: 30px !important;
        height: 30px;
        background: none;
        border: 1px solid white;
        border-radius: 3px;
        @media (max-width: 650px) {
            width: 20px !important;
            height: 20px;
        }
    }
</style>