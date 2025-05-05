<template>
  <el-row
    type="flex"
    align="middle"
    class="form-item"
  >
    <!-- label -->
    <el-row
      class="item-label"
      justify="end"
    >
      <el-row
        v-if="schema.option?.required"
        type="flex"
        class="required"
      >
        *
      </el-row>
      {{ schema.label }}
    </el-row>
    <!-- value -->
    <el-row class="item-value">
      <el-select
        v-model="dtoValue"
        v-bind="schema.option"
        class="component"
        :class="validateTips ? 'valid-border' : ''"
        @change="onChange"
      >
        <el-option
          v-for="item in schema.option?.enumList"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
      <el-row
        v-if="validateTips"
        class="valid-tips"
      >
        <!-- 呈现错误信息 -->
        {{ validateTips }}
      </el-row>
    </el-row>
  </el-row>
</template>
<script setup>
import { toRefs, watch, ref, onMounted, inject } from 'vue';

const ajv = inject('ajv')

const props = defineProps({
    schemaKey: {
        type: String,
        default: ''
    },
    schema: {
        type: Object,
        default: () => ({})
    },
    // eslint-disable-next-line vue/require-default-prop
    model: null
})
const { schemaKey, schema } = props
const { model } = toRefs(props)


const validateTips = ref(null)
const dtoValue = ref('')
const initData = () => {
    validateTips.value = null
    dtoValue.value = model.value ?? schema.option?.default
}


onMounted(() => {
    initData()
})
watch([model, schema], () => {
    initData()
}, { deep: true })

const validate = () => {
    validateTips.value = null

    //校验是否必填
    if (schema.option?.required && !dtoValue.value) {
        validateTips.value = '不能为空'
        return false
    }

    //校验schema
    if (dtoValue.value) {
        let dtoEnum = []
        if (schema.option?.dtoEnum) {
            dtoEnum = schema.option?.dtoEnum.map(item => item.value)

            const validator = ajv.compile({
                schema,
                ...{ enum: dtoEnum }
            })

            const valid = validator(dtoValue.value)
            if (!valid && valid.errors && valid.errors[0]) {
                if (valid.errors[0].keyword === 'enum') {
                    validateTips.value = '取值超出枚举范围'
                } else {
                    console.log(valid.errors[0])
                    validateTips.value = '不符合要求'
                }
                return false
            }
        }
    }
    return true
}

const getValue = () => {
    return dtoValue.value !== undefined ? {
        [schemaKey]: dtoValue.value
    } : {}
}

const onChange = () => {
    validate()
}

defineExpose({
    name: `${schemaKey}_select`,
    validate,
    getValue
})
</script>
<style lang="less" scoped></style>