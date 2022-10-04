<template>
  <div class="NavList">
    <n-space>
      <n-button strong secondary round @click="GoHome">
        首页
      </n-button>
      <n-button strong secondary round @click="ToDashboard">
        后台
      </n-button>
    </n-space>
  </div>
  <n-divider/>
  <n-list hoverable clickable>
    <n-space class="search">
      <n-dropdown trigger="hover" :options="CategoryOptions" @select="handleSelect" show-arrow>
        <n-button :style="{ width: '100px' }" type="primary">{{ selectedItem.label }}</n-button>
      </n-dropdown>
      <n-button type="primary" ghost @click="clearCategory">清除分类</n-button>
      <n-input :style="{ width: '500px' }" placeholder="输入关键词" v-model:value="keyword"/>
      <n-button type="primary" ghost @click="search(1)">搜索</n-button>
    </n-space>
    <n-list-item v-for="(item,index) in BlogData">
      <template #prefix>
      </template>
      <n-thing :title="item.title" content-style="margin-top: 10px;" @click="ToDetails(item)">
        <template #description>
          <n-space size="small" style="margin-top: 4px">
            <n-tag :bordered="false" type="info" size="small">
              {{ item.name }}
            </n-tag>
            <n-tag :bordered="false" type="info" size="small">
              {{ item.create_time }}
            </n-tag>
          </n-space>
        </template>
        {{ item.content }}
      </n-thing>
    </n-list-item>
    <template #footer>
      <n-space justify="center">
        <n-pagination v-model:page="PageInfo.page" :page-count="PageInfo.count"
                      @update:page="search">
          <template #goto>
            跳转至
          </template>
        </n-pagination>
      </n-space>
    </template>
  </n-list>
</template>

<script setup>
import {h, inject, onMounted, reactive, ref} from "vue";
import {NIcon} from "naive-ui";
import {HomeOutline as HomeIcon, Pencil as EditIcon} from "@vicons/ionicons5";
import {useRouter} from 'vue-router'


const message = inject("message")
const axios = inject("axios")
const router = useRouter()


let CategoryOptions = ref([])
let BlogData = ref([])
let PageInfo = reactive({
  page: 1,
  pagesize: 4,
})
let selectedItem = reactive({
  category_id: null,
  label: "选择分类"
})
const keyword = ref("")

const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    });
  };

};
// 处理选中的分类
const handleSelect = (key) => {
  //获取选中的分类
  let selectedOption = CategoryOptions.value.find((item) => {
    return item.key === key
  })
  // console.log(selectedOption);
  selectedItem.label = selectedOption.label;
  selectedItem.category_id = selectedOption.key;
}

const loadCategoryData = async () => {
  let res = await axios.get("/categoryRouters/list")
  // console.log(res.data)
  if (res.data.code === 200) {
    // 用map函数 将内容转成options的相应格式
    CategoryOptions.value = res.data.data.map((item) => {
      if (item.id === 1) {
        return {
          label: item.name,
          key: item.id,
          icon: renderIcon(EditIcon)
        }
      }
      return {
        label: item.name,
        key: item.id,
        icon: renderIcon(HomeIcon)
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
    if (tempRow.length === 0 && PageInfo.page > 1) {
      PageInfo.page -= 1
      res = await axios.get(`/blogRouters/list?page=${PageInfo.page}&pagesize=${PageInfo.pagesize}`)
      tempRow = res.data.data.rows
    }
    for (let row of tempRow) {
      if (row.content.length > 25) {
        row.content += '...';
      }
      let time_flag = new Date(row.create_time);
      row.create_time = `${time_flag.getFullYear()}年${time_flag.getMonth() + 1}月${time_flag.getDate()}日${time_flag.getHours()}点${time_flag.getMinutes()}分`
    }
    BlogData.value = tempRow
    // 将文章总数传给PageInfo
    PageInfo.count = Math.ceil(res.data.data.count / PageInfo.pagesize)
  } else {
    message.error(res.data.msg)
  }
}

const GoHome = () => {
  router.push('/')
}
const ToDashboard = () => {
  router.push('/dashboard/article')
}
const ToDetails = (item) => {
  router.push({path: "/details", query: {id: item.id}})
}

const search = async (current_page) => {
  // 判断是搜索点击过来的 还是翻页触发的事件
  PageInfo.page = current_page ? current_page : PageInfo.page;
  // console.log("****", `/blogRouters/list?keyword=${keyword.value}&page=${PageInfo.page}&pagesize=${PageInfo.pagesize}`)
  let search_url;
  if (selectedItem.category_id) {
    search_url = `/blogRouters/list?category_id=${selectedItem.category_id}&keyword=${keyword.value}&page=${PageInfo.page}&pagesize=${PageInfo.pagesize}`
  } else {
    search_url = `/blogRouters/list?keyword=${keyword.value}&page=${PageInfo.page}&pagesize=${PageInfo.pagesize}`
  }
  let res = await axios.get(search_url)
  // console.log("res", res)
  if (res.data.code === 200) {
    let tempRow = res.data.data.rows
    // 有可能删除后最后一页没数据
    if (tempRow.length === 0 && PageInfo.page > 1) {
      PageInfo.page -= 1
      res = await axios.get(`/blogRouters/list?page=${PageInfo.page}&pagesize=${PageInfo.pagesize}`)
      tempRow = res.data.data.rows
    }
    for (let row of tempRow) {
      if (row.content.length > 25) {
        row.content += '...';
      }
      let time_flag = new Date(row.create_time);
      row.create_time = `${time_flag.getFullYear()}年${time_flag.getMonth() + 1}月${time_flag.getDate()}日${time_flag.getHours()}点${time_flag.getMinutes()}分`
    }
    BlogData.value = tempRow
    // 将文章总数传给PageInfo
    PageInfo.count = Math.ceil(res.data.data.count / PageInfo.pagesize)
  } else {
    message.error(res.data.msg)
  }
}
// 清除分类
const clearCategory = () => {
  selectedItem.category_id = null;
  selectedItem.label = "选择分类"
}

onMounted(() => {
  // 读取分类
  loadCategoryData();
  // 读取博客数据
  loadBlogData();
})
</script>

<style lang="scss" scoped>
.NavList {
  width: 1200px;
  //margin: 0 auto;
  padding-top: 20px;
  padding-left: 20px;
}

.search {
  margin-bottom: 15px;
  margin-left: 20px;
}
</style>