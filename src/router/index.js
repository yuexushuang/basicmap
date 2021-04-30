import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'

Vue.use(VueRouter)

/**
 * constantRoutes
 * 没有访问权限的页面，所有角色都可以访问
 */
export const constantRoutes = [
    {
        path: '/',
        component: Home,
        hidden: true
    }
]

const createRouter = () => new VueRouter({
    mode: 'hash',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter();

router.beforeEach((to, from, next) => {
    next();
});

export default router