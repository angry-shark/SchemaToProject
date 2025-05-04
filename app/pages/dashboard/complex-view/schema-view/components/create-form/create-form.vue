<template>
  <el-drawer v-model="isShow" direction="rtl" :destroy-on-close="true" :size="550">2222</el-drawer>
</template>
<script setup>
import { ref } from 'vue'

//接收的参数
// const { component } = inject('schemaViewData')



const name = ref('createForm')

const isShow = ref(false)
const show = (rowData) => {
  isShow.value = true
}

defineExpose({
  name,
  show
})

</script>
<style lang="less" scoped></style>