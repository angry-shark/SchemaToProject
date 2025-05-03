<template>
  <sider-container>
    <template #menu-content>
      <el-menu :default-active="activeKey" :ellipsis="false" mode="vertical" @select="onMenuSelect">
        <div v-for="(item) in menuList" :key="item.key">
          <!-- group case -->
          <sub-menu v-if="item.subMenu && item.subMenu.length > 0" :menu-item="item" />
          <!-- module case -->
          <el-menu-item v-else :index="item.key">
            {{ item.name }}
          </el-menu-item>
        </div>
      </el-menu>
    </template>
    <template #main-content>
      <router-view></router-view>
    </template>
  </sider-container>
</template>
<script setup>
import SiderContainer from '$widgets/sider-container/sider-container.vue';
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMenuStore } from '$store/menu.js';
import SubMenu from './complex-view/sub-menu/sub-menu.vue';

const route = useRoute();
const router = useRouter();

const menuStore = useMenuStore();

const activeKey = ref('');
const setActiveKey = (key) => {
  let siderMenuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.sider_key
  });

  /**
   * 处理首次加载的情况，默认选中第一个
   */
  if (!siderMenuItem) {
    const headerMenuItem = menuStore.findMenuItem({
      key: 'key',
      value: route.query.key
    });
    if (headerMenuItem && headerMenuItem.siderConfig && headerMenuItem.siderConfig.menu.length > 0) {
      const siderMenuList = headerMenuItem.siderConfig.menu
      // 找出左侧菜单第一项
      siderMenuItem = menuStore.findFirstMenuItem(siderMenuList);
      if (siderMenuItem) {
        handleMenuSelect(siderMenuItem.key);
      }
    }
  }
  activeKey.value = siderMenuItem?.key;
};


const menuList = ref([]);
const setMenuList = () => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.key
  });

  if (menuItem && menuItem.siderConfig && menuItem.siderConfig.menu) {
    console.log(menuItem.siderConfig.menu)
    menuList.value = menuItem.siderConfig.menu;
  }
};

watch(
  () => route.query.key,
  (newPath) => {
    setMenuList();
    setActiveKey();
  });

watch(() => menuStore.menuList, (newList) => {
  setMenuList();
  setActiveKey()
},{deep:true});

onMounted(() => {
  setMenuList();
  setActiveKey()
});

const onMenuSelect = (sider_key) => {
  handleMenuSelect(sider_key);
}

const handleMenuSelect = (sider_key) => {
  const siderMenuItem = menuStore.findMenuItem({
    key: 'key',
    value: sider_key
  });
  const { moduleType, key, customConfig } = siderMenuItem

  if (key === route.query.sider_key) {// 如果当前路由已经是这个菜单了，就不需要跳转了
    return;
  }

  const pathMap = {
    'iframe': '/iframe',
    'schema': '/schema',
    'custom': customConfig?.path,
  }

  console.log( `/sider${pathMap[moduleType]}`)

  router.push({
    path: `/sider${pathMap[moduleType]}`,
    query: {
      key: route.query.key,
      sider_key: siderMenuItem.key,
      proj_key: route.query.proj_key,
    }
  })
};


</script>
<style lang="less" scoped></style>