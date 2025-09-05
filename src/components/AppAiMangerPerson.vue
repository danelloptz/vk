<template>
    <section class="user">
        <div class="header">
            <img :src="user.avatar != '' ? user.avatar : require('@/assets/images/empty.png')" class="avatar" />
            <h2>{{ user.full_name }}</h2>
        </div>
        <div class="params">
            <div class="row">
                <span class="mute">ID:</span>
                <span>{{ user.telegram_id }}</span>
            </div>
            <div class="row">
                <span class="mute">Username:</span>
                <span>{{ user.username }}</span>
            </div>
            <div class="row">
                <span class="mute">Статус:</span>
                <span>{{ user.user_status }}</span>
            </div>
            <div class="row">
                <span class="mute">Теги:</span>
                <div class="tags">
                    <div class="filter_item_tags_row">
                        <div 
                            v-for="(tag, index_tag) in person.tags"
                            :key="index_tag"
                            class="filter_item_tag"
                        >
                            {{ tag }}
                            <img src="@/assets/images/close.png" class="delete_tag" @click="deleteTag(index_tag, tag)"/>
                        </div>
                    </div>
                    <div class="dropdown_tags" v-if="isNewTags == index">
                        <div 
                            v-for="(tag, tag_index) in userTags.filter(tag => !person.tags.includes(tag))"
                            :key="tag_index"
                            class="dropdown_tag"
                            @click="addTag(tag)"
                        >
                            {{ tag }}
                        </div>
                    </div>
                    <AppBadButton 
                        v-if="!(userTags.length == 1 && userTags[0] == '')"
                        :text="'+ ДОБАВИТЬ'" 
                        class="add_tag_btn" 
                        @click="openNewTags(index)"
                    />
                    <AppGoodButton 
                        v-if="tagBuffer.length > 0"
                        class="save_tags"
                        @click="saveTags"
                        :text="'СОХРАНИТЬ'"
                    />
                </div>
            </div>
        </div>
        <div class="big_row">
            <div class="sm_row">
                 <AppGoodButton 
                        :text="'ОТПРАВИТЬ СООБЩЕНИЕ'"
                        class="send_btn"
                        @click="openMsg"
                    />
                    <AppGoodButton 
                        :text="'УДАЛИТЬ'"
                        class="delete_btn"
                        @click="deleteUser"
                    />
            </div>
            <AppBadButton 
                :text="'НАЗАД'"
                class="backup_btn"
                @click="backup"
            />
        </div>
    </section>
</template> 

<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppBadButton from '@/components/AppBadButton.vue';
    import { changeUser } from '@/services/manager';
    export default {
        components: { AppGoodButton, AppBadButton },
        props: {
            user: Object,
            userTags: Array
        },
        data() {
            return {
                tagBuffer: [],
                isNewTags: -1,
                person: null
            }
        },
        created() {
            this.person = this.user;
        },
        methods: {
            async saveTags() {
                const resp = await changeUser(this.person.telegram_id, {"tags": this.person.tags});
                if (resp) {
                    this.tagBuffer = [];
                    this.closeNewTags();
                }
            },
            deleteUser() {
                this.$emit('deleteUser', this.user.telegram_id);
            },
            backup() {
                this.$emit('backup');
            },
            openMsg() {
                this.$emit('openMsg', this.user.telegram_id);
            },
            closeNewTags() {
                this.isNewTags = -1;
            } ,
            addTag(tag) {
                this.person.tags.push(tag);

                if (this.tagBuffer.indexOf(tag) == -1) this.tagBuffer.push(tag)
                else this.tagBuffer = this.tagBuffer.filter(t => t != tag);

                this.closeNewTags();
            },
            openNewTags(index) {
                this.isNewTags = index;
            }, 
            deleteTag(tag_index, tag) {
                this.person.tags.splice(tag_index, 1);

                if (this.tagBuffer.indexOf(tag) == -1) this.tagBuffer.push(tag)
                else this.tagBuffer = this.tagBuffer.filter(t => t != tag);
            },
        }
    };
</script>

<style scoped>
    .backup_btn {
        width: 150px;
        height: 51px;
    }
    .delete_btn {
        width: 189px;
        height: 51px;
        background: #A21619;
    }
    .send_btn {
        width: 240px;
        height: 51px;
    }
    .sm_row {
        display: flex;
        column-gap: 30px;
        align-items: center;
    }
    .big_row {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 50px;
    }
    .mute {
        opacity: .5;
    }
    .row span {
        font-family: 'OpenSans';
        font-size: 18px;
        color: white;
    }
    .row {
        display: flex;
        column-gap: 10px;
        align-items: center;
    }
    .params {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        margin-left: 36px;
        margin-top: 36px;
    }
    .header h2 {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .header img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
    }
    .header {
        display: flex;
        align-items: center;
        column-gap: 20px;
    }
    .user {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    .save_tags {
        width: 130px;
        height: 32px;
        font-size: 9.98px;
    }
    .dropdown_tags {
        position: absolute;
        left: 110px;
        top: 50px;
        z-index: 999;
        background: #434665;
        padding: 10px 8px;
        display: flex;
        flex-direction: column;
    }
    .dropdown_tag {
        font-size: 15px;
        color: white;
        font-family: 'OpenSans';
        display: flex;
        align-items: center;
        padding: 8px 0px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    }
    .add_tag_btn {
        width: 92px;
        height: 32px;
        font-size: 9.98px;
        letter-spacing: 0px;
    }
    .filter_item_tags_row {
        display: flex;
        column-gap: 14px;
        flex-wrap: wrap;
        row-gap: 10px;
    }
    .filter_item_tag {
        font-size: 9.98px;
        color: white;
        font-family: 'OpenSans';
        padding: 10px;
        border: .62px solid white;
        border-radius: 6.24px;
        display: flex;
        column-gap: 12px;
    }
    .delete_tag {
        width: 9px;
        object-fit: contain;
        cursor: pointer;
    }
    .tags {
        display: flex;
        /* flex-direction: column; */
        column-gap: 10px;
        position: relative;
    }
</style>