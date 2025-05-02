<template>
  <el-sub-menu :index="menuItem.key">
    <template #title>{{ menuItem.name }}2222</template>
    <div v-for="item in menuItem.subMenu" :key="item.key">
      <SubMenu 
        v-if="item.subMenu && item.subMenu.length > 0" 
        :menu-item="item"/>
      <el-sub-menu 
        v-else 
        :index="item.key">
        {{ item.name }}
      </el-sub-menu>
    </div>
  </el-sub-menu>
</template>
<script setup>
const { menuItem } = defineProps({
    menuItem: {
        type: Object,
        default: () => ({})
    }
})

console.log(menuItem.subMenu)
</script>
<style lang="less" scoped></style>