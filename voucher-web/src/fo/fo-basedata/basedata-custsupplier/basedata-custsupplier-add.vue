<!--客商基础数据新建/修改界面-->
<template>
    <div>
        <Modal
        v-model="modal"
        :title="title"
        :loading="loading"
        :mask-closable="false"
        @on-ok="ok('formItem')"
        @on-cancel="cancel"
        width="50%">
            <Form
            :model="formItem"
            :rules="ruledefineadd"
            ref="formItem"
            :label-width="110">
                <Row>
                    <i-col span="12">
                        <FormItem label="代码" prop="code">
                            <Input :readonly="status=='update'" v-model.trim="formItem.code" placeholder="输入代码"/>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="名称" prop="name">
                            <Input v-model.trim="formItem.name" placeholder="输入名称"/>
                        </FormItem>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="12">
                        <FormItem label="助记码" prop="shortname">
                            <Input v-model.trim="formItem.shortname" placeholder="输入助记码"/>
                        </FormItem>
                    </i-col>
                </Row>
                <Row v-for="(fields, row) in extendFields" :key="row">
                    <i-col span="12" v-for="(field, col) in fields" :key="col">
                        <FormItem :label="field.columnTitle" :prop="field.columnName.toLowerCase()">
                            <!-- 父级 -->
                            <va-basedata v-if="field.columnType==='NVARCHAR' && field.columnName.toLowerCase() === 'parentcode'"
                                :value="parentshow"
                                :disabled="field.readonly"
                                :tbName="tableName"
                                useMode="bill"
                                @on-change="val => baseDataChange('parentcode', val)">
                            </va-basedata>

                            <!-- 基础数据 -->
                            <va-basedata v-else-if="field.columnType==='NVARCHAR' && (field.mappingType === 1 || field.mappingType === 4)"
                                :value="formItem[field.columnName.toLowerCase() + '_show']"
                                :disabled="field.readonly"
                                :tbName="field.mapping.split('.')[0]"
                                useMode="bill"
                                @on-change="val => baseDataChange(field.columnName.toLowerCase(), val)">
                            </va-basedata>

                            <!-- 枚举 -->
                            <va-select v-else-if="field.columnType==='NVARCHAR' && field.mappingType === 2"
                                v-model="formItem[field.columnName.toLowerCase() + '_show']"
                                :disabled="field.readonly"
                                :tbName="field.mapping.split('.')[0]"
                                @on-change="val => enumDataChange(field.columnName.toLowerCase(), val)">
                            </va-select>

                            <!-- 布尔型-->
                            <el-switch v-else-if="field.columnType==='BOOLEAN' || field.columnName.toLowerCase() === 'stopflag'" active-color="#03A4AD"
                                :disabled="field.readonly" active-value="1" inactive-value="0"
                                v-model="formItem[field.columnName.toLowerCase()]">
                            </el-switch>

                            <!-- 整型-->
                            <CustomInputInt v-else-if="field.columnType==='INTEGER' && field.columnName.toLowerCase() !== 'stopflag'"
                                v-model="formItem[field.columnName.toLowerCase()]"
                                :disabled="field.readonly"
                                :querycitem="{conditionType: 'SINGLE'}">
                            </CustomInputInt>

                            <!-- 浮点型 -->
                            <CustomInputNum v-else-if="field.columnType==='NUMERIC'"
                                v-model="formItem[field.columnName.toLowerCase()]"
                                :disabled="field.readonly"
                                :querycitem="{conditionType: 'SINGLE'}">
                            </CustomInputNum>

                            <!-- 日期 -->
                            <DatePicker v-else-if="field.columnType==='DATE' || field.columnType==='TIMESTAMP'" style="width: 100%;"
                                v-model="formItem[field.columnName.toLowerCase()]"
                                :disabled="field.readonly"
                                :type="field.columnType==='DATE'?'date':'datetime'"
                                :transfer="true">
                            </DatePicker>

                            <!-- 字符串-->
                            <CustomInputString v-else
                                v-model="formItem[field.columnName.toLowerCase()]"
                                :disabled="field.readonly"
                                :querycitem="{conditionType: 'SINGLE'}">
                            </CustomInputString>
                        </FormItem>
                    </i-col>
                </Row>
                <div class="subtable" border highlight-current-row height="800px">
                    <va-detail-table ref="collaccount" :isEdit="true" :table-cols="collAccountCols" :table-data="collAccountData" :show-summary="false"></va-detail-table>
                </div>
            </Form>
        </Modal>
    </div>
</template>

<script>
import {
    basedataApi
} from '../../../api/fo'
import {
    vaBaseDataApi
} from '../../../api/va'

export default {
    name: 'AddCustSupplier',
    props: {
        title: String,
        custsupplier: Object,
        custsupptypecode: String,
        define: Object
    },
    data () {
        return {
            modal: true,
            loading: true,
            status: '',
            collAccountData: [],
            formItem: {
                code: '',
                name: '',
                shorttitle: '',
                custsupptypecode: '',
                olddetails: null,
                details: null,
                tableName: 'MD_CUSTSUPP'
            },
            ruledefineadd: {
                'code': [{
                    required: true,
                    message: '请输入代码',
                    trigger: 'blur'
                }],
                'name': [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                custflag: [{
                    validator: (rule, val, callBack) => {
                        if (this.formItem.custflag === '0' && this.formItem.suppflag === '0') {
                            callBack(new Error('请设置客户标识或供应商标识'))
                        }
                        callBack()
                    }
                }],
                suppflag: [{
                    validator: (rule, val, callBack) => {
                        if (this.formItem.custflag === '0' && this.formItem.suppflag === '0') {
                            callBack(new Error('请设置供应商标识或客户标识'))
                        }
                        callBack()
                    }
                }]
            },
            extendFields: []
        }
    },
    computed: {
        collAccountCols () {
            return [
                {field: 'code', title: '账号', width: '150', type: 'string'},
                {field: 'name', title: '户名', width: '150', type: 'string'},
                {field: 'banktypecode', title: '银行大类', width: '150', type: 'basedata', tbName: 'MD_BANKTYPE'},
                {field: 'bankcode', title: '开户银行', width: '150', type: 'basedata', tbName: 'MD_BANK'},
                {field: 'cnapscode', title: '联行号', width: '150', type: 'basedata', tbName: 'MD_CNAPS'},
                {field: 'defaultflag', title: '默认', width: '100', trueValue: 1, falseValue: 0, type: 'switch'}
            ]
        }
    },
    async mounted () {
        await this.loadDefine()
        // 区分新建和修改
        if (this.custsupplier) {
            this.status = 'update'
            this.formItem.id = this.custsupplier.id
            this.formItem.code = this.custsupplier.code
            this.formItem.name = this.custsupplier.name
            this.formItem.shortname = this.custsupplier.shortname
            for (let key in this.custsupplier) {
                if (key === 'showTitle' || key === 'showTitleMap') {
                    continue
                }
                this.$set(this.formItem, key, this.custsupplier[key].toString())
            }
            let colName = null
            let showText = null
            for (let cols of this.extendFields) {
                for (let field of cols) {
                    colName = field.columnName.toLowerCase()
                    if (this.custsupplier[colName]) {
                        if (colName === 'parentcode' || (field.mappingType === 1 || field.mappingType === 4)) {
                            showText = {name: this.custsupplier[colName], title: this.custsupplier.showTitleMap[colName]}
                        } else if (field.mappingType === 2) {
                            showText = {name: this.custsupplier[colName]}
                        } else {
                            showText = this.custsupplier[colName]
                        }
                    } else {
                        showText = null
                    }
                    // 定义 _show, 可用于基础数据和枚举的前端控件显示，亦可用于后台做清空值判断。
                    this.$set(this.formItem, colName + '_show', showText)
                }
            }
            this.loadsubdata()
        } else {
            this.status = 'add'
            this.formItem.code = ''
            this.formItem.name = ''
            this.formItem.shortname = ''
            this.$set(this.formItem, 'custsupptypecode_show', this.custsupptypecode)
            this.$set(this.formItem, 'custsupptypecode', this.custsupptypecode)
            // this.formItem.custsupptypecode = this.custsupptypecode
        }
    },
    methods: {
        // 加载定义
        async loadDefine () {
            let defineInfo = this.define
            let fields = []
            for (let i in defineInfo.showFields) {
                // 处理字段校验
                if (defineInfo.showFields[i].required && defineInfo.showFields[i].required === true) {
                    let key = defineInfo.showFields[i].columnName.toLowerCase()
                    let info = '输入' + defineInfo.showFields[i].columnTitle
                    let rule = {required: true, message: info, trigger: 'blur'}
                    if (defineInfo.showFields[i].columnType === 'TIMESTAMP' || defineInfo.showFields[i].columnType === 'DATE') {
                        rule.type = 'date'
                    }
                    this.ruledefineadd[key] = [rule]
                }
                if (defineInfo.showFields[i].columnName === 'SHORTNAME' || defineInfo.showFields[i].columnName === 'CODE' ||
                    defineInfo.showFields[i].columnName === 'NAME') {
                    continue
                }
                fields.push(defineInfo.showFields[i])
            }
            for (let row in fields) {
                let childs = this.extendFields[Math.floor(row / 2)]
                if (!childs) {
                    childs = []
                    this.extendFields.push(childs)
                }
                if (fields[row] && fields[row].columnType === 'INTEGER') {
                    if (fields[row].mappingType === 0) {
                        fields[row].columnType = 'BOOLEAN'
                    }
                    if (defineInfo.extendFields) {
                        let extendField = defineInfo.extendFields.find(item => item.name === fields[row].columnName)
                        if (extendField && extendField.type === '8') {
                            fields[row].columnType = 'BOOLEAN'
                        }
                    }
                }
                childs.push(fields[row])
            }
        },
        validate (val) {
            return val
        },
        loadingState () {
            setTimeout(() => {
                this.loading = false
                this.$nextTick(() => {
                    this.loading = true
                })
            }, 1000)
        },
        ok (formItem) {
            this.formItem.olddetails = this.collAccountData
            this.formItem.details = this.$refs.collaccount.getData()
            this.addBasedata(formItem)
        },
        addBasedata (formItem) {
            this.$refs[formItem].validate(async (valid) => {
                if (!valid) {
                    this.loadingState()
                } else {
                    try {
                        const {data: {code, msg}} = await this.$http.post(basedataApi.custsupplier + '/' + this.status, this.formItem)
                        if (code === 0) {
                            if (this.status === 'update') {
                                this.$Message.success('修改客商成功')
                            }
                            if (this.status === 'add') {
                                this.$Message.success('新建客商成功')
                            }
                            this.loading = false
                            this.$emit('closeAddCustSupplier')

                            this.$emit('refreshCustSuppList')
                        } else {
                            if (this.status === 'update') {
                                this.$Message.error('修改【' + this.formItem.code + `】基础数据项失败:${msg}`)
                            }
                            if (this.status === 'add') {
                                this.$Message.error('新建【' + this.formItem.code + `】基础数据项失败:${msg}`)
                            }
                            this.loadingState()
                        }
                    } catch (e) {
                        if (this.status === 'update') {
                            this.$Message.error('修改【' + this.formItem.code + '】基础数据项失败:' + e)
                        }
                        if (this.status === 'add') {
                            this.$Message.error('新建【' + this.formItem.code + '】基础数据项失败:' + e)
                        }
                        this.loadingState()
                    }
                }
            })
        },
        async loadsubdata () {
            try {
                let formdata = {
                    sourcecode: this.formItem.code,
                    basedatatype: 3,
                    tableName: 'MD_COLLACCOUNT',
                    pagination: false,
                    publicflag: 1,
                    unitcode: this.formItem.unitcode,
                    stopflag: -1,
                    queryDataStructure: 'ALL'
                }
                let {data: {rs, rows}} = await this.$http.post(vaBaseDataApi.basedata + '/list', formdata)
                if (rs.code === 0) {
                    for (let rowitem of rows) {
                        this.collAccountData.push(rowitem)
                    }
                } else {
                    throw new Error(rs.msg)
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        cancel () {
            this.$emit('closeAddCustSupplier')
        },
        // 基础数据选择处理
        baseDataChange (key, val) {
            if (val) {
                this.formItem[key] = val.code
            } else {
                this.formItem[key] = ''
            }
        },
        // 枚举数据选择处理
        enumDataChange (key, val) {
            if (val) {
                this.formItem[key] = val.name
            } else {
                this.formItem[key] = ''
            }
        }
    }
}
</script>

<style scoped>
.ivu-form-item {
    margin-bottom: 15px;
    vertical-align: top;
}
.ivu-form-item-error-tip {
    line-height: 1;
    padding-top: 2px;
    left: 5px;
}
</style>
