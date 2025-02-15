<template>
    <AppRotationPlans v-if="isPlans" />
    <section class="rotation_preview" v-if="isRotationPreview">
        <span>Вы можете увеличить количество целевых подписчиков на свою ВК группу совершенно бесплатно за счет прохождения Ротации. </span>
        <span>Ротация - это взаимовыгодная функция. Вам необходимо подписаться на 20 предложенных ВК групп, посмотреть одно ВК видео 20 секунд, и в ответ получаете 10 подписок на свою ВК группу.</span>
        <span>Если у вас активен премиальный тариф, то вы можете уменьшить количество личных подписок до 10. Чтобы подключить премиум нажмите «Выбрать тариф».</span>
        <div class="rotation_preview_btns">
            <AppBadButton :text="text1" @click="makeRotation"/>
            <AppGoodButton :text="text2" @click="openPlans" />
        </div>
    </section>
    <section class="rotation" v-if="isRotation">
        <span class="counter">Подписки {{ addGroups }} из {{ totalGroups }}</span>
        <div class="group">
            <AppGroupOrUser :v-if="groupInfo" :objectData="groupsQueue[currentGroupIndex]" />
            <div class="groups_block_btns">
                <AppGoodButton :text="text3" @click="subscribeGroup" />
                <AppBadButton :text="`${text4} (${skipCounts})`" @click="skipGroup" />
                <span class="error" v-if="noSkips">Не осталось пропусков!</span>
                <span class="error" v-if="noSubscribe">Не подписались!</span>
            </div>
        </div>
    </section>
    <section class="rotation_end" v-if="isRotationEnd">
        <span class="counter">Подписки {{ addGroups }} из {{ totalGroups }}</span>
        <strong><span>Вы успешно прошли Ротацию групп!</span></strong>
        <span>Ваша группа добавлена в список Ротации. Вы можете проходить ротацию сколько угодно раз, ограничений с нашей стороны нет. Активируйте премиальный тариф, чтобы получать еще больше подписок и просмотров без прохождения Ротаций. Узнайте, как получить максимально выгодные условия прямо сейчас:</span>
        <AppGoodButton :text="text2" @click="openPlans"  />
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import AppBadButton from "@/components/AppBadButton.vue";
    import AppGroupOrUser from "@/components/AppGroupOrUser.vue";
    import AppRotationPlans from "@/components/AppRotationPlans.vue";
    import { addInRotation, checkGroupSub } from "@/services/groups";
    import { getUserInfo } from "@/services/user";
    // import { getGroupInfo, isSubscribe } from "@/services/user"; !!!! РАССКОМЕНТИТЬ !!!!

    export default {
        components: { AppGoodButton, AppBadButton, AppGroupOrUser, AppRotationPlans },
        props: {
            isTarif: Boolean
        },
        data() {
            return {
                text1: "НАЧАТЬ РОТАЦИЮ",
                text2: "ВЫБРАТЬ ТАРИФ",
                text3: "ПОДПИСАТЬСЯ",
                text4: "ПРОПУСТИТЬ",
                isRotation: false,
                isRotationPreview: true,
                isRotationEnd: false,
                addGroups: 0,
                totalGroups: 20,
                skipCounts: 10,
                noSubscribe: false,
                noSkips: false,
                isPlans: false,
                userInfo: [],
                currentGroupIndex: 0,
                groupPriorities: ["first", "second", "third_and_fourth", "fifth", "other"],
                currentPriorityIndex: 0,
                groupsQueue: [],
            }
        },
        async created() {
            const response = await getUserInfo(localStorage.getItem("token"));
            this.userInfo = response;
            if (this.isTarif) {
                this.openPlans();
                this.$emit("update:isTarif", false);
            }
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
        },
        methods: {
            updateGroupQueue() {
                const priorityKey = this.groupPriorities[this.currentPriorityIndex];
                if (this.groupInfo && this.groupInfo[priorityKey]) {
                    console.log("обновляем очередь групп");
                    this.groupsQueue = this.groupInfo[priorityKey].slice(); // Копируем массив групп
                    this.currentGroupIndex = 0;
                }
            },
            makeRotation() {
                this.isRotationPreview = false;
                this.isRotationEnd = false;
                this.isRotation = true;
            },
            async endRotation() {
                const response = await addInRotation(this.userInfo.vk_id, "group");
                console.log(response.status);
                this.isRotationPreview = false;
                this.isRotationEnd = true;
                this.isRotation = false;
            },
            async subscribeGroup() {
                if (!this.groupsQueue.length) return;
                if (this.groupInfo) {
                    const newWindow = window.open(
                        this.groupsQueue[this.currentGroupIndex].social_links.vk,
                        "_blank",
                        "width=800, height=600"
                    );
                    const intervalId = setInterval(async () => {
                        if (newWindow.closed) { 
                            clearInterval(intervalId); 
                            const response = await checkGroupSub(this.groupsQueue[this.currentGroupIndex].social_links.vk, this.userInfo.vk_id, "registration");
                            console.log(response);

                            if (response.status) {
                                this.addGroups = this.addGroups + 1;
                                this.groupsQueue.splice(this.currentGroupIndex, 1);
                                this.noSubscribe = false;
                                this.noSkips = false;
                                if (this.addGroups == this.totalGroups) {
                                    this.$router.push('/signup_3');
                                }
                                if (this.subscribedCount >= 5 || this.groupsQueue.length === 0) {
                                    this.nextPriorityGroup();
                                }
                            }
                             else {
                                this.noSubscribe = true;
                            }
                        }
                    }, 500);
                    
                        
                }
            },
            skipGroup() {
                console.log("пропустили группу");
                if (this.skipCounts == 0) 
                    this.noSkips = true
                else {
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
            openPlans() {
                this.isPlans = true;
            }
        },
        watch: {
            isTarif(newValue) {
                if (newValue) this.openPlans();
            }
        }
    };
</script>

<style scoped>
    .rotation_preview {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        font-family: 'OpenSans';
    }
    .rotation_preview span {
        color: white;
        font-size: 18px;
    }
    .rotation_preview_btns {
        display: flex;
        column-gap: 30px;
    }
    .rotation, .rotation_end {
        display: flex;
        flex-direction: column;
        row-gap: 50px;
    }
    .rotation_end { row-gap: 30px; }
    .counter {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        padding: 10px 30px;
        background: #2F3251;
        width: fit-content;
        border-radius: 10px;
    }
    .group {
        display: flex;
        flex-direction: column;
        row-gap: 50px;
    }
    .groups_block_btns {
        display: flex;
        align-items: center;
        column-gap: 30px;
    }
    span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .error {
        color: red;
    }
</style>