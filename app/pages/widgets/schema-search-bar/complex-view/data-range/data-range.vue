<template>
  <el-date-picker
    v-model="dtoValue"
    v-bind="schema.option"
    type="daterange"
    range-separator="至"
    :start-placeholder="schema.label + '(开始)'"
    :end-placeholder="schema.label + '(结束)'"
    class="date-range"
  ></el-date-picker>
</template>
<script setup>
import { onMounted, ref } from "vue"
import moment from 'moment'

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

const dtoValue = ref([])

function getValue() {
    return dtoValue.value?.length === 2 ? {
        [`${schemaKey}_start`]: moment(dtoValue.value[0]).format("YYYY-MM-DD"),
        [`${schemaKey}_end`]: moment(dtoValue.value[1]).format("YYYY-MM-DD")
    } : {}
}

function reset() {
    dtoValue.value = []
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