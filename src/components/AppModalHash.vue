<template>
    <div v-if="visibility1" class="modal_wrapper" id="modal_wrapper">
        <section class="modal">
            <div class="modal-background"></div>
            <img src="@/assets/images/close.png" class="close" @click="close">
            <h1>КАК НАЙТИ ХЭШ ТРАНЗАКЦИИ</h1>
            <h2>Существует несколько способов найти хэш транзакции в зависимости от того, где вы ее совершали:</h2>
            <ol>
                <li>
                    <strong>На криптовалютной бирже:</strong>
                    <ul>
                        <li>&mdash; Войдите в свой аккаунт на бирже.</li>
                        <li>&mdash; Перейдите в раздел «История транзакций» или «История операций».</li>
                        <li>&mdash; Найдите нужную транзакцию и нажмите на нее.</li>
                        <li>&mdash; Хэш транзакции обычно отображается как «TXID», «Hash» или «Идентификатор транзакции».</li>
                    </ul>
                </li>
                <li>
                    <strong>В криптовалютном кошельке:</strong>
                    <ul>
                        <li>&mdash; Откройте свой кошелек и перейдите в раздел «История транзакций».</li>
                        <li>&mdash; Найдите нужную транзакцию.</li>
                        <li>&mdash; Хэш транзакции будет отображаться рядом с деталями транзакции.</li>
                    </ul>
                </li>
            </ol>
            <span></span>
        </section>
    </div>
</template>

<script>
export default {
    props: {
        visibility1: Boolean,
    },
    methods: {
        close() {
            if (this.visibility1) {
                this.$emit('update:visibility1', false);
            }
            this.$emit('close'); 
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
        align-items: center;
    }

    .modal {
        width: 760px;
        height: auto;
        border-radius: 10px;
        position: relative;
        display: flex;
        flex-direction: column;
        /* align-items: center; */
        justify-content: center;
        padding: 50px;
        z-index: 10;
        overflow-y: auto;
        scrollbar-width: none;
        row-gap: 20px;
        box-sizing: border-box;
        margin-top: -50px;
        align-self: center;
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
    h2 {
        font-size: 24px;
        font-family: 'OpenSans';
        font-weight: 400;
        line-height: 32.68px;
        color: white;
    }
    ol li, ul li {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
    }
    ol {
        margin-left: 30px;
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    ul {
        list-style: none;
        padding-top: 10px;
    }
    ul li {
        line-height: 1.5;
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