import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import naive, {createDiscreteApi} from 'naive-ui'
import {createPinia} from 'pinia'
import {router} from "./common/router.js";
import axios from "axios";
import {AdminStore} from "./stores/AdminStore.js";

const app = createApp(App)

// 配置全局的地址
axios.defaults.baseURL = 'http://localhost:8080'
// 全局提供axios 使用provide和inject
app.provide("axios", axios)
const {message, notification, dialog} = createDiscreteApi(
    ["message", "dialog", "notification"],
);



app.provide("message", message);
app.provide("notification", notification);
app.provide("dialog", dialog);

app.use(naive)
app.use(createPinia())
// 配置拦截器
// const adminStore = AdminStore()
axios.interceptors.request.use((config) => {
    // 获取本地token 保证刷新以后token不会丢失，因为pinia的状态管理工具，刷新以后状态会丢失
    config.headers.token = localStorage.getItem("token") ;
    return config;
})

app.use(router)
app.mount('#app')
