<template>
    <div class="footer_data" v-if="Object.keys(userData).length !== 0">
        <img v-if="objectData" :src="objectData.avatar" class="avatar" style="margin-top: 15px;">
        <div class="footer_data_wrapper">
            <div class="footer_data_row">
                <h2 v-if="objectData && userData.name">{{ userData.name }}</h2>
                <span v-if="objectData && 
                    (objectData?.packages?.[objectData?.packages?.length - 1]?.package_name == 'Business' ||
                     objectData?.packages?.[objectData?.packages?.length - 1]?.package_name == 'Leader' || 
                     (objectData.status && objectData.status == 'Business' ||
                        objectData.status == 'Leader'
                     )) ||
                     (objectData?.package_name == 'Business' ||
                     objectData?.package_name == 'Leader')
                     ">
                    {{ objectData?.packages?.[objectData?.packages?.length - 1]?.package_name ?? objectData.status ?? objectData?.package_name}}
                </span>
            </div>
            <span v-if="objectData && objectData.vk_id && !objectData?.group_link && !objectData?.post_link && !objectData?.video_link">ID: {{ objectData.vk_id }}</span>
            <span style="margin-top: 20px;" v-if="shouldDisplayText" >{{ objectData.sentence || objectData.group?.vip_offer_text || objectData?.vip_offer_text }}</span>
            <a v-if="objectData && ((correctStatus.includes(objectData?.packages?.[objectData?.packages?.length - 1]?.package_name) || correctStatus.includes(objectData?.package_name)))" :href="objectData.group?.group_link || objectData?.group_link" target="_blank">Ссылка</a>
            <div class="footer_data_links" style="margin-top: 20px;">
                <!-- !!!!!! РАССКОМЕНИТРОВАТЬ !!!!!! -->
                <!-- <a v-if="objectData" :href="objectData.links.vk"><img src="@/assets/images/vk.png"></a>
                <a v-if="objectData" :href="objectData.links.telegram"><img src="@/assets/images/telegram.png"></a>
                <a v-if="objectData" :href="objectData.links.whatsapp"><img src="@/assets/images/whatsapp.png"></a> -->
                <a v-if="objectData" :href="vkData"  target="_blank"><img src="@/assets/images/vk.png"></a>
                <a v-if="objectData" :href="tgData?.link"  target="_blank"><img src="@/assets/images/telegram.png"></a>
                <a v-if="objectData" :href="whtData?.link" target="_blank"><img src="@/assets/images/whatsapp.png"></a>
            </div>
        </div>
        <span v-if="isBusiness" class="business">Business-предложение</span>
        
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
        isBusiness: Boolean
    },
    data() {
        return {
            correctStatus: ["VIP", "Leader", "Business"],
            userData: {},
            tgData: "",
            whtData: "",
            vkData: "",
        }
    },
    watch: {
        objectData: {
            immediate: true, // Срабатывает сразу после загрузки компонента
            handler(newValue) {
                if (newValue) {
                    this.userData = newValue;
                    this.tgData = this.objectData?.social_links.find(link => link.type === "Telegram") || [];
                    this.whtData = this.objectData?.social_links.find(link => link.type === "Whatsapp") || [];
                    this.vkData = `https://vk.com/id${this.objectData.vk_id}`;
                }
            }
        }
    },
    computed: {
    shouldDisplayText() {
        const { objectData, correctStatus } = this;
        console.log(objectData.group?.vip_offer_text !== '""' && objectData?.vip_offer_text !== '""');
        return (
        objectData &&
        (objectData.group?.vip_offer_text !== '""' && objectData?.vip_offer_text !== '""') &&
        ((correctStatus.includes(objectData?.packages?.[objectData?.packages?.length - 1]?.package_name) ||
            correctStatus.includes(objectData?.package_name)) &&
        objectData?.vip_offer_text
        ));
    },
    },
    async created() {
        console.log('data', this.objectData);
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
        @media (max-width: 600px) {
            align-items: start;
            flex-direction: column;
            row-gap: 20px;
        }
    }
    .footer_data > img {
        @media (max-width: 1200px) {
            width: 100px;
            height: 100px;
        }
    }
    .footer_data_wrapper {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .footer_data_row {
        display: flex;
        column-gap: 20px;
        align-items: center;
        @media (max-width: 650px) {
            flex-direction: column-reverse;
            align-items: start;
        }
    }
    .footer_data_row h2 {
        color: white;
        font-size: 20px;
        text-wrap: nowrap;
        @media (max-width: 560px) {
            text-wrap: wrap;
        }
    }
    .footer_data_row span {
        color: white;
        font-size: 14px;
        padding: 0px 18px;
        background: #7023EC;
        border-radius: 5px;
        @media (max-width: 650px) {
            padding: 0 15px;
            line-height: 1.2;
        }
    }
    .footer_data_links {
        display: flex;
        column-gap: 23px;
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
    }
</style>