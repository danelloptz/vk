<template>
    <section class="faq">
        <h1>Инструкции: </h1>
        <div class="item" 
            v-for="(item, index) in textData" 
            :key="index"
            @click="toggleItem(index)"
        >
            <div class="row">
                <h2 :class="{ active: activeIndex === index }">{{ item.title }}</h2>
                <img 
                    src="@/assets/images/arrow_diag.png"
                    :class="{ rotated: activeIndex === index }"
                >
            </div>
            <span v-show="activeIndex === index" class="text">
                {{ item.text }}
            </span>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                activeIndex: null,
                textData: [
                    { 
                        title: "1. Могут ли заблокировать мою группу за использование сервиса?",
                        text: "Нет, вашу группу за использование сервиса не заблокируют. Но если вы будете публиковать контент, нарушающий правила «ВКонтакте», то на вашу группу могут быть наложены ограничения."
                    },
                    {
                        title: "2. Это сервис накрутки или это живая аудитория?",
                        text: "Нет, вашу группу за использование сервиса не заблокируют. Но если вы будете публиковать контент, нарушающий правила «ВКонтакте», то на вашу группу могут быть наложены ограничения."
                    },
                    {
                        title: "3. Откуда берутся подписчики?",
                        text: "Нет, вашу группу за использование сервиса не заблокируют. Но если вы будете публиковать контент, нарушающий правила «ВКонтакте», то на вашу группу могут быть наложены ограничения."
                    },
                    {
                        title: "4. О какой рекламе на сайте идет речь, помимо продвижения сообщества и ВК-видео?",
                        text: "Нет, вашу группу за использование сервиса не заблокируют. Но если вы будете публиковать контент, нарушающий правила «ВКонтакте», то на вашу группу могут быть наложены ограничения."
                    },
                    {
                        title: "5. Сколько времени нужно, чтобы увидеть первые результаты?",
                        text: "Нет, вашу группу за использование сервиса не заблокируют. Но если вы будете публиковать контент, нарушающий правила «ВКонтакте», то на вашу группу могут быть наложены ограничения."
                    },
                    {
                        title: "6. Я «чайник» в технических вопросах — если я что-то не пойму, что мне делать?",
                        text: "Нет, вашу группу за использование сервиса не заблокируют. Но если вы будете публиковать контент, нарушающий правила «ВКонтакте», то на вашу группу могут быть наложены ограничения."
                    },
                    {
                        title: "7. Как ИИ будет писать посты в мою группу, вдруг он что-то напишет не так?",
                        text: "Нет, вашу группу за использование сервиса не заблокируют. Но если вы будете публиковать контент, нарушающий правила «ВКонтакте», то на вашу группу могут быть наложены ограничения."
                    },
                    {
                        title: "8. Сколько уровней партнерской программы доступно в вашем сервисе?",
                        text: "Нет, вашу группу за использование сервиса не заблокируют. Но если вы будете публиковать контент, нарушающий правила «ВКонтакте», то на вашу группу могут быть наложены ограничения."
                    }
                ]
            }
        },
        methods: {
            toggleItem(index) {
                this.activeIndex = this.activeIndex === index ? null : index;
            }
        }
    };
</script>

<style scoped>
    .faq {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    h1 {
        font-size: 24px;
        color: white;
        font-family: 'OpenSans';
        align-self: center;
    }
    .item {
        display: flex;
        flex-direction: column;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        width: 100%;
        row-gap: 20px;
        cursor: pointer;
    }
    .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    h2 {
        font-size: 20px;
        font-family: 'OpenSans';
        color: white;
        transition: .2s ease-in;
    }
    .row img {
        width: 28px;
        height: 28px;
        object-fit: cover;
        object-position: center;
        transition: transform 0.3s ease;
    }
    .row img.rotated {
        transform: rotate(90deg);
    }
    .row h2.active {
        background: linear-gradient(to right, #7023EC, #A585DA); 
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }
    .text {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        transition: max-height 0.3s ease, opacity 0.3s ease;
    }
</style>