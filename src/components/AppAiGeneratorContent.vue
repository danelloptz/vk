<template>
    <section class="ai">
        <div class="switch">
            <span
                v-for="(item, index) in listSwtich"
                :key="index"
                :class="{ active: activeIndex === index }" 
                @click="setActive(index)"
            >{{ item }}</span>
        </div> 
        <div class="brief" v-if="activeIndex == 0">
        <h1>Для создания качественного контент плана вам необходимо заполнить подробный бриф:</h1> 
            <div class="container">
                <div class="item">
                    <span class="counter">{{ allSymbols }}/{{ maxSymbols }}</span>
                    <h2>Название компании:</h2>
                    <input 
                        type="text"
                        v-model="label"
                        placeholder="Название"
                        @input="validateInput('label', $event)"
                        :class="{ saved: isSaved }"
                    >
                    <h2>Год основания компании:</h2>
                    <input 
                        type="text"
                        v-model="year"
                        placeholder="Год"
                        @input="validateInput('year', $event)"
                        :class="{ saved: isSaved }"
                    >
                </div>
                <div class="item">
                    <h2>Описание компании:</h2>
                    <textarea :class="{ saved: isSaved }" placeholder="Какие продукты или услуги предлагает компания?" v-model="description_company" @input="validateInput('description_company', $event)"></textarea>
                </div>
                <div class="item">
                    <h2>Конкурентные преимущества:</h2>
                    <textarea :class="{ saved: isSaved }" placeholder="Что выделяет компанию среди конкурентов?" v-model="pros" @input="validateInput('pros', $event)"></textarea>
                </div>
                <div class="item">
                    <h2>Описание продукта / услуги:</h2>
                    <textarea :class="{ saved: isSaved }" placeholder="Подробное описание продуктов или услуг, которые необходимо продвигать" v-model="description_product" @input="validateInput('description_product', $event)"></textarea>
                </div>
                <div class="item">
                    <h2>Какие боли или проблемы решает ваш продукт?</h2>
                    <textarea :class="{ saved: isSaved }" placeholder="Чем ваш продукт может помочь клиентам?" v-model="whats_solve" @input="validateInput('whats_solve', $event)"></textarea>
                </div>
                <div class="item">
                    <h2>Уникальные характеристики продукта:</h2>
                    <textarea :class="{ saved: isSaved }" placeholder="Что отличает ваш продукт от других на рынке?" v-model="characteristics"  @input="validateInput('characteristics', $event)"></textarea>
                </div>
                <div class="item">
                    <h2>Цена и ценовая политика:</h2>
                    <input 
                        type="text"
                        v-model="price"
                        placeholder="Цена"
                        @input="validateInput('price', $event)"
                        :class="{ saved: isSaved }"
                    >
                    <h2>Какой тип партнерской программы в компании?</h2>
                    <div class="dropdown">
                        <input
                            v-model="type"
                            type="text"
                            placeholder="Тип программы"
                            :class="{ saved: isSaved }"
                            @focus="isDropdownVisible = true"
                            @blur="hideDropdown"
                            readonly 
                        />
                        <img :class="{'rotated': isDropdownVisible}" src="@/assets/images/arrow_down.png" class="arrow_down">
                        <ul v-if="isDropdownVisible" class="dropdown-menu">
                            <li
                                v-for="(item, index) in types"
                                :key="index"
                                @mousedown.prevent="selectType(item)"
                            >
                                {{ item }}
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="item">
                    <h2>Кто ваша основная целевая аудитория?</h2>
                    <textarea :class="{ saved: isSaved }" placeholder="Возраст, пол, профессия, уровень дохода" v-model="audience" @input="validateInput('audience', $event)"></textarea>
                </div>
                <div class="item">
                    <h2>Ссылка:</h2>
                    <input 
                        type="text"
                        v-model="link"
                        placeholder="Ссылка"
                        @input="validateInput('link', $event)"
                        :class="{ saved: isSaved }"
                    >
                </div>
                <div class="item">
                    <h2>Какую реакцию вы хотите получить от вашей аудитории?</h2>
                    <input 
                        type="text"
                        v-model="reaction"
                        placeholder="Покупки, регистрация в системе"
                        @input="validateInput('reaction', $event)"
                        :class="{ saved: isSaved }"
                    >
                </div>
            </div>
            <div class="row" style="margin-top: 50px; margin-bottom: 44px;">
                <AppGoodButton :text="text1" @click="saveSettings"/>
                <AppGoodButton :text="text2" @click="editSettings" />
                <AppGoodButton :text="text3" @click="generateThemes" />
            </div>  
            <div class="table_container">
                <table>
                    <thead>
                        <tr class="head">
                            <th>
                                <input type="checkbox" v-model="allCheckboxes">
                            </th>
                            <th>День</th>
                            <th>Тема</th>
                            <th>Пост</th>
                            <th>Баннер</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in plan" :key="index">
                            <td>
                                <input type="checkbox" v-model="aprovedPostsIndexes[index]" :checked="allCheckboxes">
                            </td>
                            <td>
                                <span>{{ index + 1 }}</span>
                            </td>
                            <td class="plan_item">
                                <span :contenteditable="isEditable">{{ item?.topic_name }}</span>
                            </td>
                            <td class="plan_item">
                                <span :contenteditable="isEditable" v-html="formatedPost(item?.post_text[item.chose_post_index])"></span>
                                <div class="plan_item_variants">
                                    <AppGoodButton 
                                        v-for="(name, index_var) in variants.slice(0, item.post_text.length)" 
                                        :key="index_var" 
                                        :text="name" 
                                        class="variant_btn" 
                                        :class="{ not_active: index_var !== plan[index].chose_post_index }"
                                        @click="setActivePostVar(index_var, index)"
                                    />
                                </div>
                            </td>
                            <td class="plan_item">
                                <img :src="item?.image_links[item.chose_image_index]" class="banner" />
                                <div class="plan_item_variants">
                                    <AppGoodButton 
                                        v-for="(name, index_var) in variants.slice(0, item.image_links.length)" 
                                        :key="index_var" 
                                        :text="name" 
                                        class="variant_btn"
                                        :class="{ not_active: index_var !== plan[index].chose_image_index }"
                                        @click="setActiveImageVar(index_var, index)"
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <span v-if="isLoading">Подождите, пока закончится генерация.</span>
            <div class="row" style="margin-top: 50px; margin-bottom: 44px;">
                <AppGoodButton :text="text4" @click="confirmCurrentPosts" />
                <AppGoodButton :text="text5" @click="regenerateCurrentPosts" />
                <AppGoodButton :text="text6" @click="editInfo" />
            </div>
        </div>
        <div class="content" v-if="activeIndex == 1">
            <table>
                <thead>
                    <tr class="head">
                        <th>
                            <input type="checkbox" v-model="allCheckboxesContent">
                        </th>
                        <th>День</th>
                        <th>Тема</th>
                        <th>Пост</th>
                        <th>Баннер</th>
                        <th>Дата / время публикации</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in plan" :key="index">
                        <td v-if="item.date_publication">
                            <input type="checkbox" :checked="allCheckboxesContent">
                        </td>
                        <td v-if="item.date_publication">
                            <span class="content_text">{{ index + 1 }}</span>
                        </td>
                        <td v-if="item.date_publication">
                            <span class="content_text">{{ item?.topic_name }}</span>
                        </td>
                        <td v-if="item.date_publication">
                            <span class="content_text" v-html="formatedPost(item.post_text[item.chose_post_index])"></span>
                        </td>
                        <td v-if="item.date_publication">
                            <img class="accepted_banner" :src="item.image_links[item.chose_image_index]" />
                        </td>
                        <td class="col" v-if="item.date_publication">
                            <span
                                class="content_text"
                                :contenteditable="isEditableContent"
                                :ref="'editableDate_' + index"
                            >{{ formatedDate(item.date_publication * 1000) }}</span>
                            <span class="change_text" @click="changeEditableContent">{{ isEditableContent ? "Отменить" : "Изменить" }}</span>
                            <AppGoodButton v-if="isEditableContent" :text="text8" class="sm_btn" @click="savePlan(index)" />
                            <span class="error" v-if="badDate">Неправильный формат даты. Введите дату в формате: 01.01.2000 12:00</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <AppGoodButton :text="text7" />
        </div>
    </section>
    
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import { sendBrief, getBrief, updateBrief, getContentPlan, generateTopics, generatePostsText, regenerateThemes, generateBanners, regeneratePosts, updateContentPlan, regenerateBanners, acceptPlan } from "@/services/ai";

    export default {
        components: { AppGoodButton },
        data() {
            return {
                activeIndex: 0,
                listSwtich: ["Бриф", "Контент план"],
                text1: "СОХРАНИТЬ",
                text2: "РЕДАКТИРОВАТЬ",
                text3: "СГЕНЕРИРОВАТЬ ПЛАН",
                text4: "ОДОБРИТЬ",
                text5: "ЗАМЕНИТЬ",
                text6: "РЕДАКТИРОВАТЬ",
                text7: "УДАЛИТЬ",
                text8: "СОХРАНИТЬ",
                themes: [
                    "Обзор сервиса Best Followers. Видео-инструктаж о том, как сервис может помочь в развитии вашего Telegram-канала и увеличении доходов",
                    "Обзор сервиса Noise Pollution. Видео-инструктаж о том, как сервис может помочь в развитии вашего Telegram-канала и увеличении доходов",
                    "Обзор сервиса Typeguru. Видео-инструктаж о том, как сервис может помочь в развитии вашего Telegram-канала и увеличении доходов",
                ],
                posts: [
                    "Пост 1. йцукенгшщзх",
                    "Пост 2. йцукенгшщзх",
                    "Пост 3. йцукенгшщзх",
                ],
                banners: [
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvkUFmp5jSF-DhrD5102bzHU7RbidetfqYfA&s",
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvkUFmp5jSF-DhrD5102bzHU7RbidetfqYfA&s",
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvkUFmp5jSF-DhrD5102bzHU7RbidetfqYfA&s",
                ],
                allCheckboxes: false,
                allCheckboxesContent: false,
                isSaved: false,
                isEditable: false,
                isEditableContent: false,
                label: "",
                year: "",
                description_company: "",
                pros: "",
                description_product: "",
                whats_solve: "",
                characteristics: "",
                price: "",
                type: "",
                audience: "",
                link: "",
                reaction: "",
                isNewBrief: false,
                idBrief: "",
                plan: null,
                aprovedPostsIndexes: [],
                isLoading: false,
                step: -1,
                currBanners: [],
                currTexts: [],
                variants: ["ВАРИАНТ 1", "ВАРИАНТ 2", "ВАРИАНТ 3"],
                result: [],
                badDate: false,
                maxSymbols: 3500,
                isDropdownVisible: false,
                types: ["Нет", "Линейный маркетинг", "Бинарный маркетинг", "Гибридный маркетинг", "Матрица", "Шахматный маркетинг"]
            }
        },
        watch: {
            isSaved(status) {
                if (status) {
                    setTimeout(() => this.isSaved = false, 1100);
                }
            }
        },
        async created() {
            const resp = await getBrief(localStorage.getItem("token"));
            if (resp) {
                this.isNewBrief = false;
                this.label = resp.name_company;
                this.year = resp.year_foundation_of_company;
                this.description_company = resp.description_company;
                this.pros = resp.competitive_advantages;
                this.description_product = resp.description_product;
                this.whats_solve = resp.what_problems_solve;
                this.characteristics = resp.unique_characters_of_product;
                this.price = resp.price_policy;
                this.audience = resp.target_audience;
                this.link = resp.link;
                this.reaction = resp.feedback_from_audience;
                this.type = resp.type_loyalty_programm;
                this.idBrief = resp.id;
                console.log(resp);
            } else {
                this.isNewBrief = true;
                console.log("БРИФ ЕЩЁ НЕ СОЗДАН!");
            }

            this.isLoading = true;
            const r = await getContentPlan(localStorage.getItem("token"));
            this.plan = r || [];
            this.isLoading = false;

            this.aprovedPostsIndexes = Array.from({ length: this.plan.length }, () => false);
            this.currTexts = Array.from({ length: this.plan.length }, () => 0);
            this.currBanners = Array.from({ length: this.plan.length }, () => 0);
            
            this.step = this.getStep();
        },
        computed: { 
            allCountsOfTexts() {
                return this.plan.map(item => item.chose_post_index);
            },
            allCountsOfBanners() {
                return this.plan.map(item => item.chose_image_index);
            },
            countsOfTexts() {
                const checked = this.plan.filter((_, index) => this.aprovedPostsIndexes[index]);
                return checked.map(item => item.post_text.length);
            },
            countsOfBanners() {
                const checked = this.plan.filter((_, index) => this.aprovedPostsIndexes[index]);
                return checked.map(item => item.image_links.length);
            },
            allSymbols() {
                return this.year.length + this.label.length + this.description_company.length + this.pros.length + this.description_product.length + this.whats_solve.length + this.characteristics.length + this.price.length + this.audience.length + this.link.length + this.reaction.length;
            }
        },
        methods: {
            hideDropdown() {
                this.isDropdownVisible = false;
            },
            selectType(item) {
                this.type = item;
                this.hideDropdown();
            },
            validateInput(field) {
                const currentLength = this.allSymbols;

                // Если текущая длина + новая длина превышает лимит, обрезаем ввод
                if (currentLength > this.maxSymbols) {
                    this[field] = this[field].slice(0, this[field].length - (currentLength - this.maxSymbols));
                }
            },
            formatedPost(post) {
                if (!post) return "";
                return post.replace(/\n/g, "<br>");
            },
            async confirmCurrentPosts() {
                const filtered = this.allCheckboxes ? this.plan : this.plan.filter((_, index) => this.aprovedPostsIndexes[index]);
                if (filtered.length > 0) {
                    this.plan = filtered;
                    this.aprovedPostsIndexes = Array.from({ length: this.plan.length }, () => false);
                    this.allCheckboxes = false;
                    this.isLoading = true;

                    console.log(this.step);
                    if (this.step == 1) {
                        console.log("STEP 1", this.step);
                        try {
                            await updateContentPlan(this.plan, localStorage.getItem("token"));
                            let resp = await generatePostsText(this.plan, localStorage.getItem("token"));
                            if (!resp) resp = await generatePostsText(this.plan, localStorage.getItem("token"));
                            this.plan = resp;
                            this.plan.forEach(item => {
                                item.chose_post_index = 0;
                            });
                            await updateContentPlan(this.plan, localStorage.getItem("token"));
                        } catch(err) {
                            console.error(err);
                        }
                    }

                    console.log(this.step);
                    if (this.step == 2) {
                        console.log("STEP 2", this.step);
                        try {
                            this.plan.forEach(item => {
                                if (!item.chose_post_index) item.chose_post_index = 0;
                            });
                            await updateContentPlan(this.plan, localStorage.getItem("token"));
                            let resp = await generateBanners(this.plan, localStorage.getItem("token"));
                            if (!resp) resp = await generateBanners(this.plan, localStorage.getItem("token"));
                            this.plan = resp;
                            this.plan.forEach(item => {
                                item.chose_image_index = 0;
                            });
                            await updateContentPlan(this.plan, localStorage.getItem("token"));
                        } catch(err) {
                            console.error(err);
                        }
                    }
                    if (this.step > 2) {
                        try {
                            this.plan.forEach(item => item.is_accept_pairs = true);
                            let resp = await acceptPlan(this.plan, localStorage.getItem("token"));
                            if (!resp) resp = await acceptPlan(this.plan, localStorage.getItem("token"));
                            this.plan = resp;
                            this.activeIndex = 1;
                        } catch(err) {
                            console.error(err);
                        }
                        
                    }
                    else this.step++;

                    this.isLoading = false;
                }
            },
            setActive(index) {
                this.activeIndex = index;
            },
            setActivePostVar(var_index, post_index) {
                this.plan[post_index].chose_post_index = var_index;
            },
            setActiveImageVar(var_index, post_index) {
                this.plan[post_index].chose_image_index = var_index;
            },
            async savePlan(index) {
                const editableElement = this.$refs['editableDate_' + index];

                if (!editableElement) {
                    console.error("Редактируемый элемент не найден");
                    return;
                }

                const editedDate = editableElement[0].innerText.trim();
                const newTimestamp = this.convertToTimestamp(editedDate);

                if (newTimestamp) {
                    this.badDate = false;
                    this.plan[index].date_publication = newTimestamp;
                    console.log("Обновленный план:", this.plan);
                } else {
                    console.error("Неверный формат даты");
                    this.badDate = true;
                    return;
                }

                const resp = await updateContentPlan(this.plan, localStorage.getItem("token"));
                if (resp == 200) {
                    this.isEditableContent = false;
                }
            },
            async saveSettings() {
                // TODO: отправка на сервер данных брифа
                this.isSaved = true;
                const payload = {
                    "name_company": this.label,
                    "year_foundation_of_company": this.year,
                    "description_company": this.description_company,
                    "competitive_advantages": this.pros,
                    "description_product": this.description_product,
                    "what_problems_solve": this.whats_solve,
                    "unique_characters_of_product": this.characteristics,
                    "price_policy": this.price,
                    "target_audience": this.audience,
                    "type_loyalty_programm": this.type,
                    "link": this.link,
                    "feedback_from_audience": this.reaction
                };
                if (this.isNewBrief) {
                    this.isNewBrief = false;
                    const resp = await sendBrief(payload, localStorage.getItem("token"));
                    console.log(resp);
                } else {
                    console.log(this.idBrief);
                    const resp = await updateBrief(this.idBrief, payload, localStorage.getItem("token"));
                    console.log(resp);
                }
                
            },
            editSettings() {
                this.isSaved = false; 
            },
            editInfo() {
                this.isEditable = true;

            },
            async generateThemes() {
                this.step = 0;
                this.saveSettings();
                this.isLoading = true;

                const topics = await generateTopics(localStorage.getItem("token"));
                this.plan = topics;
                this.step++;

                this.isLoading = false;
            },
            changeEditableContent() {
                this.isEditableContent = !this.isEditableContent;
            },
            async regenerateCurrentPosts() {
                this.isLoading = true;

                const checked_plan = this.allCheckboxes ? this.plan : this.plan.filter((_, index) => this.aprovedPostsIndexes[index]);
                const max_text = Math.max(...this.countsOfTexts);
                const max_banners = Math.max(...this.countsOfBanners);
                this.aprovedPostsIndexes = Array.from({ length: this.plan.length }, () => false);
                this.allCheckboxes = false;

                if (this.step == 1) {
                    try {
                        const topics = await regenerateThemes(checked_plan, localStorage.getItem("token"));
                        this.plan = topics;
                    } catch(err) {
                        console.error(err);
                    }
                } 
                if (this.step == 2 && max_text < 3) {
                    try {
                        checked_plan.forEach(item => {
                            item.chose_post_index++;
                        });
                        const topics = await regeneratePosts(checked_plan, localStorage.getItem("token"));
                        this.plan = topics;
                        this.currText++;
                    } catch(err) {
                        console.error(err);
                    }
                } 
                if (this.step == 3 && max_banners < 3) {
                    try {
                        checked_plan.forEach(item => {
                            item.chose_image_index++;
                        });
                        const topics = await regenerateBanners(checked_plan, localStorage.getItem("token"));
                        this.plan = topics;
                        this.currBanner++;
                    } catch(err) {
                        console.error(err);
                    }
                }

                this.isLoading = false;
            },
            getStep() {
                console.log(this.plan);
                const notEmptyThemes = this.plan.filter(item => item.topic_name != "");
                const notEmptyPosts = this.plan.filter(item => item.post_text.length > 0);
                const notEmptyImages = this.plan.filter(item => item.image_links.length > 0);
                console.log("Непустые тема: ", notEmptyThemes);
                console.log("Непустые посты: ", notEmptyPosts);
                console.log("Непустые картинки: ", notEmptyImages);
                if (notEmptyThemes.length == 0) return 0;
                if (notEmptyPosts.length == 0) return 1;
                if (notEmptyImages.length == 0) return 2;
                return 3;
            },
            formatedDate(time) {
                console.log(time);
                const date = new Date(time);

                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');

                return `${day}.${month}.${year} ${hours}:${minutes}`;
            },
            convertToTimestamp(dateString) {
                try {
                    // Разбиваем строку на компоненты даты и времени
                    const [datePart, timePart] = dateString.split(' ');
                    const [day, month, year] = datePart.split('.').map(Number);
                    const [hours, minutes] = timePart.split(':').map(Number);

                    const date = new Date(year, month - 1, day, hours, minutes);

                    const timestamp = Math.floor(date.getTime() / 1000);

                    return timestamp;
                } catch(err) {
                    return false;
                }
                
            }
        },
    };
</script>

<style scoped>
    .active {
        background: #7023EC;
        font-weight: bold;
    }
    .ai {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 50px;
        /* z-index: 4; */
    }
    .switch {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }
    span {
        width: 100%;
        height: 40px;
        color: white;
        font-size: 14px;
        font-family: 'OpenSans';
        /* cursor: pointer; */
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

    h1 {
        font-size: 20px;
        color: white;
        font-family: 'OpenSans';
        text-align: center;
        margin-bottom: 50px;
        justify-self: center;
        @media (min-width: 1300px) {
            max-width: 60%;
        }
    }
    h2 {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .brief {
        width: 100%;
    }
    .container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        column-gap: 50px;
        row-gap: 30px;
    }
    .item {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        position: relative;
    }
    .dropdown {
        position: relative;
        width: 100%
    }

    input[type="checkbox"] {
        width: 24px;
        height: 24px;
        appearance: none; /* Убираем стандартный стиль */
        border: 2px solid #333;
        border-radius: 4px;
        background-color: white;
        cursor: pointer;
        padding: 0;
        margin-top: 8px;
    }

    input[type="checkbox"]:checked {
        background-color: #4CAF50; /* Цвет при активации */
        border-color: #4CAF50;
        position: relative;
    }

    input[type="checkbox"]:checked::after {
        font-size: 18px;
        color: white;
        position: absolute;
        top: 1px;
        left: 4px;
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
        transition: .2s ease-in;
        @media (max-width: 500px) {
            width: 70vw;
        }
    }
    textarea {
        width: 100%;
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
        transition: .2s ease-in;
        @media (max-width: 500px) {
            width: 70vw;
        }
    }

    .arrow_down {
        position: absolute;
        top: 23px;
        right: 23px;
        width: 13px;
        height: 13px;
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
    .table_container {
        max-height: 973px;
        overflow: auto;
    }
    table {
        border: none;
        border-collapse: collapse;
        width: 100%;
    }
    th {
        line-height: 3;
    }
    td {
        padding: 0px 10px;
    }
    td, th {
        color: white;
        font-family: 'OpenSans';
        font-size: 20px;
        text-align: center;
        /* align-self: center; */
        z-index: 9;
        padding: 10px;
        position: relative;
    }
    td {
        vertical-align: top;
    }
    span {
        color: white;
        font-family: 'OpenSans';
        font-size: 20px;
        z-index: 9;
        /* padding: 10px; */
        /* align-self: center; */
        position: relative;
    }
    td span {
        font-size: 14px !important;
    }
    tr:nth-child(2n+1) {
        background: #111433;
    }
    .head {
        background: none !important;
    }
    .row {
        display: flex;
        justify-content: space-between;
    }
    .saved {
        animation: ChangeColor 1s ease-in-out;
    }
    @keyframes ChangeColor {
        0% { border-color: white; }
        50% { border-color: #4caf4f8e;  }
        100% { border-color: white; }
    }

    .content {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
        row-gap: 50px;
    }
    .col {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 26px;
    }
    .change_text {
        text-decoration: underline;
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
        cursor: pointer;
    }
    .content_text {
        font-size: 14px;
    }
    .plan_item {
        width: 270px;
        padding: 15px 20px;
        text-align: start !important;
    }

    .banner {
        width: 230px;
    }

    .variant_btn {
        width: 70px;
        height: 20px;
        font-size: 7px;
    }

    .not_active {
        background: none !important;
        border: 1px solid white;
    }
    .not_active:hover {
        background: rgba(255, 255, 255, 0.329);
    }
    .plan_item_variants {
        display: flex;
        row-gap: 10px;
        column-gap: 10px;
        flex-wrap: wrap;
        margin-top: 20px;
    }
    .accepted_banner {
        width: 180px;
    }
    .sm_btn {
        width: 110px;
        font-size: 12px;
    }
    .error {
        color: red;
    }
    .counter {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 14px;
        color: white;
        opacity: .5;
        font-family: 'OpenSans';
        width: min-content;
        line-height: 2;
        height: min-content;
    }
</style>