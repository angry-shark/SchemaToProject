<template>
  <el-select v-model="dtoValue" v-bind="schema.option" class="dynamic-select">
    <el-option v-for="item in enumList" :key="item.value" :value="item.value" :label="item.label"></el-option>
  </el-select>
</template>
<script setup>
import { ref, onMounted } from "vue"
import $curl from '$common/curl.js'

const { schemaKey, schema } = defineProps({
  schemaKey: {
    type: String,
    default: ''
  }, schema: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['loaded'])

const dtoValue = ref()

function getValue() {
  return dtoValue.value !== undefined ? {
    [schemaKey]: dtoValue.value
  } : {}
}

const enumList = ref([])
const fetchEnumList = async () => {
  const res = await $curl({
    method: 'get',
    url: schema.option?.api,
    data: {}
  })

  if (res?.data?.length > 0) {
    enumList.value.push(...res.data)
  }
}

const reset = () => {
  dtoValue.value = schema?.option?.default ?? enumList.value[0]?.value
}

onMounted(async () => {
  await fetchEnumList()
  reset();
  emits('loaded')
})

defineExpose({
  getValue,
  reset
})
</script>
<style lang="less" scoped></style>