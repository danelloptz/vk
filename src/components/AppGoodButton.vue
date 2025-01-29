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
            height: 40px;
        }
        @media (max-width: 420px) {
            width: 130px;
            height: 30px;
            font-size: 12px;
        }
    }
    .button:hover {
        background: linear-gradient(to right, #E14A7A, #E14ABB, #A139DE);
    }
</style>