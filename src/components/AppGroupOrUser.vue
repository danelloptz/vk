<template>
    <div class="footer_data">
        <img v-if="objectData" :src="require(`@/assets/images/${objectData.img}`)" class="avatar">
        <div class="footer_data_wrapper">
            <div class="footer_data_row">
                <h2 v-if="objectData">{{ objectData.name }}</h2>
                <span v-if="objectData && objectData.status != 'Free'">{{ objectData.status }}</span>
            </div>
            <span v-if="objectData && (objectData.id || objectData.sentence && correctStatus.includes(objectData.status))">{{ objectData.id || objectData.sentence }}</span>
            <div class="footer_data_links">
                <a v-if="objectData" :href="objectData.links.vk"><img src="@/assets/images/vk.png"></a>
                <a v-if="objectData" :href="objectData.links.telegram"><img src="@/assets/images/telegram.png"></a>
                <a v-if="objectData" :href="objectData.links.whatsapp"><img src="@/assets/images/whatsapp.png"></a>
            </div>
        </div>
        
    </div>
</template>

<script>
    export default {
        props: {
            objectData: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                correctStatus: ["VIP", "Leader", "Business"],
            }
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
    h1, h2, span, img {
        z-index: 5;
    }

    span {
        color: white;
        font-size: 18px;
        font-family: 'OpenSans';
    }
    .footer_data {
        display: flex;
        column-gap: 30px;
        align-items: center;
        @media (max-width: 1100px) {
            justify-content: center;
            align-items: center;
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
        z-index: 10;
        cursor: pointer;
    }
    .avatar {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        object-position: center;
        object-fit: cover;
        @media (max-width: 560px) {
            width: 100px;
            height: 100px;
        }
    }
</style>