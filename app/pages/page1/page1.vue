<!-- eslint-disable vue/html-self-closing -->
<template>
  <h1>page1</h1>
  <el-input v-model="content" style="width: 300px;" />
  <el-table :data="tableData" style="width: 100%;">
    <el-table-column prop="name" label="name" width="180"></el-table-column>
    <el-table-column prop="description" label="desc"></el-table-column>
  </el-table>
  <div>{{ content }}</div>
</template>
<script setup>
import $curl from '$common/curl.js'
import { ref, onMounted } from "vue";
import './page1.css'
const content = ref("");
const tableData = ref([])


onMounted(async () => {
  const res = await $curl({
    url: '/api/project/list', //请求地址
    method: "get", //请求方法
    query: {
      proj_key: '111'
    }
  })
  tableData.value = res.data;
})

</script>
<style lang="less" scoped>
h1 {
  color: red;
}
</style>