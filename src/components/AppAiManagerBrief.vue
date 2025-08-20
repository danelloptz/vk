<template>
    <AppModal 
        :title="title" 
        :message="msg" 
        :visibility1="isModal"
        @update:visibility1="isModal = $event"
    />
    <section class="instruc_modal_wrapper" v-if="isInstructModal">
        <div class="instruct_modal">
            <img src="@/assets/images/close.png" class="instruc_modal_close" @click="closeInstructModal">
            <h2>Инструкция</h2>
            <span>Для получения токена перейдите по ссылке в официальный бот Телеграм - @botfather и выполните там команду /newbot. Далее напишите имя бота, после чего напишите никнейм бота с окончанием "bot" и @botfather выдаст вам токен.</span>
        </div>
    </section>
    <section class="brief">
        <!-- <div class="managers_switch" v-if="managers.length > 0">
            <span class="managers_switch_title">ИИ менеджер: </span>
            <div 
                class="switch" 
            >
                <span
                    v-for="(_, index) in 5"
                    :key="index"
                    class="switch_item"
                    :class="{ active: activeIndex === index }" 
                    @click="setActive(index)"
                >{{ index + 1 }}</span>
            </div> 
        </div> -->
        <!-- <div class="no_package" v-if="noAccess">
            <img src="@/assets/images/robot.png">
            <h1>Чтобы увеличить количество менеджеров до 5, активируйте пакет Leader!</h1>
            <AppGoodButton :text="'ВЫБРАТЬ ПАКЕТ'" style="width: 200px; margin-top: 40px;" @click="openTatiff" />
        </div> -->
        <div class="sub_brief" v-if="!noAccess">
            <h2>Для создания ИИ менеджера необходимо привязть Telegram бот к сервису Intelektaz и заполнить бриф:</h2>
            <div class="token_row">
                <span>Токен бота:</span>
                <input v-model="token" class="token_input" />
                <AppGoodButton :text="'ПРИВЯЗАТЬ'" class="token_btn" @click="bind"/>
                <span style="text-decoration: underline;" @click="openInstructModal">Инструкция</span>
            </div>
            <div class="link_row">
                <span>Ссылка:</span>
                <div class="link" v-if="tg_link.length > 0" @click="copyLink(tg_link)">
                    <span class="link_text">{{ tg_link }}</span> <img src="@/assets/images/copy.png" />
                    <span class="green" v-if="isCopy">Скопировано!</span>
                </div>
            </div>
            <div class="row_between">
                <h2 class="m30">Бриф:</h2>
                <AppGoodButton :text="'СКОПИРОВАТЬ С ИИ'" class="copy_from_ai" @click="copyFromBrief"/>
            </div>
            <div class="container">
                <div class="col">
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
                    <h2 class="pros">Конкурентные преимущества:</h2>
                    <textarea class="h185" :class="{ saved: isSaved }" placeholder="Что выделяет компанию среди конкурентов?" v-model="pros" @input="validateInput('pros', $event)"></textarea>
                    <h2>Какие боли или проблемы решает ваш продукт?</h2>
                    <textarea class="h185" :class="{ saved: isSaved }" placeholder="Чем ваш продукт может помочь клиентам?" v-model="whats_solve" @input="validateInput('whats_solve', $event)"></textarea>
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
                    <h2 class="tg">Телеграм для связи:</h2>
                    <input 
                        type="text"
                        v-model="tg"
                        placeholder="Телеграм (введите имя пользователя)"
                        @input="validateInput('tg', $event)"
                        :class="{ saved: isSaved }"
                    >
                </div>
                <div class="col">
                    <h2>Имя, Фамилия или Компания:</h2>
                    <input 
                        type="text"
                        v-model="fio"
                        placeholder="Данные, кого будет представлять бот"
                        @input="validateInput('fio', $event)"
                        :class="{ saved: isSaved }"
                    >
                    <h2 class="descr_comp">Описание компании:</h2>
                    <textarea :class="{ saved: isSaved }" placeholder="Какие продукты или услуги предлагает компания?" v-model="description_company" @input="validateInput('description_company', $event)"></textarea>
                    <h2>Описание продукта / услуги:</h2>
                    <textarea :class="{ saved: isSaved }" placeholder="Подробное описание продуктов или услуг, которые необходимо продвигать" v-model="description_product" @input="validateInput('description_product', $event)"></textarea>
                    <h2>Уникальные характеристики продукта:</h2>
                    <textarea :class="{ saved: isSaved }" placeholder="Что отличает ваш продукт от других на рынке?" v-model="characteristics"  @input="validateInput('characteristics', $event)"></textarea>
                    <h2>Часто задаваемые вопросы:</h2>
                    <textarea :class="{ saved: isSaved }" placeholder="В этом разделе укажите самые частые вопросы, которые задают ваши клиенты и ответы на них. Используте формат «Вопрос: [текст вопроса]. Ответ: [текст ответа]». Каждый вопрос с новой строки" v-model="qu" @input="validateInput('qu', $event)"></textarea>
                </div>
            </div>
            <h2 class="m50">Ссылки и материалы:</h2>
            <div class="links">
                <div v-for="(link, index) in links" :key="index" class="row">
                    <input 
                        placeholder="Ссылка"
                        v-model="link.link"
                        class="links_link"
                    >
                    <input 
                        placeholder="Описание"
                        v-model="link.descr"
                        class="links_descr"
                    >
                    <div class="sub_row"  >
                        <img 
                            v-if="link.isNew"
                            src="@/assets/images/delete_ai.png" 
                            @click="removeLink(index)"
                        >
                        <img 
                            v-if="index == links.length - 1"
                            src="@/assets/images/addPlus.png" 
                            @click="addLink(link, index)"
                        >
                    </div>
                </div>
            </div>
            <h2 class="m50">Какую реакцию вы хотите получить от вашей аудитории?</h2>
            <div class="links">
                <div v-for="(goal, index) in goals" :key="index" class="row">
                    <input 
                        placeholder="Цель"
                        v-model="goal.goal"
                        class="links_link"
                    >
                    <input 
                        placeholder="Описание"
                        v-model="goal.descr"
                        class="links_descr"
                    >
                    <div class="sub_row"  >
                        <img 
                            v-if="goal.isNew"
                            src="@/assets/images/delete_ai.png" 
                            @click="removeGoal(index)"
                        >
                        <img 
                            v-if="index == goals.length - 1"
                            src="@/assets/images/addPlus.png" 
                            @click="addGoal(goal, index)"
                        >   
                    </div>
                </div>
            </div>
            <div class="btns_row">
                <AppGoodButton :text="'СОХРАНИТЬ'" class="btn_long" @click="saveChanges"/>
                <AppGoodButton :text="'РЕДАКТИРОВАТЬ'" class="btn_long" />
                <AppGoodButton :text="'УДАЛИТЬ БОТА'" class="btn_long" @click="deleteMngr" />
            </div>
            <div class="conv_style_wrapper m50">
                <h2>Стиль общения: </h2>
                <div class="conv_style">
                    <div 
                        v-for="(item, index) in conv_styles"
                        :key="index"
                        class="conv_style_row"
                    >
                        <div class="conv_style_row_row">
                            <div class="checkbox-wrapper-18">
                                <div class="round">
                                    <input type="checkbox" :id="`checkbox-${index}`" @click="setActiveConvStyle(index + 1)" :checked="active_conv_style == index + 1" />
                                    <label :for="`checkbox-${index}`"></label>
                                </div>
                            </div>
                            <span>{{ item.type }}</span>
                        </div>
                        <div class="conv_style_faq" @click="setInfoShownIndex(index)">?</div>
                        <div v-if="info_shown_index == index" class="conv_style_info_wrapper" :style="{top: `${(index) * 25 + (index) * 15 + 12.5}px`}">
                            <div class="conv_style_info">
                                <img src="@/assets/images/close.png" class="close" @click="closeStyleInfo">
                                <h2>{{ item.type }}</h2>
                                <span><strong>Стиль: </strong>{{ item.style }}</span>
                                <span><strong>Тон: </strong>{{ item.tone }}</span>
                                <span><strong>Язык: </strong>{{ item.lang }}</span>
                                <span><strong>Персонализация: </strong>{{ item.person }}</span>
                                <span><strong>Эмоциональная окраска: </strong>{{ item.emotions }}</span>
                                <span><strong>Цель общения: </strong>{{ item.conv_goals }}</span>
                                <span><strong>Подходит для: </strong>{{ item.specific }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="start_msg m50">
                <h2>Приветственное сообщение</h2>
                <div class="line_wrapper" v-if="isGenerated">
                    <div class="line"></div>
                </div>
                <AppGoodButton :text="'СГЕНЕРИРОВАТЬ'" class="generate_msg_btn" @click="generateHelloMessage"/>
                <textarea class="start_msg_text" v-model="welcome_message"></textarea>
                <div class="start_msg_row_btns">
                    <AppGoodButton :text="'СОХРАНИТЬ'" class="start_msg_row_btn_sm" @click="saveChanges"/>
                    <AppGoodButton :text="'РЕДАКТИРОВАТЬ'" class="start_msg_row_btn_bg" @click="editMsg" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppModal from '@/components/AppModal.vue';
    import { 
        bindBot, 
        createManager, 
        getManager, 
        updateBrief, 
        deleteManager, 
        getHelloMessage 
    } from '@/services/manager';
    import { getBrief } from '@/services/ai';

    export default {
        props: {
            userData: Object,
            managers: Array,
            activeIndex: Number
        },
        components: { AppGoodButton, AppModal },
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
                fio: "",
                year: "",
                label: "",
                description_company: "",
                pros: "",
                description_product: "",
                whats_solve: "",
                characteristics: "",
                price: "",
                audience: "",
                link: "",
                qu: "",
                tg: "",
                type: "",
                welcome_message: "",
                maxSymbols: 10000,
                types: ["Нет", "Линейный маркетинг", "Бинарный маркетинг", "Гибридный маркетинг", "Матрица", "Шахматный маркетинг"],
                isDropdownVisible: false,
                links: [
                    {
                        "link": "",
                        "descr": "",
                        "isNew": false
                    }
                ],
                goals: [
                    {
                        "goal": "",
                        "descr": "",
                        "isNew": false
                    }
                ],
                conv_styles: [
                    {
                        "type": "Эксперт",
                        "style": "Формальный",
                        "tone": "Уважительный",
                        "lang": "Профессиональная терминология (умеренно)",
                        "person": "Обращение на «Вы»",
                        "emotions": "Нейтральный",
                        "conv_goals": "Информационная, продающая (экспертная консультация)",
                        "specific": "B2B, сложные продукты/услуги, где важна экспертность и доверие."
                    },
                    {
                        "type": "Друг",
                        "style": "Неформальный",
                        "tone": "Поддерживающий",
                        "lang": "Простой и понятный, с элементами разговорного",
                        "person": "Обращение на «Ты» (если уместно)",
                        "emotions": "Позитивный, эмпатичный",
                        "conv_goals": "Поддержка, вовлечение, создание лояльности",
                        "specific": "Молодежная аудитория, развлекательный контент, сервисы поддержки клиентов."
                    },
                    {
                        "type": "Профессионал",
                        "style": "Нейтральный",
                        "tone": "Спокойный",
                        "lang": "Стандартный, без сленга и терминов",
                        "person": "Обращение на «Вы»",
                        "emotions": "Безэмоциональный (факты, цифры)",
                        "conv_goals": "Информационная, обработка заявок, решение проблем",
                        "specific": "Широкая аудитория, где важна скорость и точность."
                    }
                ],
                active_conv_style: "1",
                info_shown_index: null,
                isInstructModal: false,
                token: "",
                currManager: null,
                title: null,
                msg: null,
                isModal: false,
                isGenerated: false,
                noAccess: false,
                isLeader: false,
                isCopy: false,
                tg_link: "",
            }
        },
        computed: {
            allSymbols() {
                return this.year.length + this.label.length + this.description_company.length + this.pros.length + this.description_product.length + this.whats_solve.length + this.characteristics.length + this.price.length + this.audience.length + this.link.length + this.qu.length + this.tg.length;
            }
        },
        watch: {
            activeIndex: {
                handler() {
                    this.setBriefFieldsForSwitch();
                },
                immediate: true,
            }
        },
        async created() {
            this.isLeader = this.userData.packages.at(-1).package_name == 'Leader';
            // const managers = await getManagers(this.userData.id);
            // if (managers) {
            //     this.managers = managers;
            // }
            if (this.managers.length > 0) {
                this.currManager = await getManager(this.managers[this.activeIndex].assistant.id);
                this.token = this.currManager.bot_token;
                this.setBriefFieldsForSwitch();
            }
        },
        mounted() {
            document.addEventListener('click', this.handleClickOutside);
        },
        methods: {
            async copyFromBrief() {
                const brief = await getBrief(localStorage.getItem('token'));
                this.pros = brief.competitive_advantages;
                this.description_company = brief.description_company
                this.description_product = brief.description_product;
                this.links = [];
                this.links.push(
                    {
                        "link": brief.link,
                        "descr": "",
                        "isNew": false
                    }
                );
                this.label = brief.name_company;
                this.price = brief.price_policy;
                this.audience = brief.target_audience;
                this.type = brief.type_loyalty_programm;
                this.characteristics = brief.unique_characters_of_product;
                this.whats_solve = brief.what_problems_solve;
                this.year = brief.year_foundation_of_company;
            },
            async copyLink(link) {
                this.isCopy = true;
                console.log(true);
                await navigator.clipboard.writeText(link);
                setTimeout(() => { this.isCopy = false; }, 2000);
            },
            handleClickOutside(event) {
                const clickedEl = event.target;
                if (!clickedEl.closest('.conv_style_info_wrapper') && !clickedEl.closest('.conv_style_faq')) {
                    this.closeStyleInfo();
                }
            },
            openTatiff() {
                this.$emit('openTariff');
            },
            editMsg() {
                const textarea = document.querySelector('textarea.start_msg_text');
                if (!textarea) return;
                textarea.focus();
            },
            Timer(countOfPosts, time) {
                let initialLineWidth = 0; // Начальная ширина полосы загрузки (в пикселях)
                let maxLineWidth = 233; // Максимальная ширина полосы загрузки (в пикселях)
                let totalDuration = time ? time : (Math.ceil(countOfPosts / 7)) * 60 * 1000; // Общее время анимации (3 секунды в миллисекундах)

                let startTime = Date.now(); // Время начала анимации

                function updateProgress() {
                    let lines = document.querySelectorAll('.line');
                    let elapsedTime = Date.now() - startTime;
                    let progress = Math.min(elapsedTime / totalDuration, 1);

                    let newLineWidth = initialLineWidth + (maxLineWidth - initialLineWidth) * progress;
                    lines.forEach(line => line.style.width = `${newLineWidth}px`);

                    if (progress < 1) {
                        requestAnimationFrame(updateProgress);
                    }
                }
                // Запускаем анимацию
                requestAnimationFrame(updateProgress);
            },
            async generateHelloMessage() {
                this.isGenerated = true;
                this.Timer(0, 3000);
                const resp = await getHelloMessage(this.managers[this.activeIndex].assistant.id);
                this.isGenerated = false;
                if (resp) {
                    this.welcome_message = resp.welcome_message;
                } else {
                    this.title = "ОШИБКА!";
                    this.msg = "При генерации приветственного сообщения произошла ошибка.";
                    this.isModal = true;
                }
            },
            async deleteMngr() {
                await deleteManager(this.managers[this.activeIndex].id);
                this.title = "УСПЕШНО!";
                this.msg = "Менеджер был успешно удалён.";
                this.isModal = true;
                setTimeout(() => location.reload(), 1000);
            },
            async saveChanges() {
                this.title = "ОЖИДАНИЕ";
                this.msg = "Подождите немного, пока сохраняются изменения.";
                this.isModal = true;

                if (this.managers.length == 0 || this.activeIndex >= this.managers.length) {
                    await createManager(this.userData.id, this.token, {}, this.active_conv_style, "");
                    // this.managers = await getManagers(this.userData.id);
                    this.$emit('update_managers');
                    this.isModal = true;
                    this.title = "УСПЕШНО";
                    this.msg = "Менеджер был создан и изменения сохранены.";
                    return;
                }
                const brief = this.getBrief();
                console.log(this.managers[this.activeIndex], this.activeIndex, this.managers);
                await updateBrief(this.managers[this.activeIndex].assistant.id, brief, this.active_conv_style, this.welcome_message);

                this.isModal = true;
                this.title = "УСПЕШНО";
                this.msg = "Изменения были успешно внесены.";
            },
            getBrief() {
                return {
                    fio: this.fio,
                    year: this.year,
                    label: this.label,
                    description_company: this.description_company,
                    pros: this.pros,
                    description_product: this.description_product,
                    whats_solve: this.whats_solve,
                    characteristics: this.characteristics,
                    price: this.price,
                    audience: this.audience,
                    link: this.link,
                    qu: this.qu,
                    tg: this.tg,
                    type: this.type,
                    links: JSON.stringify(this.links),
                    goals: JSON.stringify(this.goals),
                    user_filters: JSON.stringify(this.goals.map(item => item.goal))
                };
            },
            setBriefFields() {
                this.fio = this.currManager.brief?.fio || "";
                this.year = this.currManager.brief?.year || "";
                this.label = this.currManager.brief?.label || "";
                this.description_company = this.currManager.brief?.description_company || "";
                this.pros = this.currManager.brief?.pros || "";
                this.description_product = this.currManager.brief?.description_product || "";
                this.whats_solve = this.currManager.brief?.whats_solve || "";
                this.characteristics = this.currManager.brief?.characteristics || "";
                this.price = this.currManager.brief?.price || "";
                this.audience = this.currManager.brief?.audience || "";
                this.link = this.currManager.brief?.link || "";
                this.qu = this.currManager.brief?.qu || "";
                this.tg = this.currManager.brief?.tg || "";
                this.type = this.currManager.brief?.type || "";
                this.welcome_message = this.managers[this.activeIndex]?.assistant?.assistant_config?.welcome_message || "";
                this.links = JSON.parse(this.currManager.brief?.links);
                this.goals = JSON.parse(this.currManager.brief?.goals);
                this.active_conv_style = +this.currManager.brief?.communication_style || 0;
            },
            setBriefFieldsForSwitch() {
                this.fio = this.managers[this.activeIndex]?.assistant.assistant_config?.fio || "";
                this.year = this.managers[this.activeIndex]?.assistant.assistant_config?.year || "";
                this.label = this.managers[this.activeIndex]?.assistant.assistant_config?.label || "";
                this.description_company = this.managers[this.activeIndex]?.assistant.assistant_config?.description_company || "";
                this.pros = this.managers[this.activeIndex]?.assistant.assistant_config?.pros || "";
                this.description_product = this.managers[this.activeIndex]?.assistant.assistant_config?.description_product || "";
                this.whats_solve = this.managers[this.activeIndex]?.assistant.assistant_config?.whats_solve || "";
                this.characteristics = this.managers[this.activeIndex]?.assistant.assistant_config?.characteristics || "";
                this.price = this.managers[this.activeIndex]?.assistant.assistant_config?.price || "";
                this.audience = this.managers[this.activeIndex]?.assistant.assistant_config?.audience || "";
                this.link = this.managers[this.activeIndex]?.assistant.assistant_config?.link || "";
                this.qu = this.managers[this.activeIndex]?.assistant.assistant_config?.qu || "";
                this.tg = this.managers[this.activeIndex]?.assistant.assistant_config?.tg || "";
                this.type = this.managers[this.activeIndex]?.assistant.assistant_config?.type || "";
                this.welcome_message = this.managers[this.activeIndex]?.assistant?.assistant_config?.welcome_message || "";
                this.links = this.managers[this.activeIndex]?.assistant.assistant_config?.links ? JSON.parse(this.managers[this.activeIndex]?.assistant.assistant_config?.links) : [
                    {
                        "link": "",
                        "descr": "",
                        "isNew": false
                    }
                ];
                this.goals = this.managers[this.activeIndex]?.assistant.assistant_config?.goals ? JSON.parse(this.managers[this.activeIndex]?.assistant.assistant_config?.goals) : [
                    {
                        "goal": "",
                        "descr": "",
                        "isNew": false
                    }
                ];
                this.token = this.managers[this.activeIndex]?.bot_token || "";
                this.active_conv_style = +this.managers[this.activeIndex]?.assistant.assistant_config?.communication_style || 1;
                this.tg_link = this.managers[this.activeIndex]?.tg_link || "";
            },
            async bind() {
                this.title = "ОЖИДАНИЕ";
                this.msg = "Подождите немного, пока идёт привязка телеграмм бота.";
                this.isModal = true;

                if (this.managers.length == 0 || this.activeIndex >= this.managers.length) {
                    await createManager(this.userData.id, this.token, {}, this.active_conv_style, "");
                    // this.managers = await getManagers(this.userData.id);
                    this.$emit('update_managers');
                    setTimeout(() => this.setBriefFieldsForSwitch(), 2000);
                    this.title = "УСПЕШНО!";
                    this.msg = "Телеграмм бот был успешно привязан к вашему менеджеру.";
                    this.isModal = true;
                    return;
                }
                const status = await bindBot(this.token, this.managers[this.activeIndex].assistant.id, this.userData.id);
                if (status) {
                    this.setBriefFieldsForSwitch();
                    this.title = "УСПЕШНО!";
                    this.msg = "Телеграмм бот был успешно привязан к вашему менеджеру.";
                    this.isModal = true;
                }
            },
            openInstructModal() {
                this.isInstructModal = true;
            },
            closeInstructModal() {
                this.isInstructModal = false;
            },
            closeStyleInfo() {
                this.info_shown_index = null;
            },
            setInfoShownIndex(index) {
                this.info_shown_index = this.info_shown_index == index ? null : index;
            },
            setActiveConvStyle(style) {
                this.active_conv_style = style;
            },
            addLink(link, index) {
                this.links.splice(index + 1, 0, { type: link.type, link: "", isNew: true });
            },
            removeLink(index) {
                this.links.splice(index, 1);
                this.saveSocial();
            },
            addGoal(goal, index) {
                this.goals.splice(index + 1, 0, { type: goal.type, goal: "", isNew: true });
            },
            removeGoal(index) {
                this.goals.splice(index, 1);
                this.saveSocial();
            },
            // setActive(index) {
            //     this.activeIndex = index;
            //     if (!this.isLeader && index > 0) {
            //         this.noAccess = true;
            //         return;
            //     }
            //     this.noAccess = false;
            //     this.setBriefFieldsForSwitch();
            // },
            validateInput(field) {
                const currentLength = this.allSymbols;

                // Если текущая длина + новая длина превышает лимит, обрезаем ввод
                if (currentLength > this.maxSymbols) {
                    this[field] = this[field].slice(0, this[field].length - (currentLength - this.maxSymbols));
                }
            },
            hideDropdown() {
                this.isDropdownVisible = false;
            },
            selectType(item) {
                this.type = item;
                this.hideDropdown();
            },
        }
    };
</script>

<style scoped>
    .copy_from_ai {
        width: 200px;
        height: 40px;
        font-size: 14px;
        letter-spacing: 0px;
    }
    .no_package {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .no_package img {
        width: 379px;
        height: 379px;
    }
    .no_package h1 {
        font-family: 'OpenSans';
        font-size: 24px;
        color: #FF6666;
        font-weight: bold;
        text-align: center;
    }
    .line_wrapper {
        width: 233px;
        height: 15px;
        border: 1px solid white;
        /* padding: 5px; */
        border-radius: 7.5px;
        position: relative;
        display: flex;
        align-items: center;
        padding: 2.68px;
    }
    .line {
        width: 0px;
        height: 9.64px;
        background: #7023EC;
        transition: .2s ease-in;
        border-radius: 4.8px;   
    }
    .create_btn {
        width: 220px;
    }
    .m50 {
        margin-top: 50px;
    }
    .m30 {
        margin-top: 30px;
    }
    .brief {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .sub_brief {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .managers_switch {
        display: flex;
        column-gap: 21px;
        align-items: center;
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
    h2 {
        color: white;
        font-size: 20px;
        font-family: 'OpenSans';
    }
    .token_row {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin-top: 35px;
    }
    .token_row span {
        color: white;
        font-size: 20px;
        font-family: 'OpenSans';
    }
    .token_input {
        width: 444px;
        height: 50px;
        background: none;
        border: 1px solid white;
        border-radius: 10px;
        font-size: 16px;
        padding-left: 20px;
    } 
    .token_btn {
        width: 150px;
        height: 51px;
    }
    .link_row {
        display: flex;
        align-items: center;
        column-gap: 57px;
        margin-top: 30px;
    }
    .link_row span {
        color: white;
        font-size: 20px;
        font-family: 'OpenSans';
        line-height: 1.5;
    }
    .link_text {
        font-size: 18px !important;
        font-weight: bold;
        text-decoration: underline;
        cursor: pointer;
    }
    .link {
        display: flex;
        column-gap: 10px;
        align-items: center;
        cursor: pointer;
    }
    .link img {
        width: 20px;
        height: 20px;
    }
    .green {
        color: green !important;
        animation: ShowEasy 2s ease-in;
        opacity: 0;
        @media (max-width: 650px) {
            display: none;
        }
    }
    @keyframes ShowEasy {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }

    .container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        column-gap: 50px;
        row-gap: 20px;
        @media (max-width: 650px) {
            grid-template-columns: 1fr;
        }
    }
    .col {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        margin-top: 30px;
        position: relative;
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
        @media (max-width: 650px) {
            height: 50px;
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
        @media (max-width: 650px) {
            height: 160px;
            padding: 10px;
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
        @media (max-width: 650px) {
            font-size: 16px;
        }
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
    .descr_comp {
        margin-top: 35px !important;
    }
    .pros {
        margin-top: 10px;
    }
    .tg {
        margin-top: 25px;
    }
    .h185 {
        height: 185px !important;
    }
    .links {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
        margin-top: 20px;
    }
    .row {
        display: flex;
        column-gap: 30px;
    }
    .row_between {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }
    .links_link {
        width: 280px;
    }
    .links_descr {
        width: 518px;
    }
    .sub_row {
        display: flex;
        align-items: center;
        column-gap: 20px;
        @media (max-width: 650px) {
            column-gap: 15px;
        }
    }
    .sub_row img {
        width: 35px;
        object-fit: contain;
        cursor: pointer;
        @media (max-width: 650px) {
            width: 39px;
            height: auto;
        }
    }
    .btns_row {
        display: flex;
        justify-content: space-between;
        margin-top: 50px;
    }
    .btn_long {
        width: 260px;
        height: 51px;
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
    .conv_style_wrapper {
        display: flex;
        column-gap: 30px;
    }
    .conv_style {
        display: flex;
        flex-direction: column;
        row-gap: 15px;
        position: relative;
    }
    .conv_style_row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 210px;
    }
    .conv_style_row_row {
        display: flex;
        column-gap: 10px;
        align-items: center;
    }
    .conv_style_row_row span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .conv_style_faq {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #2F3251;
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .start_msg {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    .start_msg span {
        color: white;
        font-size: 18px;
        font-family: 'OpenSans';
    }
    .generate_msg_btn {
        width: 260px;
        height: 51px;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .start_msg_text {
        width: 100%;
        height: 210px;
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
        @media (max-width: 650px) {
            height: 160px;
            padding: 10px;
        }
    }
    .start_msg_row_btns {
        display: flex;
        column-gap: 20px;
        margin-top: 10px;
    }
    .start_msg_row_btn_sm {
        width: 200px;
        height: 51px;
    }
    .start_msg_row_btn_bg {
        width: 250px;
        height: 51px;
    }
    .conv_style_info_wrapper {
        position: absolute;
        right: -420px;
        top: 0;
        z-index: 890;
    }
    .conv_style_info {
        position: relative;
        background-color: #1b1e3c;
        color: white;
        padding: 19px 20px;
        border-radius: 0 12px 12px 12px;
        width: 370px;
        font-family: 'OpenSans';
        font-size: 12px;
        display: flex;
        flex-direction: column;
        row-gap: 5px;
    }
    .conv_style_info h2 {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
        margin-bottom: 9px;
    }
    .close {
        position: absolute;
        width: 14px;
        height: 14px;
        right: 15px;
        top: 15px;
        cursor: pointer;
    }

    .conv_style_info::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 40px;
        height: 40px;
        background-color: #1b1e3c;
        clip-path: polygon(0 0, 100% 100%, 0 100%);
        transform: translate(-100%, 0) rotate(180deg);
    }
    .instruc_modal_wrapper {
        width: 100vw;
        height: 100vh;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 900;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .instruct_modal {
        width: 919px;
        height: 250px;
        border-radius: 10px;
        position: relative; /* Обеспечиваем позиционирование для псевдоэлемента */
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 50px;
        z-index: 2;
        overflow-y: auto;
        scrollbar-width: none;
        /* row-gap: 20px; */
        box-sizing: border-box;
        margin-top: -50px;
        align-self: center;
        background: #1B1E3D;
        border-radius: 10px;
        row-gap: 20px;
        @media (max-width: 1400px) {
            width: 80vw;
        }
        @media (max-width: 650px) {
            width: 90vw;
            padding: 30px 15px;
        }
    }

    .instruct_modal::-webkit-scrollbar {
        width: 0;  
        height: 0;
    }

    .instruct_modal::-webkit-scrollbar-thumb {
        background: transparent;
    }
    .instruct_modal span, .instruct_modal h2 {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }

    .instruc_modal_close {
        position: absolute;
        right: 50px;
        top: 30px;
        width: 21px;
        height: 21px;
        cursor: pointer;
        @media (max-width: 450px) {
            right: 20px;
            top: 20px;
        }
    }

</style>