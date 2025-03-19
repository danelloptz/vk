<template>
    <div class="vip" v-if="vipUser">
        <div class="vip_user">
            <img :src="vipUser.avatar">
            <div class="text_wrapper">
                <h2>{{ vipUser.name }}</h2>
                <span>{{ vipUser.package_name }}</span>
            </div>
        </div>
        <span>{{ vipUser.vip_offer_text.slice(0, 60) }}</span>
        <a :href="vipUser.group_link" target="_blank">Ссылка</a>
        <div class="vip_footer">
            <div class="vip_links">
                <a :href="vkData" target="_blank"><img src="@/assets/images/vk.png"></a>
                <a :href="tgData?.link" target="_blank"><img src="@/assets/images/telegram.png"></a>
                <a :href="whtData?.link" target="_blank"><img src="@/assets/images/whatsapp.png"></a>
            </div>
            <span>VIP-предложение</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            vipUser: Object,
            vkData: String,
            tgData: Object,
            whtData: Object
        },
        watch: {
            vipUser(newValue) {
                console.log(newValue);
            }
        }
    };
</script>

<style scoped>
    span, a {
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
        word-wrap: break-word;
    }
    .vip {
        width: 229px;
        background: #2F3251;
        padding: 10px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .vip_user {
        display: flex;
        align-items: center;
        column-gap: 20px;
    }
    .vip_user img {
        width: 60px;
        height: 60px;
        border-radius: 30px;
        object-position: center;
    }
    .vip a {
        word-wrap: break-word;
    }
    .text_wrapper {
        display: flex;
        flex-direction: column;
        row-gap: 5px;
    }
    .text_wrapper h2 {
        color: white;
        font-size: 16px;
        font-family: 'OpenSans';
        font-weight: normal;
    }
    .text_wrapper span {
        color: white;
        font-size: 14px;
        font-weight: bold;
        font-family: 'OpenSans';
        padding: 1px 10px;
        background: #7023EC;
        border-radius: 5px;
        width: max-content;
        word-wrap: break-word;
    }
    .vip_footer {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .vip_links {
        display: flex;
        align-items: center;
        column-gap: 10px;
    }
    .vip_links a {
        cursor: pointer;
    }
    .vip_links img {
        width: 15px;
        height: 15px;
    }
    .vip_footer span {
        color: #23EC63;
        font-size: 10px;
        font-weight: 500;
        font-family: 'OpenSans';
    }
</style>