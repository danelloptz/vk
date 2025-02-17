<template>
    <AppModalPayment 
        :package="selectedPackage" 
        :visibility1="isModal"
        :isGoodPayment="isGoodPayment"
        @update:visibility1="isModal = $event"
        @update:isGoodPayment="isGoodPayment = $event"
    />

    <section class="plans">
        <h2>Выберите свой идеальный вариант продвижения. Доверьте ИИ стремительный рост вашего бизнеса</h2>
        <div class="row">
            <div class="item">
                <span>Ваш тариф / пакет:</span>
                <span><strong>VIP</strong></span>
            </div>
            <div class="item">
                <span>Осталось дней (Business):</span>
                <span><strong>320</strong></span>
            </div>
            <div class="item">
                <span>Осталось дней (VIP):</span>
                <span><strong>28</strong></span>
            </div>
        </div>
        <table>
            <div class="bg"></div>
            <div class="gradient-column" style="left: calc(100% * 5 / 6.95); width: calc((100% / 7.7));"></div>
            <div class="gradient-column2" style="left: calc(100% * 6 / 6.95); width: calc(100% / 7.7);"></div>
            <thead>
                <tr>
                    <th></th>
                    <th>Free</th>
                    <th>Start</th>
                    <th>Standart</th>
                    <th>VIP</th>
                    <th>Business</th>
                    <th>Leader</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>ИИ генерация постов</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Автопостинг</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>ИИ менеджер продаж</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>SEO оптимизация и поисковый трафик</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>ИИ анализ группы</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>ИИ сценарии для видео</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>ИИ помощник</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>VIP предложение</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Business предложение</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Автоподписка</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Рефподписка</td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Баннерная реклама</td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Рекламная лента, USDT</td>
                    <td><span>3</span></td>
                    <td><span>2</span></td>
                    <td><span>2</span></td>
                    <td><span>1.5</span></td>
                    <td><span>1</span></td>
                    <td><span>1</span></td>
                </tr>
                <tr>
                    <td>Ежемесячный розыгрыш VIP тарифа</td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Ротация групп</td>
                    <td><span>20/10</span></td>
                    <td><span>15/10</span></td>
                    <td><span>10/10</span></td>
                    <td><span>10/10</span></td>
                    <td><span>10/10</span></td>
                    <td><span>10/10</span></td>
                </tr>
                <tr>
                    <td>Ротация видео</td>
                    <td><span>20/10</span></td>
                    <td><span>15/10</span></td>
                    <td><span>10/10</span></td>
                    <td><span>10/10</span></td>
                    <td><span>10/10</span></td>
                    <td><span>10/10</span></td>
                </tr>
                <tr>
                    <td>Ротация постов</td>
                    <td><span>20/10</span></td>
                    <td><span>15/10</span></td>
                    <td><span>10/10</span></td>
                    <td><span>10/10</span></td>
                    <td><span>10/10</span></td>
                    <td><span>10/10</span></td>
                </tr>
                <tr>
                    <td>Booster (30 USDT) </td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><span>Доступен, вкл. 0 шт.</span></td>
                    <td><span>Включено 12 шт. (360 USDT)</span></td>
                    <td><span>Включено 12 шт. (360 USDT)</span></td>
                </tr>
                <tr>
                    <td>Клиентский маркетинг, ур.</td>
                    <td><span>1</span></td>
                    <td><span>3</span></td>
                    <td><span>5</span></td>
                    <td><span>7</span></td>
                    <td><span>8</span></td>
                    <td><span>10-15</span></td>
                </tr>
                <tr>
                    <td>Бинар, %</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><span>8%</span></td>
                    <td><span>10-12%</span></td>
                </tr>
                <tr>
                    <td>Быстрый старт</td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Matching bonus, ур.</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td>5-10</td>
                </tr>
                <tr>
                    <td>Ранг бонус</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Бонус Глобальный 1</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Бонус Глобальный 2</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Бонус Глобальный 3</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Авто-продвижение сервиса</td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Новые функции</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td></td>
                    <td class="column">
                        <span>0 USDT в месяц</span>
                    </td>
                    <td class="column">
                        <span>10 USDT в месяц</span>
                        <AppGoodButton :text="text1" class="btn" @click="selectPackage(plans[0])"/>
                    </td>
                    <td class="column">
                        <span>30 USDT в месяц</span>
                        <AppGoodButton :text="text1" class="btn" @click="selectPackage(plans[1])"/>
                    </td>
                    <td class="column">
                        <span>50 USDT в месяц</span>
                        <AppGoodButton :text="text1" class="btn" @click="selectPackage(plans[2])"/>
                    </td>
                    <td class="column">
                        <span>25* USDT в месяц</span>
                        <AppGoodButton :text="text1" class="btn" @click="selectPackage(plans[3])"/>
                    </td>
                    <td class="column">
                        <span>42* USDT в месяц</span>
                        <AppGoodButton :text="text1" class="btn" @click="selectPackage(plans[4])"/>
                    </td>
                </tr>
            </tbody>
        </table>
        <span>*Пакеты Business и Leader активируются сроком только на 1 год с максимальной скидкой и полным функционалом сервиса с дальнейшими доработками. Это несоизмеримо выгоднее, чем любой другой тариф.</span>
        <div class="booster">
            <div class="booster-img"></div>
            <div class="col">
                <span><strong>Booster</strong> - инструмент, который дает мощный всплеск подписчиков, просмотров видео, постов, за счет обнуления показателей внутренней статистики тарифа/пакета. Доступен на тарифе VIP, пакетах Business, Leader</span>
                <strong><span>Цена 30 USDT</span></strong>
                <AppGoodButton :text="text1" class="booster_btn"/>
            </div>
            
        </div>
    </section>
</template>

<script>
import AppModalPayment from "@/components/AppModalPayment.vue";
import AppGoodButton from "@/components/AppGoodButton.vue";
import { getTariffs } from "@/services/cash";

    export default {
        components: { AppGoodButton, AppModalPayment },
        data() {
            return {
                userData: [],
                text1: "КУПИТЬ",
                text2: "ПРОДЛИТЬ",
                selectedPackage: "",
                plans: ["Start", "Standart", "VIP", "Business", "Leader"],
                isModal: false,
                isGoodPayment: false
            }
        },
        async created() {
            const resp = await getTariffs(localStorage.getItem("token"));
            console.log(resp);
        },
        methods: {
            selectPackage(pack) {
                this.selectedPackage = pack;
                this.isModal = true;
            }
        }
    };
</script>

<style scoped>
    .plans {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
    }
    h2 {
        font-size: 24px;
        color: white;
        font-family: 'OpenSans';
    }
    .row {
        display: flex;
        justify-content: stretch;
        background: #2F3251;
        padding: 10px;
        border-radius: 10px;
    }
    .item {
        display: flex;
        column-gap: 7px;
    }
    table {
        width: 100%;
        border-radius: 10px;
        border-collapse: collapse;
        position: relative;
        z-index: 9;
    }
    td {
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        border-right: 1px solid rgba(255, 255, 255, 0.5);
        padding: 0px 10px;
    }
    th {
        line-height: 3;
    }
    span, td, th {
        color: white;
        font-family: 'OpenSans';
        font-size: 18px;
        text-align: center;
        align-self: center;
        z-index: 9;
        padding: 10px;
        position: relative;
    }
    img {
        width: 26px;
        height: 19px;
        object-fit: cover;
        object-position: center;
        align-self: center;
        justify-self: center;
    }
    .minus {
        align-self: center;
        justify-self: center;
        width: 30px;
        height: 2px;
        background: white;
    }
    .column span {
        font-family: 'Tektur';
    }
    td:nth-child(6), th:nth-child(6) {
        position: relative;
        z-index: 8;
    }
    td:nth-child(7), th:nth-child(7) {
        position: relative;
        z-index: 8;
    }
    .btn {
        width: 100px;
    }
    .gradient-column, .gradient-column2 {
        position: absolute;
        top: 20px;
        bottom: 0;
        left: 0;
        width: 100%;
        background: linear-gradient(to right,  #7023EC, #A585DA);
        z-index: -1;
        border-radius: 10px;
    }
    .gradient-column2 {
        background: linear-gradient(45deg, #D19981, #DB40E6);
    }
    .bg {
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 10px;
        background: #1B1E3D;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
    .booster {
        width: 100%;
        background: #2F3251;
        display: flex;
        column-gap: 40px;
        align-items: center;
        border-radius: 10px;
        padding: 30px 40px;
    }
    .col {
        display: flex;
        flex-direction: column;
        row-gap: 15px;
    }
    .booster-img {
        width: 173px;
        height: 244px;
        background: url("@/assets/images/rocket.png") no-repeat center/cover, #2F3251;
        background-blend-mode: lighten;
        -webkit-mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
        mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
    }

    .booster span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        text-align: start;
        align-self: auto;
        width: 60%;
    }
    .booster_btn {
        width: 130px;
    }
</style>