import { createRouter, createWebHistory } from 'vue-router';
import AppStartModal from '@/views/AppStartModal'
import AppRegistrationStepOne from '@/views/AppRegistrationStepOne'
import AppRegistrationStepTwo from '@/views/AppRegistrationStepTwo'
import AppHome from '@/views/AppHome'

const routes = [
    { path: '/signin', component: AppStartModal },
    { path: '/signup_1', component: AppRegistrationStepOne },
    { path: '/signup_2', component: AppRegistrationStepTwo },
    { path: '/home', component: AppHome },
];

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL),
});

export default router;
