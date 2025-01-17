import { createRouter, createWebHistory } from 'vue-router';
import AppStartModal from '@/views/AppStartModal'
import AppRegistrationStepOne from '@/views/AppRegistrationStepOne'

const routes = [
    { path: '/signin', component: AppStartModal },
    { path: '/signup', component: AppRegistrationStepOne },
];

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL),
});

export default router;
