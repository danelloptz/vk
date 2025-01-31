<template>
    <section class="settings">
        <h2>Настройки</h2>
        <h3>Контактные данные</h3>
        <div class="links">
            <span v-if="userData?.links?.vk">Вконтакте: {{ userData.links.vk }}</span>
            <span v-if="userData?.links?.telegram">Telegram: {{ userData.links.telegram }}</span>
            <span v-if="userData?.links?.whatsapp">WhatsApp: {{ userData.links.whatsapp }}</span>
        </div>
        
        <div class="row" v-if="!userData?.links?.telegram">
            <input 
                v-model="telegramLink" 
                placeholder="Telegram">
            <span>ДОБАВИТЬ</span>
        </div>
        <div class="row" v-if="!userData?.links?.whatsapp">
            <input 
                v-model="whatsappLink" 
                placeholder="WhatsApp">
            <span>ДОБАВИТЬ</span>
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
                :key="country.name"
                @mousedown.prevent="selectCountry(country.name)"
            >
                {{ country.name }}
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
    </section>
</template>

<script>
import { getUserInfoLocal } from "@/services/user";

export default {
    data() {
        return {
            userData: null,
            telegramLink: "",
            whatsappLink: "",
            text: "ШАГ 2",
            text2: "ОТМЕНИТЬ",
            isCheckboxChecked : false,
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
            isNotCheckboxChecked: false
        };
    },
    computed: {
        filteredCountries() {
            return this.countries.filter((country) =>
                country.name.toLowerCase().startsWith(this.searchQuery.toLowerCase())
            );
        },
    },
    async created() {
        const response = await getUserInfoLocal();
        this.userData = response;

        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            const data = await response.json();
            this.countries = data.map(country => ({
                name: country.name.common
            }));
        } catch (error) {
            console.error('Ошибка при загрузке данных о странах:', error);
        }
    },
    watch: {
        userData: {
            immediate: true,
            handler(newData) {
                if (newData?.links) {
                    this.telegramLink = newData.links.telegram || "";
                    this.whatsappLink = newData.links.whatsapp || "";
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
                this.isNotSelectCountry = !this.countries.some(country => country.name === this.selectedCountry);
                this.isNotSelectGender = !(this.selectedGender != "");
                this.isNotSelectInterest = !(this.selectedInterests.length > 0);
                this.isNotCheckboxChecked = !this.isCheckboxChecked;
                if (!(this.isNotSelectCountry || this.isNotSelectGender || this.isNotSelectInterest || this.isNotCheckboxChecked)) {
                    this.$router.push('/signup_2');
                }
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
        column-gap: 20px;
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
    .inputs {
        position: relative;
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        width: 360px;
        @media (max-width: 500px) {
            width: 100%;
            align-items: center;
        }
    }
    .dropdown {
        position: relative;
        width: 360px;
        @media (max-width: 500px) {
            width:70vw;
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

    .modal {
        width: 1160px;
        border-radius: 10px;
        position: relative; /* Обеспечиваем позиционирование для псевдоэлемента */
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 50px;
        z-index: 2;
        overflow-y: auto;
        scrollbar-width: none;
        row-gap: 50px;
        box-sizing: border-box;
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
        row-gap: 30px;
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

    .modal_cotainer {
        display: flex;
        width: 100%;
        align-items: start;
        column-gap: 130px;
        @media (max-width: 1100px) {
            flex-direction: column;
            align-items: center;
            row-gap: 30px;
        }
        
    }
    .user_info {
        display: flex;
        column-gap: 30px;
        align-items: center;
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

    .agreement {
        display: flex;
        align-items: start;
        column-gap: 12px;
    }
    .agreement input {
        width: 40px;
        height: 40px;
        background: none;
        border: 1px solid white;
        border-radius: 3px;
    }
    .agreement span {
        font-size: 16px;
        line-height: 1.2;
    }

    a {
        text-decoration: underline;
        cursor: pointer;
    }

    .footer {
        margin-top: 20px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 40px;
        @media (max-width: 1100px) {
            grid-template-columns: 1fr;
            align-items: center;
            row-gap: 20px;
        }
    }
    .footer_text {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
        @media (max-width: 1300px) {
            row-gap: 10px;
        }
        @media (max-width: 1100px) {
            row-gap: 0px;
            text-align: center;
        }
    }
    .footer_text h1 {
        font-family: 'Tektur';
        font-size: 36px;
        font-weight: normal;
        @media (max-width: 1300px) {
            font-size: 30px;
        }
        @media (max-width: 1100px) {
            font-size: 36px;
        }
    }
    .footer_text span {
        font-family: 'OpenSans';
        color: white;
        font-size: 18px;
        @media (max-width: 1300px) {
            font-size: 16px;
        }
        @media (max-width: 1100px) {
            font-size: 16px;
        }
        @media (max-width: 830px) {
            font-size: 15px;
            text-align: center;
        }
    }

    .error_message {
        font-size: 14px;
        font-family: 'OpenSans';
        color: red;
    }
</style>