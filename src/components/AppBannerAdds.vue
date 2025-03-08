<template>
    <AppModal 
        :title="title" 
        :message="msg" 
        :visibility1="isModal"
        @update:visibility1="isModal = $event"
    />
    <section class="adds">
        <h1 class="normal">Баннерная реклама с геотаргетингом по интересам</h1>
        <span class="normal">Тысячи пользователей с бизнес интересами ежедневно и многократно посещают кабинет Intelektaz. У нас точно есть ваши клиенты.  Покажите им свое предложение.</span>
        <span class="normal">Вы можете выбрать свою целевую аудиторию, которой ваша реклама будет показываться в приоритете. Этим действием вы не заузите общее количество показов, если в моменте вашей аудитории нет, то баннер все равно будет показан по близким к вашей аудитории параметрам.</span>
        <div class="container">
            <div class="item">
                <h2>Выбрать страну:</h2>
                <div v-if="selectedCountries.length > 0" class="selected-countries">
                    <span v-for="(country, index) in selectedCountries" :key="index" class="selected-interest">
                    {{ country }}
                    <img src="@/assets/images/close.png" @click="removeCountry(index)" class="remove-btn">
                    </span>
                </div>
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
                <span v-if="isNotSelectCountry" class="error_message">Не выбрана страна!</span>
            </div>
            <div class="item">
                <h2>Выбрать город: </h2>
                <div v-if="selectedCities.length > 0" class="selected-countries">
                    <span v-for="(city, index) in selectedCities" :key="index" class="selected-interest">
                    {{ city }}
                    <img src="@/assets/images/close.png" @click="removeCity(index)" class="remove-btn">
                    </span>
                </div>
                <input 
                    placeholder="Город" 
                    v-model="queryCity"
                    @keyup.enter="selectCity(queryCity)"
                />
            </div>
            <div class="item">
                <h2>Выбрать интересы: </h2>
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
                        ref="interestInput"
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
            </div>
            <div class="item">
                <h2>Выбрать пол: </h2>
                <div v-if="selectedSexes.length > 0" class="selected-countries">
                    <span v-for="(sex, index) in selectedSexes" :key="index" class="selected-interest">
                    {{ sex }}
                    <img src="@/assets/images/close.png" @click="removeSex(index)" class="remove-btn">
                    </span>
                </div>
                <div class="dropdown">
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
            </div>
            <div class="item">
                <h2>Тарифы</h2>
                <div v-if="selectedPackages.length > 0" class="selected-countries">
                    <span v-for="(pack, index) in selectedPackages" :key="index" class="selected-interest">
                    {{ pack }}
                    <img src="@/assets/images/close.png" @click="removePackage(index)" class="remove-btn">
                    </span>
                </div>
                <div class="dropdown">
                    <input
                        type="text"
                        v-model="searchQueryPackage"
                        placeholder="Тарифы"
                        @focus="isDropdownVisiblePackage = true"
                        @blur="hideDropdown"
                        ref="packageInput"
                    />
                    <img :class="{'rotated': isDropdownVisiblePackage}" src="@/assets/images/arrow_down.png" class="arrow_down">
                    <ul v-if="isDropdownVisiblePackage" class="dropdown-menu">
                        <li
                        v-for="pack in packages"
                        :key="pack"
                        @mousedown.prevent="selectPackage(pack)"
                        >
                        {{ pack }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <span>Загрузите баннер 200х250 для бокового блока или 740х140 для нижнего блока. Вес файла не более 2 мб.</span>
        <span v-if="isError" class="error">Не подходящий размер изображения!</span>
        <AppGoodButton :text="text1" @click="triggerFileUpload" />
        <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileUpload" 
            accept="image/*"
            style="display: none;"
        />

        <div class="row">
            <h2>Ссылка: </h2>
            <input type="text" v-model="link" placeholder="Ссылка">
        </div>
        <div class="uploadedImage" v-if="isImageUploaded">
            <img :src="uploadedImage" alt="Предпросмотр" />
        </div>

        <div class="prices">
            <div class="price" v-for="(day, index) in days" :key="index"> 
                <div class="price_item">
                    <span>{{ day }}</span>
                    <strong><span>{{ prices[index] }} USDT</span></strong>
                </div>
                <div class="price_item">
                    <img src="@/assets/images/minus.png" @click="decreaseCount(index)" class="counter-btn">
                    <span>{{ selectedCounts[index] }}</span>
                    <img src="@/assets/images/green_plus.png" @click="increaseCount(index)" class="counter-btn">
                </div>
            </div>
        </div>

        <div class="line"></div>

        <div class="summary">
            <div class="summary_text">
                <div class="summary_text_row">
                    <span>Рекламных дней - </span>
                    <strong><span>{{ daysSummary }}</span></strong>
                </div>
                <div class="summary_text_row">
                    <span>Сумма к оплате - </span>
                    <strong><span>{{ priceSummary }} USDT</span></strong>
                </div>
            </div>
            <AppGoodButton :text="text2" class="btn" @click="makePayment"/>
        </div>

        <h1 style="margin-top: 50px;">Мои объявления</h1>
        <table v-if="userAdds">
            <thead>
                <tr class="head">
                    <th>Номер</th>
                    <th>Объявление</th>
                    <th>Статус</th>
                    <th>Осталось дней</th>
                    <th>Управление</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in userAdds" :key="index">
                    <td>
                        <span>{{ index + 1 }}</span>
                    </td>
                    <td>
                        <img :src="item.add_img" >
                    </td>
                    <td>
                        <span v-if="item.status">активно</span>
                        <span v-if="!item.status">неактивно</span>
                    </td>
                    <td>
                        <span>{{ item.time_left }}</span>
                    </td>
                    <td>
                        <div class="edit">
                            <div class="row">
                                <img src="@/assets/images/edit.png">
                                <a>редактировать</a>
                            </div>
                            <div class="row">
                                <img src="@/assets/images/delete.png">
                                <a>удалить</a>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import { getUserInfo } from "@/services/user";
    import { sendOtherAdd, getUserAdds } from "@/services/add";
    import { refreshToken } from "@/services/auth";
    import AppModal from '@/components/AppModal.vue';

    export default {
        components: { AppGoodButton, AppModal },
        data() {
            return {
                countries: [],
                searchQuery: "",
                queryCity: "",
                searchQueryGender: "",
                link: "",
                interests: ["Интернет бизнес", "МЛМ", "Инвестиции", "Недвижимость", "Здоровье и красота", "Трейдинг", "Криптовалюта", "Технологии", "Туризм и путешествия", "Мотивация", "Авто", "Одежда", "Еда и кулинария", "Развлечения и досуг", "Другое"],
                searchQueryInterest: "",
                searchQueryPackage: "",
                selectedCities: [],
                genders: ["Мужской", "Женский"],
                packages: ["Start", "Standart", "VIP", "Business", "Leader"],
                selectedInterests: [],
                selectedCountries: [],
                selectedPackages: [],
                selectedSexes: [],
                selectedGender: "",
                isDropdownVisibleCountry: false,
                isDropdownVisibleGender: false,
                isDropdownVisibleInterest: false,
                isDropdownVisiblePackage: false,
                isNotSelectCountry: false,
                text1: "ПРИКРЕПИТЬ",
                text2:  "ОПЛАТИТЬ",
                isError: false,
                uploadedImage: "",
                isImageUploaded: false,
                days: ["1 день - ", "7 дней - ", "30 дней - ", "90 дней - ", "180 дней - ", "365 дней - "],
                daysNum: [1, 7, 30, 90, 180, 365],
                prices: [10, 50, 150, 400, 700, 990],
                selectedCounts: [0, 0, 0, 0, 0, 0],
                daysSummary: 0,
                priceSummary: 0,
                userData: [],
                userAdds: [],
                img: "",
                position: "",
                isModal: false,
                title: "",
                msg: ""
            }
        },
        computed: {
            filteredCountries() {
                return this.countries.filter((country) =>
                    country.toLowerCase().startsWith(this.searchQuery.toLowerCase())
                );
            },
        },
        async created() {
            const user_data = await getUserInfo(localStorage.getItem("token"));
            if (!user_data) {
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
            this.userData = user_data;

            const adds = await getUserAdds(this.userData.vk_id);
            this.userAdds = adds.ads;
            console.log(this.userAdds);
            try {
                const response = await fetch('https://namaztimes.kz/ru/api/country');
                const data = await response.json();
                
                for (const value of Object.values(data)) {
                    this.countries.push(value);
                }

            } catch (error) {
                console.error('Ошибка при загрузке данных о странах:', error);
            }
        },
        methods: {
            selectCountry(country) {
                if (country.trim() !== "" && !this.selectedCountries.includes(country)) {
                    this.selectedCountries.push(country);
                }
                this.searchQuery = country;
                this.isDropdownVisibleCountry = false;
            },
            hideDropdown() {
                this.isDropdownVisibleCountry = false;
                this.isDropdownVisibleGender = false;
                this.isDropdownVisiblePackage = false;
                this.isDropdownVisibleInterest = false;
            },
            selectCity(city) {
                if (city.trim() !== "" && !this.selectedCities.includes(city)) {
                    this.selectedCities.push(city);
                }
                this.queryCity = '';
            },
            selectPackage(pack) {
                if (pack.trim() !== "" && !this.selectedPackages.includes(pack)) {
                    this.selectedPackages.push(pack);
                }
                this.searchQueryPackage = '';
                this.$refs.packageInput.blur();
            },
            selectInterest(interest) {
                if (!this.selectedInterests.includes(interest)) {
                    this.selectedInterests.push(interest);
                }
                this.searchQueryInterest = '';
                this.$refs.interestInput.blur();
            },
            removeCity(index) {
                this.selectedCities.splice(index, 1);
            },
            removeInterest(index) {
                this.selectedInterests.splice(index, 1);
            },
            removePackage(index) {
                this.selectedPackages.splice(index, 1);
            },
            removeCountry(index) {
                this.selectedCountries.splice(index, 1);
            },
            selectGender(gender) {
                if (gender.trim() !== "" && !this.selectedSexes.includes(gender)) {
                    this.selectedSexes.push(gender);
                }
                // this.selectedGender = gender;
                this.searchQueryGender = '';
                this.isDropdownVisibleGender = false;
                this.$refs.genderInput.blur();
            },
            triggerFileUpload() {
                this.$refs.fileInput.click();
            },
            handleFileUpload(event) {
                const file = event.target.files[0];
                if (!file) return;

                const img = new Image();
                img.src = URL.createObjectURL(file);
                img.onload = () => {
                    const { width, height } = img;
                    if (width === 200 && height === 250) {
                        this.uploadedImage = img.src;
                        this.isImageUploaded = true;
                        this.position = "left";
                        const formData = new FormData();
                        formData.append("file", file);
                        this.img = formData;
                    }
                    if (width === 740 && height === 140) {
                        this.uploadedImage = img.src;
                        this.isImageUploaded = true;
                        this.position = "bottom";
                        const formData = new FormData();
                        formData.append("file", file);
                        this.img = formData;
                    }

                    if (this.position == "") {
                        this.isError = true;
                        return;
                    }
                };
            },
            increaseCount(index) {
                this.selectedCounts[index]++;
                this.countSummary();
            },
            decreaseCount(index) {
                if (this.selectedCounts[index] > 0) {
                    this.selectedCounts[index]--;
                    this.countSummary();
                }
            },
            countSummary() {
                this.priceSummary = this.prices.reduce((sum, price, index) => sum + (price * this.selectedCounts[index]), 0);
                this.daysSummary = this.selectedCounts.reduce((sum, num, index) => sum + (num * this.daysNum[index]), 0);
            },
            async makePayment() {
                if (this.userData.balance >= this.priceSummary) {
                    const formData = new FormData();

                    formData.append("ads_img", this.img.get("file"));
                    
                    const days_count = {
                        "days_1": this.selectedCounts[0],
                        "days_7": this.selectedCounts[1],
                        "days_30": this.selectedCounts[2],
                        "days_90": this.selectedCounts[3],
                        "days_180": this.selectedCounts[4],
                        "days_365": this.selectedCounts[5],
                    };

                    console.log(days_count);
                    
                    formData.append("days_count", JSON.stringify(days_count));
                    formData.append("vk_id", this.userData.vk_id);
                    formData.append("ads_text", "text");
                    formData.append("ads_url", this.link);
                    formData.append("position", this.position);
                    
                    formData.append("auditorium", JSON.stringify({
                        city: this.selectedCities,
                        country: this.selectedCountries,
                        sex: this.selectedSexes,
                        interests: this.selectedInterests,
                        tarif: this.selectedPackages
                    }));

                    const payment = await sendOtherAdd(formData);
                    this.isModal = true;
                    this.title = payment.status ? "УСПЕШНО!" : "ОШИБКА!";
                    this.msg = payment.status ? "Покупка завершена. Ваша реклама добавлена." : "Не удалось оплатить покупку рекламного банера.";
                } else {
                    this.isModal = true;
                    this.title = "ОШИБКА!"
                    this.msg = "Недостаточно средств на балансе";
                }
            }
        }
    };
</script>

<style scoped>
    .adds {
        display: flex;
        flex-direction: column;
        row-gap: 26px;
    }
    h1 {
        font-size: 24px;
        color: white;
        font-family: 'OpenSans';
    }
    span {
        font-size: 18px;
        font-family: 'OpenSans';
        color: white;
    }
    .container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 50px;
        row-gap: 30px;
    }
    .item {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
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
        @media (max-width: 1300px) {
            width: 100%ж
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
    .dropdown::-webkit-scrollbar {
        width: 0;  
        height: 0;
    }

    .dropdown::-webkit-scrollbar-thumb {
        background: transparent;
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
    h2 {
        font-size: 18px;
        color: white;
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
    .error {
        color: red;
    }
    .row {
        display: flex;
        align-items: center;
        column-gap: 26px;
        width: 100%;
    }
    .row input {
        width: 100%;
    }
    .uploadedImage {
        padding: 10px;
        background: #1B1E3D;
        border-radius: 10px;
    }
    .uploadedImage {
        width: 100%;
        object-fit: cover;
        object-position: center;
    }
    .prices {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    .price {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
    }
    .price:nth-child(2n+1) {
        background: #111433;
    }
    .price_item {
        display: flex;
        column-gap: 10px;
        align-items: center;
    }
    .price_item span {
        font-size: 24px;
        color: white;
        font-family: 'OpenSans';
    }
    .price_item img {
        cursor: pointer;
    }

    .line {
        width: 100%;
        height: 1px;
        background: rgba(255, 255, 255, 0.5);
    }

    .summary {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .summary_text {
        display: flex;
        flex-direction: column;
        row-gap: 13px;
    }
    .summary_text_row {
        display: flex;
        align-items: center;
        column-gap: 5px;
    }
    .btn {
        width: 189px;
    }
    th {
        line-height: 3;
    }
    td {
        padding: 0px 10px;
    }
    span, td, th {
        color: white;
        font-family: 'OpenSans';
        font-size: 20px;
        text-align: center;
        align-self: center;
        z-index: 9;
        padding: 10px;
        position: relative;
    }
    tr:nth-child(2n+1) {
        background: #111433;
    }
    .head {
        background: none !important;
    }
    .edit {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .edit .row {
        column-gap: 10px;
    }
    .edit img {
        width: 20px;
        height: 20px;
    }
    .normal {
        text-align: start !important;
        padding: 0 !important;
    }
</style>