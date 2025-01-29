<template>
    <section class="history-table">
        <table>
            <thead>
                <tr>
                    <th>Дата</th>
                    <th>Сумма</th>
                    <th>Описание</th>
                    <th>Статус</th>
                </tr>
            </thead>
            <tbody v-if="paginatedHistory.length">
                <tr v-for="(item, index) in paginatedHistory" :key="index">
                    <td>{{ item.date }}</td>
                    <td>{{ item.sum }}</td>
                    <td>{{ item.description }}</td>
                    <td>{{ item.status }}</td>
                </tr>
            </tbody>
        </table>

        <div class="switchs" v-if="totalPages > 1">
            <img src="@/assets/images/arrow.svg" @click="prevPage" style="transform: rotate(180deg);" />

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
import { getHistory } from "@/services/cash";

export default {
    data() {
        return {
            history: [],
            currentPage: 1,
            perPage: 5
        };
    },
    async created() {
        const response = await getHistory();
        this.history = response.reverse();
    },
    computed: {
        totalPages() {
            return Math.ceil(this.history.length / this.perPage);
        },
        paginatedHistory() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.history.slice(start, start + this.perPage);
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
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
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
</style>
