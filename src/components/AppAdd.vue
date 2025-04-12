<template>
    <section 
        class="add_container"
        :style="{ 
            flexDirection: orientation === 'vertical' || (orientation === 'horizontal' && windowWidth <= 650) ? 'column' : 'row',
            gridTemplateColumns: orientation === 'vertical' || (orientation === 'horizontal' && windowWidth <= 650) ? '1fr' : '9fr 1fr',
            display: orientation === 'vertical' || (orientation === 'horizontal' && windowWidth <= 650) ? 'flex' : 'grid',
            marginBottom: orientation === 'horizontal' ? '50px' : '0px'
         }"
    >
        <div 
            class="img_wrapper"
            :style="{
                gridTemplateColumns: orientation === 'vertical' && windowWidth > 650 ? '1fr' : orientation === 'vertical' ? '1fr 1fr' : `repeat(${filteredData.length}, 1fr)`,
            }"
        >
            <img 
                v-for="(item, index) in filteredData"
                :key="index"
                :src="item.ads_img"
                :style="{
                    // aspectRatio: orientation === 'vertical' ? '1/1' : 'auto',
                    height: orientation === 'vertical' || (orientation === 'horizontal' && windowWidth <= 650) ? 'auto' : '140px',
                    maxWidth: orientation === 'vertical' ? 'auto' : '740px'
                }"
                @click="openLink(item.ads_url)"
            >
        </div>
        <div 
            class="text_wrapper"
            :style="{
                flexDirection: orientation === 'vertical' || (orientation === 'horizontal' && windowWidth <= 650) ? 'row' : 'column'
            }"
        >
            <div class="add">
                <img src="@/assets/images/add.png">
                <h2>Реклама</h2>
            </div>
            <AppGoodButton :text="text1" class="button" @click="order" />
        </div>
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    
    export default {
        components: { AppGoodButton },
        props: {
            orientation: String,
            data: Array,
            isClicked: Boolean
        },
        data() {
            return {
                text1: "ЗАКАЗАТЬ",
                windowWidth: window.innerWidth
            };
        },
        computed: {
            filteredData() {
                // if (this.windowWidth < 500) {
                //     return this.data.slice(0, 1);
                // }
                return this.data;
            }
        },
        methods: {
            handleResize() {
                this.windowWidth = window.innerWidth;
            },
            order() {
                console.log('clicked');
                this.$emit("update:isClicked", true);
            },
            openLink(url) {
                if (url) {
                    window.open(url, "_blank");
                }
            }
        },
        mounted() {
            window.addEventListener('resize', this.handleResize);
        },
        beforeUnmount() {
            window.removeEventListener('resize', this.handleResize);
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
    .add_container {
        display: grid;
        align-items: center;
        row-gap: 20px;
        column-gap: 20px;
        width: 100%;
        padding: 10px;
        position: relative;
        background: #2F3251;
        border-radius: 10px;
        @media (max-width: 650px) {
            grid-template-columns: 1fr;
            row-gap: 10px;
        }
    }
    .img_wrapper {
        display: grid;
        column-gap: 10px;
        row-gap: 10px;
        /* @media (max-width: 650px) {
            grid-template-columns: 1fr 1fr !important;
        } */
    }
    .img_wrapper img {
        width: 100%;
        object-fit: cover;
        object-position: center;
        cursor: pointer;
    }
    .add {
        display: flex;
        column-gap: 10px;
        align-items: center;
        justify-content: space-between;
    }
    .add h2 {
        font-size: 16px;
        font-weight: normal;
        font-family: 'OpenSans';
        color: white;
    }
    .text_wrapper {
        display: flex;
        align-items: center;
        column-gap: 22px;
        row-gap: 10px;
        width: 100%;
        @media (max-width: 650px) {
            justify-content: center;
        }
    }
    .button {
        font-size: 11px;
        height: 29px;
        width: 100px;
        @media (max-width: 650px) {
            font-size: 10px;
            width: 90px;
        }
    }
</style>