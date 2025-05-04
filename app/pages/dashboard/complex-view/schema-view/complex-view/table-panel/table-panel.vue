<template>
  <el-card class="table-panel">
    <!-- operation-panel -->
    <el-row v-if="tableConfig?.headerButtons?.length > 0" justify="end" class="operation-panel">
      <el-button v-for="(item, idx) in tableConfig?.headerButtons" :key="idx" v-bind="item"
        @click="operationHandler({ btnConfig: item })">{{ item.label }}</el-button>
    </el-row>
    <!-- schema-table 组件 widgets -->
    <schema-table ref="schemaTableRef" :api="api" :schema="tableSchema" :buttons="tableConfig?.rowButtons ?? []"
      @operate="operationHandler"></schema-table>
  </el-card>
</template>
<script setup>
import { ref, inject } from 'vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import $curl from '$common/curl.js'
import SchemaTable from '$widgets/schema-table/schema-table.vue'

const emits = defineEmits(['operate'])

const {
  api,
  tableSchema,
  tableConfig
} = inject('schemaViewData')

const schemaTableRef = ref(null)


const EventHandlerMap = {
  remove: removeData
}

function operationHandler({ btnConfig, rowData }) {
  const { eventKey } = btnConfig
  if (EventHandlerMap[eventKey]) {
    EventHandlerMap[eventKey]({ btnConfig, rowData })
  } else {
    emits('operate', { btnConfig, rowData })
  }
}

function removeData({ btnConfig, rowData }) {
  const { eventOption } = btnConfig
  if (!eventOption?.params) { return; }

  const { params } = eventOption

  const removeKey = Object.keys(params)[0]
  let removeValue
  const removeValueList = Object.values(params)[0].split("::")
  if (removeValueList[0] === 'schema' && removeValueList[1]) {
    removeValue = rowData[removeValueList[1]]
  }

  ElMessageBox.confirm(
    `确认删除 ${removeKey} 为 ${removeValue} 数据？`,
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }
  ).then(async () => {
    schemaTableRef.value.showLoading()
    const res = await $curl({
      method: 'delete',
      url: api.value,
      data: {
        [removeKey]: removeValue
      },
      errorMessage: '删除失败'
    })
    schemaTableRef.value.hideLoading()

    if (!res || !res.success || !res.data) {
      return;
    }

    ElNotification({
      title: '删除成功',
      message: '删除成功',
      type: 'success'
    })
    await initTableData()
  })
}

async function initTableData() {
  await schemaTableRef.value.initData()
}

async function loadTableData() {
  await schemaTableRef.value.loadTableData()
}

defineExpose({
  initTableData,
  loadTableData
})

</script>
<style lang="less" scoped>
.table-panel {
  flex: 1;
  margin-right: 10px;

  .operation-panel {
    margin-bottom: 10px;
  }
}

:deep(.el-card__body) {
  height: 98%;
  display: flex;
  flex-direction: column;
}
</style>