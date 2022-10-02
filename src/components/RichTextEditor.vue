<template>
  <div>
    <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        style="border-bottom: 1px solid #ccc"
    />
    <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        v-model="valueHtml"
        style="height: 400px; overflow-y: hidden"
        @onCreated="handleCreated"
        @onChange="handleChange"
    />
  </div>
</template>

<script setup>
import {AdminStore} from "@/stores/AdminStore.js";
import {inject, nextTick, onBeforeUnmount, onMounted, reactive, ref, shallowRef} from 'vue'
import '@wangeditor/editor/dist/css/style.css';
import {Editor, Toolbar} from '@wangeditor/editor-for-vue';

const server_url = inject('server_url');

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
const toolbarConfig = {excludeKeys: ['uploadVideo', 'italic','group-more-style']} // 排除菜单组，写菜单组 key 的值即可
const editorConfig = {placeholder: '请输入内容...'};
editorConfig.MENU_CONF = {}
editorConfig.MENU_CONF['uploadImage'] = {
  // 小于该值就插入 base64 格式（而不上传），默认为 0
  base64LimitSize: 5 * 1024, // 5kb
  server: server_url + '/UploadRouters/rich_editor_upload',
}
editorConfig.MENU_CONF['insertImage'] = {
  // 也支持 async 函数
  parseImageSrc: (src) => {
    // 如果不包含服务器地址 则添加上去
    if (src.indexOf('http') !== 0) {
      return `${server_url}${src}`
    }
    return src
  },
}

const mode = ref('default')
// 内容 HTML
const valueHtml = ref('');

const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  }
})

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

// 这个先将数据传入好了在进行数据的渲染
onMounted(async () => {
  // 使用nextTick，让页面数据渲染完成后在渲染DOM
  await nextTick(() => {
    valueHtml.value = props.modelValue;
  });
})

// 编辑器回调函数
const handleCreated = (editor) => {
  // console.log('created', editor);
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
  // console.log('change:', editor.getHtml());
  // 修改内容的时候，向外面抛出输入的内容
  // emit('update:model-value', valueHtml.value)
  emit("update:model-value", valueHtml.value)
};

// 注册需要抛出的事件
const emit = defineEmits(['update:model-value'])

</script>

<style lang="scss" scoped>

</style>