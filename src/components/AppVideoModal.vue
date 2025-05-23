<template>
    <div v-if="visibility1" class="modal_wrapper" id="modal_wrapper">
        <section class="modal">
            <div class="header">
                <div class="timer_wrapper">
                    <span class="timer" v-if="!isEnd">{{ currTime }}</span>
                    <span class="timer_msg">{{ timerMsg }}</span>
                </div>
                <span class="quit" v-if="!uncloseable || isEnd" @click="close">ЗАКРЫТЬ</span>
                <span class="skip" v-if="uncloseable && !noskips" @click="skip">ПРОПУСТИТЬ</span>
            </div>
            <div class="video_wrapper">
                <iframe 
                    ref="videoFrame"
                    :src="`${listOfLinks[videoIndex].link}&js_api=1`" 
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
        isWatched: Boolean,
        uncloseable: Boolean,
        listOfLinks: Array
    },
    data() {
        return {
            currTime: 20,
            timerMsg: "Пожалуйста, ждите окончания отсчета таймера",
            intervalId: null,
            isPlaying: false,
            isEnd: false,
            paused: false,
            videoIndex: 0,
            noskips: false
        };
    },
    async created() {
        console.log(this.listOfLinks);
    },
    watch: {
        visibility1(newVal) {
            if (newVal) {
                this.loadScript().then(() => {
                    this.$nextTick(() => {
                        this.initVKPlayer();
                    });
                });
            }
        },
        isEnd(newVal) {
            if (newVal) {
                this.noskips = true;
            }
        }
    },
    mounted() {
        document.addEventListener("visibilitychange", this.handleVisibilityChange);
    },
    methods: {
        skip() {
            if (this.listOfLinks.length > this.videoIndex + 1) this.videoIndex++; 
        },
        loadScript() {
            return new Promise((resolve, reject) => {
                // Check if the script is already loaded
                if (window.VK && window.VK.VideoPlayer) {
                    resolve();
                    return;
                }

                // Create a script element
                const script = document.createElement('script');
                script.src = "https://vk.com/js/api/videoplayer.js";
                script.async = true;

                // Resolve the promise when the script is loaded
                script.onload = () => {
                    console.log("VK Video Player script loaded successfully");
                    resolve();
                };

                // Reject the promise if there's an error loading the script
                script.onerror = () => {
                    console.error("Failed to load VK Video Player script");
                    reject();
                };

                // Append the script to the document head
                document.head.appendChild(script);
            });
        },
        initVKPlayer() {
            let iframe = this.$refs.videoFrame;
            if (!iframe) return console.error("iframe не найден!");

            if (!window.VK) return console.error("VK API не загружен!");

            try {
                const player = new window.VK.VideoPlayer(iframe);

                player.on("started", () => {
                    this.isPlaying = true;
                    if (!this.paused) this.startTimer();
                });
                player.on("paused", () => {
                    this.isPlaying = false;
                    this.paused = true;
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
            if (this.intervalId || this.currTime === 0 || !this.isPlaying) return;

            this.intervalId = setInterval(() => {
                if (this.currTime > 0 && this.isPlaying) {
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
            this.isPlaying = false;
            this.isEnd = false;
            this.paused = false;
            this.clearTimer();
            this.$emit("update:visibility1", false);
            this.$emit("close");
        },
        handleVisibilityChange() {
            if (document.hidden) {
                console.log("сработало переключение");
                this.isPlaying = false;
                this.clearTimer();
            } else {
                if (this.isPlaying) {
                    this.startTimer();
                }
            }
            console.log(this.isPlaying);
        },
        handleBlur() {
            console.log('blur');
            this.isPlaying = false;
            this.clearTimer();
        },
        handleFocus() {
            if (this.isPlaying) {
                this.startTimer();
                console.log("Пользователь вернулся в окно");
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

    iframe {
        width: 50vw;
        aspect-ratio: 16 / 9;
        z-index: 20;
        @media (max-width: 900px) {
            width: 100%;
        }
    }
    .header {
        display: flex;
        justify-content: space-between;
        height: 93px;
        width: 100%;
        @media (max-width: 650px) {
            flex-direction: column;
            row-gap: 30px;
            height: auto;
        }
    }
    .timer_wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        column-gap: 20px;
        padding: 0px 30px;
        align-items: center;
        background: #1B1E3D;
        @media (max-width: 650px) {
            padding: 21px 10px;
            border-radius: 10px;
        }
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
        @media (max-width: 1200px) {
            font-size: 20px;
        }
        @media (max-width: 900px) {
            font-size: 16px;
            text-align: start !important;
        }
    }
    .quit, .skip {
        font-size: 20px;
        font-family: 'Tektur';
        font-weight: bold;
        height: 100%;
        border: 1px solid white;
        background: #2F3251;
        cursor: pointer;
        padding: 0 36px;
        align-content: center;
        @media (max-width: 650px) {
            width: 100%;
            padding: 20px;
            font-size: 16px;
            border-radius: 10px;
        }
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
        @media (max-width: 650px) {
            align-items: center;
            padding: 0px;
        }
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
            width: 95vw;
            padding: 0;
            row-gap: 30px;
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
    .video {
        min-height: 500px;
    }
</style>