<template>
    <AppModal 
        :title="title" 
        :message="msg" 
        :visibility1="isModal"
        @update:visibility1="isModal = $event"
        @close="reload"
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
        <span style="text-align: left;">Загрузите баннер 200х250 для бокового блока или 740х140 для нижнего блока. Вес файла не более 2 мб.</span>
        <span v-if="isError" class="error">Не подходящий размер изображения!</span>
        <AppGoodButton class="uploadImage" :text="text1" @click="triggerFileUpload" />
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
            <img :src="uploadedImage" class="image" alt="Предпросмотр" />
        </div>

        <div class="prices">
            <div class="price" v-for="(day, index) in days" :key="index"> 
                <div class="price_item">
                    <span>{{ day }}</span>
                    <strong v-if="index != 0"><span style="text-decoration: line-through; opacity: .5;">{{ fullPrices[index] }} / </span></strong>
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
        <table v-if="userAdds && windowWidth > 650">
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
                <tr v-for="(item, index) in paginatedUserAdds" :key="index">
                    <td>
                        <span>{{ index + 1 }}</span>
                    </td>
                    <td>
                        <img :src="item.add_img" class="image" >
                    </td>
                    <td>
                        <span v-if="item.status">активно</span>
                        <span v-if="!item.status">неактивно</span>
                    </td>
                    <td>
                        <span>{{ item.time_left + 1 }}</span>
                    </td>
                    <td>
                        <div class="edit">
                            <div class="row" @click="edit(item)">
                                <img src="@/assets/images/edit.png" style="cursor: pointer;">
                                <a>редактировать</a>
                            </div>
                            <div class="row" style="cursor: pointer;" @click="deleteAdd(item, index)">
                                <img src="@/assets/images/delete.png">
                                <a>удалить</a>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="mob_adds" v-if="windowWidth <= 650">
            <div class="mob_adds_item" v-for="(item, index) in paginatedUserAdds" :key="index">
                <span><strong>Номер: </strong>{{ index + 1 + (currentPage - 1) * pageSize }}</span>
                <span><strong>Объявление:</strong></span>
                <img :src="item.add_img" class="image" >
                <div class="mob_adds_item_row">
                    <span><strong>Статус: </strong>{{ item.status ? "активно" : "неактивно" }}</span>
                    <span><strong>Осталось дней: </strong>{{ item.time_left + 1 }}</span>
                </div>
                <div class="mob_adds_item_row2">
                    <span><strong>Управление: </strong></span>
                    <div class="mob_adds_item_col">
                        <div class="mob_adds_item_col_row" @click="edit(item)">
                            <img src="@/assets/images/edit.png" class="mob_icon" style="cursor: pointer;">
                            <a>редактировать</a>
                        </div>
                        <div class="mob_adds_item_col_row" @click="deleteAdd(item, index)">
                            <img src="@/assets/images/delete.png" class="mob_icon">
                            <a>удалить</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="switchs" v-if="totalPages > 1">
            <img src="@/assets/images/arrow.svg" @click="prevPage" style="transform: rotate(180deg);" v-if="currentPage > 1" />

            <span v-for="page in visiblePages" :key="page" @click="goToPage(page)" 
                :class="{ active: page === currentPage }">
                {{ page }}
            </span>

            <span v-if="currentPage + 2 < totalPages">...</span>

            <img src="@/assets/images/arrow.svg" @click="nextPage" v-if="currentPage < totalPages" />
        </div>
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import { sendOtherAdd, getUserAdds, deleteAdd, editOtherAdd } from "@/services/add";
    import { getConfig } from "@/services/config";
    import AppModal from '@/components/AppModal.vue';

    export default {
        components: { AppGoodButton, AppModal },
        props: { 
            userData: Object,
            windowWidth: Number
        },
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
                selectedCounts: [0, 0, 0, 0, 0, 0],
                daysSummary: 0,
                priceSummary: 0,
                userAdds: [],
                img: "",
                position: "",
                isModal: false,
                title: "",
                msg: "",
                pricesData: null,
                old_pay: 0,
                isEdit: false,
                ad_id: null,
                timestamp: null,
                daysBefore: 0,
                posBefore: "",
                disabled: false,
                currentPage: 1, 
                pageSize: 5,
            }
        },
        computed: {
            filteredCountries() {
                return this.countries.filter((country) =>
                    country.toLowerCase().startsWith(this.searchQuery.toLowerCase())
                );
            },
            prices() {
                let values = [];
                for (let value of Object.values(this.pricesData.current)) {
                    values.push(value.toLocaleString("ru-RU"));
                }
                return values;
            },
            fullPrices() {
                let values = [];
                for (let value of Object.values(this.pricesData.full)) {
                    values.push(value.toLocaleString("ru-RU"));
                }
                return values;
            },
            totalPages() {
                // Вычисляем общее количество страниц
                return Math.ceil(this.userAdds.length / this.pageSize);
            },
            visiblePages() {
                // Определяем видимые страницы (текущая ±2)
                const pages = [];
                for (
                    let i = Math.max(1, this.currentPage - 2);
                    i <= Math.min(this.totalPages, this.currentPage + 2);
                    i++
                ) {
                    pages.push(i);
                }
                return pages;
            },
            paginatedUserAdds() {
                // Возвращаем объявления только для текущей страницы
                const start = (this.currentPage - 1) * this.pageSize;
                const end = start + this.pageSize;
                return this.userAdds.slice(start, end);
            },
        },
        async created() {
            this.pricesData = await getConfig("add_price", localStorage.getItem("token"));
            console.log(this.pricesData);

            const adds = await getUserAdds(this.userData.id);
            this.userAdds = adds.ads;
            this.userAdds = this.userAdds.reverse();
            console.log("РЕКЛАМЫ ПОЛЬЗОВАТЕЛЯ: ", this.userAdds);
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
            prevPage() {
                if (this.currentPage > 1) {
                    this.currentPage--;
                }
            },
            nextPage() {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                }
            },
            goToPage(page) {
                if (page >= 1 && page <= this.totalPages) {
                    this.currentPage = page;
                }
            },
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
                if (this.disabled) return;
                if (this.userData.balance >= this.priceSummary && (this.priceSummary > 0 || this.isEdit) && (this.img != "" || this.uploadedImage != "")) {
                    this.disabled = true;
                    const formData = new FormData();

                    if (this.img != "") formData.append("ads_img", this.img.get("file"))
                    else {
                        console.log(this.uploadedImage);
                        const response = await fetch(this.uploadedImage);
                        const blob = await response.blob();

                        // 2. Создаём объект File
                        const file = new File([blob], "image.jpg", { type: blob.type });

                        // 3. Формируем данные для отправки 
                        formData.append("ads_img", file);
                        console.log(file);
                    }

                    if (this.img != "") console.log("ФОРМАТ ОТПРАВКИ ФАЙЛА: ", this.img.get("file"));
                    
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
                    formData.append("user_id", this.userData.id);
                    formData.append("ads_text", "text");
                    formData.append("ads_url", this.link);
                    if (this.position != "") formData.append("position", this.position)
                    else formData.append("position", this.posBefore);
                    
                    formData.append("auditorium", JSON.stringify({
                        city: this.selectedCities,
                        country: this.selectedCountries,
                        sex: this.selectedSexes,
                        interests: this.selectedInterests,
                        tarif: this.selectedPackages
                    }));

                    console.log(formData);

                    console.log(this.timestamp * 1000, this.daysSummary * 24*60*60*1000, this.timestamp * 1000 + this.daysSummary * 24*60*60*1000);
                    const payment = this.isEdit ? await editOtherAdd(formData, this.ad_id, this.timestamp * 1000 + this.daysSummary * 24*60*60*1000) : await sendOtherAdd(formData);
                    this.isModal = true;
                    this.title = payment.status ? "УСПЕШНО!" : "ОШИБКА!";
                    this.msg = payment.status ? "Покупка завершена. Ваша реклама добавлена." : "Не удалось оплатить покупку рекламного банера.";
                    this.isEdit = false;
                    this.disabled = false;
                } else {
                    this.isModal = true;
                    this.title = "ОШИБКА!"
                    if (this.userData.balance < this.priceSummary) this.msg = "Недостаточно средств на балансе.";
                    if (this.priceSummary == 0) this.msg = "Не выбрали срок для рекламы.";
                    if (this.img == "") this.msg = "Не выбрали баннер для рекламы.";
                }
            },
            reload() {
                if (this.title != "ОШИБКА!") window.location.reload();
            },
            async deleteAdd(item, index) {
                const resp = await deleteAdd(item.ad_id);
                if (resp.status) {
                    this.userAdds.splice(index, 1);
                }
            },
            edit(add) {
                this.isEdit = true;
                const data = add.data;

                this.selectedCities = data.auditorium.city;
                this.selectedCountries = data.auditorium.country;
                this.selectedSexes = data.auditorium.sex;
                this.selectedInterests = data.auditorium.interests;
                this.selectedPackages = data.auditorium.tarif;
                this.link = data.ads_url;
                this.uploadedImage = data.ads_img;
                this.ad_id = add.ad_id;
                this.timestamp = data.date_view_end;
                this.posBefore = data.position;

                const curr_date = new Date();
                console.log(this.timestamp);
                if (add.time_left == -1) {
                    console.log("ВРЕМЯ РЕКЛАМЫ ПРОШЛО");
                    this.timestamp = Math.floor(curr_date.getTime() / 1000);
                }

                this.isImageUploaded = true;
                console.log(data.ads_img);
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
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    span {
        font-size: 18px;
        font-family: 'OpenSans';
        color: white;
        @media (max-width: 650px) {
            font-size: 14px !important;
        }
    }
    .container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 50px;
        row-gap: 30px;
        @media (max-width: 650px) {
            grid-template-columns: 1fr;
        }
    }
    .item {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    .dropdown {
        position: relative;
        width: 360px;
        @media (max-width: 650px) {
            width: 100%;
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
            width: 100%;
        }
    }
    .arrow_down {
        position: absolute;
        top: 23px;
        right: 23px;
        width: 15px;
        height: 15px;
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
        @media (max-width: 650px) {
            font-size: 14px;
        }
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
        cursor: pointer;
        @media (max-width: 650px) {
            flex-direction: column;
            row-gap: 10px;
        }
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
        @media (max-width: 650px) {
            padding: 10px 15px;
        }
    }
    .price:nth-child(2n+1) {
        background: #111433;
    }
    .price_item {
        display: flex;
        align-items: center;
        column-gap: 9px;
    }
    .price_item span {
        font-size: 24px;
        color: white;
        font-family: 'OpenSans';
        padding: 0;
        @media (max-width: 650px) {
            font-size: 14px;
        }
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
        @media (max-width: 650px) {
            flex-direction: column;
            align-items: start;
        }
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
    .summary_text_row span {
        @media (max-width: 650px) {
            padding: 0;
        }
    }
    .btn {
        width: 189px;
        @media (max-width: 650px) {
            margin-top: 20px;
            width: 180px;
            height: 40px;
            align-self: center;
        }
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
    .image {
        max-width: 200px;
        max-height: 250px;
    }
    .uploadImage {
        @media (max-width: 650px) {
            width: 180px;
            height: 40px;
            align-self: center;
        }
    }
    .mob_adds {
        display: flex;
        flex-direction: column;
    }
    .mob_adds_item {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 15px 10px;
        row-gap: 10px;
    }
    .mob_adds_item:nth-child(2n+1) {
        background: #111433;
    }
    .mob_adds_item span, .mob_adds_item a{
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
        padding: 0 !important;
        text-align: start !important;
        align-self: self-start !important;
    }
    .mob_adds_item_row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .mob_adds_item_row2 {
        display: flex;
        column-gap: 30px;
    }
    .mob_adds_item_col {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    .mob_adds_item_col_row {
        display: flex;
        align-items: center;
        column-gap: 5px;
        cursor: pointer;
    }
    .mob_icon {
        width: 15px;
        height: 15px;
    }
    .switchs {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        gap: 10px;
    }
    .switchs img {
        cursor: pointer;
        width: 15px;
        filter: invert(100%);
    }
    .switchs span {
        cursor: pointer;
        font-size: 16px;
        padding: 5px 10px;
        border-radius: 5px;
        color: white;
    }
    .switchs span.active {
        background-color: #111433;
        color: white;
    }
</style>