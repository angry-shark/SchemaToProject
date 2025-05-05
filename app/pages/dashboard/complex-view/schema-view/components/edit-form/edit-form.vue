<template>
  <el-drawer
    v-model="isShow"
    direction="rtl"
    :destroy-on-close="true"
    size="550"
  >
    <template #header>
      <h3>{{ title }}</h3>
    </template>
    <template #default>
      <schema-form
        ref="schemaFormRef"
        v-loading="loading"
        :schema="components[name]?.schema"
        :model="dtoModel"
      ></schema-form>
    </template>
    <template #footer>
      <el-button
        type="primary"
        @click="save"
      >
        {{ saveBtnText }}
      </el-button>
    </template>
  </el-drawer>
</template>
<script setup>
import { ref, inject } from 'vue';
import SchemaForm from '$widgets/schema-form/schema-form.vue'
import $curl from '$common/curl.js'
import { ElNotification } from 'element-plus';

const emits = defineEmits(['command'])

const name = ref('editForm')

const { api, components } = inject('schemaViewData')

const title = ref('')
const saveBtnText = ref('')
const isShow = ref(false)
const loading = ref(false)

const mainKey = ref('')
const mainKeyValue = ref()
const dtoModel = ref({})

const schemaFormRef = ref(null)

const show = (rowData) => {
    const { config } = components.value[name.value]
    title.value = config.title;
    saveBtnText.value = config.saveBtnText;

    mainKey.value = config.mainKey //表单主键
    mainKeyValue.value = rowData[config.mainKey] //表单主键值
    dtoModel.value = {}

    isShow.value = true
    fetchFormData()
}

const close = () => {
    isShow.value = false
}

async function fetchFormData() {
    if (loading.value) return;

    loading.value = true
    const res = await $curl({
        method: 'get',
        url: api.value,
        query: {
            [mainKey.value]: mainKeyValue.value
        }
    })
    loading.value = false

    if (!res || !res.success || !res.data || !res.data.product) {
        return;
    }

    dtoModel.value = res.data.product
}

const save = async () => {
    if (loading.value) return;
    const validResult = schemaFormRef.value.validate()
    //校验表单
    if (!validResult) {
        return;
    }

    loading.value = true
    const res = await $curl({
        method: 'put',
        url: api.value,
        data: {
            ...schemaFormRef.value.getValue(),
            [mainKey.value]: mainKeyValue.value.toString(),
        }
    })
    loading.value = false

    if (!res || !res.success || !res.data) {
        return;
    }

    ElNotification({
        title: '修改成功',
        message: '修改成功',
        type: 'success'
    })

    close()

    emits('command', {
        event: 'loadTableData'
    })
}

defineExpose({
    name,
    show
})

</script>
<style lang="less" scoped></style>