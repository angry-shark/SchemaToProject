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
      <el-input
        v-model="dtoValue"
        v-bind="schema.option"
        class="component"
        :class="validateTips ? 'valid-border' : ''"
        :placeholder="placeHolder"
        @blur="onBlur"
        @focus="onFocus"
      ></el-input>
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
    model: {
        type: String,
        default: ''
    }
})
const { schemaKey, schema } = props
const { model } = toRefs(props)


const validateTips = ref(null)
const placeHolder = ref('')
const dtoValue = ref('')
const initData = () => {
    validateTips.value = null
    dtoValue.value = model.value ?? schema.option?.default

    const {
        minLength,
        maxLength,
        pattern
    } = schema

    const ruleList = []
    if (schema.option?.placeholder) {
        ruleList.push(schema.option?.placeholder)
    }

    if (minLength) {
        ruleList.push(`最小长度${minLength}`)
    }

    if (maxLength) {
        ruleList.push(`最大长度${maxLength}`)
    }

    if (pattern) {
        ruleList.push(`格式: ${pattern}`)
    }

    placeHolder.value = ruleList.join('|')
}


onMounted(() => {
    initData()
})
watch([model, schema], () => {
    initData()
}, { deep: true })

const validate = () => {
    validateTips.value = null
    const { type } = schema

    //校验是否必填
    if (schema.option?.required && !dtoValue.value) {
        validateTips.value = '不能为空'
        return false
    }

    //校验schema
    if (dtoValue.value) {
        const validator = ajv.compile(schema)
        const valid = validator(dtoValue.value)
        if (!valid && validator.error && validator.error[0]) {
            const { keyword, params } = validator.error[0]
            if (keyword === 'type') {
                validateTips.value = `类型必须为${type}`
            } else if (keyword === 'maxLength') {
                validateTips.value = `最大长度应为${params.limit}`
            } else if (keyword === 'minLength') {
                validateTips.value = `最小长度应为${params.limit}`
            } else if (keyword === 'pattern') {
                validateTips.value = `格式不正确`
            } else {
                console.log(validator.error[0])
                validateTips.value = '不符合要求'
            }
            return false
        }
    }
    return true
}

const getValue = () => {
    return dtoValue.value !== undefined ? {
        [schemaKey]: dtoValue.value
    } : {}
}

const onFocus = () => {
    validateTips.value = ''
}

const onBlur = () => {
    validate()
}

defineExpose({
    name: `${schemaKey}_input`,
    validate,
    getValue
})
</script>
<style lang="less" scoped></style>