<!-- eslint-disable vue/html-self-closing -->
<template>
  <h1>page2</h1>
  <input v-model="content" />
  <div>{{ content }}</div>
</template>
<script setup>
import { ref } from "vue";
import util from "$common/utils";
import './page2.css'
import '../commoncss/common.css'
const content = ref("");
console.log("page2 init");
util.print()
</script>
<style lang="less" scoped>
h1 {
  color: blue;
}
</style>