<template>
  <n-button @click="showAddModel=true">
    添加分类
  </n-button>
  <n-table :bordered="false" :single-line="false">
    <thead>
    <tr>
      <th>编号</th>
      <th>名称</th>
      <th>操作</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(category,index) in categoryList">
      <td>{{ category.id }}</td>
      <td>{{ category.name }}</td>
      <td>
        <n-space>
          <n-button @click="updateDialog(category)">修改</n-button>
          <n-button @click="deleteCategory(category.id)">删除</n-button>
        </n-space>
      </td>
    </tr>
    </tbody>
  </n-table>
  <!--  添加的对话框 -->
  <n-modal v-model:show="showAddModel" preset="dialog" title="Dialog">
    <template #header>
      <div>添加分类</div>
    </template>
    <div>
      <n-input v-model:value="addCategory.name" type="text" placeholder="请输入名称"/>
    </div>
    <template #action>
      <div>
        <n-button @click="add">提交</n-button>
      </div>
    </template>
  </n-modal>
  <!--  修改的对话框 -->
  <n-modal v-model:show="showUpdateModel" preset="dialog" title="Dialog">
    <template #header>
      <div>修改分类</div>
    </template>
    <div>
      <n-input v-model:value="updateCategory.name" type="text" placeholder="请输入名称"/>
    </div>
    <template #action>
      <div>
        <n-button @click="update">提交</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup>
import {AdminStore} from "../../stores/AdminStore.js";
import {inject, reactive, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(() =>
    loadDatas()
)

const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")
const adminStore = AdminStore()

const categoryList = ref([])
const loadDatas = async () => {
  let res = await axios.get("/categoryRouters/list")
  // console.log(res.data.data)
  categoryList.value = res.data.data
}
const showAddModel = ref(false);
const showUpdateModel = ref(false);

const addCategory = reactive({
  name: ""
})
const updateCategory = reactive({
  id: "",
  name: ""
})

// 添加
const add = async () => {
  let res = await axios.post('/categoryRouters/_token/add', {name: addCategory.name})
  if (res.data.code === 200) {
    await loadDatas();
    message.info(res.data.msg)
  } else {
    message.error(res.data.msg)
  }
  showAddModel.value = false;
}

// 删除
const deleteCategory = async (id) => {
  dialog.warning({
    title: '警告',
    content: '确定删除？',
    negativeText: '取消',
    positiveText: '确定',
    onPositiveClick: async () => {
      let res = await axios.delete(`/categoryRouters/_token/delete?id=${id}`)
      if (res.data.code === 200) {
        await loadDatas();
        message.success('删除成功')
      } else {
        message.error(res.data.msg)
      }
    },
    onNegativeClick: () => {
      message.success('取消删除')
    }
  })
}

// 修改
const updateDialog = (category) => {
  showUpdateModel.value = true;
  updateCategory.id = category.id;
  updateCategory.name = category.name;
}

const update = async () => {
  console.log(updateCategory)
  let res = await axios.put('/categoryRouters/_token/update', {id: updateCategory.id, name: updateCategory.name})
  if (res.data.code === 200) {
    await loadDatas();
    message.info(res.data.msg)
  } else {
    message.error(res.data.msg)
  }
  showUpdateModel.value = false;
}
</script>

<style lang="scss" scoped>

</style>