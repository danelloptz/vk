<template>
    <AppModalPayment 
        :package="selectedPackage" 
        :visibility1="isModal"
        :isGoodPayment="isGoodPayment"
        :tarrifs="tariffs"
        @update:visibility1="isModal = $event"
        @update:isGoodPayment="isGoodPayment = $event"
    />

    <section class="plans">
        <h2>Выберите свой идеальный вариант продвижения. Доверьте ИИ стремительный рост вашего бизнеса</h2>
        <div class="row">
            <div class="item">
                <span>Ваш тариф / пакет:</span>
                <span><strong>{{ userData?.packages[userData?.packages.length - 1]?.package_name }}</strong></span>
            </div>
            <div class="item" v-for="(item, index) in newTarrif" :key="index">
                <span>Осталось дней ({{ item.package_name }}):</span>
                <span v-if="getDays(item)"><strong>{{ getDays(item) }}</strong></span>
                <span v-else style="font-size: 40px;"><strong>{{ "∞" }}</strong></span>
            </div>
        </div>
        <table>
            <div class="bg"></div>
            <div class="gradient-column" style="width: calc((100% / 7.7));"></div>
            <div class="gradient-column2" style="width: calc(100% / 7.7);"></div>
            <thead>
                <tr>
                    <th></th>
                    <th v-for="(tarif, index) in tariffs" :key="index" >{{ tarif.package_name }}</th>
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
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Автопостинг</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>ИИ менеджер продаж</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>SEO оптимизация и поисковый трафик</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>ИИ анализ группы</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>ИИ сценарии для видео</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>ИИ помощник</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>VIP предложение</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Business предложение</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Автоподписка</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Рефподписка</td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Баннерная реклама</td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Рекламная лента, USDT</td>
                    <td><span>3</span></td>
                    <td><span>2</span></td>
                    <td><span>2</span></td>
                    <td><span>1.5</span></td>
                    <td><span>1</span></td>
                    <td style="border-right: none;"><span>1</span></td>
                </tr>
                <tr>
                    <td>Ежемесячный розыгрыш VIP тарифа</td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Ротация групп</td>
                    <td><span>20/10</span></td>
                    <td><span>15/10</span></td>
                    <td><span>10/10</span></td>
                    <td><span>10/10</span></td>
                    <td><span>10/10</span></td>
                    <td style="border-right: none;"><span>10/10</span></td>
                </tr>
                <tr>
                    <td>Ротация видео</td>
                    <td><span>20/10</span></td>
                    <td><span>15/10</span></td>
                    <td><span>10/10</span></td>
                    <td><span>10/10</span></td>
                    <td><span>10/10</span></td>
                    <td style="border-right: none;"><span>10/10</span></td>
                </tr>
                <tr>
                    <td>Ротация постов</td>
                    <td><span>20/10</span></td>
                    <td><span>15/10</span></td>
                    <td><span>10/10</span></td>
                    <td><span>10/10</span></td>
                    <td><span>10/10</span></td>
                    <td style="border-right: none;"><span>10/10</span></td>
                </tr>
                <tr>
                    <td>Booster (30 USDT) </td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><span>Доступен, вкл. 0 шт.</span></td>
                    <td><span>Включено 12 шт. (360 USDT)</span></td>
                    <td style="border-right: none;"><span>Включено 12 шт. (360 USDT)</span></td>
                </tr>
                <tr>
                    <td>Клиентский маркетинг, ур.</td>
                    <td><span>1</span></td>
                    <td><span>3</span></td>
                    <td><span>5</span></td>
                    <td><span>7</span></td>
                    <td><span>8</span></td>
                    <td style="border-right: none;"><span>10-15</span></td>
                </tr>
                <tr>
                    <td>Бинар, %</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><span>8%</span></td>
                    <td style="border-right: none;"><span>10-12%</span></td>
                </tr>
                <tr>
                    <td>Быстрый старт</td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Matching bonus, ур.</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td style="border-right: none;">5-10</td>
                </tr>
                <tr>
                    <td>Ранг бонус</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Бонус Глобальный 1</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Бонус Глобальный 2</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Бонус Глобальный 3</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Авто-продвижение сервиса</td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok_green.png"></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td>Новые функции</td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><div class="minus"></div></td>
                    <td><img src="@/assets/images/ok.png"></td>
                    <td style="border-right: none;"><img src="@/assets/images/ok.png"></td>
                </tr>
                <tr>
                    <td style="border-bottom: none;"></td>
                    <td class="column first_col" style="border-bottom: none;">
                        <span><span class="big_letters">{{ tariffs[0]?.monthly_cost }}</span> <span class="medium_letters">USDT</span><br> в месяц</span>
                    </td>
                    <td class="column"  style="border-bottom: none;">
                        <span><span class="big_letters">{{ tariffs[1]?.monthly_cost }}</span> <span class="medium_letters">USDT</span><br> в месяц</span>
                        <AppGoodButton :text="currTarrif.includes(plans[1]) ? text2 : text1" class="btn" @click="selectPackage(plans[1])"/>
                    </td>
                    <td class="column" style="border-bottom: none;">
                        <span><span class="big_letters">{{ tariffs[2]?.monthly_cost }}</span> <span class="medium_letters">USDT</span><br> в месяц</span>
                        <AppGoodButton :text="currTarrif.includes(plans[2]) ? text2 : text1" class="btn" @click="selectPackage(plans[2])"/>
                    </td>
                    <td class="column" style="border-bottom: none;">
                        <span><span class="big_letters">{{ tariffs[3]?.monthly_cost }}</span> <span class="medium_letters">USDT</span><br> в месяц</span>
                        <AppGoodButton :text="currTarrif.includes(plans[3]) ? text2 : text1" class="btn" @click="selectPackage(plans[3])"/>
                    </td>
                    <td class="column" style="border-bottom: none;">
                        <span><span class="large_letters">{{ tariffs[4]?.monthly_cost }}*</span> <span class="medium_letters">USDT</span><br> в месяц</span>
                        <AppGoodButton :text="currTarrif.includes('Business') ? text2 : text1" class="btn" @click="selectPackage(plans[4])"/>
                    </td>
                    <td class="column" style="border-right: none; border-bottom: none;">
                        <span><span class="large_letters">{{ tariffs[5]?.monthly_cost }}*</span> <span class="medium_letters">USDT</span><br> в месяц</span>
                        <AppGoodButton :text="(currTarrif.includes('Business') && !currTarrif.includes('Leader')) ? text3 : currTarrif.includes('Leader') ? text2 : text1" class="btn" @click="selectPackage(plans[5])"/>
                    </td>
                </tr>
            </tbody>
        </table>
        <span>*Пакеты Business и Leader активируются сроком только на 1 год с максимальной скидкой и полным функционалом сервиса с дальнейшими доработками. Это несоизмеримо выгоднее, чем любой другой тариф.</span>
        <div class="booster">
            <div class="booster-img"></div>
            <div class="col">
                <span><strong>Booster</strong> - инструмент, который дает мощный всплеск подписчиков, просмотров видео, постов, за счет обнуления показателей внутренней статистики тарифа/пакета. Доступен на тарифе VIP, пакетах Business, Leader.</span>
                <strong><span>Цена 30 USDT</span></strong>
                <AppGoodButton :text="text1" class="booster_btn" @click="buy"/>
            </div>
            
        </div>
    </section>
</template>

<script>
import AppModalPayment from "@/components/AppModalPayment.vue";
import AppGoodButton from "@/components/AppGoodButton.vue";
import { getTariffs, buyBooster } from "@/services/cash";
import { getUserInfo } from "@/services/user";
 
    export default {
        components: { AppGoodButton, AppModalPayment },
        data() {
            return {
                userData: [],
                text1: "КУПИТЬ",
                text2: "ПРОДЛИТЬ",
                text3: "ПОВЫСИТЬ",
                selectedPackage: "",
                plans: [],
                isModal: false,
                isGoodPayment: false,
                tariffs: [],
                currTarrif: [],
                newTarrif: []
            }
        },
        async created() {
            const resp = await getTariffs(localStorage.getItem("token"));
            this.tariffs = resp;
            const user = await getUserInfo(localStorage.getItem("token"));
            this.userData = user;
            this.tariffs.forEach(tarif => this.plans.push(tarif?.package_name));
            this.currTarrif = this.userData.packages.map(item => item.package_name);
            console.log(this.currTarrif);
            this.tariffs.forEach(item => console.log(item?.package_name));
            this.newTarrif = (this.userData.packages.length == 1 && this.userData.packages[0].package_name == "Free") ?  this.userData.packages : this.userData.packages.filter(item => item.package_name != "Free");
            console.log(this.newTarrif);
        },
        watch: {
            tarrifs(newValue) {
                this.tariffs = newValue;
            }
        },
        methods: {
            selectPackage(pack) {
                this.selectedPackage = pack;
                this.isModal = true;
            },
            async buy() {
                const payment = await buyBooster(30, localStorage.getItem("token"));
                console.log(payment);
            },
            getDays(item) {
                const end_time = this.userData.packages_datetime.find(el => el.tarif_id == item.id)?.date_end;
                if (end_time) {
                    const now = Math.floor(Date.now() / 1000);
                    const daysLeft = Math.floor((end_time - now) / 86400);
                    return daysLeft;
                }
                return "";
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
        flex-wrap: wrap;
        background: #2F3251;
        padding: 10px;
        border-radius: 10px;
        column-gap: 50px;
        row-gap: 15px;
    }
    .item {
        display: flex;
        align-items: center;
        column-gap: 7px;
    }
    table {
        width: 100%;
        border-radius: 10px;
        position: relative;
        z-index: 9;
    }
    td {
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        border-right: 1px solid rgba(255, 255, 255, 0.5);
        padding: 0px 10px;
        width: 125px;
    }
    .first_col {
        min-width: 110px !important;
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
    span {
        padding: 0 !important;
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
        margin: auto;
        width: 30px;
        height: 2px;
        background: white;
    }
    .column span {
        font-family: 'Tektur';
        font-size: 13px;
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

    .gradient-column {
        left: 72.292% !important;
        @media (min-width: 1440px) {
            left: 72% !important;
        }
    }
    .gradient-column2 {
        left: 86.401% !important;
        background: linear-gradient(45deg, #D19981, #DB40E6);
        @media (min-width: 1440px) {
            left: 86.15% !important;
        }
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
        width: 100%;
    }
    .booster_btn {
        width: 130px;
    }
    .large_letters {
        font-size: 32px !important;
    }
    .big_letters {
        font-size: 27px !important;
    }
    .medium_letters {
        font-size: 15px !important;
    }
</style>