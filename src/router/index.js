import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '@/views/LoginView.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: LoginView
    },
    {
        path: '/dashboard',
        component: () => import('@/views/DashboardView.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router
