<template>
    <div v-if="visibility1" class="modal_wrapper" id="modal_wrapper">
        <section class="modal">
            <div class="header">
                <div class="timer_wrapper">
                    <span class="timer" v-if="!isEnd">{{ currTime }}</span>
                    <span class="timer_msg">{{ timerMsg }}</span>
                </div>
                <span class="quit" @click="close">ПЕРЕЙТИ</span>
            </div>
            <div class="video_wrapper">
                <iframe 
                    ref="videoFrame"
                    :src="`${link}&js_api=1`" 
                    class="video" 
                    frameborder="0" 
                    allowfullscreen
                    @load="setupVideoTracking"
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    id="iframe"
                ></iframe>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    props: {
        visibility1: Boolean,
        link: String,
        isWatched: Boolean
    },
    data() {
        return {
            currTime: 20,
            timerMsg: "Пожалуйста, ждите окончания отсчета таймера",
            intervalId: null,
            isPlaying: false,
            isEnd: false
        };
    },
    watch: {
        visibility1(newVal) {
            if (newVal) {
                this.$nextTick(() => {
                    this.initVKPlayer();
                });
            }
        }
    },
    methods: {
        initVKPlayer() {
            let iframe = this.$refs.videoFrame;
            if (!iframe) return console.error("iframe не найден!");

            if (!window.VK) return console.error("VK API не загружен!");

            try {
                const player = new window.VK.VideoPlayer(iframe);

                player.on("started", () => {
                    this.isPlaying = true;
                    this.startTimer();
                });
                player.on("paused", () => {
                    this.isPlaying = false;
                    this.clearTimer();
                });
                player.on("resumed", () => {
                    this.isPlaying = true;
                    this.startTimer();
                });

                console.log("VK Player инициализирован", player);
            } catch (error) {
                console.error("Ошибка инициализации VK.VideoPlayer:", error);
            }
        },
        startTimer() {
            if (this.intervalId || this.currTime === 0) return;

            this.intervalId = setInterval(() => {
                if (this.currTime > 0) {
                    this.currTime--;
                } else {
                    this.clearTimer();
                    this.timerMsg = "Просмотр засчитан";
                    this.isEnd = true;
                    this.$emit("update:isWatched", true);
                }
            }, 1000);
        },
        clearTimer() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        },
        close() {
            this.currTime = 20;
            this.timerMsg = "Пожалуйста, ждите окончания отсчета таймера";
            this.intervalId = null;
            this.isPlaying = false;
            this.isEnd = false;
            this.$emit("update:visibility1", false);
            this.$emit("close");
            this.clearTimer();
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

    iframe {
        width: 50vw;
        aspect-ratio: 16 / 9;
        z-index: 20;
    }
    .header {
        display: flex;
        justify-content: space-between;
        height: 93px;
        width: 100%;
    }
    .timer_wrapper {
        height: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0px 30px;
        align-items: center;
        background: #1B1E3D;
    }
    .timer {
        font-size: 40px;
        font-family: 'Tektur';
        color: white;
        padding: 10px;
        background: #2F3251;
        border-radius: 10px;
    }
    .timer_msg {
        font-size: 32px;
        font-family: 'OpenSans';
        color: white;
    }
    .quit {
        font-size: 20px;
        font-family: 'Tektur';
        font-weight: bold;
        height: 100%;
        border: 1px solid white;
        background: #2F3251;
        cursor: pointer;
        padding: 0 36px;
        align-content: center;
    }

    h3 {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        font-weight: normal;
    }
    h1, h2, span, img {
        z-index: 5;
    }
    .modal_wrapper {
        width: 100vw;
        height: 100vh;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 900;
        background: #070a29;
        display: flex;
        justify-content: center;
        align-items: start;
        padding: 50px;
    }

    .modal {
        width: 1160px;
        border-radius: 10px;
        position: relative; /* Обеспечиваем позиционирование для псевдоэлемента */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 50px;
        z-index: 2;
        overflow-y: auto;
        scrollbar-width: none;
        row-gap: 20px;
        box-sizing: border-box;
        margin-top: -50px;
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
        text-align: center;
        font-family: 'OpenSans';
        @media (max-width: 900px) {
            font-size: 20px;
        }
        @media (max-width: 650px) {
            font-size: 17px;
        }
    }
</style>