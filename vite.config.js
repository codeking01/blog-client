import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            // 配置项目路径，引入 @ ，参考 https://www.cnblogs.com/wang715100018066/p/16593957.html
            '@': path.resolve(__dirname, './src')
        }
    }
})
