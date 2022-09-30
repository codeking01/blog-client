<template>
  <div class="login-panel">
    <n-card title="管理后台登录">
      <n-form :rules="rules" :model="admin">
        <n-form-item path="account" label="账号">
          <n-input v-model:value="admin.account" placeholder="请输入账号"/>
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input v-model:value="admin.password" type="password" placeholder="请输入密码"/>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-checkbox v-model:checked="admin.remember" label="记住我"/>
        <n-button @click="login">登录</n-button>
      </template>
    </n-card>
  </div>
</template>

<script setup>
import {inject, reactive} from 'vue'
import {AdminStore} from '../stores/AdminStore.js'
import {useRoute, useRouter} from 'vue-router'

const router = useRouter()
const route = useRoute()

const message = inject("message")
const axios = inject("axios")
const adminStore = AdminStore()

/**验证表单规则 */
let rules = {
  account: [
    {required: true, message: "请输入账号", trigger: "blur"},
    {min: 3, max: 12, message: "账号长度在 3 到 12 个字符", trigger: "blur"},
  ],
  password: [
    {required: true, message: "请输入密码", trigger: "blur"},
    {min: 6, max: 18, message: "密码长度在 6 到 18 个字符", trigger: "blur"},
  ],
};

/**管理员登录数据 */
const admin = reactive({
  account: localStorage.getItem("account") || "",
  password: localStorage.getItem("password") || "",
  remember: localStorage.getItem("remember") === '1' || false
})

/**登录 */
const login = async () => {
  let result = await axios.post("/AdminRouter/login", {
    account: admin.account,
    password: admin.password
  });
  if (result.data.code === 200) {
    adminStore.token = result.data.data.token;
    adminStore.account = result.data.data.account;
    adminStore.id = result.data.data.id;
    // 本地存储：将非持久化存储变为持久化存储
    localStorage.setItem("token", adminStore.token)
    //把数据存储到localStorage
    if (admin.remember) {
      localStorage.setItem("account", admin.account)
      localStorage.setItem("password", admin.password)
      localStorage.setItem("remember", admin.remember ? '1' : '0')
    }
    await router.push("/dashboard")
    message.info("登录成功")
  } else {
    message.error("登录失败")
  }
}

</script>

<style lang="scss" scoped>
.login-panel {
  width: 500px;
  margin: 130px auto 0;
}
</style>