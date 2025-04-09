<template>
    <section class="assembly" v-if="assemblyGroups">
        <div 
            class="item"
            v-for="(group, index) in assemblyGroups"
            v-show="index < itemsToShow"
            :key="group.group_name"
            @click="redirectToGroup(group.group_link)"
        >
            <img
                :src="group.group_photo">
            <!-- <span v-else>Изображение не найдено</span> -->
            <div class="text_block">
                <span>{{ group.group_name }}</span>
            </div>
        </div>
        <img src="@/assets/images/plus.png" class="add_group" @click="addGroup">
    </section>
</template>

<script>
    // import { getAssemblyGroups  } from '@/services/groups'; !!!!! РАССКОМЕНИТРОВАТЬ !!!!!
    import { getAdds } from '@/services/add';

    export default {
        data() {
            return {
                assemblyGroups: null,
                itemsToShow: 10,
            }
        },
        async created() {
            const adds = await getAdds();
            console.log(adds.groups);
            this.assemblyGroups = adds.groups;
            // const response = await getAssemblyGroups(); !!!!! РАССКОМЕНИТРОВАТЬ !!!!!
            // this.assemblyGroups = response;

            // this.assemblyGroups  = Array.from({ length: 10 }, (_, i) => ({
            //     id: String(i),
            //     link: "link",
            //     name: "Название группы",
            //     img: "group_avatar2.png"
            // }));

            this.updateItemsToShow();
            window.addEventListener("resize", this.updateItemsToShow);
        },
        beforeUnmount() {
            window.removeEventListener("resize", this.updateItemsToShow);
        },
        methods: {
            updateItemsToShow() {
                const width = window.innerWidth;
                if (width >= 1920) this.itemsToShow = 10;
                else if (width >= 1700) this.itemsToShow = 9;
                else if (width >= 1440) this.itemsToShow = 8;
                else if (width >= 1100) this.itemsToShow = 7;
                else if (width >= 900) this.itemsToShow = 6;
                else if (width >= 700) this.itemsToShow = 5;
                else if (width >= 500) this.itemsToShow = 4;
                else if (width >= 360) this.itemsToShow = 3;
                else this.itemsToShow = 2;
            },
            redirectToGroup(link) {
                if (link) {
                    window.open(link, "_blank");
                } else {
                    console.error("Ссылка на группу отсутствует!");
                }
            },
            addGroup() {
                this.$emit("comeToAssembly");
            }
        }
    };
</script>

<style scoped>
    .assembly {
        width: 100%;
        display: flex;
        align-items: center;
        column-gap: 10px;
        padding: 10px;
        background-color: #2f3251a8;
        border-radius: 10px;
        position: relative;
    }
    .item {
        width: 150px;
        height: 150px;
        border-radius: 10px;
        position: relative;
        padding: 5px;
        display: flex;
        align-items: end;
        cursor: pointer;
        @media (max-width: 650px) {
            width: 95.88px;
            height: 95.88px;
        }
    }
    .item img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        border-radius: 10px;
        opacity: 0.8;
        z-index: 5;
        transition: .3s;
    }
    .item img:hover {
        opacity: 1;
    }
    .text_block {
        background: #1b1e3d7b;
        width: 100%;
        padding: 6px;
        border-radius: 10px;
        z-index: 6;
        @media (max-width: 650px) {
            display: none;
        }
    }
    span {
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
    }
    .add_group {
        width: 60px;
        height: 60px;
        z-index: 11;
        position: absolute;
        right: -20px;
        cursor: pointer;
        transition: .3s;
        @media (max-width: 650px) {
            width: 27.33px;
            height: 27.33px;
            right: -14px;
        }
    }
    .add_group:hover {
        filter: brightness(150%);
    }
</style>