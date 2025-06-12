<template>
    <AppAiEditor 
        v-if="isEditor" 
        :imageSrc="aiEditorLink"
        @update:visibility1="isEditor = $event"
        @update:save="updateImage($event, indexEdit, isCustomEdit)"
    />
    <AppModalGenerator 
        v-if="isModalGenerator" 
        :userData="userData"
        :isSecond="isSecond"
        :visibility1="isModalGenerator"
        @update:visibility1="isModalGenerator = $event"
    />
    <AppModalGeneratorPayment 
        v-if="isModalGeneratorPayment" 
        :userData="userData"
        :visibility1="isModalGeneratorPayment"
        :bannerAmount="diff"
        :payment="payment"
        @update:visibility1="isModalGeneratorPayment = $event"
        @success_payment="successPayment"
        @bad_payment="badPayment"
    />
    <div class="modal_wrapper" v-if="isBanner">
        <div class="modal" :style="{ position: isChangePosition ? 'static' : 'relative' }">
            <img src="@/assets/images/close.png" class="close" @click="closeBanner">
            <AppAiBanner 
                :userData="userData" 
                :isBanner="true" 
                @confirm="confirmImage"
                @changePosition="changePosition"
            />
        </div>
    </div>
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
            <div class="row" v-if="windowWidth > 1000" style="margin-top: 50px; margin-bottom: 44px;">
                <AppGoodButton :text="text1" @click="saveSettings"/>
                <AppGoodButton :text="text2" @click="editSettings" />
                <AppGoodButton :text="text3" @click="generateThemes" />
            </div>  
            <div class="mob_btns" v-if="windowWidth <= 1000">   
                <div class="mob_btns_row">
                    <AppGoodButton class="mob_btn" :text="text1" @click="saveSettings"/>
                    <AppGoodButton class="mob_btn" :text="text2" @click="editSettings" />
                </div>
                <AppGoodButton class="mob_btn" :text="text3" @click="generateThemes" />
            </div>
            <div class="generations_wrapper" v-if="testers.indexOf(userData.vk_id) != -1">
                <span class="generations_item" @click="openGeneratorModal(false)">
                    Генерация баннеров: {{ generations?.free.remains }} / {{ generations?.free.total }}
                </span>
                <span class="generations_item" @click="openGeneratorModal(true)">
                    Пакет генераций: {{ generations?.paid.remains }} / {{ generations?.paid.total }}
                </span>
            </div>
            <input type="checkbox" v-if="windowWidth <= 1000" v-model="allCheckboxes" style="margin-bottom: 20px;">
            <div class="table_container_mob" v-if="windowWidth <= 1000">
                <div class="table_mob">
                    <div class="table_item_mob" v-for="(item, index) in plan" :key="index">
                        <input type="checkbox" v-model="aprovedPostsIndexes[index]" :checked="allCheckboxes" style="margin-bottom: 20px;">
                        <div class="table_item_mob_content">
                            <span>День: {{ index + 1 }}</span>
                            <span v-if="step >= 0">Тема: </span>
                            <div class="line_wrapper" v-if="(isLoading && step == 0 && !isRegenerate) || (isRegenerate && step == 1)">
                                <div class="line"></div>
                            </div>
                            <span v-if="!(isLoading && step == 0)" :contenteditable="isEditable">{{ item?.topic_name }}</span>

                            <span v-if="step >= 2">Пост: </span>
                            <div class="line_wrapper" v-if="(isLoading && step == 1 && !isRegenerate) || (isRegenerate && step == 2)">
                                <div class="line"></div>
                            </div>
                            <span v-if="!(isLoading && step == 0)" :contenteditable="isEditable" v-html="formatedPost(item?.post_text[item.chose_post_index])"></span>
                            <div class="plan_item_variants" v-if="!(isLoading && step == 0) && step >= 2">
                                <AppGoodButton 
                                    v-for="(name, index_var) in variants.slice(0, item.post_text.length)" 
                                    :key="index_var" 
                                    :text="name" 
                                    class="variant_btn" 
                                    :class="{ not_active: index_var !== plan[index].chose_post_index }"
                                    @click="setActivePostVar(index_var, index)"
                                />
                            </div>

                            <span v-if="step >= 3">Баннер: </span>
                            <div class="line_wrapper" v-if="(isLoading && step == 2 && !isRegenerate) || (isRegenerate && step > 2)">
                                <div class="line"></div>
                            </div>
                            <img v-if="!(isLoading && step == 0)" :src="flagsImages[index] ? item.custom_image_url : item?.image_links[item.chose_image_index || 0]" class="banner" />
                            <div class="plan_item_variants" v-if="!(isLoading && step == 0) && step >= 3">
                                <AppGoodButton 
                                    :text="user_photo"
                                    v-if="step >= 3 && !isLoading"
                                    class="not_active variant_btn"
                                    @click="getUserImage(item, index)"
                                />
                                <AppGoodButton 
                                    v-for="(name, index_var) in variants.slice(0, item.image_links.length)" 
                                    :key="index_var" 
                                    :text="name" 
                                    class="variant_btn"
                                    :class="{ 
                                        not_active: index_var !== (plan[index].chose_image_index || 0),
                                        big_variant_btn: index_var > 1
                                    }"
                                    @click="setActiveImageVar(index_var, index)"
                                />
                                <AppGoodButton 
                                    :text="user_label(item)" 
                                    class="variant_btn"
                                    v-if="item.custom_image_url != ''"
                                    :class="{ not_active: plan[index].chose_image_index !== 3 }"
                                    @click="setUserImage(index)"
                                />
                                <input 
                                    type="file" 
                                    :ref="'fileInput_' + index"
                                    @change="handleFileUpload"
                                    accept="image/*"
                                    style="display: none;"
                                />
                                <!-- <img src="@/assets/images/addPlus.png" class="addImageBtn" @click="getUserImage(item, index)" /> -->
                            </div>
                            <div class="banner_tools" v-if="!(isLoading && step == 0) && step >= 3">
                                <div class="editor" v-if="testers.indexOf(userData.vk_id) != -1" @click="openEditor(flagsImages[index] ? item.custom_image_url : item?.image_links[item.chose_image_index || 0], flagsImages[index], index)">
                                    <img src="@/assets/images/pen.png" />
                                    <span>Редактор</span>
                                </div>
                                <div class="bannerAi" v-if="testers.indexOf(userData.vk_id) != -1" @click="openBanner(index)">
                                    <img src="@/assets/images/banner.png" />
                                    <span>ИИ Баннер</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="table_container" v-if="windowWidth > 1000">
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
                                <div class="line_wrapper" v-if="(isLoading && step == 0 && !isRegenerate) || (isRegenerate && step == 1)">
                                    <div class="line"></div>
                                </div>
                                <span v-if="!(isLoading && step == 0)" :contenteditable="isEditable">{{ item?.topic_name }}</span>
                            </td>
                            <td class="plan_item">
                                <div class="line_wrapper" v-if="(isLoading && step == 1 && !isRegenerate) || (isRegenerate && step == 2)">
                                    <div class="line"></div>
                                </div>
                                <span v-if="!(isLoading && step == 0)" :contenteditable="isEditable" v-html="formatedPost(item?.post_text[item.chose_post_index])"></span>
                                <div class="plan_item_variants" v-if="!(isLoading && step == 0)">
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
                                <div class="line_wrapper" v-if="(isLoading && step == 2 && !isRegenerate) || (isRegenerate && step > 2)">
                                    <div class="line"></div>
                                </div>
                                <img v-if="!(isLoading && step == 0)" :src="flagsImages[index] ? item.custom_image_url : item?.image_links[item.chose_image_index || 0]" class="banner" />
                                <div class="plan_item_variants" v-if="!(isLoading && step == 0)">
                                    <!-- <img src="@/assets/images/addPlus.png" v-if="step >= 2 && !isLoading" class="addImageBtn" @click="getUserImage(item, index)" /> -->
                                    <AppGoodButton 
                                        :text="user_photo"
                                        v-if="step >= 3 && !isLoading"
                                        class="not_active variant_btn"
                                        @click="getUserImage(item, index)"
                                    />
                                    <AppGoodButton 
                                        v-for="(name, index_var) in variants.slice(0, item.image_links.length)" 
                                        :key="index_var" 
                                        :text="name" 
                                        class="variant_btn"
                                        :class="{ 
                                            not_active: index_var !== (plan[index].chose_image_index || 0),
                                            big_variant_btn: index_var > 1
                                        }"
                                        @click="setActiveImageVar(index_var, index)"
                                    />
                                    <AppGoodButton 
                                        :text="user_label(item)" 
                                        class="variant_btn"
                                        v-if="item.custom_image_url != ''"
                                        :class="{ not_active: plan[index].chose_image_index !== 3 }"
                                        @click="setUserImage(index)"
                                    />
                                    <input 
                                        type="file" 
                                        :ref="'fileInput_' + index"
                                        @change="handleFileUpload"
                                        accept="image/*"
                                        style="display: none;"
                                    />
                                </div>
                                <div class="banner_tools" v-if="!(isLoading && step == 0) && step >= 3">
                                    <div class="editor" v-if="testers.indexOf(userData.vk_id) != -1" @click="openEditor(flagsImages[index] ? item.custom_image_url : item?.image_links[item.chose_image_index || 0], flagsImages[index], index)">
                                        <img src="@/assets/images/pen.png" />
                                        <span>Редактор</span>
                                    </div>
                                    <div class="bannerAi" v-if="testers.indexOf(userData.vk_id) != -1" @click="openBanner(index)">
                                        <img src="@/assets/images/banner.png" />
                                        <span>ИИ Баннер</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <span v-if="isLoading">Подождите, пока закончится генерация.</span>
            <div class="row" v-if="windowWidth > 1000" style="margin-top: 50px; margin-bottom: 44px;">
                <AppGoodButton :text="text4" @click="confirmCurrentPosts" />
                <AppGoodButton :text="text5" @click="regenerateCurrentPosts" />
                <AppGoodButton :text="text6" @click="editInfo" />
            </div>
            <div class="mob_btns" v-if="windowWidth <= 1000">
                <div class="mob_btns_row">
                    <AppGoodButton class="mob_btn" :text="text4" @click="confirmCurrentPosts" />
                    <AppGoodButton class="mob_btn" :text="text5" @click="regenerateCurrentPosts" />
                </div>
                <AppGoodButton class="mob_btn" :text="text6" @click="editInfo" />
            </div>
        </div>

        <div class="table_container_mob" v-if="activeIndex == 1 && windowWidth <= 1000">
            <div class="table_mob">
                <input type="checkbox" v-model="allCheckboxesContent">
                <div class="table_item_mob" v-for="(item, index) in fileredPlan" :key="index">
                    <input 
                        v-if="item.date_publication" 
                        type="checkbox" 
                        v-model="aprovedPostsIndexes[index]" 
                        :checked="allCheckboxes" 
                        style="margin-bottom: 20px;"
                    />
                    <div class="table_item_mob_content" v-if="item.date_publication">
                        <span>День: {{ index + 1 }}</span>
                        <span>Тема: </span>
                        <span>{{ item?.topic_name }}</span>

                        <span>Пост: </span>
                        <span v-html="formatedPost(item?.post_text[item.chose_post_index])"></span>

                        <span>Баннер: </span>
                        <img :src="flagsImages[index] ? item.custom_image_url : item?.image_links[item.chose_image_index]" class="banner" />

                        <span>Дата / время публикации: </span>

                        <!-- Поле для даты -->
                        <span
                            class="content_text date"
                            :contenteditable="isEditableContent"
                            :ref="'editableDate_' + index"
                            @input="updateSelectedDate(index, 'date')"
                        >{{ formatDateOnly(item.date_publication * 1000) }}</span>
                        <!-- Поле для времени -->
                        <span
                            class="content_text time"
                            :contenteditable="isEditableContent"
                            :ref="'editableTime_' + index"
                            @input="updateSelectedDate(index, 'time')"
                        >{{ formatTimeOnly(item.date_publication * 1000) }}</span>
                        <!-- Кнопка "Изменить" -->
                        <span class="change_text" @click="changeEditableContent">{{ isEditableContent ? "Отменить" : "Изменить" }}</span>
                        <!-- Кнопка сохранения -->
                        <AppGoodButton v-if="isEditableContent" :text="text8" class="sm_btn" @click="savePlan(index)" />
                        <!-- Ошибка ввода -->
                        <span class="error" v-if="badDate">Неправильный формат даты/времени.</span>

                        <!-- <span
                            class="content_text"
                            :contenteditable="isEditableContent"
                            :ref="'editableDate_' + index"
                            @input="updateSelectedDate"
                        >{{ formatedDate(item.date_publication * 1000) }}</span>
                        <span class="change_text" @click="changeEditableContent">{{ isEditableContent ? "Отменить" : "Изменить" }}</span>
                        <AppGoodButton v-if="isEditableContent" :text="text8" class="sm_btn" @click="savePlan(index)" />
                        <span class="error" v-if="badDate">Неправильный формат даты. Введите дату в формате: 01.01.2000 12:00</span> -->
                    </div>
                </div>
            </div>
        </div>

        <div class="table_container">
            <div class="content" v-if="activeIndex == 1 && windowWidth > 1000">
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
                        <tr v-for="(item, index) in fileredPlan" :key="index">
                            <td v-if="item.date_publication">
                                <input 
                                    v-if="item.date_publication" 
                                    type="checkbox" 
                                    v-model="aprovedPostsIndexes[index]" 
                                    :checked="allCheckboxesContent" 
                                />
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
                                <img class="accepted_banner" :src="flagsImages[index] ? item.custom_image_url : item?.image_links[item.chose_image_index]" />
                            </td>
                            <td class="col" v-if="item.date_publication">
                                <!-- Поле для даты -->
                                <span
                                    class="content_text date"
                                    :contenteditable="isEditableContent"
                                    :ref="'editableDate_' + index"
                                    @input="updateSelectedDate(index, 'date')"
                                >{{ formatDateOnly(item.date_publication * 1000) }}</span>

                                <!-- Поле для времени -->
                                <span
                                    class="content_text time"
                                    :contenteditable="isEditableContent"
                                    :ref="'editableTime_' + index"
                                    @input="updateSelectedDate(index, 'time')"
                                >{{ formatTimeOnly(item.date_publication * 1000) }}</span>

                                <!-- Кнопка "Изменить" -->
                                <span class="change_text" @click="changeEditableContent">{{ isEditableContent ? "Отменить" : "Изменить" }}</span>

                                <!-- Кнопка сохранения -->
                                <AppGoodButton v-if="isEditableContent" :text="text8" class="sm_btn" @click="savePlan(index)" />

                                <!-- Ошибка ввода -->
                                <span class="error" v-if="badDate">Неправильный формат даты/времени.</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
            </div>
        </div>
        <span class="info_msg" v-if="isLoading && activeIndex == 1">Отправляем посты. После отправки, вы сможете их найти в разделе "Отложенные посты". </span>
        <span class="info_msg" v-if="isPostPubl && activeIndex == 1">Посты были успешно отправлены.</span>
        <span class="error" v-if="publPostsError && activeIndex == 1">При отправке постов произошла ошибка. Пожалуйста, нажмите кнопку "ОПУБЛИКОВАТЬ" ещё раз.</span>
        <AppGoodButton class="publ_btn" v-if="isContentPlan && fileredPlan.length > 0 && !isLoading && activeIndex == 1 && !isPostPubl" :text="text7" @click="publicate" />
    </section>
    
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import AppAiEditor from "@/components/AppAiEditor.vue";
    import { 
        sendBrief, 
        getBrief, 
        updateBrief, 
        getContentPlan, 
        generateTopics, 
        generatePostsText, 
        regenerateThemes, 
        generateBanners, 
        regeneratePosts, 
        updateContentPlan, 
        regenerateBanners, 
        acceptPlan,
        uploadUserImage,
        getGenerations,
        writeOffGenerations
    } from "@/services/ai";
    import { sendPosting } from "@/services/user";
    import { getConfig } from "@/services/config";
    import AppModalGenerator from "@/components/AppModalGenerator.vue";
    import AppModalGeneratorPayment from "@/components/AppModalGeneratorPayment.vue";
    import AppAiBanner from '@/components/AppAiBanner.vue';

    export default {
        components: { AppGoodButton, AppAiEditor, AppModalGenerator, AppModalGeneratorPayment, AppAiBanner },
        props: {
            windowWidth: Number,
            userData: Object
        },
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
                text7: "ОПУБЛИКОВАТЬ",
                text9: "УДАЛИТЬ",
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
                isRegenerate: false,
                step: -1,
                currBanners: [],
                currTexts: [],
                variants: ["ВАРИАНТ 1", "ВАРИАНТ 2", "ВАРИАНТ 3", "ВАРИАНТ 4"],
                result: [],
                badDate: false,
                maxSymbols: 10000,
                isDropdownVisible: false,
                types: ["Нет", "Линейный маркетинг", "Бинарный маркетинг", "Гибридный маркетинг", "Матрица", "Шахматный маркетинг"],
                isPostPubl: false,
                selectedDate: null,
                currPostToChangeImage: null,
                flagsImages: [],
                publPostsError: false,
                isEditor: false,
                aiEditorLink: "",
                testers: null,
                isCustomEdit: false,
                indexEdit: null,
                user_photo: "ВАШЕ ФОТО",
                generations: null,
                isModalGenerator: false,
                isSecond: false,
                diff: null,
                payment: null,
                isModalGeneratorPayment: false,
                backupPlan: null,
                checkedPlan: null,
                isReg: false,
                isBanner: false,
                bannerIndex: null,
                isChangePosition: false
            }
        },
        watch: {
            isSaved(status) {
                if (status) {
                    setTimeout(() => this.isSaved = false, 1100);
                }
            },
            allCheckboxesContent(newVal) {
                // Если отмечен "Выбрать все", обновляем массив чекбоксов
                this.aprovedPostsIndexes = Array.from({ length: this.plan.length }, () => newVal);
                console.log(this.aprovedPostsIndexes, newVal);
            },
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
            this.flagsImages =  Array.from({ length: this.plan.length }, () => false);
            this.plan.forEach((item, index) => {
                this.flagsImages[index] = item.custom_image_url != '';
                if (this.flagsImages[index]) this.plan[index].chose_image_index = 3;    
            });
            console.log(this.flagsImages);
            
            this.step = this.getStep();
            console.log("ШАГ", this.step);

            const testers = await getConfig("testers_for_cropper", localStorage.getItem("token"));
            this.testers = testers.ids;

            const gener = await getGenerations(this.userData.id);
            this.generations = gener;
        },
        computed: { 
            user_label() {
                return (item) => {
                    return this.variants[item.image_links.length];
                };
            },
            isContentPlan() {
                return this.plan.filter(item => item?.date_publication).length > 0;
            },
            isBlockGenerate() {
                return this.plan.filter(item => item.is_published).length > 0
            },
            fileredPlan() {
                return this.plan.filter(item => !item.is_published);
            },
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
            changePosition() {
                this.isChangePosition = !this.isChangePosition;
            },
            async confirmImage(link) {
                this.closeBanner();
                this.indexEdit = this.bannerIndex;
                this.isCustomEdit = true;
                await this.updateImage(link);
                await updateContentPlan(this.plan, localStorage.getItem("token"));
            },
            openBanner(index) {
                this.isBanner = true;
                this.bannerIndex = index;
            },
            closeBanner() {
                this.isBanner = false;
            },
            openGeneratorModal(flag) {
                this.isSecond = flag;
                this.isModalGenerator = true;
            },
            async updateImage(link) {
                let file;

                if (link.startsWith("data:image")) {
                    // Convert base64 to Blob
                    const contentType = link.split(';')[0].split(':')[1]; // Extract content type (e.g., "image/png")
                    file = this.base64ToBlob(link, contentType);
                    console.log("я тут");
                } else {
                    try {
                        const response = await fetch(link);
                        if (!response.ok) {
                            throw new Error(`Ошибка загрузки изображения: ${response.status}`);
                        }

                        const blob = await response.blob();
                        file = blob; // именно Blob, не URL
                        console.log("я тут2");
                    } catch (error) {
                        console.error('Ошибка при скачивании изображения:', error);
                        return; // остановить выполнение, если ошибка
                    }
                }

                // Теперь `file` гарантированно готов к использованию
                if (this.isCustomEdit) {
                    console.log("я тут3");
                    this.plan[this.indexEdit].custom_image_url = link;
                    const resp = await uploadUserImage(this.plan[this.indexEdit].topic_id, file, localStorage.getItem("token"));
                    this.plan = resp;
                } else {
                    console.log("я тут4");
                    await updateContentPlan(this.plan, localStorage.getItem("token"));
                    this.plan[this.indexEdit].image_links[this.plan[this.indexEdit].chose_image_index || 0] = link;
                    console.log(this.plan);
                    const resp = await uploadUserImage(
                        this.plan[this.indexEdit].topic_id,
                        file,
                        localStorage.getItem("token"),
                        this.plan[this.indexEdit].chose_image_index || 0
                    );
                    this.plan = resp;
                    console.log(this.plan);
                }
            },

            base64ToBlob(base64String, contentType = '', sliceSize = 512) {
                const byteCharacters = atob(base64String.split(',')[1]); // Remove the "data:image/png;base64," prefix
                const byteArrays = [];

                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    const slice = byteCharacters.slice(offset, offset + sliceSize);

                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    const byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }

                return new Blob(byteArrays, { type: contentType });
            },
            openEditor(link, isCustom, index) {
                this.isEditor = true;
                this.aiEditorLink = link;
                this.isCustomEdit = isCustom; // является ли фотография загруженной пользователем
                this.indexEdit = index; // индекс редактируемой фотографии
            },
            formatDateOnly(time) {
                const date = new Date(time);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}.${month}.${year}`;
            },
            formatTimeOnly(time) {
                const date = new Date(time);
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${hours}:${minutes}`;
            },
            setUserImage(index) {
                this.flagsImages[index] = true;
                this.plan[index].chose_image_index = 3;
            },
            getUserImage(post, index) {
                const fileInputRef = this.$refs['fileInput_' + index];
                console.log(fileInputRef);
                if (fileInputRef) {
                    fileInputRef[0].click();
                }
                this.currPostToChangeImage = post;
            },
            async handleFileUpload(event) {
                const file = event.target.files[0];
                if (!file) return;

                const maxSize = 2 * 1024 * 1024;
                if (file.size > maxSize) {
                    alert("Файл слишком большой! Максимальный размер файла: 2 МБ.");
                    return;
                }

                const img = new Image();
                img.src = URL.createObjectURL(file);
                img.onload = async () => {
                    const formData = new FormData();
                    formData.append("img_form_data ", file);
                    const resp = await uploadUserImage(this.currPostToChangeImage.topic_id, file, localStorage.getItem("token"));
                    this.plan = resp;
                    this.plan.forEach((item, index) => {
                        this.flagsImages[index] = item.custom_image_url && item.custom_image_url != '';
                        if (this.flagsImages[index]) this.plan[index].chose_image_index = 3;
                    });
                };
            },
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
                this.step = this.getStep();
                this.backupPlan = this.plan;
                const filtered = this.allCheckboxes ? this.plan : this.plan.filter((_, index) => this.aprovedPostsIndexes[index]);
                if (filtered.length > 0) {
                    this.plan = filtered;
                    this.aprovedPostsIndexes = Array.from({ length: this.plan.length }, () => false);
                    this.allCheckboxes = false;
                    this.isLoading = true;
                    const param = this.step == 0 || this.step == 1 ? 20000 : 0;
                    this.Timer(this.plan.length, param);

                    console.log(this.step);
                    if (this.step == 1) {
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
                    } else if (this.step == 2) {
                        try {
                            this.plan.forEach(item => {
                                if (!item.chose_post_index) item.chose_post_index = 0;
                            });
                            await updateContentPlan(this.plan, localStorage.getItem("token"));

                            if (this.plan.length > this.generations.free.remains + this.generations.paid.remains) {
                                this.diff = this.plan.length - this.generations.free.remains - this.generations.paid.remains;
                                this.payment = this.diff * 0.6;
                                this.isModalGeneratorPayment = true;
                                this.isLoading = false;
                                return;
                            }
                            // проверяю что длина плана <= generations.free.remains + generations.paid.remains
                            // если нет, то считаем: кол-во превышенных генераций, сумма оплаты
                            // оплата: произвоидим оплату, если успешно, то генерация
                            // если отмена или крестик, то plan = backup  и return

                            let resp = await generateBanners(this.plan, localStorage.getItem("token"));
                            if (!resp) resp = await generateBanners(this.plan, localStorage.getItem("token"));
                            if (resp) {
                                await writeOffGenerations(this.userData.vk_id, this.plan.length);
                                const gener = await getGenerations(this.userData.id);
                                this.generations = gener;
                            }
                            this.plan = resp;
                            this.plan.forEach(item => {
                                item.chose_image_index = 0;
                            });
                            await updateContentPlan(this.plan, localStorage.getItem("token"));
                            this.step = this.getStep();
                        } catch(err) {
                            console.error(err);
                        }
                    } else if (this.step > 2) {
                        try {
                            this.plan.forEach(item => {
                                item.is_accept_pairs = true;
                                if (item.chose_image_index != 0 && !item.chose_image_index) item.chose_image_index = 0;
                            });
                            let resp = await acceptPlan(this.plan, localStorage.getItem("token"));
                            if (!resp) resp = await acceptPlan(this.plan, localStorage.getItem("token"));
                            this.plan = resp;
                            this.activeIndex = 1;
                        } catch(err) {
                            console.error(err);
                        }
                        
                    }

                    this.isLoading = false;
                }
            },
            async successPayment() {
                this.isLoading = true;
                if (this.isReg) this.isRegenerate = true;
                this.isModalGeneratorPayment = false;
                this.diff = null;
                this.payment = null;
                const gener = await getGenerations(this.userData.id);
                this.generations = gener;

                if (this.isReg) {
                    this.checkedPlan.forEach(item => {
                        item.chose_image_index++;
                    });
                    const topics = await regenerateBanners(this.checkedPlan, localStorage.getItem("token"));
                    if (topics) {
                        await writeOffGenerations(this.userData.vk_id, this.checkedPlan.length);
                        const gener = await getGenerations(this.userData.id);
                        this.generations = gener;
                    } 
                    this.plan = topics;
                    this.currBanner++;
                } else {
                    let resp = await generateBanners(this.plan, localStorage.getItem("token"));
                    if (!resp) resp = await generateBanners(this.plan, localStorage.getItem("token"));
                    if (resp) {
                        await writeOffGenerations(this.userData.vk_id, this.plan.length);
                        const gener = await getGenerations(this.userData.id);
                        this.generations = gener;
                    }
                    this.plan = resp;
                    this.plan.forEach(item => {
                        item.chose_image_index = 0;
                    });
                }
                
                await updateContentPlan(this.plan, localStorage.getItem("token"));
                this.isLoading = false;
                this.isReg = false;
                this.isRegenerate = false;
                this.checkedPlan = null;
                this.step = this.getStep();
            },
            badPayment() {
                this.isModalGeneratorPayment = false;
                this.plan = this.isReg ? this.plan : this.backupPlan;
                this.backupPlan = null;
                this.checkedPlan = null;
                this.isReg = false;
                this.step = this.getStep();
            },
            setActive(index) {
                this.activeIndex = index;
            },
            setActivePostVar(var_index, post_index) {
                this.plan[post_index].chose_post_index = var_index;
            },
            setActiveImageVar(var_index, post_index) {
                this.flagsImages[post_index] = false;
                this.plan[post_index].chose_image_index = var_index;
            },
            async savePlan(index) {
                const editableElementDate = this.$refs['editableDate_' + index];
                const editableElementHours = this.$refs['editableTime_' + index];

                if (!editableElementDate || !editableElementHours) {
                    console.error("Редактируемый элемент не найден");
                    return;
                }

                const editedDate = editableElementDate[0].innerText.trim() + " " + editableElementHours[0].innerText.trim();
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
                this.saveSelectedDates();

                const resp = await updateContentPlan(this.plan, localStorage.getItem("token"));
                if (resp == 200) {
                    this.isEditableContent = false;
                    this.aprovedPostsIndexes = Array.from({ length: this.plan.length }, () => false);
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
                if (this.isBlockGenerate) return;
                this.step = 0;
                this.saveSettings();
                this.isLoading = true;
                this.Timer(this.plan.length, 20000);

                const topics = await generateTopics(localStorage.getItem("token"));
                this.plan = topics;
                // this.step++;

                this.isLoading = false;
            },
            changeEditableContent() {
                this.isEditableContent = !this.isEditableContent;
                // if (!this.isEditableContent) {
                //     console.log("SAVED!!!!!");
                //     // При выходе из режима редактирования сохраняем значение
                //     this.saveSelectedDates();
                // }
            },
            saveSelectedDates() {
                const selectedIndexes = this.aprovedPostsIndexes.reduce((acc, isChecked, index) => {
                    if (isChecked) acc.push(index);
                    return acc;
                }, []);

                selectedIndexes.forEach(index => {
                    const dateElement = this.$refs[`editableDate_${index}`]?.[0];
                    const timeElement = this.$refs[`editableTime_${index}`]?.[0];

                    if (dateElement && timeElement && this.selectedTime) {
                        const currentDateString = dateElement.textContent.trim();
                        const newTimestamp = this.convertToTimestamp(currentDateString + " " + this.selectedTime);

                        if (newTimestamp) {
                            this.plan[index].date_publication = newTimestamp;
                            timeElement.textContent = this.selectedTime;
                        } else {
                            this.badDate = true;
                        }
                    }
                });

                console.log(this.plan);
                this.badDate = false; // Сбрасываем флаг ошибки
            },
            parseDate(dateString) {
                const date = new Date(dateString);
                console.log(date, date.getTime());
                if (isNaN(date.getTime())) {
                    this.badDate = true;
                    return null;
                }
                return Math.floor(date.getTime() / 1000); // Возвращаем в секундах
            },
            updateSelectedDate(index, type) {
                const editableElement = this.$refs[`editable${type.charAt(0).toUpperCase() + type.slice(1)}_${index}`]?.[0];
                if (!editableElement) return;

                const newValue = editableElement.innerText.trim();

                if (type === "date") {
                    // Обновляем только дату для текущего элемента
                    // const newTimestamp = this.convertToTimestamp(newValue + " " + this.formatTimeOnly(this.plan[index].date_publication * 1000));
                    // if (newTimestamp) {
                    //     this.plan[index].date_publication = newTimestamp;
                    // } else {
                    //     this.badDate = true;
                    // }
                    this.selectedDate = newValue;
                } else if (type === "time") {
                    // Обновляем время для всех выбранных элементов
                    this.selectedTime = newValue; // Сохраняем выбранное время
                }
            },
            async regenerateCurrentPosts() {
                this.step = this.getStep();
                this.isLoading = true;
                this.isRegenerate = true;

                const param = this.step == 0 || this.step == 1 || this.step == 2 ? 20000 : 0;
                this.Timer(this.plan.length, param);

                const checked_plan = this.allCheckboxes ? this.plan : this.plan.filter((_, index) => this.aprovedPostsIndexes[index]);
                const max_text = Math.max(...this.countsOfTexts);
                const max_banners = Math.max(...this.countsOfBanners);
                this.aprovedPostsIndexes = Array.from({ length: this.plan.length }, () => false);
                this.allCheckboxes = false;
                console.log(this.step);
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
                        if (checked_plan.length > this.generations.free.remains + this.generations.paid.remains) {
                            this.diff = checked_plan.length - this.generations.free.remains - this.generations.paid.remains;
                            this.payment = this.diff * 0.6;
                            this.isModalGeneratorPayment = true;
                            this.isLoading = false;
                            this.isRegenerate = false;
                            this.isReg = true;
                            this.checkedPlan = checked_plan;
                            console.log("checked_plan", checked_plan);
                            return;
                        }
                        checked_plan.forEach(item => {
                            item.chose_image_index++;
                        });
                        const topics = await regenerateBanners(checked_plan, localStorage.getItem("token"));
                        if (topics) {
                            await writeOffGenerations(this.userData.vk_id, checked_plan.length);
                            const gener = await getGenerations(this.userData.id);
                            this.generations = gener;
                        } 
                        this.plan = topics;
                        this.currBanner++;
                    } catch(err) {
                        console.error(err);
                    }
                }

                this.isLoading = false;
                this.isRegenerate = false;
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
                const date = new Date(time);

                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');

                return `${day}.${month}.${year} ${hours}:${minutes}`;
            },
            convertToTimestamp(dateTimeString) {
                console.log(dateTimeString);
                const [datePart, timePart] = dateTimeString.split(" ");
                const [day, month, year] = datePart.split(".").map(Number);
                const [hours, minutes] = timePart.split(":").map(Number);

                const date = new Date(year, month - 1, day, hours, minutes);
                if (isNaN(date.getTime())) {
                    console.error("Неверный формат даты/времени:", dateTimeString);
                    return null;
                }

                return Math.floor(date.getTime() / 1000); // Возвращаем timestamp в секундах
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
        async publicate() {
            if (this.isLoading) return;
            this.isLoading = true;
            try {
                const resp = await sendPosting(localStorage.getItem("token"));
                this.isLoading = false;
                if (resp && resp.invalid_topic_ids.length == 0) {
                    this.isPostPubl = true;
                    this.publPostsError = false;
                } 
                else this.publPostsError = true;
            } catch(err) {
                this.publPostsError = true;
                this.isLoading = false;
            }
            
        }
        },
    };
</script>

<style scoped>
    .modal_wrapper {
        width: 100vw;
        height: 100%;
        display: flex;
        justify-content: center;
        /* align-items: center; */
        background: rgba(0, 0, 0, 0.3);
        position: fixed;
        left: 0;
        top: 0;
        z-index: 995;
    }
    .modal {
        width: 1054px;
        display: flex;
        flex-direction: column;
        row-gap: 30px;
        padding: 50px 77px;
        background: #1B1E3D;
        border-radius: 10px;
        overflow-y: auto;
        position: relative;
        @media (max-width: 900px) {
            padding: 40px 13px;
            align-items: center;
        }
    }
    .close {
        position: absolute;
        right: 30px;
        top: 30px;
        width: 21px;
        height: 21px;
        cursor: pointer;
    }
    .active {
        background: #7023EC;
        font-weight: bold;
        border: none !important;
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
        @media (max-width: 650px) {
            grid-template-columns: 1fr;
            row-gap: 10px;
        }
    }
    .switch span {
        @media (max-width: 650px) {
            font-size: 16px !important;
            border: 1px solid white;
        }
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
        @media (max-width: 650px) {
            font-size: 16px;
            text-align: start;
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
        @media (max-width: 650px) {
            grid-template-columns: 1fr;
        }
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
        @media (max-width: 650px) {
            margin-top: 0px;
        }
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
    .table_container {
        max-height: 973px;
        overflow: auto;
    }
    .table_container_mob {
        max-height: 1200px;
        overflow: auto;
    }
    table {
        border: none;
        border-collapse: collapse;
        width: 100%;
    }
    th {
        line-height: normal;
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
        row-gap: 10px;
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
        min-width: 70px;
        height: 20px;
        font-size: 7px;
        border-radius: 5px;
    }
    .big_variant_btn {
        width: 110px;
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
        column-gap: 10px;
        row-gap: 10px;
        flex-wrap: wrap;
        margin-top: 20px;
        align-items: center;
    }
    .plan_item_variants > * {
        flex: 1 1 calc(33.33% - 20px); /* 3 кнопки в первой строке */
        max-width: calc(33.33% - 20px); /* Ограничение ширины */
    }

    .plan_item_variants > :nth-child(n + 4) {
        flex: 1 1 calc(50% - 5px); /* 2 кнопки во второй строке */
        max-width: calc(50% - 5px); /* Ограничение ширины */
    }
    .accepted_banner {
        width: 180px;
    }
    .sm_btn {
        width: 110px;
        font-size: 12px;
        @media (max-width: 650px) {
            width: 70px;
            height: 20px;
            font-size: 7px;
            border-radius: 5px;
        }
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
    .mob_btns {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        width: 100%;
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .mob_btns_row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 10px;
    }
    .mob_btn {
        width: 100%;
        height: 40px;
        font-size: 14px;
    }
    .table_mob {
        display: flex;
        flex-direction: column;
        width: 100%;
        row-gap: 20px;
    }
    .table_item_mob {
        width: 100%;
        display: flex;
        column-gap: 10px;
        padding: 10px;
    }
    .table_item_mob:nth-child(2n+1) {
        background: #111433;
    }
    .table_item_mob_content {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .table_item_mob_row {
        display: flex;
        align-items: center;
        column-gap: 10px;
    }
    .table_item_mob span {
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
        width: fit-content !important;
        height: auto !important;
        text-align: start !important;
        padding: 0 !important;
    }
    .publ_btn {
        align-self: center;
    }
    .info_msg {
        @media (max-width: 650px) {
            font-size: 14px;
            text-align: start;
            align-content: start;
        }
    }
    .addImageBtn {
        width: 15px;
        height: 15px;
        cursor: pointer;
    }
    .banner_tools {
        display: flex;
        column-gap: 20px;
        align-items: center;
    }
    .editor, .bannerAi {
        display: flex;
        column-gap: 5px;
        align-items: center;
        width: fit-content;
    }
    .editor img, .bannerAi img  {
        width: 12px;
        height: 12px;
    }
    .editor span, .bannerAi span {
        font-size: 12px;
        color: white;
        font-family: 'OpenSans';
        text-decoration: underline;
    }

    .generations_wrapper {
        display: flex;
        column-gap: 30px;
        @media (max-width: 750px) {
            flex-direction: column;
        }
    }
    .generations_item {
        padding: 10px 20px;
        background: #111433;
        border-radius: 10px;
        color: white;
        font-size: 20px;
        font-family: 'OpenSans';
        width: fit-content;
        height: fit-content;
        margin-bottom: 10px;
        cursor: pointer;
        @media (max-width: 750px) {
            width: 100%;
            font-size: 16px;
        }
    }
</style>