<template>
  <n-card title="文章管理" style="margin-bottom: 16px">
    <n-tabs type="line" animated>
      <n-tab-pane name="oasis" tab="code-king">
        code-king
      </n-tab-pane>
      <n-tab-pane name="add" tab="添加文章">
        <n-form-item label="文章">
          <n-input v-model:value="addArticle.title" placeholder="请输入文章标题"/>
        </n-form-item>
        <n-form-item label="分类">
          <n-select v-model:value="addArticle.category_id" :options="CategoryOptions"/>
        </n-form-item>
        <n-form-item label="内容">
          <!-- v-model 实现双向绑定 -->
          <rich-text-editor v-model="addArticle.content"></rich-text-editor>
        </n-form-item>
        <!-- {{addArticle.content}}-->
        <n-button @click="Add">提交</n-button>
      </n-tab-pane>
      <n-tab-pane name="jay chou" tab="修改文章">
        七里香
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import {AdminStore} from "@/stores/AdminStore.js";
import {inject, onMounted, reactive, ref} from 'vue'
import RichTextEditor from "@/components/RichTextEditor.vue"
import {useRoute, useRouter} from 'vue-router'

const router = useRouter()
const route = useRoute()
const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")
const adminStore = AdminStore()

const addArticle = reactive({
  category_id: 0,
  title: "",
  content: "",
})

let CategoryOptions = ref([])

const loadCategoryData = async () => {
  let res = await axios.get("/categoryRouters/list")
  // console.log(res.data.data)
  // 用map函数 将内容转成options的相应格式
  CategoryOptions.value = res.data.data.map((item) => {
    return {
      label: item.name,
      value: item.id
    }
  })
}

const Add = async () => {
  let res = await axios.post('/blogRouters/_token/add', addArticle)
  if (res.data.code === 200) {
    message.info(res.data.msg)
    addArticle.category_id=0;
    addArticle.title="";
    addArticle.content="";
  } else {
    message.error(res.data.msg)
  }
}


onMounted(() => {
  loadCategoryData();
})

</script>

<style lang="scss" scoped>

</style>