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
    <AppModalAds 
        :visibility1="isModalAds"
        @update:visibility1="isModalAds = $event"
        @turn_on="turnAdsOn"
        @open_rotation="openRotation"
    />

    <section class="settings" v-if="!isAuto">
        <h2>Настройки</h2>
        <h3>Контактные данные</h3>
        <div class="links">
            <span v-if="windowWidth > 650">Вконтакте:</span>
            <span v-if="windowWidth > 650">
                https://vk.com/id{{ userData.vk_id }} 
                <img v-if="userData?.vk_id" src="@/assets/images/ok_green2.png" class="ok_green"/>
                <AppGoodButton v-else class="active_tg_btn" :text="'АКТИВИРОВАТЬ'" :disabled="isDisabled" @click="tap"/>
            </span>

            <!-- <span v-if="windowWidth > 650">
                Вконтакте: https://vk.com/id{{ userData.vk_id }} 
                <img v-if="userData?.vk_id" src="@/assets/images/ok_green2.png" class="ok_green"/>
                <AppGoodButton v-else class="active_tg_btn" :text="'АКТИВИРОВАТЬ'" :disabled="isDisabled" @click="tap"/>
            </span> -->

            <span v-if="windowWidth > 650 && testers.includes(userData?.id)">Telegram:</span>
            <span v-if="windowWidth > 650 && testers.includes(userData?.id)">
                Telegram:
                {{ userData?.tg_id && userData.tag ? `https://t.me/${userData.tag}` : userData?.tg_id && !userData.tag ? `tg://user?id=${userData?.tg_id}` : 'https://t.me/ ' }}
                <AppGoodButton v-if="!userData?.tg_id" :text="'АКТИВИРОВАТЬ'" class="active_tg_btn" @click="activateTg"/>
                <img v-else src="@/assets/images/ok_green2.png" class="ok_green" />
            </span>

            <!-- <span v-if="windowWidth > 650 && testers.includes(userData?.id)">
                <span>Telegram: {{ userData?.tg_id && userData.tag ? `https://t.me/${userData.tag}` : userData?.tg_id && !userData.tag ? `tg://user?id=${userData?.tg_id}` : 'https://t.me/ ' }} </span>
                <AppGoodButton v-if="!userData?.tg_id" :text="'АКТИВИРОВАТЬ'" class="active_tg_btn" @click="activateTg"/>
                <img v-else src="@/assets/images/ok_green2.png" class="ok_green" />
            </span> -->
            
            <span  v-if="whtData?.link && windowWidth > 650">WhatsApp:</span>
            <span  v-if="whtData?.link && windowWidth > 650">{{ whtData.link }}</span>

            <!-- <span v-if="whtData?.link && windowWidth > 650">WhatsApp: {{ whtData.link }}</span> -->

            <span v-if="windowWidth > 650 && emailData">Почта:</span>
            <span v-if="windowWidth > 650 && emailData">{{ emailData }}</span>

            <!-- <span v-if="windowWidth > 650 && emailData">Почта: {{ emailData }}</span> -->
            <div class="mobile_links_row" v-if="windowWidth <= 650">
                <span>Вконтакте: </span>
                <span>https://vk.com/id{{ userData.vk_id }}</span>
            </div>
            <div class="mobile_links_row" v-if="windowWidth <= 650 && testers.includes(userData?.id)">
                <span>Telegram: </span>
                <span>{{ userData?.tg_id && userData.tag ? `https://t.me/${userData.tag}` : userData?.tg_id && !userData.tag ? `tg://user?id=${userData?.tg_id}` : 'https://t.me/ ' }} </span>
                <AppGoodButton v-if="!userData?.tg_id" :text="'АКТИВИРОВАТЬ'" class="active_tg_btn" @click="activateTg"/>
                <img v-else src="@/assets/images/ok_green2.png" class="ok_green" />
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
            <span class="row_text" @click="addEmail">ДОБАВИТЬ</span>
        </div>
        <!-- <div class="row">
            <input 
                v-model="telegramLink" 
                placeholder="Telegram (введите имя пользователя)">
            <span @click="addTelegram">ДОБАВИТЬ</span>
        </div> -->
        <div class="row">
            <input 
                v-model="whatsappLink" 
                type="number"
                placeholder="WhatsApp (введите номер телефона)">
            <span class="row_text" @click="addWhatsapp">ДОБАВИТЬ</span>
            <!-- <span class="error_message" v-if="notTelegram">Введите номер телефона</span> -->
        </div>

        <h3>Пассивный доход из реферальной программы на автопилоте</h3>
        <span>Включите автопродвижение и получайте рефералов автоматически — система сама рассказывает о Intelektaz и приводит новых партнёров по вашей ссылке.</span>
        <AppGoodButton 
            :text="'АВТОПРОДВИЖЕНИЕ'"
            class="auto_btn"
            @click="nextStep"
        />

        <h3 class="region_title">Региональные данные</h3>
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
        
        <div class="dropdown gender_dropdown">
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

        <h3 class="tg_channel_title">Telegram канал для продвижения:</h3>
        <div class="row">
            <input  
                v-if="tg_group"
                v-model="tg_group" 
                placeholder="Telegram канал" >
            <span class="row_text" @click="addTelegramChannel">ДОБАВИТЬ</span>
            <h3 v-if="userData">Подписки: {{ tgGroupStats?.active || 0}}</h3>
        </div>
        <div class="row2">
            <div class="checkbox-wrapper-18">
                <div class="round">
                    <input type="checkbox" :id="`checkbox-111`" v-model="isCheckboxChecked"  @click="handleCheckboxChange" />
                    <label :for="`checkbox-111`"></label>
                </div>
            </div>
            <!-- <input type="checkbox" class="checkbox" v-model="isCheckboxChecked" @change="handleCheckboxChange"> -->
            <span>Подписки</span>
        </div>

        <h3 class="tg_theme_channel_title">Тема канала: </h3>
        <div v-if="selectedThemes.length > 0" class="selected-countries">
            <span v-for="(interest, index) in selectedThemes" :key="index" class="selected-interest">
            {{ interest }}
            <img src="@/assets/images/close.png" @click="removeTheme(index)" class="remove-btn">
            </span>
        </div>
        <div class="dropdown">
            <input
                type="text"
                v-model="searchQueryTheme"
                placeholder="Тема канала"
                @focus="isDropdownVisibleTheme = true"
                @blur="hideDropdown"
                ref="selectTheme"
            />
            <img :class="{'rotated': isDropdownVisibleTheme}" src="@/assets/images/arrow_down.png" class="arrow_down">
            <ul v-if="isDropdownVisibleTheme" class="dropdown-menu">
                <li
                v-for="interest in interests"
                :key="interest"
                @mousedown.prevent="selectTheme(interest)"
                >
                {{ interest }}
                </li>
            </ul>
        </div>

        <h3 class="tg_story_title">Telegram история для продвижения:</h3>
        <div class="row">
            <input  
                v-model="userTgStory" 
                placeholder="Telegram история" >
            <span class="row_text" @click="addTelegramStory">ДОБАВИТЬ</span>
            <h3 v-if="userData">Просмотры: {{ tgStoryCount }}</h3>
        </div>

        <h3 class="tg_story_title">Telegram пост для продвижения:</h3>
        <div class="row">
            <input  
                v-model="userTgPost" 
                placeholder="Telegram пост" >
            <span class="row_text" @click="addTelegramPost">ДОБАВИТЬ</span>
            <!-- <h3 v-if="userData">Просмотры: {{ tgStoryCount }}</h3> -->
        </div>

        <h3 class="vk_group_title">ВК группа для продвижения:</h3>
        <div class="row">
            <input  
                v-model="vkGroupLink" 
                placeholder="ВК группа" >
            <span class="row_text" @click="addVKGroup">ДОБАВИТЬ</span>
            <h3 v-if="userData">Подписки: {{ userData.group?.count_subs_from_service || 0}}</h3>
        </div>
        <div class="row2">
            <div class="checkbox-wrapper-18">
                <div class="round">
                    <input type="checkbox" :id="`checkbox-111`" v-model="isCheckboxChecked"  @click="handleCheckboxChange" />
                    <label :for="`checkbox-111`"></label>
                </div>
            </div>
            <!-- <input type="checkbox" class="checkbox" v-model="isCheckboxChecked" @change="handleCheckboxChange"> -->
            <span>Подписки</span>
        </div>
        
        <h3 class="vk_video_title">ВК видео для продвижения:</h3>
        <div class="row">
            <input  
                v-model="vkVideoLink" 
                placeholder="ВК видео" >
            <span class="row_text" @click="addVKVideo">ДОБАВИТЬ</span>
            <h3 v-if="userData">Просмотры: {{ userData?.video?.count_subs_from_service || 0 }}</h3>
        </div>

        <h3 class="interests_title">Интересы: </h3>
        <div v-if="selectedInterests.length > 0" class="selected-countries ">
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
            <span><strong>Business</strong> предложение пакетов Business и Leader ежедневно публикуются на тысячи ТГ каналов с многотысячной аудиторией в рамках <strong>Intelektaz Ads</strong>. </span>
            <span><i><strong>Сделайте свое предложение пользователям INTELEKTAZ, прямо сейчас:</strong></i></span>
        </div>
        <h3>Ваше предложение:</h3>
        <span>*В вип-предложении будет показываться только первые 90 символов. Полностью предложение будет видно в бизнес-предложении.</span>
        <div class="row alg-st">
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
            <div class="copy_from">
                <h3>Копировать баннер и название с:</h3>
                <div class="copy_from_row" style="margin-top: 5px;">
                    <div class="checkbox-wrapper-18">
                        <div class="round">
                            <input type="checkbox" :id="`checkbox-1`" @click="setActiveBussinesStyle('tg')" v-model="tg_business" :checked="active_bussines_style == 'tg'" />
                            <label :for="`checkbox-1`"></label>
                        </div>
                    </div>
                    <span>Telegram</span>
                </div>
                <div class="copy_from_row">
                    <div class="checkbox-wrapper-18">
                        <div class="round">
                            <input type="checkbox" :id="`checkbox-2`" @click="setActiveBussinesStyle('vk')" v-model="vk_business" :checked="active_bussines_style == 'vk'" />
                            <label :for="`checkbox-2`"></label>
                        </div>
                    </div>
                    <span>Вконтакте</span>
                </div>
            </div>
        </div>
        <input  
            v-model="siteLink" 
            placeholder="Сайт" >

        <h3 class="tg_theme_channel_title">Интересы Intelektaz Ads: </h3>
        <div v-if="selectedThemes.length > 0" class="selected-countries">
            <span v-for="(interest, index) in selectedThemes" :key="index" class="selected-interest">
            {{ interest }}
            <img src="@/assets/images/close.png" @click="removeTheme(index)" class="remove-btn">
            </span>
        </div>
        <div class="dropdown">
            <input
                type="text"
                v-model="searchQueryTheme"
                placeholder="Тема канала"
                @focus="isDropdownVisibleTheme = true"
                @blur="hideDropdown"
                ref="selectTheme"
            />
            <img :class="{'rotated': isDropdownVisibleTheme}" src="@/assets/images/arrow_down.png" class="arrow_down">
            <ul v-if="isDropdownVisibleTheme" class="dropdown-menu">
                <li
                v-for="interest in interests"
                :key="interest"
                @mousedown.prevent="selectTheme(interest)"
                >
                {{ interest }}
                </li>
            </ul>
        </div>
        <span>Таргетинг по интересам Intelektaz Ads работает только на пакетах Leader.</span>
        <div class="row2">
            <!-- <div class="checkbox-wrapper-18">
                <div class="round">
                    <input type="checkbox" :id="`checkbox-3`" @click="changeAds('tg')" v-model="intelAds" :checked="intelAds" />
                    <label :for="`checkbox-3`"></label>
                </div>
            </div> -->
            <!-- <input type="checkbox" class="checkbox" v-model="intelAds" @click="changeAds" /> -->
            <div class="checkbox-wrapper-18">
                <div class="round">
                    <input type="checkbox" :id="`checkbox-11`" v-model="intelAds" @click="changeAds" />
                    <label :for="`checkbox-11`"></label>
                </div>
            </div>
            <span>Intelektaz Ads</span>
        </div>
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
    import AppModalAds from "@/components/AppModalAds.vue";
    import { editGroup, editVideo } from "@/services/groups";
    import { refreshToken } from "@/services/auth";
    import { 
        activeTg, 
        turnAdsOn, 
        turnAdsOff, 
        getTelegramLinks, 
        getVkToken, 
        addTelegramStory, 
        getUserStory,
        getTgGroupStats,
        upgradeTelegrmChannel,
        updateVipPlatform,
        getUserPlatform,
        createTgPost,
        getCurPost
    } from '@/services/tg';
    import { getConfig } from '@/services/config';

export default {
    components: { AppGroupOrUser, AppGoodButton, AppModalSubscribe, AppSettingsAuto, AppModal, AppVipUser, AppModalAds },
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
            testers: [],
            intelAds: false,
            tg_links: [],
            isDisabled: false,
            code_verifier: "",
            code_challenge: "",
            code_challenge_method: "S256",
            state: "grehthrtjui7643trr",
            redirectUrl: "https://lk.intelektaz.com",
            searchQueryTheme: "",
            isDropdownVisibleTheme: false,
            selectedThemes: [],
            userTgStory: null,
            tgStoryInfo: null,
            tgStoryCount: null,
            tgGroupStats: null,
            isModalAds: false,
            tg_group: null,
            active_bussines_style: null,
            tg_business: false,
            vk_business: false,
            userTgPost: null,
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
            console.log(this.userData?.packages, this.userData?.packages == true);
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

        this.intelAds = this.userData.in_ads;

        this.beforeLinks = [...this.userData.social_links];

        this.testers = await getConfig('tg_testers');

        this.tg_links = await getTelegramLinks(localStorage.getItem('token'));
        this.tg_group = this.tg_links.channel_tg_link;

        this.tgStoryInfo = await getUserStory(localStorage.getItem('token'));
        this.userTgStory = this.tgStoryInfo.story_link;
        this.tgStoryCount = this.tgStoryInfo.rotation_count;

        this.tgGroupStats = await getTgGroupStats(localStorage.getItem('token'));
        this.active_bussines_style = await getUserPlatform(localStorage.getItem('token'));

        const post = await getCurPost(localStorage.getItem('token'));
        this.userTgPost = post.post_link;

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
        async addTelegramPost() {
            await createTgPost(this.userTgPost, localStorage.getItem('token'));
        },
        async setActiveBussinesStyle(style) {
            // Запоминаем старое состояние
            const oldStyle = this.active_bussines_style;
            const oldTg = this.tg_business;
            const oldVk = this.vk_business;

            try {
                // Обновляем визуально выбранный стиль (оптимистично)
                this.active_bussines_style = style;
                this.tg_business = style === 'tg';
                this.vk_business = style === 'vk';

                const resp = await updateVipPlatform(style, localStorage.getItem('token'));

                // Если сервер вернул ошибку
                if (!resp) {
                    // Восстанавливаем всё обратно
                    this.active_bussines_style = oldStyle;
                    this.tg_business = oldTg;
                    this.vk_business = oldVk;

                    this.isSaveModal = true;
                    this.title = 'ОШИБКА!';
                    this.msg = 'У вас не привязана эта платформа к аккаунту.';
                    return;
                }

                // Успех
                this.isSaveModal = true;
                this.title = 'УСПЕШНО!';
                this.msg = 'Платформа для рекламного предложения успешно обновлена';

            } catch (err) {
                // Ошибка запроса → тоже возвращаем всё обратно
                this.active_bussines_style = oldStyle;
                this.tg_business = oldTg;
                this.vk_business = oldVk;

                this.isSaveModal = true;
                this.title = 'ОШИБКА!';
                this.msg = 'Произошла ошибка при обновлении рекламного предложения.';
            }
        },

        async addTelegramChannel() {
            if (this.tg_group) {
                try {
                    await upgradeTelegrmChannel(this.tg_group, localStorage.getItem('token'));
                    this.isModal = true;
                    this.title = 'УСПЕШНО!';
                    this.msg = 'Ваш телеграмм канал был успешно обновлён.';
                } catch(err) {
                    this.isModal = true;
                    this.title = 'ОШИБКА!';
                    this.msg = 'При изменении канала произошла ошибка.';
                }
            } else {
                window.open(`https://t.me/IntelektazTGBot?start`, "_blank", "width=800, height=600");
            }
        },
        openRotation() {
            this.$emit('open_rotation');
        },
        async turnAdsOn() {
            this.intelAds = !this.intelAds;
            this.intelAds ? await turnAdsOn(localStorage.getItem('token')) : await turnAdsOff(localStorage.getItem('token'));
            this.isModalAds = false;
        },
        generateCodeVerifier(length = 64) {
            console.log("генерация code_verifier");
            const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let codeVerifier = "";
            for (let i = 0; i < length; i++) {
                codeVerifier += validChars.charAt(Math.floor(Math.random() * validChars.length));
            }
            if (localStorage.getItem("code_verifier") === null)
                localStorage.setItem("code_verifier", codeVerifier);
            return codeVerifier;
        },

        // Преобразование строки в Base64 URL-safe
        base64UrlEncode(buffer) {
            return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
        },
        async generatePKCE() {
            const codeVerifier = this.generateCodeVerifier();
            const codeChallenge = await this.generateCodeChallenge(codeVerifier); 
            const codeChallengeMethod = 'S256'; 

            return {
                codeVerifier,
                codeChallenge,
                codeChallengeMethod
            };
        },

        // Генерация code_challenge из code_verifier
        async generateCodeChallenge(codeVerifier) {
            const encoder = new TextEncoder();
            const data = encoder.encode(codeVerifier);
            const digest = await crypto.subtle.digest('SHA-256', data);
            return this.base64UrlEncode(digest);
        },
        async handleUrlParams() {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");
            const state = params.get("state");
            const device_id = params.get("device_id");
            const code_verifier = localStorage.getItem("code_verifier");

            const sponsor_platform = localStorage.getItem('sponsor_platform');
            console.log(sponsor_platform);
            let sponsor_id = localStorage.getItem('referer');
            if (sponsor_id.startsWith('tg')) {
                sponsor_id = sponsor_id.slice(2);
            }



            if (code && state && device_id) {
                let response;
                try {
                    response = await getVkToken(code, state, code_verifier, device_id, this.redirectUrl, this.userData.id);
                } catch (err) {

                    const referal = localStorage.getItem("referer");
                    const addGroups = localStorage.getItem("addGroups");
                    const watchedVideos = localStorage.getItem("watchedVideos");
                    const addPosts = localStorage.getItem("addPosts");
                    const code_verifier = localStorage.getItem("code_verifier");
                    localStorage.clear();
                    if (addGroups) localStorage.setItem("addGroups", addGroups);
                    if (watchedVideos) localStorage.setItem("watchedVideos", watchedVideos);
                    if (addPosts) localStorage.setItem("addPosts", addPosts);
                    localStorage.setItem("referer", referal);
                    localStorage.setItem("code_verifier", code_verifier);

                    const cleanUrl = window.location.origin + window.location.pathname; 
                    window.history.replaceState({}, document.title, cleanUrl);

                    // location.reload();
                }
                if (response.status == 200) {
                    // оставляем только эти три поля, которые будут использоваться на страницах
                    const ref = localStorage.getItem("referer");
                    const addGroups = localStorage.getItem("addGroups");
                    const watchedVideos = localStorage.getItem("watchedVideos");
                    const addPosts = localStorage.getItem("addPosts");
                    const code_verifier = localStorage.getItem("code_verifier");
                    localStorage.clear();
                    if (addGroups) localStorage.setItem("addGroups", addGroups);
                    if (watchedVideos) localStorage.setItem("watchedVideos", watchedVideos);
                    if (addPosts) localStorage.setItem("addPosts", addPosts);
                    localStorage.setItem("token", response.data.access_token);
                    localStorage.setItem("token_refresh", response.data.refresh_token);
                    localStorage.setItem("is_new_user", response.data.is_new_user);
                    localStorage.setItem("code_verifier", code_verifier);

                    try {
                        await getUserInfo(localStorage.getItem("token"));
                        const refererId = ref; // если есть рефер, то отмечаем это
                        console.log("refererId", refererId);
                        
                        localStorage.setItem("points", 0);
                        localStorage.setItem("page", 1);
                        this.$router.push('/home')

                    } catch(err) {
                        const referal = localStorage.getItem("referer");
                        const addGroups = localStorage.getItem("addGroups");
                        const watchedVideos = localStorage.getItem("watchedVideos");
                        const addPosts = localStorage.getItem("addPosts");
                        const code_verifier = localStorage.getItem("code_verifier");
                        localStorage.clear();
                        if (addGroups) localStorage.setItem("addGroups", addGroups);
                        if (watchedVideos) localStorage.setItem("watchedVideos", watchedVideos);
                        if (addPosts) localStorage.setItem("addPosts", addPosts);
                        localStorage.setItem("first", true);
                        localStorage.setItem("referer", referal);
                        localStorage.setItem("code_verifier", code_verifier);
                        // location.reload();
                    }
                    
                } else {
                    const ref = localStorage.getItem("referer");
                    const addGroups = localStorage.getItem("addGroups");
                    const watchedVideos = localStorage.getItem("watchedVideos");
                    const addPosts = localStorage.getItem("addPosts");
                    const code_verifier = localStorage.getItem("code_verifier");
                    localStorage.clear();
                    if (addGroups) localStorage.setItem("addGroups", addGroups);
                    if (watchedVideos) localStorage.setItem("watchedVideos", watchedVideos);
                    if (addPosts) localStorage.setItem("addPosts", addPosts);
                    localStorage.setItem("first", true);
                    localStorage.setItem("referer", ref);
                    localStorage.setItem("code_verifier", code_verifier);
                    // const cleanUrl = window.location.origin + window.location.pathname; 
                    // window.history.replaceState({}, document.title, cleanUrl);
                    // location.reload();
                }
                    
            } else {
                console.warn("Параметры code, state или device_id отсутствуют в URL.");
            }
        },
        async tap() {
            if (!this.isDisabled) {
                this.isDisabled = true;
                localStorage.setItem("isDisabled", this.isDisabled);
                // штука, чтобы параметры только один раз генерировались
                const isParams = localStorage.getItem("isParams"); 
                if (isParams != "true") {
                    console.log("генерируются параметры новые");
                    const pkce = await this.generatePKCE();
                    this.code_verifier = pkce.codeVerifier;
                    this.code_challenge = pkce.codeChallenge;
                    localStorage.setItem("isParams", "true");
                }

                // схема "Обмен на бэкенде без SDK"
                const clientId = "52191705";
                const redirectUri = this.redirectUrl;
                const state = this.state;
                const code_challenge = this.code_challenge;
                const code_challenge_method = this.code_challenge_method;
                const scopes = "groups,photos,wall,video,stats";
                localStorage.setItem('zopa', code_challenge);   
                localStorage.setItem('isAddVK', true);
                localStorage.setItem('userId', this.userData.id);

                const vkAuthUrl = `https://id.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}&code_challenge=${code_challenge}&code_challenge_method=${code_challenge_method}&scope=${scopes}`;
                try {
                    window.location.href = vkAuthUrl;
                } catch(err) {
                    const ref = localStorage.getItem("referer");
                    const addGroups = localStorage.getItem("addGroups");
                    const watchedVideos = localStorage.getItem("watchedVideos");
                    const addPosts = localStorage.getItem("addPosts");
                    const code_verifier = localStorage.getItem("code_verifier");
                    localStorage.clear();
                    if (addGroups) localStorage.setItem("addGroups", addGroups);
                    if (watchedVideos) localStorage.setItem("watchedVideos", watchedVideos);
                    if (addPosts) localStorage.setItem("addPosts", addPosts);
                    localStorage.setItem("first", true);
                    localStorage.setItem("referer", ref);
                    localStorage.setItem("code_verifier", code_verifier);
                }
            }
            
        },
        async addTelegramStory() {
            try {
                const resp = await addTelegramStory(this.userTgStory, localStorage.getItem('token'));
                if (resp) {
                    this.isSaveModal = true;
                    this.title = 'УСПЕШНО';
                    this.msg = 'Ваша Telegram история была успешно привязана';
                } else {
                    this.isSaveModal = true;
                    this.title = 'ОШИБКА';
                    this.msg = 'История должна принадлежать вашему каналу';
                }
            } catch(err) {
                this.isSaveModal = true;
                this.title = 'ОШИБКА';
                this.msg = 'История должна принадлежать вашему каналу';
            }
            
        },
        async changeAds() {
            setTimeout(() => this.intelAds = !this.intelAds, 500);
            this.isModalAds = true;
        },
        async activateTg() {
            const code = await activeTg(localStorage.getItem('token'));
            window.open(`https://t.me/IntelektazTGBot?start=code=${code}`, "_blank", "width=800, height=600")
        },
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

            selectTheme(interest) {
                if (!this.selectedThemes.includes(interest)) {
                    this.selectedThemes.push(interest);
                }
                this.searchQueryTheme = '';
                this.isDropdownVisibleTheme = false;
                this.$refs.selectTheme.blur();
            },
            removeTheme(index) {
                this.selectedThemes.splice(index, 1);
            },

            hideDropdown() {
                this.isDropdownVisibleCountry = false;
                this.isDropdownVisibleGender = false;
                this.isDropdownVisibleInterest = false;
                this.isDropdownVisibleTheme = false;
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
                if (this.userData?.channel_theme)
                    this.selectedThemes = [...this.userData.channel_theme];
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
                    channel_theme: this.selectedThemes
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

    .checkbox-wrapper-18 .round {
        position: relative;
    }

    .checkbox-wrapper-18 .round label {
        background-color: none;
        border: 1px solid white;
        cursor: pointer;
        height: 23px;
        width: 23px;
        display: block;
    }

    .checkbox-wrapper-18 .round label:after {
        border: 3px solid #66bb6a;
        border-top: none;
        border-right: none;
        content: "";
        height: 6px;
        left: 5px;
        opacity: 0;
        position: absolute;
        top: 3px;
        transform: rotate(-45deg);
        width: 18px;
    }

    .checkbox-wrapper-18 .round input[type="checkbox"] {
        visibility: hidden;
        display: none;
        opacity: 0;
    }

    .checkbox-wrapper-18 .round input[type="checkbox"]:checked + label {
        background-color: none;
        border-color: white;
    }

    .checkbox-wrapper-18 .round input[type="checkbox"]:checked + label:after {
        opacity: 1;
    }

    .copy_from {
        display: flex;
        flex-direction: column;
        row-gap: 15px;
    }
    .copy_from h3 {
        color: white;
        font-size: 18px;
        font-family: 'OpenSans';
        max-width: 196px;
    }

    .copy_from_row {
        display: flex;
        column-gap: 10px;
        align-items: center;
    }

    .sm_checkbox {
        width: 20px !important;
        height: 20px !important;
        background: none;
    }

    .gender_dropdown, .tg_channel_title, .tg_theme_channel_title, .tg_story_title, .vk_video_title, .vk_group_title, .interests_title {
        margin-top: 25px;
    }

    .region_title {
        margin-top: 15px;
    }

    .ok_green {
        margin-left: 30px;
        width: 18px;
        height: 13px;
    }

    .active_tg_btn {
        width: 148px;
        height: 40px;
        font-size: 14px;
        letter-spacing: 0px;
        margin-left: 22px;
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
        display: grid;
        grid-template-columns: 100px 1fr;
        column-gap: 30px;
        @media (max-width: 650px) {
            display: flex;
            flex-direction: column;
            row-gap: 10px;
        }
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
        /* flex-wrap: wrap; */
        row-gap: 10px;
        @media (max-width: 650px) {
            row-gap: 20px;
        }
    }
    .alg-st {
        align-items: start;
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
    .row_text {
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

    .copy_from_row span {
        border: none;
        font-size: 18px;
        font-weight: normal;
    }
</style>