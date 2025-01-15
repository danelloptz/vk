import { createRouter, createWebHistory } from 'vue-router';
import AppHome from '@/views/AppHome';
import AppRotation from '@/views/AppRotation';
import AppSettings from '@/views/AppSettings';

const routes = [
    { path: '/', component: AppHome },
    { path: '/rotation',component: AppRotation },
    { path: '/settings', component: AppSettings },
];

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL),
});

export default router;
