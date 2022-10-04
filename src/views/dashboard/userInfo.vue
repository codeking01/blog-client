<template>
  <n-card content-style="padding: 0;">
    <n-tabs
        type="segment"
        size="large"
        :tabs-padding="20"
        pane-style="padding: 20px;"
    >
      <n-tab-pane name="登录">
        <Login/>
      </n-tab-pane>
      <n-tab-pane name="注册">
        <div class="login-panel">
          <n-card title="注册">
            <n-form :rules="rules" :model="MyRegister">
              <n-form-item path="account" label="账号">
                <n-input v-model:value="MyRegister.account" placeholder="请输入账号"/>
              </n-form-item>
              <n-form-item path="password" label="密码">
                <n-input v-model:value="MyRegister.password" type="password" placeholder="请输入密码"/>
              </n-form-item>
              <n-form-item path="confirmPassword" label="确认密码">
                <n-input v-model:value="MyRegister.confirmPassword" type="password" placeholder="请再次输入密码"/>
              </n-form-item>
            </n-form>
            <template #footer>
              <n-button @click="register">注册</n-button>
            </template>
          </n-card>
        </div>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import {inject, reactive} from 'vue'
import {AdminStore} from '@/stores/AdminStore.js'
import {useRoute, useRouter} from 'vue-router'
import Login from "@/views/Login.vue";

const router = useRouter()
const route = useRoute()

const message = inject("message")
const axios = inject("axios")
const adminStore = AdminStore()

const MyRegister = reactive({
  account: "",
  password: "",
  confirmPassword: ""
})

/**验证表单规则 */
let rules = {
  account: [
    {required: true, message: "请输入账号", trigger: "blur"},
    {min: 3, max: 12, message: "账号长度在 3 到 12 个字符", trigger: "blur"},
  ],
  password: [
    {required: true, message: "请输入密码", trigger: "blur"},
    {min: 4, max: 18, message: "密码长度在 4 到 18 个字符", trigger: "blur"},
  ],
  confirmPassword: [
    {required: true, message: "请输入密码", trigger: "blur"},
    {min: 4, max: 18, message: "密码长度在 4 到 18 个字符", trigger: "blur"},
  ],
};

/**注册 */
const register = async () => {
  // 判断 两次输入密码是否一致
  if (MyRegister.password === MyRegister.confirmPassword) {
    let result = await axios.post("/AdminRouter/register", {
      account: MyRegister.account,
      password: MyRegister.password
    });
    if (result.data.code === 200) {
      await router.push("/dashboard/article")
      message.info("注册成功")
    } else {
      message.error(result.data.err)
    }
  }else{
    MyRegister.confirmPassword=""
    message.warning("两次密码输入不一致！");
  }


}
</script>

<style lang="scss" scoped>
.login-panel {
  width: 500px;
  margin: 30px auto 0;
}
</style>