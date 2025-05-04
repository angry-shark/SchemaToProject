<template>
  <el-input
    v-model="dtoValue"
    v-bind="schema.option"
    class="input"
  ></el-input>
</template>
<script setup>
import { onMounted, ref } from "vue"

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
    dtoValue.value = schema?.option?.default
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