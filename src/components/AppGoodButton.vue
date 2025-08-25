<template>
    <button class="button">
        <img v-if="isSave" src="@/assets/images/save_banner.png" class="save_banner" />
        <img v-if="isReboot" src="@/assets/images/reboot_banner.png" class="reboot_banner" />
        <img v-if="isPics" src="@/assets/images/pics_banner.png" class="pics_banner" />
        <img v-if="isRect" src="@/assets/images/rectangle_banner.png" class="rectangle_banner" />
        <img v-if="isEmojis" src="@/assets/images/smile_banner.png" class="smile_banner" />
        <span v-if="isText" class="text_banner">T</span>
        {{ text }}
    </button>
</template>

<script>
    export default {
        props: {
            text: String,
            isReboot: Boolean,
            isSave: Boolean,
            isText: Boolean,
            isPics: Boolean,
            isRect: Boolean,
            isEmojis: Boolean
        }
    }
</script>

<style scoped>
    @font-face {
        font-family: 'Tektur';
        src: url('@/assets/fonts/Tektur.ttf') format('truetype');
    }
    .button {
        width: 231px;
        height: 51px;
        border-radius: 10px;
        border: none;
        background: linear-gradient(to right, #A139DE, #E14ABB, #E14A7A);
        color: white;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 1px;
        line-height: 20.8px;
        font-family: 'Tektur', sans-serif;
        cursor: pointer;
        z-index: 4;
        @media (max-width: 900px) {
            width: 170px;
            font-size: 14px;
            height: 50px;
        }
        @media (max-width: 650px) {
            width: 170px;
            height: 51px;
        }
        /* @media (max-width: 420px) {
            width: 130px;
            height: 30px;
            font-size: 12px;
        } */
    }
    .button:hover {
        background: linear-gradient(to right, #E14A7A, #E14ABB, #A139DE);
    }
    .save_banner {
        width: 23px;
        height: 23px;
        @media (max-width: 900px) {
            width: 18.15px;
            height: 18.15px;
        }
    }
    .reboot_banner {
        width: 40px;
        height: 40px;
        @media (max-width: 900px) {
            width: 30px;
            height: 30px;
        }
    }
    .text_banner {
        font-size: 23.21px;
        font-family: 'Tektur';
        color: white;
        font-weight: lighter;
    }
    .pics_banner {
        width: 28px;
        height: 28px;
    }
    .rectangle_banner {
        width: 23.76px;
        height: 13.58px;
        border: 1px solid white;
    }
    .smile_banner {
        width: 28px;
        height: 28px;
    }
</style>