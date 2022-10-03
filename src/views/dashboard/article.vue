<template>
  <n-card title="文章管理" style="margin-bottom: 16px">
    <!--  default-value默认先展示哪个   -->
    <n-tabs v-model:value="tabValue" type="line" animated>
      <n-tab-pane name="article" tab="文章列表">
        <n-list hoverable clickable>
          <n-list-item v-for="(item,index) in BlogData">
            <n-thing :title="item.title" content-style="margin-top: 10px;">
              <template #description>
                <n-space size="small" style="margin-top: 4px">
                  <n-tag :bordered="false" type="info" size="small">
                    {{ item.create_time }}
                  </n-tag>
                </n-space>
              </template>
              {{ item.content }}
            </n-thing>
            <template #suffix>
              <n-space>
                <n-button @click="toUpdate(item)">修改</n-button>
                <n-button @click="Delete(item.id)">删除</n-button>
              </n-space>
            </template>
          </n-list-item>
          <template #footer>
            <!-- 分页    -->
            <n-space justify="center">
              <!--  @update:page="loadBlogData"  处理页面数据改变时候的跳转，也可以使用监听函数watch实现-->
              <n-pagination v-model:page="PageInfo.page" :page-count="PageInfo.count"
                            @update:page="loadBlogData" @update:page-size="loadBlogData">
                <template #goto>
                  跳转至
                </template>
              </n-pagination>
            </n-space>
          </template>
        </n-list>
      </n-tab-pane>
      <n-tab-pane name="add" tab="添加文章">
        <n-form>
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
        </n-form>
      </n-tab-pane>
      <n-tab-pane name="update" tab="修改文章">
        <n-form>
          <n-form-item label="文章">
            <n-input v-model:value="updateArticle.title" placeholder="请输入文章标题"/>
          </n-form-item>
          <n-form-item label="分类">
            <n-select v-model:value="updateArticle.category_id" :options="CategoryOptions"/>
          </n-form-item>
          <n-form-item label="内容">
            <!-- v-model 实现双向绑定 -->
            <rich-text-editor v-model="updateArticle.content"></rich-text-editor>
          </n-form-item>
          <n-button @click="update">提交</n-button>
        </n-form>
        <!--  {{ updateArticle }}-->
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import {inject, nextTick, onMounted, reactive, ref, watch} from 'vue'
import RichTextEditor from "@/components/RichTextEditor.vue"
import {router} from "@/common/router.js";

const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")

const addArticle = reactive({
  category_id: 0,
  title: "",
  content: ""
})

const updateArticle = reactive({
  id: "",
  category_id: "",
  title: "",
  content: ""
})

let CategoryOptions = ref([])
let BlogData = ref([])
let PageInfo = reactive({
  page: 1,
  pagesize: 4,
})

// 切换标签栏的
let tabValue = ref("article")

// watch(()=>PageInfo.count, async () => {
//   await loadBlogData()
// })

const toUpdate = async (blog) => {
  // 向服务端请求查找
  let res = await axios.get('/blogRouters/details?id=' + blog.id)
  updateArticle.id = blog.id
  updateArticle.category_id = res.data.data.rows[0].category_id
  updateArticle.title = res.data.data.rows[0].title
  updateArticle.content = res.data.data.rows[0].content
  // 等数据渲染结束了在跳转过去
  tabValue.value = "update"
}

const loadCategoryData = async () => {
  let res = await axios.get("/categoryRouters/list")
  // console.log(res.data)
  if (res.data.code === 200) {
    // 用map函数 将内容转成options的相应格式
    CategoryOptions.value = res.data.data.map((item) => {
      return {
        label: item.name,
        value: item.id
      }
    })
  } else {
    message.error(res.data.msg)
  }
}
// 加载博客数据
const loadBlogData = async () => {
  let res = await axios.get(`/blogRouters/list?page=${PageInfo.page}&pagesize=${PageInfo.pagesize}`)
  if (res.data.code === 200) {
    let tempRow = res.data.data.rows
    // 有可能删除后最后一页没数据
    if(tempRow.length === 0 && PageInfo.page>1) {
      PageInfo.page-=1
      res = await axios.get(`/blogRouters/list?page=${PageInfo.page}&pagesize=${PageInfo.pagesize}`)
      tempRow = res.data.data.rows
    }
    for (let row of tempRow) {
      if (row.content.length > 25) {
        row.content += '...';
      }
      let time_flag = new Date(row.create_time);
      row.create_time = `${time_flag.getFullYear()} 年 ${time_flag.getMonth() + 1}月${time_flag.getDate()}日`
    }
    BlogData.value = tempRow
    // 将文章总数传给PageInfo
    PageInfo.count = Math.ceil(res.data.data.count / PageInfo.pagesize)
  } else {
    message.error(res.data.msg)
  }
}

const Add = async () => {
  let res = await axios.post('/blogRouters/_token/add', addArticle)
  if (res.data.code === 200) {
    addArticle.category_id = 0;
    addArticle.title = "";
    addArticle.content = "";
    await loadBlogData();
    message.info(res.data.msg)
    tabValue.value = "article"
  } else {
    message.error(res.data.msg)
  }
}

const update = async () => {
  let res = await axios.put('/blogRouters/_token/update', updateArticle)
  // console.log(res.data)
  if (res.data.code === 200) {
    await loadBlogData()
    tabValue.value = "article"
    message.success(res.data.msg)
  } else {
    message.error(res.data.msg)
  }
}

const Delete = async (id) => {
  let res = await axios.delete('/blogRouters/_token/delete?id=' + id);
  if (res.data.code === 200) {
    await nextTick(() => {
      loadBlogData()
    })
    message.success(res.data.msg)
  } else {
    message.error(res.data.msg)
  }
}

onMounted(() => {
  // 读取分类
  loadCategoryData();
  // 读取博客数据
  loadBlogData();
})

</script>

<style lang="scss" scoped>

</style>