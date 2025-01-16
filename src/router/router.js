import { createRouter, createWebHistory } from 'vue-router';
import AppStartModal from '@/views/AppStartModal'

const routes = [
    { path: '/auth', component: AppStartModal },
];

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL),
});

export default router;
