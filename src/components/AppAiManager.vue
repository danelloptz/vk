<template>
    <section class="unworked">
        <img src="@/assets/images/unworked.png">
        <h1>Раздел находится в разработке</h1>
    </section>
</template>

<script>
    export default {

    };
</script>

<style scoped>
    .unworked {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .unworked img {
        width: 540px;
        @media (max-width: 650px) {
            max-width: 330px;
        }
    }
    .unworked h1 {
        font-size: 40px;
        color: #FF6666;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
</style>