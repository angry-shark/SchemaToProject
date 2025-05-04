<template>
  <el-select
    v-model="dtoValue"
    v-bind="schema.option"
    class="select"
  >
    <el-option
      v-for="item in schema.option?.enumList"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    ></el-option>
  </el-select>
</template>
<script setup>
import { ref, onMounted } from "vue"

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

function reset() {
    dtoValue.value = schema?.option?.default ?? schema.option?.enumList[0]?.value
}


onMounted(() => {
    reset();
    emits('loaded')
})

defineExpose({
    getValue,
    reset
})
</script>
<style lang="less" scoped></style>