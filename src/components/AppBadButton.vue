<template>
    <button class="button">{{ text }}</button>
</template>

<script>
    export default {
        props: {
            text: String
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
        background: none;
        border: 1px solid white;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 1px;
        line-height: 20.8px;
        font-family: 'Tektur', sans-serif;
        color: white;
        z-index: 4;
        cursor: pointer;
        @media (max-width: 900px) {
            width: 170px;
            font-size: 14px;
            height: 50px;
        }
        @media (max-width: 650px) {
            height: 40px;
        }
        @media (max-width: 420px) {
            width: 130px;
            height: 30px;
            font-size: 12px;
        }
    }
</style>