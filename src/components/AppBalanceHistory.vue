<template>
    <AppModal 
        :title="title" 
        :message="msg" 
        :visibility1="isModal"
        @update:visibility1="isModal = $event"
        @close="reload"
    />
    <section class="history-table">
        <table v-if="windowWidth > 650">
            <thead>
                <tr>
                    <th>Дата</th>
                    <th>Сумма</th>
                    <th>Описание</th>
                    <th>Статус</th>
                </tr>
            </thead>
            <tbody v-if="history.length">
                <tr v-for="(item, index) in history" :key="index">
                    <td>{{ formatedDate(item.date_created) }}</td>
                    <td>{{ item.sum }}</td>
                    <td v-html="formatedMessage(item)"></td>
                    <td style="display: flex; flex-direction: column; row-gap: 5px;">
                        {{ item.status }} 
                        <span 
                            v-if="item.category == 'Вывод' && item.status == 'В процессе'" 
                            @click="cancelTrans(item)"
                            style="text-decoration: underline; cursor: pointer;"
                        >Отменить</span>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="history_mob" v-if="windowWidth <= 650">
            <div class="history_mob_item" v-for="(item, index) in history" :key="index">
                <span><strong>Дата: </strong>{{ formatedDate(item.date_created) }}</span>
                <span><strong>Сумма, USDT: </strong>{{ item.sum }}</span>
                <span><strong>Описание: </strong><span v-html="formatedMessage(item)"></span></span>
                <span>
                    <strong>Статус: </strong>{{ item.status }} 
                    <span 
                        v-if="item.category == 'Вывод' && item.status == 'В процессе'" 
                        @click="cancelTrans(item)"
                        class="descr"
                    >Отменить</span>
                </span>
            </div>
        </div>

        <div class="switchs" v-if="totalPages > 1">
            <img src="@/assets/images/arrow.svg" @click="prevPage" style="transform: rotate(180deg);" v-if="currentPage > 1" />

            <span v-for="page in visiblePages" :key="page" @click="goToPage(page)" 
                  :class="{ active: page === currentPage }">
                {{ page }}
            </span>

            <span v-if="currentPage + 2 < totalPages">...</span>

            <img src="@/assets/images/arrow.svg" @click="nextPage" v-if="currentPage < totalPages" />
        </div>
    </section>
</template>

<script>
import { getTransactions, cancelTransaction } from "@/services/cash";
import AppModal from "@/components/AppModal.vue";

export default {
    components: { AppModal },
    props: {
        windowWidth: Number
    },
    data() {
        return {
            history: [],
            currentPage: 1,
            perPage: 20,
            totalTransactions: 0,
            isModal: false,
            title: "",
            msg: ""
        };
    },
    async created() {
        const offset = (this.currentPage - 1) * this.perPage;
        const response = await getTransactions(offset, this.perPage, localStorage.getItem("token"));
        console.log(response);
        this.history = response.data.items;
        this.totalTransactions = response.data.pagination.total;
    },
    computed: {
        totalPages() {
            return Math.ceil(this.totalTransactions / this.perPage);
        },
        visiblePages() {
            const pages = [];
            const lastPage = this.totalPages;

            if (this.currentPage >= lastPage - 2) {
                for (let i = lastPage - 2; i <= lastPage; i++) {
                    if (i > 0) pages.push(i);
                }
            } else {
                pages.push(this.currentPage, this.currentPage + 1, this.currentPage + 2);
            }

            return pages;
        }
    },
    methods: {
        async goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                const offset = (this.currentPage - 1) * this.perPage;
                const response = await getTransactions(offset, this.perPage, localStorage.getItem("token"));
                this.history = response.data.items;
                this.totalTransactions = response.data.pagination.total;
            }
        },
        async nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                const offset = (this.currentPage - 1) * this.perPage;
                const response = await getTransactions(offset, this.perPage, localStorage.getItem("token"));
                this.history = response.data.items;
                this.totalTransactions = response.data.pagination.total;
            }
        },
        async prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                const offset = (this.currentPage - 1) * this.perPage;
                const response = await getTransactions(offset, this.perPage, localStorage.getItem("token"));
                this.history = response.data.items;
                this.totalTransactions = response.data.pagination.total;
            }
        },
        formatedMessage(item) {
            if (item.category === "Перевод") {
                return `Перевод на ${item.to_user}`;
            }
            if (item.category.startsWith("https")) {
                return `<a href="${item.category}" target="_blank" style="text-decoration: underline; color: white;">Вывод</a>`;
            }
            return item.category;
        },
        formatedDate(time) {
            const date = new Date(time);

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${day}.${month}.${year} ${hours}:${minutes}`;
        },
        async cancelTrans(item) {
            const cancel = await cancelTransaction(item.id);

            this.title = cancel.status ? "УСПЕШНО!" : "ОШИБКА!";
            this.msg = cancel.status ? "Вывод средств отменён." : "При отмене вывода средств произошла ошибка.";
            this.isModal = true;
        },
        reload() {
            location.reload();
        }
    }
};
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    font-family: 'OpenSans';
}
thead {
    font-size: 18px;
    line-height: 2;
    border-bottom: 1px solid rgba(255, 255, 255, 0.212);
    color: white;
    @media (max-width: 600px) {
        font-size: 16px;
    }
    @media (max-width: 450px) {
        font-size: 14px;
    }
    @media (max-width: 350px) {
        font-size: 12px;
    }
}
td {
    padding: 10px 0px;
    text-align: center;
    font-size: 16px;
    color: white;
    @media (max-width: 600px) {
        font-size: 14px;
    }
    @media (max-width: 450px) {
        font-size: 12px;
    }
    @media (max-width: 350px) {
        font-size: 10px;
    }
}
tr:nth-child(2n) {
    background: #111433;
}
.switchs {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    gap: 10px;
}
.switchs img {
    cursor: pointer;
    width: 15px;
    filter: invert(100%);
}
.switchs span {
    cursor: pointer;
    font-size: 16px;
    padding: 5px 10px;
    border-radius: 5px;
    color: white;
}
.switchs span.active {
    background-color: #111433;
    color: white;
}
a {
    color: white;
    font-family: 'OpenSans';
}
.history_mob {
    display: flex;
    width: 100%;
    flex-direction: column;
    row-gap: 10px;
}
.history_mob_item {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    padding: 10px 0px;
}
.history_mob_item span {
    font-size: 14px;
    color: white;
    font-family: 'OpenSans';
}
.descr {
    text-decoration: underline;
    cursor: pointer;
}
</style>
