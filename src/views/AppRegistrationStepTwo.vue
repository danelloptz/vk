<template>
    <section class="modal">
        <div class="modal-background"></div>
        <img src="@/assets/images/close.png" class="close" @click="this.$router.push('/signup_1')">
        <div class="text_wrapper">
            <h1>ШАГ 2 - ПОДПИШИТЕСЬ НА УКАЗАННЫЕ ГРУППЫ</h1>
            <span style="font-weight: bold;">Почему это важно?</span>
            <span>1. Это активирует ваш аккаунт и искусственный интеллект поможет вам вести бизнес на полном автомате, включая рекламу и подписную базу.</span>
            <span>2. Вы займете место в бинаре и с этого момента начнете получать перелив от вышестоящих рефереров, что открывает для вас невероятные финансовые возможности. Время — ваш главный союзник.</span>
            <span>3. Сразу после активации получите подарок — «Как удвоить продажи через ВК за 30 дней. 10 секретов быстрого продвижения бизнеса».</span>
            <span>Активируйтесь прямо сейчас и используйте все преимущества сервиса Intelektaz!</span>
        </div>
        <div class="add_block">
            <span>Добавлено {{ addGroups }} из {{ totalGroups }}</span>
            <hr>
        </div>
        <div class="groups_block">
            <AppGroupOrUser :v-if="groupInfo" :objectData="groupsQueue[currentGroupIndex]" />
            <div class="groups_block_btns">
                <AppGoodButton :text="text1" @click="subscribeGroup" />
                <AppBadButton :text="`${text2} (${skipCounts})`" @click="skipGroup" />
                <span class="error_message" v-if="noSkips">Не осталось пропусков!</span>
                <span class="error_message" v-if="noSubscribe">Не подписались!</span>
            </div>
        </div>
    </section>
</template>

<script>
    import AppGroupOrUser from '@/components/AppGroupOrUser.vue';
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppBadButton from '@/components/AppBadButton.vue';
    // import { getGroupInfo, isSubscribe } from '@/services/user';  !!!!! РАБОЧАЯ ВЕРСИЯ, РАССКОМЕНТИРОВАТЬ !!!!!
    // import { checkGroupSub, getGroups } from '@/services/groups';
    import { checkGroupSub } from '@/services/groups';
    import { getUserInfo } from '@/services/user';

    export default {
        components: { AppGroupOrUser, AppGoodButton, AppBadButton },
        data() {
            return {
                addGroups: 23,
                totalGroups: 25,
                skipCounts: 10,
                groupInfo: null,
                userInfo: [],
                text1: "ПОДПИСАТЬСЯ",
                text2: "ПРОПУСТИТЬ",
                noSkips: false,
                noSubscribe: false,
                currentGroupIndex: 0,
                groupPriorities: ["first", "second", "third_and_fourth", "fifth", "other"],
                currentPriorityIndex: 0,
                groupsQueue: [],
                subscribedCount: 0,
                waitingForCheck: false, // Флаг для отслеживания момента проверки подписки
            };
        },
        async created() {
            const response = await getUserInfo(localStorage.getItem("token"));
            this.userInfo = response;
            // const groups = await getGroups(this.userInfo.vk_id);
            // this.groupInfo = groups;
            this.groupInfo = {
                "first": [
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/iZ2SPDVQaTLtPhczqLbeR604L4-V_83bxIPkkNK_XRDt0MRJJS3iSMey8_o3G03yzMT3GslodZtGSa5ldtXXLjDI.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "Профком обучающихся ПетрГУ","social_links": {"vk" : "https://vk.com/profcom.petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/iZ2SPDVQaTLtPhczqLbeR604L4-V_83bxIPkkNK_XRDt0MRJJS3iSMey8_o3G03yzMT3GslodZtGSa5ldtXXLjDI.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "Профком обучающихся ПетрГУ","social_links": {"vk" : "https://vk.com/profcom.petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/iZ2SPDVQaTLtPhczqLbeR604L4-V_83bxIPkkNK_XRDt0MRJJS3iSMey8_o3G03yzMT3GslodZtGSa5ldtXXLjDI.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "Профком обучающихся ПетрГУ","social_links": {"vk" : "https://vk.com/profcom.petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/iZ2SPDVQaTLtPhczqLbeR604L4-V_83bxIPkkNK_XRDt0MRJJS3iSMey8_o3G03yzMT3GslodZtGSa5ldtXXLjDI.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "Профком обучающихся ПетрГУ","social_links": {"vk" : "https://vk.com/profcom.petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/iZ2SPDVQaTLtPhczqLbeR604L4-V_83bxIPkkNK_XRDt0MRJJS3iSMey8_o3G03yzMT3GslodZtGSa5ldtXXLjDI.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "Профком обучающихся ПетрГУ","social_links": {"vk" : "https://vk.com/profcom.petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/iZ2SPDVQaTLtPhczqLbeR604L4-V_83bxIPkkNK_XRDt0MRJJS3iSMey8_o3G03yzMT3GslodZtGSa5ldtXXLjDI.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "Профком обучающихся ПетрГУ","social_links": {"vk" : "https://vk.com/profcom.petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/iZ2SPDVQaTLtPhczqLbeR604L4-V_83bxIPkkNK_XRDt0MRJJS3iSMey8_o3G03yzMT3GslodZtGSa5ldtXXLjDI.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "Профком обучающихся ПетрГУ","social_links": {"vk" : "https://vk.com/profcom.petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/iZ2SPDVQaTLtPhczqLbeR604L4-V_83bxIPkkNK_XRDt0MRJJS3iSMey8_o3G03yzMT3GslodZtGSa5ldtXXLjDI.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "Профком обучающихся ПетрГУ","social_links": {"vk" : "https://vk.com/profcom.petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/iZ2SPDVQaTLtPhczqLbeR604L4-V_83bxIPkkNK_XRDt0MRJJS3iSMey8_o3G03yzMT3GslodZtGSa5ldtXXLjDI.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "Профком обучающихся ПетрГУ","social_links": {"vk" : "https://vk.com/profcom.petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/iZ2SPDVQaTLtPhczqLbeR604L4-V_83bxIPkkNK_XRDt0MRJJS3iSMey8_o3G03yzMT3GslodZtGSa5ldtXXLjDI.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "Профком обучающихся ПетрГУ","social_links": {"vk" : "https://vk.com/profcom.petrsu","telegram" : "","whatsapp" : "",}},
                    ],
                    "second": [
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/VpClicsvi4pmCaWXsCYRSqYjpXZRaUK8sLIwnqYBnzFpux0hkkWVDd3gt_IWkfeJaFJJht5jb7lhhn1u5t3EDddg.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "KARJALA GREEN | ФЕРМЕРСКАЯ ЗЕЛЕНЬ","social_links": {"vk" : "https://vk.com/karjalagreen","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/VpClicsvi4pmCaWXsCYRSqYjpXZRaUK8sLIwnqYBnzFpux0hkkWVDd3gt_IWkfeJaFJJht5jb7lhhn1u5t3EDddg.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "KARJALA GREEN | ФЕРМЕРСКАЯ ЗЕЛЕНЬ","social_links": {"vk" : "https://vk.com/karjalagreen","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/VpClicsvi4pmCaWXsCYRSqYjpXZRaUK8sLIwnqYBnzFpux0hkkWVDd3gt_IWkfeJaFJJht5jb7lhhn1u5t3EDddg.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "KARJALA GREEN | ФЕРМЕРСКАЯ ЗЕЛЕНЬ","social_links": {"vk" : "https://vk.com/karjalagreen","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/VpClicsvi4pmCaWXsCYRSqYjpXZRaUK8sLIwnqYBnzFpux0hkkWVDd3gt_IWkfeJaFJJht5jb7lhhn1u5t3EDddg.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "KARJALA GREEN | ФЕРМЕРСКАЯ ЗЕЛЕНЬ","social_links": {"vk" : "https://vk.com/karjalagreen","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/VpClicsvi4pmCaWXsCYRSqYjpXZRaUK8sLIwnqYBnzFpux0hkkWVDd3gt_IWkfeJaFJJht5jb7lhhn1u5t3EDddg.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "KARJALA GREEN | ФЕРМЕРСКАЯ ЗЕЛЕНЬ","social_links": {"vk" : "https://vk.com/karjalagreen","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/VpClicsvi4pmCaWXsCYRSqYjpXZRaUK8sLIwnqYBnzFpux0hkkWVDd3gt_IWkfeJaFJJht5jb7lhhn1u5t3EDddg.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "KARJALA GREEN | ФЕРМЕРСКАЯ ЗЕЛЕНЬ","social_links": {"vk" : "https://vk.com/karjalagreen","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/VpClicsvi4pmCaWXsCYRSqYjpXZRaUK8sLIwnqYBnzFpux0hkkWVDd3gt_IWkfeJaFJJht5jb7lhhn1u5t3EDddg.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "KARJALA GREEN | ФЕРМЕРСКАЯ ЗЕЛЕНЬ","social_links": {"vk" : "https://vk.com/karjalagreen","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/VpClicsvi4pmCaWXsCYRSqYjpXZRaUK8sLIwnqYBnzFpux0hkkWVDd3gt_IWkfeJaFJJht5jb7lhhn1u5t3EDddg.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "KARJALA GREEN | ФЕРМЕРСКАЯ ЗЕЛЕНЬ","social_links": {"vk" : "https://vk.com/karjalagreen","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/VpClicsvi4pmCaWXsCYRSqYjpXZRaUK8sLIwnqYBnzFpux0hkkWVDd3gt_IWkfeJaFJJht5jb7lhhn1u5t3EDddg.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "KARJALA GREEN | ФЕРМЕРСКАЯ ЗЕЛЕНЬ","social_links": {"vk" : "https://vk.com/karjalagreen","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-21.userapi.com/s/v1/ig2/VpClicsvi4pmCaWXsCYRSqYjpXZRaUK8sLIwnqYBnzFpux0hkkWVDd3gt_IWkfeJaFJJht5jb7lhhn1u5t3EDddg.jpg?quality=95&crop=0,0,1080,1080&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=200x200","name": "KARJALA GREEN | ФЕРМЕРСКАЯ ЗЕЛЕНЬ","social_links": {"vk" : "https://vk.com/karjalagreen","telegram" : "","whatsapp" : "",}},

                    ],
                    "third_and_fourth": [
                        {"avatar" : "https://sun6-23.userapi.com/s/v1/ig2/chRW6P1fuOl-7644XvhUbA7qfbvDpaV7_KczOb2gh5_wjq-gTiI_ey0ejNtnifJfE4_6Af3fcbkGd1_li13CAsRz.jpg?quality=95&crop=210,46,534,534&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480&ava=1&cs=200x200","name": "ЗАРЯД  ШАУРМЫ","social_links": {"vk" : "https://vk.com/zaryad_shaurmy","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-23.userapi.com/s/v1/ig2/chRW6P1fuOl-7644XvhUbA7qfbvDpaV7_KczOb2gh5_wjq-gTiI_ey0ejNtnifJfE4_6Af3fcbkGd1_li13CAsRz.jpg?quality=95&crop=210,46,534,534&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480&ava=1&cs=200x200","name": "ЗАРЯД  ШАУРМЫ","social_links": {"vk" : "https://vk.com/zaryad_shaurmy","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-23.userapi.com/s/v1/ig2/chRW6P1fuOl-7644XvhUbA7qfbvDpaV7_KczOb2gh5_wjq-gTiI_ey0ejNtnifJfE4_6Af3fcbkGd1_li13CAsRz.jpg?quality=95&crop=210,46,534,534&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480&ava=1&cs=200x200","name": "ЗАРЯД  ШАУРМЫ","social_links": {"vk" : "https://vk.com/zaryad_shaurmy","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-23.userapi.com/s/v1/ig2/chRW6P1fuOl-7644XvhUbA7qfbvDpaV7_KczOb2gh5_wjq-gTiI_ey0ejNtnifJfE4_6Af3fcbkGd1_li13CAsRz.jpg?quality=95&crop=210,46,534,534&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480&ava=1&cs=200x200","name": "ЗАРЯД  ШАУРМЫ","social_links": {"vk" : "https://vk.com/zaryad_shaurmy","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-23.userapi.com/s/v1/ig2/chRW6P1fuOl-7644XvhUbA7qfbvDpaV7_KczOb2gh5_wjq-gTiI_ey0ejNtnifJfE4_6Af3fcbkGd1_li13CAsRz.jpg?quality=95&crop=210,46,534,534&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480&ava=1&cs=200x200","name": "ЗАРЯД  ШАУРМЫ","social_links": {"vk" : "https://vk.com/zaryad_shaurmy","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-23.userapi.com/s/v1/ig2/chRW6P1fuOl-7644XvhUbA7qfbvDpaV7_KczOb2gh5_wjq-gTiI_ey0ejNtnifJfE4_6Af3fcbkGd1_li13CAsRz.jpg?quality=95&crop=210,46,534,534&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480&ava=1&cs=200x200","name": "ЗАРЯД  ШАУРМЫ","social_links": {"vk" : "https://vk.com/zaryad_shaurmy","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-23.userapi.com/s/v1/ig2/chRW6P1fuOl-7644XvhUbA7qfbvDpaV7_KczOb2gh5_wjq-gTiI_ey0ejNtnifJfE4_6Af3fcbkGd1_li13CAsRz.jpg?quality=95&crop=210,46,534,534&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480&ava=1&cs=200x200","name": "ЗАРЯД  ШАУРМЫ","social_links": {"vk" : "https://vk.com/zaryad_shaurmy","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-23.userapi.com/s/v1/ig2/chRW6P1fuOl-7644XvhUbA7qfbvDpaV7_KczOb2gh5_wjq-gTiI_ey0ejNtnifJfE4_6Af3fcbkGd1_li13CAsRz.jpg?quality=95&crop=210,46,534,534&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480&ava=1&cs=200x200","name": "ЗАРЯД  ШАУРМЫ","social_links": {"vk" : "https://vk.com/zaryad_shaurmy","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-23.userapi.com/s/v1/ig2/chRW6P1fuOl-7644XvhUbA7qfbvDpaV7_KczOb2gh5_wjq-gTiI_ey0ejNtnifJfE4_6Af3fcbkGd1_li13CAsRz.jpg?quality=95&crop=210,46,534,534&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480&ava=1&cs=200x200","name": "ЗАРЯД  ШАУРМЫ","social_links": {"vk" : "https://vk.com/zaryad_shaurmy","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-23.userapi.com/s/v1/ig2/chRW6P1fuOl-7644XvhUbA7qfbvDpaV7_KczOb2gh5_wjq-gTiI_ey0ejNtnifJfE4_6Af3fcbkGd1_li13CAsRz.jpg?quality=95&crop=210,46,534,534&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480&ava=1&cs=200x200","name": "ЗАРЯД  ШАУРМЫ","social_links": {"vk" : "https://vk.com/zaryad_shaurmy","telegram" : "","whatsapp" : "",}},
                    ],
                    "fifth": [
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/wRXZgCvHR3J_8C-oL7GhfohlyNXkvqmxi53StIUbiW7qL85ae1z8ywZj5-qcuqJaoXKYaeRtQGp3QHvHnGh8W2yz.jpg?quality=95&crop=414,396,1312,1312&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280&ava=1&cs=200x200","name": "Время есть | Сеть кафе в ПетрГУ","social_links": {"vk" : "https://vk.com/cafe_petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/wRXZgCvHR3J_8C-oL7GhfohlyNXkvqmxi53StIUbiW7qL85ae1z8ywZj5-qcuqJaoXKYaeRtQGp3QHvHnGh8W2yz.jpg?quality=95&crop=414,396,1312,1312&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280&ava=1&cs=200x200","name": "Время есть | Сеть кафе в ПетрГУ","social_links": {"vk" : "https://vk.com/cafe_petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/wRXZgCvHR3J_8C-oL7GhfohlyNXkvqmxi53StIUbiW7qL85ae1z8ywZj5-qcuqJaoXKYaeRtQGp3QHvHnGh8W2yz.jpg?quality=95&crop=414,396,1312,1312&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280&ava=1&cs=200x200","name": "Время есть | Сеть кафе в ПетрГУ","social_links": {"vk" : "https://vk.com/cafe_petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/wRXZgCvHR3J_8C-oL7GhfohlyNXkvqmxi53StIUbiW7qL85ae1z8ywZj5-qcuqJaoXKYaeRtQGp3QHvHnGh8W2yz.jpg?quality=95&crop=414,396,1312,1312&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280&ava=1&cs=200x200","name": "Время есть | Сеть кафе в ПетрГУ","social_links": {"vk" : "https://vk.com/cafe_petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/wRXZgCvHR3J_8C-oL7GhfohlyNXkvqmxi53StIUbiW7qL85ae1z8ywZj5-qcuqJaoXKYaeRtQGp3QHvHnGh8W2yz.jpg?quality=95&crop=414,396,1312,1312&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280&ava=1&cs=200x200","name": "Время есть | Сеть кафе в ПетрГУ","social_links": {"vk" : "https://vk.com/cafe_petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/wRXZgCvHR3J_8C-oL7GhfohlyNXkvqmxi53StIUbiW7qL85ae1z8ywZj5-qcuqJaoXKYaeRtQGp3QHvHnGh8W2yz.jpg?quality=95&crop=414,396,1312,1312&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280&ava=1&cs=200x200","name": "Время есть | Сеть кафе в ПетрГУ","social_links": {"vk" : "https://vk.com/cafe_petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/wRXZgCvHR3J_8C-oL7GhfohlyNXkvqmxi53StIUbiW7qL85ae1z8ywZj5-qcuqJaoXKYaeRtQGp3QHvHnGh8W2yz.jpg?quality=95&crop=414,396,1312,1312&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280&ava=1&cs=200x200","name": "Время есть | Сеть кафе в ПетрГУ","social_links": {"vk" : "https://vk.com/cafe_petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/wRXZgCvHR3J_8C-oL7GhfohlyNXkvqmxi53StIUbiW7qL85ae1z8ywZj5-qcuqJaoXKYaeRtQGp3QHvHnGh8W2yz.jpg?quality=95&crop=414,396,1312,1312&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280&ava=1&cs=200x200","name": "Время есть | Сеть кафе в ПетрГУ","social_links": {"vk" : "https://vk.com/cafe_petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/wRXZgCvHR3J_8C-oL7GhfohlyNXkvqmxi53StIUbiW7qL85ae1z8ywZj5-qcuqJaoXKYaeRtQGp3QHvHnGh8W2yz.jpg?quality=95&crop=414,396,1312,1312&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280&ava=1&cs=200x200","name": "Время есть | Сеть кафе в ПетрГУ","social_links": {"vk" : "https://vk.com/cafe_petrsu","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/wRXZgCvHR3J_8C-oL7GhfohlyNXkvqmxi53StIUbiW7qL85ae1z8ywZj5-qcuqJaoXKYaeRtQGp3QHvHnGh8W2yz.jpg?quality=95&crop=414,396,1312,1312&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280&ava=1&cs=200x200","name": "Время есть | Сеть кафе в ПетрГУ","social_links": {"vk" : "https://vk.com/cafe_petrsu","telegram" : "","whatsapp" : "",}},
                    ],
                    "other": [
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/lTefR5rWvAFQyQhF4abM3tAIuj8QaZrqJZMKG1xBom3nvlJgGne3Dvf1yNxFGeDV6X44dnkpViGpEn6-mMya-qvO.jpg?quality=95&crop=0,0,1000,1000&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200","name": "ГРАД МАСТЕРОВ ∙ Строительная компания","social_links": {"vk" : "https://vk.com/gradmasterov_ptz","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/lTefR5rWvAFQyQhF4abM3tAIuj8QaZrqJZMKG1xBom3nvlJgGne3Dvf1yNxFGeDV6X44dnkpViGpEn6-mMya-qvO.jpg?quality=95&crop=0,0,1000,1000&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200","name": "ГРАД МАСТЕРОВ ∙ Строительная компания","social_links": {"vk" : "https://vk.com/gradmasterov_ptz","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/lTefR5rWvAFQyQhF4abM3tAIuj8QaZrqJZMKG1xBom3nvlJgGne3Dvf1yNxFGeDV6X44dnkpViGpEn6-mMya-qvO.jpg?quality=95&crop=0,0,1000,1000&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200","name": "ГРАД МАСТЕРОВ ∙ Строительная компания","social_links": {"vk" : "https://vk.com/gradmasterov_ptz","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/lTefR5rWvAFQyQhF4abM3tAIuj8QaZrqJZMKG1xBom3nvlJgGne3Dvf1yNxFGeDV6X44dnkpViGpEn6-mMya-qvO.jpg?quality=95&crop=0,0,1000,1000&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200","name": "ГРАД МАСТЕРОВ ∙ Строительная компания","social_links": {"vk" : "https://vk.com/gradmasterov_ptz","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/lTefR5rWvAFQyQhF4abM3tAIuj8QaZrqJZMKG1xBom3nvlJgGne3Dvf1yNxFGeDV6X44dnkpViGpEn6-mMya-qvO.jpg?quality=95&crop=0,0,1000,1000&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200","name": "ГРАД МАСТЕРОВ ∙ Строительная компания","social_links": {"vk" : "https://vk.com/gradmasterov_ptz","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/lTefR5rWvAFQyQhF4abM3tAIuj8QaZrqJZMKG1xBom3nvlJgGne3Dvf1yNxFGeDV6X44dnkpViGpEn6-mMya-qvO.jpg?quality=95&crop=0,0,1000,1000&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200","name": "ГРАД МАСТЕРОВ ∙ Строительная компания","social_links": {"vk" : "https://vk.com/gradmasterov_ptz","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/lTefR5rWvAFQyQhF4abM3tAIuj8QaZrqJZMKG1xBom3nvlJgGne3Dvf1yNxFGeDV6X44dnkpViGpEn6-mMya-qvO.jpg?quality=95&crop=0,0,1000,1000&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200","name": "ГРАД МАСТЕРОВ ∙ Строительная компания","social_links": {"vk" : "https://vk.com/gradmasterov_ptz","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/lTefR5rWvAFQyQhF4abM3tAIuj8QaZrqJZMKG1xBom3nvlJgGne3Dvf1yNxFGeDV6X44dnkpViGpEn6-mMya-qvO.jpg?quality=95&crop=0,0,1000,1000&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200","name": "ГРАД МАСТЕРОВ ∙ Строительная компания","social_links": {"vk" : "https://vk.com/gradmasterov_ptz","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/lTefR5rWvAFQyQhF4abM3tAIuj8QaZrqJZMKG1xBom3nvlJgGne3Dvf1yNxFGeDV6X44dnkpViGpEn6-mMya-qvO.jpg?quality=95&crop=0,0,1000,1000&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200","name": "ГРАД МАСТЕРОВ ∙ Строительная компания","social_links": {"vk" : "https://vk.com/gradmasterov_ptz","telegram" : "","whatsapp" : "",}},
                        {"avatar" : "https://sun6-22.userapi.com/s/v1/ig2/lTefR5rWvAFQyQhF4abM3tAIuj8QaZrqJZMKG1xBom3nvlJgGne3Dvf1yNxFGeDV6X44dnkpViGpEn6-mMya-qvO.jpg?quality=95&crop=0,0,1000,1000&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200","name": "ГРАД МАСТЕРОВ ∙ Строительная компания","social_links": {"vk" : "https://vk.com/gradmasterov_ptz","telegram" : "","whatsapp" : "",}},
                    ],
            }
            this.updateGroupQueue();

            // Добавляем обработчики событий
            document.addEventListener("visibilitychange", this.handleVisibilityChange);
            window.addEventListener("focus", this.handleFocus);
        },
        beforeUnmount() {
            // Убираем обработчики событий при уничтожении компонента
            document.removeEventListener("visibilitychange", this.handleVisibilityChange);
            window.removeEventListener("focus", this.handleFocus);
        },
        methods: {
            updateGroupQueue() {
                const priorityKey = this.groupPriorities[this.currentPriorityIndex];
                if (this.groupInfo && this.groupInfo[priorityKey]) {
                    console.log("Обновляем очередь групп");
                    this.groupsQueue = this.groupInfo[priorityKey].slice(); // Копируем массив групп
                    this.currentGroupIndex = 0;
                }
            },
            async subscribeGroup() {
                if (!this.groupsQueue.length) return;
                if (this.groupInfo) {
                    const groupLink = this.groupsQueue[this.currentGroupIndex].social_links.vk;
                    const newWindow = window.open(groupLink, "_blank", "width=800, height=600");

                    this.waitingForCheck = true; // Устанавливаем флаг ожидания проверки

                    const intervalId = setInterval(async () => {
                        if (newWindow.closed) {
                            clearInterval(intervalId);
                            this.checkSubscription(groupLink);
                        }
                    }, 500);
                }
            },
            async checkSubscription(groupLink) {
                if (!this.waitingForCheck) return;
                this.waitingForCheck = false;
                const response = await checkGroupSub(groupLink, this.userInfo.vk_id, "registration");
                console.log(response);

                if (response.status) {
                    this.addGroups++;
                    this.groupsQueue.splice(this.currentGroupIndex, 1);
                    this.subscribedCount++;
                    this.noSubscribe = false;

                    if (this.addGroups === this.totalGroups) {
                        this.$router.push("/signup_3");
                    }
                    if (this.subscribedCount >= 5 || this.groupsQueue.length === 0) {
                        this.nextPriorityGroup();
                    }
                } else {
                    this.noSubscribe = true;
                }
            },
            skipGroup() {
                console.log("Пропустили группу");
                if (this.skipCounts === 0) {
                    this.noSkips = true;
                } else {
                    this.skipCounts--;
                    this.groupsQueue.splice(this.currentGroupIndex, 1);
                    if (this.groupsQueue.length === 0) {
                        this.nextPriorityGroup();
                    }
                }
            },
            nextPriorityGroup() {
                console.log("Новая группа");
                this.subscribedCount = 0;
                this.currentPriorityIndex++;

                if (this.currentPriorityIndex < this.groupPriorities.length) {
                    this.updateGroupQueue();
                } else {
                    console.log("Все группы обработаны.");
                }
            },
            handleVisibilityChange() {
                if (!document.hidden && this.waitingForCheck) {
                    this.checkSubscription(this.groupsQueue[this.currentGroupIndex]?.social_links.vk);
                }
            },
            handleFocus() {
                if (this.waitingForCheck) {
                    this.checkSubscription(this.groupsQueue[this.currentGroupIndex]?.social_links.vk);
                }
            },
        },
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

    .modal {
        width: 1160px;
        border-radius: 10px;
        position: relative; /* Обеспечиваем позиционирование для псевдоэлемента */
        display: flex;
        flex-direction: column;
        /* align-items: center; */
        padding: 50px;
        z-index: 2;
        overflow-y: auto;
        scrollbar-width: none;
        row-gap: 30px;
        box-sizing: border-box;
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
    .text_wrapper {
        display: flex;
        flex-direction: column;
        align-items: start;
        row-gap: 20px;
    }
    h1 {
        font-size: 36px;
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
    span {
        font-size: 18px;
        font-family: 'OpenSans';
        font-weight: 400;
        line-height: 32.68px;
        color: white;
        text-wrap: wrap;
        text-align: left;
        font-family: 'OpenSans';
        @media (max-width: 900px) {
            font-size: 20px;
        }
        @media (max-width: 650px) {
            font-size: 17px;
        }
    }
    .add_block {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .add_block span {
        background: #2F3251;
        color: white;
        padding: 0px 20px;
        border-radius: 5px 5px 0px 0px;
        line-height: 2;
        }
    hr {
        width: 100%;
        height: 1px;
        background-color: white;
        @media (max-width: 900px) {
            width: 95%;
        }
    }
    .groups_block {
        display: flex;
        justify-content: space-between;
        align-items: end;
        @media (max-width: 1300px) {
            justify-content: center;
            column-gap: 30px;
        }
        @media (max-width: 900px) {
            flex-direction: column;
            row-gap: 30px;
            align-items: center;
        }
    }
    .groups_block_btns {
        display: flex;
        column-gap: 20px;
        @media (max-width: 1300px) {
            flex-direction: column;
            row-gap: 20px;
        }
        @media (max-width: 900px) {
            justify-content: center;
            flex-direction: row;
        }
    }
    .error_message {
        font-size: 14px;
        color: red;
        position: absolute;
        bottom: 15px;
        right: 50px;
    }

</style>