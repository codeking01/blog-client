<template>
  <div class="main-panel">
    <div class="menus">
      <div v-for="(menu, index) in menus" @click="toPage(menu)">
        {{ menu.name }}
      </div>
    </div>
    <div style="padding:20px;width:100%">
      <router-view></router-view>
    </div>
  </div>
  <div class="title">博客后台管理系统</div>
</template>

<script setup>
import {AdminStore} from "../../stores/AdminStore.js";
import {inject, reactive} from 'vue'
import {useRoute, useRouter} from 'vue-router'

const router = useRouter()
const route = useRoute()

const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")
const adminStore = AdminStore()
const menus = reactive([
  {name: "文章管理", href: "/dashboard/article"},
  {name: "分类管理", href: "/dashboard/category"},
  {name: "退出", href: "logout"},
])

const toPage = (menu) => {
  if (menu.href === "logout") {
    // 加个确认按钮，然后置空token
    dialog.warning({
      title: '警告',
      content: '确定退出？',
      negativeText: '取消',
      positiveText: '确定',
      onPositiveClick: () => {
        localStorage.setItem("token", "")
        router.push("/login")
        message.success('退出成功')
      },
      onNegativeClick: () => {
        message.info('取消退出')
      }
    })
  } else {
    router.push(menu.href)
  }
}

</script>

<style lang="scss" scoped>

.main-panel {
  display: flex;
  color: #64676a;
  max-width: 1500px;
  margin: 0 auto;
}

.menus {
  padding: 20px 0;
  box-sizing: border-box;
  line-height: 55px;
  text-align: center;
  width: 180px;
  height: 95vh;
  border-right: 1px solid #dadada;

  div {
    cursor: pointer;

    &:hover {
      color: #fd760e;
    }
  }
}

.title {
  font-size: 45px;
  font-weight: bold;
  text-align: right;
  position: fixed;
  color: rgba(0, 0, 0, 20%);
  right: calc((100vw - 1500px) / 2);
  bottom: 20px;
  //z-index: -1;
}

</style>