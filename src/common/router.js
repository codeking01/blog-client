import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
    {path: '/test', component: () => import('../views/Test.vue')},
    {path: '/login', component: () => import('../views/Login.vue')},
    {
        path: '/dashboard', component: () => import('../views/dashboard/Dashboard.vue'),
        children: [
            {path: '/dashboard/article', component: () => import ('../views/dashboard/article.vue')},
            {path: '/dashboard/category', component: () => import('../views/dashboard/category.vue')}
        ]
    }
]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routers: routes` 的缩写
})

export {routes, router};