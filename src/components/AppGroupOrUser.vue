<template>
    <div class="footer_data" v-if="Object.keys(userData).length !== 0">
        <!-- <div class="zopa">
            <div class="left_col">
                <img v-if="objectData" :src="isSettings ? objectData.group.group_photo : (objectData.avatar_url ?? objectData.avatar)" class="avatar" style="margin-top: 15px;">
                <span class="label" v-if="windowWidth <= 650 && (objectData &&
                        (objectData?.packages?.[objectData?.packages?.length - 1]?.package_name == 'Business' ||
                        objectData?.packages?.[objectData?.packages?.length - 1]?.package_name == 'Leader' || 
                        objectData?.packages?.[objectData?.packages?.length - 1]?.package_name == 'VIP' || 
                        (objectData.status && (objectData.status == 'Business' ||
                            objectData.status == 'Leader' || objectData.status == 'VIP')
                        )) ||
                        (objectData?.package_name == 'Business' ||
                        objectData?.package_name == 'Leader' ||
                        objectData?.package_name == 'VIP'))
                        " style="margin-left: 10px;">
                        {{ objectData?.packages?.[objectData?.packages?.length - 1]?.package_name ?? objectData.status ?? objectData?.package_name}}
                </span>
            </div>
            <div class="footer_data_wrapper">
                <div class="footer_data_row">
                    <h2 v-if="objectData && userData.name">{{ isSettings ? objectData.group.group_name : userData.name }} <span v-if="windowWidth > 650 && (objectData &&
                        (objectData?.packages?.[objectData?.packages?.length - 1]?.package_name == 'Business' ||
                        objectData?.packages?.[objectData?.packages?.length - 1]?.package_name == 'Leader' || 
                        objectData?.packages?.[objectData?.packages?.length - 1]?.package_name == 'VIP' || 
                        (objectData.status && (objectData.status == 'Business' ||
                            objectData.status == 'Leader' || objectData.status == 'VIP')
                        )) ||
                        (objectData?.package_name == 'Business' ||
                        objectData?.package_name == 'Leader' ||
                        objectData?.package_name == 'VIP'))
                        " style="margin-left: 10px;">
                        {{ objectData?.packages?.[objectData?.packages?.length - 1]?.package_name ?? objectData.status ?? objectData?.package_name}}
                    </span></h2><br>
                    
                </div>
                <span class="id" v-if="objectData && objectData.vk_id && !objectData?.group_link && !objectData?.post_link && !objectData?.video_link">ID: {{ objectData.vk_id }}</span><br>
                <span class="sentence" style="word-break: break-word;" v-if="shouldDisplayText" >{{ objectData.sentence || objectData.group?.vip_offer_text || objectData?.vip_offer_text }}</span><br>
                <a v-if="objectData && (isSettings || (correctStatus.includes(objectData?.packages?.[objectData?.packages?.length - 1]?.package_name) || correctStatus.includes(objectData?.package_name)))" :href="objectData?.group_link && (objectData?.group_link == '' || objectData?.group_link.length == 0) ? `https://vk.com/id${objectData?.vk_id}` : objectData.group?.group_link || objectData?.group_link" target="_blank">Ссылка</a><br>
                <div v-if="windowWidth > 650 || isRotation" class="footer_data_links" style="margin-top: 20px;">
                    <a v-if="objectData" :href="vkData"  target="_blank"><img src="@/assets/images/vk.png"></a>
                    <a v-if="objectData" :href="tgData?.link"  target="_blank"><img src="@/assets/images/telegram.png"></a>
                    <a v-if="objectData" :href="whtData?.link" target="_blank"><img src="@/assets/images/whatsapp.png"></a>
                </div>
            </div>
        </div> -->


        <div class="left_col">
            <img v-if="objectData" :src="isSettings ? objectData.group.group_photo : (objectData.avatar_url ?? objectData.avatar)" class="avatar" style="margin-top: 15px;">
            <span class="label" v-if="windowWidth <= 650 && (objectData &&
                    (objectData?.packages?.[objectData?.packages?.length - 1]?.package_name == 'Business' ||
                     objectData?.packages?.[objectData?.packages?.length - 1]?.package_name == 'Leader' || 
                     objectData?.packages?.[objectData?.packages?.length - 1]?.package_name == 'VIP' || 
                     (objectData.status && (objectData.status == 'Business' ||
                        objectData.status == 'Leader' || objectData.status == 'VIP')
                     )) ||
                     (objectData?.package_name == 'Business' ||
                     objectData?.package_name == 'Leader' ||
                     objectData?.package_name == 'VIP'))
                     " style="margin-left: 10px;">
                    {{ objectData?.packages?.[objectData?.packages?.length - 1]?.package_name ?? objectData.status ?? objectData?.package_name}}
            </span>
        </div>
        <div class="footer_data_wrapper">
            <div class="footer_data_row">
                <h2 v-if="objectData && userData.name">{{ isSettings ? objectData.group.group_name : userData.name }} <span v-if="windowWidth > 650 && (objectData &&
                    (objectData?.packages?.[objectData?.packages?.length - 1]?.package_name == 'Business' ||
                     objectData?.packages?.[objectData?.packages?.length - 1]?.package_name == 'Leader' || 
                     objectData?.packages?.[objectData?.packages?.length - 1]?.package_name == 'VIP' || 
                     (objectData.status && (objectData.status == 'Business' ||
                        objectData.status == 'Leader' || objectData.status == 'VIP')
                     )) ||
                     (objectData?.package_name == 'Business' ||
                     objectData?.package_name == 'Leader' ||
                     objectData?.package_name == 'VIP'))
                     " style="margin-left: 10px;">
                    {{ objectData?.packages?.[objectData?.packages?.length - 1]?.package_name ?? objectData.status ?? objectData?.package_name}}
                </span></h2>
                
            </div>
            <span class="sentence" style="word-break: break-word;" v-if="shouldDisplayText" >{{ ' ' + (objectData.sentence || objectData.group?.vip_offer_text || objectData?.vip_offer_text) + ' ' }}</span>
            <a v-if="objectData && (isSettings || (correctStatus.includes(objectData?.packages?.[objectData?.packages?.length - 1]?.package_name) || correctStatus.includes(objectData?.package_name)))" :href="objectData?.group_link && (objectData?.group_link == '' || objectData?.group_link.length == 0) ? `https://vk.com/id${objectData?.vk_id}` : objectData.group?.group_link || objectData?.group_link" target="_blank">Ссылка</a>
            <div v-if="windowWidth > 650 || isRotation" class="footer_data_links" style="margin-top: 20px;">
                <a v-if="objectData" :href="vkData"  target="_blank"><img src="@/assets/images/vk.png"></a>
                <a v-if="objectData" :href="tgData?.link"  target="_blank"><img src="@/assets/images/telegram.png"></a>
                <a v-if="objectData" :href="whtData?.link" target="_blank"><img src="@/assets/images/whatsapp.png"></a>
            </div>
        </div>
        <div v-if="windowWidth <= 650 && !isRotation" class="footer_data_links" style="margin-top: 20px;margin-bottom: 20px;">
            <a v-if="objectData" :href="vkData"  target="_blank"><img src="@/assets/images/vk.png"></a>
            <a v-if="objectData" :href="tgData?.link"  target="_blank"><img src="@/assets/images/telegram.png"></a>
            <a v-if="objectData" :href="whtData?.link" target="_blank"><img src="@/assets/images/whatsapp.png"></a>
        </div>
        <span v-if="isBusiness || isSettings" class="business">Business-предложение</span>
        
    </div>
    <span v-else>Подождите, пока загрузятся данные.</span>
</template>

<script>
export default {
    props: {
        objectData: {
            type: Object,
            default: () => ({}), // Указываем пустой объект, чтобы избежать ошибок
        },
        isBusiness: Boolean,
        isSettings: Boolean,
        isRotation: Boolean,
    },
    data() {
        return {
            correctStatus: ["VIP", "Leader", "Business"],
            userData: {},
            tgData: "",
            whtData: "",
            vkData: "",
            windowWidth: 0,
        }
    },
    mounted() {
        this.windowWidth = window.innerWidth;
        console.log(this.windowWidth);

        window.addEventListener('resize', this.handleResize);
    },
    watch: {
        objectData: {
            immediate: true, // Срабатывает сразу после загрузки компонента
            handler(newValue) {
                if (newValue) {
                    this.userData = newValue;
                    if (this.userData?.social_links) {
                        this.tgData = this.userData?.social_links.filter(link => link.type === "Telegram").at(-1) || [];
                        this.whtData = this.userData?.social_links.filter(link => link.type === "Whatsapp").at(-1) || [];
                        this.vkData = `https://vk.com/id${this.userData.vk_id}`;
                    }
                }
            }
        }
    },
    computed: {
        shouldDisplayText() {
            const { objectData, correctStatus } = this;
            return (
            objectData && ( this.isSettings ||
            (objectData.group?.vip_offer_text !== '""' && objectData?.vip_offer_text !== '""') &&
            ((correctStatus.includes(objectData?.packages?.[objectData?.packages?.length - 1]?.package_name) ||
                correctStatus.includes(objectData?.package_name)) &&
            objectData?.vip_offer_text
            )));
        },
    },
    async created() {
        console.log('data', this.objectData);
    },
    methods: {
        handleResize() {
            this.windowWidth = window.innerWidth;
            console.log(this.windowWidth);
        },
    }
};
</script>


<style scoped>
    h2 {
        font-family: 'OpenSans';
        font-size: 20px;
        background: linear-gradient(to right, #7023EC, #A585DA); 
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }
    h1, h2, span, img, a {
        z-index: 4;
    }

    span {
        color: white;
        font-size: 18px;
        font-family: 'OpenSans';
    }
    .id {
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    a {
        text-decoration: underline;
        color: white;
        font-family: 'OpenSans';
        font-size: 16px;
        cursor: pointer;
    }
    .footer_data {
        display: flex;
        column-gap: 30px;
        width: fit-content;
        max-width: 100%;
        position: relative;

        @media (max-width: 1100px) {
            justify-content: center;
            align-items: center;
        }

        @media (max-width: 650px) {
            display: block; /* Отключаем Flexbox */
            overflow: hidden; /* Обеспечиваем корректное обтекание */
            padding: 15px;
        }
    }
    .footer_data > img {
        @media (max-width: 1200px) {
            width: 100px;
            height: 100px;
        }
        @media (max-width: 650px) {
            width: 90px;
            height: 90px;
        }
    }
    
    .left_col {
        display: flex;
        flex-direction: column;
        row-gap: 30px;

        @media (max-width: 650px) {
            float: left; /* Обтекание слева только на маленьких экранах */
            width: 120px; /* Ширина автоматическая */
            margin-right: 15px; /* Отступ справа для обтекания */
        }
    }

    .footer_data_wrapper {
        display: flex;
        flex-direction: column;
        row-gap: 10px;

        @media (max-width: 650px) {
            display: block;
            clear: right;
        }
    }
    .footer_data_wrapper > * {
        display: block;
    }
    .footer_data_row {
        display: flex;
        column-gap: 20px;
        align-items: start;
        @media (max-width: 650px) {
            flex-direction: column-reverse;
            align-items: start;
        }
    }
    .footer_data_row h2 {
        color: white;
        font-size: 20px;
        text-wrap: wrap;
        line-height: 1.5;
        @media (max-width: 650px) {
            font-size: 16px;
        }
        @media (max-width: 560px) {
            text-wrap: wrap;
        }
    }
    /* .footer_data_row span {
        color: white;
        font-size: 14px;
        padding: 0px 18px;
        background: #7023EC;
        border-radius: 5px;
        @media (max-width: 650px) {
            padding: 0 15px;
            line-height: 1.2;
        }
    } */
    .footer_data_row span {
        color: white;
        font-size: 14px;
        font-weight: bold;
        font-family: 'OpenSans';
        padding: 1px 18px;
        background: #7023EC;
        border-radius: 5px;
        width: max-content;
        word-wrap: break-word;
        @media (max-width: 650px) {
            font-size: 12px;
        }
    }
    .label {
        color: white;
        font-size: 14px;
        font-weight: bold;
        font-family: 'OpenSans';
        padding: 1px 18px;
        background: #7023EC;
        border-radius: 5px;
        width: max-content;
        word-wrap: break-word;
        @media (max-width: 650px) {
            font-size: 12px;
        }
    }
    .footer_data_links {
        display: flex;
        column-gap: 23px;
        @media (max-width: 650px) {
            column-gap: 19px;
            padding-top: 15px;
        }
    }
    .footer_data_links img {
        width: 35px;
        height: 35px;
        @media (max-width: 650px) {
            width: 25px;
            height: 25px;
        }

    }
    .footer_data_links a {
        z-index: 4;
        cursor: pointer;
    }
    .avatar {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        object-position: center;
        object-fit: cover;
        outline: 1px solid white; /* Толщина и цвет обводки */
        outline-offset: 10px;
        @media (max-width: 560px) {
            width: 100px;
            height: 100px;
        }
        @media (max-width: 650px) {
            width: 90px;
            height: 90px;
        }
    }
    .business {
        color: #23EC63;
        font-size: 16px;
        font-family: 'OpenSans';
        font-weight: 500;
        position: absolute;
        bottom: 20px;
        right: 20px;
        cursor: pointer;
        @media (max-width: 650px) {
            font-size: 12px;
        }
    }
    .sentence {
        margin-top: 20px; 
        @media (max-width: 650px) {
            margin-top: 10px;
            margin-bottom: 10px;
        }
    }




    .zopa_col {
        float: left;
        width: 120px;
    }
</style>