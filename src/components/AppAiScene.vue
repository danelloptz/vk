<template>
    <section class="scene">
        <h2>Для создания качественного сценария для вашего видео необходимо заполнить бриф:</h2>
        <div class="dropdown">
            <input
                v-model="selectedTime"
                type="text"
                placeholder="Длительность"
                @focus="isDropdownVisibleTime = true"
                @blur="hideDropdownTime"
                readonly 
            />
            <img :class="{'rotated': isDropdownVisibleTime}" src="@/assets/images/arrow_down.png" class="arrow_down">
            <ul v-if="isDropdownVisibleTime" class="dropdown-menu">
                <li
                    v-for="(item, index) in times"
                    :key="index"
                    @mousedown.prevent="selectTime(item)"
                >
                    {{ item }}
                </li>
            </ul>
        </div>
        <div class="item">
            <span class="counter">{{ nameCharacters.length }}/200</span>
            <h2>Имена персонажей</h2>
            <input 
                v-model="nameCharacters"
                type="text"
                placeholder="Укажите имена персонажей для вашего сценария, через запятую"
                maxlength="200"
            >
        </div>
        <div class="item">
            <span class="counter">{{ story.length }}/2000</span>
            <h2>Детали сюжета: </h2>
            <textarea 
                v-model="story"
                type="text"
                placeholder="Подробно опишите детали сюжета"
                maxlength="2000"
            ></textarea>
            <AppGoodButton :text="text1" />
        </div>
        <div class="item">
            <h2>Если вам нужно внести корректировки в сценарий, то пропишите их здесь: </h2>
            <textarea 
                v-model="edits"
                type="text"
                placeholder="Ваше сообщение"
                maxlength="2000"
            ></textarea>
            <AppGoodButton :text="text2" />
        </div>
    </section>
</template>

<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';

    export default {
        components: { AppGoodButton },
        data() {
            return {
                selectedTime: "",
                isDropdownVisibleTime: false,
                times: ["30 секунд", "1 минута", "3 минуты", "5 минуты", "10 минут", "20 минут", "30 минут"],
                text1: "СГЕНЕРИРОВАТЬ",
                text2: "ОТПРАВИТЬ",
                nameCharacters: "",
                story: "",
                edits: ""
            }
        },
        methods: {
            hideDropdownTime() {
                this.isDropdownVisibleTime = false;
            },
            selectTime(item) {
                this.selectedTime = item;
                this.hideDropdownTime();
            }
        }
    };
</script>

<style scoped>
    .scene {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 50px;
    }
    h2 {
        font-size: 20px;
        color: white;
        font-family: 'OpenSans';
    }

    .item {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        position: relative;
    }
    
    .counter {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 14px;
        color: white;
        opacity: .5;
        font-family: 'OpenSans';
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

    textarea {
        width: 100%;
        height: 270px;
        padding: 20px;
        box-sizing: border-box;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.5);
        background: none;
        border: 1px solid white;
        border-radius: 10px;
        font-family: 'OpenSans';
        position: relative;
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
    .dropdown {
        position: relative;
        width: 360px;
        @media (max-width: 500px) {
            width:70vw;
        }
    }
</style>