<template>
  <el-config-provider :locale="zhCn">
    <HeaderView
      :proj-name="projName"
      @menu-select="onMenuSelect"
    >
      <template #main-content>
        <router-view />
      </template>
    </HeaderView>
  </el-config-provider>
</template>
<script setup>
import { zhCn } from 'element-plus/es/locale/index.mjs';
import HeaderView from '$pages/dashboard/complex-view/header-view/header-view.vue';
import $curl from '$pages/common/curl.js';
import { ref, onMounted } from 'vue';
import { useProjectStore } from '$store/project.js';
import { useMenuStore } from '$store/menu.js';
import { useRoute, useRouter } from 'vue-router';


const route = useRoute();
const router = useRouter();

const projectStore = useProjectStore();
const menuStore = useMenuStore();

const projName = ref('');

onMounted(() => {
    getProjectConfigList();
    getProjectConfig();
});

/**
 * 点击菜单callback
 * @param menuItem 
 */
const onMenuSelect = (menuItem) => {
    const { moduleType, key, customConfig } = menuItem;

    if (key === route.query.key) {// 如果当前路由已经是这个菜单了，就不需要跳转了
        return;
    }

    const pathMap = {
        'sider': '/sider',
        'iframe': '/iframe',
        'schema': '/schema',
        'custom': customConfig?.path,
    }

    router.push({
        path: pathMap[moduleType],
        query: {
            key: key,
            proj_key: route.query.proj_key,
        }
    })
};


//请求/api/project/geiList， 并 cache 到 project store 中
async function getProjectConfigList() {
    const res = await $curl({
        method: 'get',
        url: '/api/project/list',
        query: {
            proj_key: route.query.proj_key
        }
    })

    if (!res || !res.success || !res.data) {
        return;
    }

    projectStore.setProjectList(res.data);
}


//请求 /api/project/getProject，并缓存到 menu store 中
async function getProjectConfig() {
    const res = await $curl({
        method: 'get',
        url: '/api/project/getProject',
        query: {
            proj_key: route.query.proj_key
        }
    })

    if (!res || !res.success || !res.data) {
        return;
    }

    const { name, menu } = res.data;
    projName.value = name;
    menuStore.setMenuList(menu);
}



</script>
<style lang="less" scoped></style>