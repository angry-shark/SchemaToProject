<template>
  <el-config-provider :locale="zhCn">
    <HeaderView :proj-name="projName" />
  </el-config-provider>
</template>
<script setup>
import { zhCn } from 'element-plus/es/locale/index.mjs';
import HeaderView from '$pages/dashboard/complex-view/header-view/header-view.vue';
import $curl from '$pages/common/curl.js';
import { ref, onMounted } from 'vue';
import { useProjectStore } from '$store/project.js';
import { useMenuStore } from '$store/menu.js';

const projectStore = useProjectStore();
const menuStore = useMenuStore();

const projName = ref('');

onMounted(() => {
    getProjectConfigList();
    getProjectConfig();
});


//请求/api/project/geiList， 并 cache 到 project store 中
async function getProjectConfigList() {
    const res = await $curl({
        method: 'get',
        url: '/api/project/list',
        query: {
            proj_key: 'pdd'
        }
    })

    if (!res || !res.success || !res.data) {
        return;
    }

    projectStore.setProjectList(res.data);
}


//请求 /api/project，并缓存到 menu store 中
async function getProjectConfig() {
    const res = await $curl({
        method: 'get',
        url: '/api/project/getProject',
        query: {
            proj_key: 'pdd'
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