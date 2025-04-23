<!-- eslint-disable vue/html-self-closing -->
<template>
  <h1>page1</h1>
  <input v-model="content" />
  <div>{{ content }}</div>
  <h1>hmr complete11122</h1>
</template>
<script setup>
import { ref } from "vue";
import util from "$common/utils";
import './page1.css'
import '../commoncss/common.css'
const content = ref("");
console.log("page1 init");
util.print()
</script>
<style lang="less" scoped>
h1 {
  color: red;
}
</style>