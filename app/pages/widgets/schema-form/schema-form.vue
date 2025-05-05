<template>
  <el-row
    v-if="schema && schema.properties"
    class="schema-form"
  >
    <div
      v-for="(itemSchema, key) in schema.properties"
      :key="key"
    >
      <component
        :is="FormItemConfig[itemSchema.option?.comType]?.component"
        ref="formComList"
        :v-show="itemSchema.option.visible !== false"
        :schema-key="key"
        :schema="itemSchema"
        :model="model[key]"
      >
      </component>
    </div>
  </el-row>
</template>
<script setup>
import { provide, toRefs, ref } from 'vue';
import FormItemConfig from './form-item-config';
const Ajv = require('ajv')
const ajv = new Ajv()

provide('ajv', ajv)

//接收的属性
const props = defineProps({
    /**
     * schema config data structure
     *  schema: {
          //板块数据结构
          type: "object",
          properties: {
            key: {
              ...schema, //标准的schema
              type: "", //字段类型
              label: "", //字段的中文名
              option: {
                ...elComponentConfig, //标准的 el-component 配置
                comType: "", //控键类型 input/select/input-number ...
                visible: true, //是否展示（true/false）， 默认展示
                disabled: false, //是否禁用（true/false），默认不禁用
                default: "", //默认值
                required: false,// 表单项是否必填，默认false

                //如果 comType 是 select时
                enumList: [], //可选项的枚举列表
              },
            },
          },
        },
     */
    schema: {
        type: Object,
        default: () => ({})
    },
    /**
     * 表单数据
     */
    model: {
        type: Object,
        default: () => ({})
    }
})

const { schema, model } = toRefs(props)

const formComList = ref([])


//返回的事件
//暴露的方法
const validate = () => {
    return formComList.value.every(formCom => {
        const validResult = formCom.validate()
        return validResult
    })
}

const getValue = () => {
    return formComList.value.reduce((dtoObj, formCom) => {
        return {
            ...dtoObj,
            ...formCom.getValue()
        }
    }, {})
}

defineExpose({
    validate,
    getValue
})

</script>
<style lang="less">
.schema-form {
    .form-item {
        margin-bottom: 20px;
        min-width: 500px;

        .item-label {
            margin-right: 15px;
            min-width: 70px;
            text-align: right;
            font-size: 14px;
            color: #ffffff;
            word-break: break-all;

            .required {
                padding-right: 4px;
                color: #f56c6c;
                font-size: 20px;
            }
        }

        .item-value {
            .component {
                width: 320px;
            }

            .valid-border {

                .el-input__wrapper,
                .el-select_wrapper {
                    border: 1px solid #f93f3f;
                    box-shadow: 0 0 0 0;
                }
            }
        }

        .valid-tips {
            margin-left: 10px;
            height: 36px;
            line-height: 36px;
            overflow: hidden;
            font-size: 12px;
            color: #f93f3f
        }

    }
}
</style>