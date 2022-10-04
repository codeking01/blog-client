<template>
  <div class="container">
    <n-space style="margin-top: 20px">
      <n-button @click="back">返回</n-button>
    </n-space>
    <!-- 标题 -->
    <n-h1>{{ Detail.title }}</n-h1>
    <!-- 文章内容 -->
    <div class="blog-content">
      <n-tag :bordered="false" type="info" size="small">
        {{ Detail.name }}
      </n-tag>
      <n-divider/>
      <div v-html="Detail.content"></div>
    </div>
  </div>
</template>

<script setup>
import {useRoute, useRouter} from 'vue-router'
import {inject, onMounted, ref} from "vue";
import axios from "axios";

const message = inject("message")
const router = useRouter()
let route = useRoute()

let Detail = ref({
  id: null,
  category_id: null,
  title: null,
  content: null,
  create_time: null,
  name: null
})

const loadBlog = async () => {
  let res = await axios.get('/blogRouters/details?id=' + Detail.value.id)
  if (res.data.code === 200) {
    // Detail.value.id = res.data.data.rows[0].blog_id
    Detail.value.category_id = res.data.data.rows[0].category_id
    Detail.value.title = res.data.data.rows[0].title
    Detail.value.content = res.data.data.rows[0].content
    Detail.value.create_time = res.data.data.rows[0].create_time
    Detail.value.name = res.data.data.rows[0].name
  } else {
    message.error(res.data.msg)
  }
}
const back=()=>{
  router.push('/')
}

onMounted(() => {
  Detail.value.id = parseInt(route.query.id)
  loadBlog();
})
</script>

<style>
.blog-content img {
  max-width: 100% !important;
}
</style>

<style lang="scss" scoped>
.container {
  width: 1200px;
  margin: 0 auto;
}
</style>