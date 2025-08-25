<template>
    <div class="switch_mob">
        <span class="active" @click="openDrowdown">
            {{ listSwtich[activeIndex].name }}
            <img src="@/assets/images/arrow_down.png" 
                class="arrow_down"
                :class="{ rotated: isDropdown }"
            >
        </span>
        <div class="dropdown" v-if="isDropdown">
            <span
                v-for="(item, index) in filteredListSwtich"
                :key="index"
                class="item_mob"
                @click="setActive(item.index)"
            >{{ item.name }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            listSwtich: Object,
        },
        data() {
            return {
                isDropdown: false,
                helpFlag: false,
                activeIndex: 0
            }
        },
        computed: {
            filteredListSwtich() {
                return this.listSwtich.filter((_, index) => index != this.activeIndex);
            }
        },
        methods: {
            openDrowdown() {
                this.isDropdown = !this.isDropdown;
                if (this.isDropdown) document.addEventListener("click", this.handleClickOutside)
                else document.removeEventListener("click", this.handleClickOutside);
            },
            handleClickOutside(event) {
                const path = event.composedPath();
                const wrapperNavMobile = path.find(el => el.classList?.contains("switch_mob"));
                if (!wrapperNavMobile && this.helpFlag) {
                    this.isDropdown = false;
                    this.helpFlag = false;
                }
                this.helpFlag = true;
            },
            // handleClickOutside(event) {
            //     const path = event.composedPath();
            //     const wrapperNavMobile = this.$el.querySelector(".switch_mob");
            //     console.log(path, wrapperNavMobile);
            //     console.log(!path.includes(wrapperNavMobile), this.helpFlag);
            //     if (!path.includes(wrapperNavMobile) && this.helpFlag) {
            //         this.isDropdown = false;
            //         this.helpFlag = false;
            //     }
            //     this.helpFlag = true;
            // },
            setActive(index) {
                this.activeIndex = index;
                this.isDropdown = false;
                this.helpFlag = false;
                this.$emit("update-index", index);
            }
        }
    };
</script>

<style scoped>
    .active {
        background: #7023EC;
        font-weight: bold;
        position: relative;
        cursor: pointer;
        @media (max-width: 650px) {
            font-size: 16px;
            text-align: start !important;
        }
    }
    .arrow_down {
        position: absolute;
        top: 18px;
        right: 13px;
        width: 13px;
        height: 13px;
        transition: .2s ease-in;
    }
    .rotated {
        transform: rotate(180deg);
        transition: .2s ease-in;
    }
    .switch_mob {
        width: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
    }
    .dropdown {
        position: absolute;
        top: 100%;
        width: 100%;
        border: 1px solid #7023EC;
        border-top: none;
        max-height: 200px;
        overflow-y: scroll;
        list-style: none;
        margin: 0;
        padding: 0;
        z-index: 1000;
        color: white;
        font-size: 20px;
        font-weight: normal;
        letter-spacing: 1px;
        scrollbar-width: none;
        z-index: 15;
        background: #1B1E3D;
        display: flex;
        flex-direction: column;
    }
    span {
        width: 100%;
        height: 40px;
        color: white;
        font-size: 18px;
        font-family: 'OpenSans';
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: .1s ease-in;
        @media (max-width: 1300px) {
            font-size: 16px;
        }
        @media (max-width: 1100px) {
            font-size: 14px;
            height: 50px;
            padding: 5px 10px;
        }
        @media (max-width: 700px) {
            height: 50px;
        }
    }
    .item_mob {
        border-bottom: 1px solid white;
        padding: 10px;
        text-align: start;
        padding-left: 10px;
        font-size: 16px !important;
    }
    .switch_mob::-webkit-scrollbar {
        width: 0;  
        height: 0;
    }

    .switch_mob::-webkit-scrollbar-thumb {
        background: transparent;
    }
</style>