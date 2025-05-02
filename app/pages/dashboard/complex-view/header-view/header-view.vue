<template>
  <HeaderContainer :title="projName">
    <template #menu-content>
      <el-menu
        :default-active="activeKey"
        :ellipsis="false"
        mode="horizontal"
        @select="onMenuSelect"
      >
        <div
          v-for="(item) in menuStore.getMenuList()"
          :key="item.key"
        >
          <SubMenu
            v-if="item.subMenu && item.subMenu.length > 0"
            :menu-item="item"
          />
          <el-menu-item
            v-else
            :index="item.key"
          >
            {{ item.name }}
          </el-menu-item>
        </div>
      </el-menu>
    </template>
    <template #setting-content>
      <!-- dep project store 的 project_list to render -->
      <el-dropdown @command="handleProjectCommand">
        <span class="project-list">
          {{ projName }}
          <el-icon
            v-if="projectStore.projectList.length > 1"
            class="el-icon-right"
          >
            <ArrowDown />
          </el-icon></span>


        <template
          v-if="projectStore.projectList.length > 1"
          #dropdown
        >
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(item) in projectStore.projectList"
              :key="item.key"
              :command="item.key"
              :disabled="item.name === projName"
            >
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <template #main-content>
      <!-- dep project store 的 menu to render -->
      <slot name="main-content" />
    </template>
  </HeaderContainer>
</template>
<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import HeaderContainer from '$pages/widgets/header-container/header-container.vue'
import { ref } from 'vue';
import { useProjectStore } from '$store/project.js';
import { useMenuStore } from '$store/menu.js';
import SubMenu from './complex-view/sub-menu/sub-menu.vue';

const projectStore = useProjectStore();
const menuStore = useMenuStore();

defineProps({
  projName: {
    type: String,
    default: 'Header View'
  }
})


const activeKey = ref('');

const onMenuSelect = (key) => {
  activeKey.value = key;
}

const handleProjectCommand = (e) => {
  console.log(e)
}


</script>
<style lang="less" scoped>
.project-list {
  margin-right: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  outline: none;
  color: var(--el-color-primary);
}


:deep(.el-menu--horizontal.el-menu) {
  border-bottom: 0
}
</style>