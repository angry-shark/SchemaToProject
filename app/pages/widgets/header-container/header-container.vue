<template>
  <el-container class="header-container">
    <el-header class="header">
      <el-row
        type="flex"
        align="middle"
        class="header-row"
      >
        <!-- 左上方title -->
        <el-row
          type="flex"
          align="middle"
          class="title-panel"
        >
          <img
            src="./asserts/logo.png"
            class="logo"
          >
          <el-row class="text">
            {{ title }}
          </el-row>
        </el-row>
        <!-- 插槽：菜单区域 -->
        <slot name="menu-content" />

        <!-- 插槽：用户个人信息区域 -->
        <el-row
          type="flex"
          align="middle"
          justify="end"
          class="setting-panel"
        >
          <slot name="setting-content" />
          <img
            src="./asserts/avatar.png"
            class="avatar"
          >
          <el-dropdown @command="handleUserCommand">
            <span class="username">{{ userName }} <i class="el-icon-arrow-down el-icon--right" /></span>
            <template #dropdown>
              <el-dropdown-item command="logout">
                退出登陆
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </el-row>
      </el-row>
    </el-header>
    <el-main class="main-container">
      <!-- 插槽：核心内容填充区域 -->
      <slot name="main-content" />
    </el-main>
  </el-container>
</template>
<script setup>
import { ref } from 'vue'

defineProps({
  title: String,

});

const userName = ref('管理员');

const handleUserCommand = (e) => { console.log(e) }
</script>
<style lang="less" scoped>
.header-container {
  height: 100%;
  min-width: 1000px;
  overflow: hidden;

  .header {
    max-height: 120px;
    border-bottom: 1px solid #e8e8e8;

    .header-row {
      height: 60px;
      padding: 0 20px;

      .title-panel {
        width: 180px;
        min-width: 180px;

        .logo {
          margin-right: 10px;
          width: 25px;
          height: 25px;
          border-radius: 50%;
        }

        .text {
          font-size: 15px;
          font-weight: 500;
        }
      }

      .setting-panel {
        margin-left: auto;
        min-width: 180px;

        .avatar {
          margin-right: 12px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .username {
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          height: 60px;
          line-height: 60px;
          outline: none;
        }
      }
    }
  }

  .main-container {}
}

:deep(.el-header) {
  padding: 0;
}
</style>