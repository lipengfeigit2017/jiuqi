<template>

<div>
        <div style='padding-top: 10px;padding-left: 16px;padding-right: 16px;'>
            系统固化引用条件：相同组织机构、相同客商和工作流审批通过的数据
        <!-- <Button style='float: right' type="primary" @click="check">校验配置信息</Button> -->
        </div>

<div>
        <div style="padding:10px 16px">
            <div style="float:left;margin-bottom: 10px;">
                引用条件
            </div>
        </div>

        <div class="apar-bill-edittable">
            <elx-editable ref="reftabledata" :data.sync="tableRefData" :edit-config="tableConfig" border row-key="columnName">
                <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>

                <elx-editable-column label="源字段"  :edit-render="{}" prop="srcfield">

                        <template v-slot:edit="scope">
                            <AparBillRefSingleSelectField :value="scope.row" :tableNames="srcTableNames" @on-change="val=>changeSrcfield(val,scope.row)"></AparBillRefSingleSelectField>
                        </template>
                        <template v-slot="scope">
                            <!-- <div>{{ getSelectSrcfieldShowtitle(scope.row, scope.row.srcfieldshowtitle) }}</div> -->
                            {{scope.row.srcfieldshowtitle ? scope.row.srcfieldshowtitle : ''}}
                        </template>

                </elx-editable-column>
                <elx-editable-column prop="connector" label="连接符" :edit-render="{name: 'default'}">
                    <template v-slot:edit="scope">
                        <el-select v-if="checkMappingType(scope, 1)" v-model="scope.row.connector" size="mini" clearable>
                            <el-option v-for="item in connectorTypeListOfString" :key="item.value" :value="item.value" :label="item.showtitle"></el-option>
                        </el-select>
                        <el-select v-else-if="checkMappingType(scope, 2)" v-model="scope.row.connector" size="mini" clearable>
                            <el-option v-for="item in connectorTypeListOfString" :key="item.value" :value="item.value" :label="item.showtitle"></el-option>
                        </el-select>
                        <el-select v-else-if="checkColumnType(scope, 'NUMERIC')" v-model="scope.row.connector" size="mini" clearable>
                            <el-option v-for="item in connectorTypeListOfNumber" :key="item.value" :value="item.value" :label="item.showtitle"></el-option>
                        </el-select>
                        <el-select v-else-if="checkColumnType(scope, 'INTEGER')" v-model="scope.row.connector" size="mini" clearable>
                            <el-option v-for="item in connectorTypeListOfNumber" :key="item.value" :value="item.value" :label="item.showtitle"></el-option>
                        </el-select>
                        <el-select v-else-if="checkColumnType(scope, 'NVARCHAR')" v-model="scope.row.connector" size="mini" clearable>
                            <el-option v-for="item in connectorTypeListOfString" :key="item.value" :value="item.value" :label="item.showtitle"></el-option>
                        </el-select>
                        <el-select v-else v-model="scope.row.connector" size="mini" clearable>
                            <el-option v-for="item in connectorTypeList" :key="item.value" :value="item.value" :label="item.showtitle"></el-option>
                        </el-select>
                    </template>
                    <template v-slot="scope">
                        <div>{{ getSelectConnectorLabel(scope.row.connector, 'value', 'showtitle', connectorTypeList) }}</div>
                    </template>

                </elx-editable-column>

                <elx-editable-column label="目标字段"  :edit-render="{}" prop="targetfield">

                        <template v-slot:edit="scope">
                            <AparBillRefSingleSelectField :value="scope.row" :tableNames="targetTableNames" @on-change="val=>changeTargetfield(val,scope.row)"></AparBillRefSingleSelectField>
                        </template>
                        <template v-slot="scope">
                            <!-- <div>{{ getSelectTargetfieldShowtitle(scope, scope.row.targetfieldshowtitle) }}</div> -->
                            {{scope.row.targetfieldshowtitle ? scope.row.targetfieldshowtitle : ''}}
                        </template>

                </elx-editable-column>

                <elx-editable-column prop="filter" label="过滤范围" :edit-render="{name: 'ElInput'}"></elx-editable-column>

                <elx-editable-column prop="display" label="显示"  width="65" :edit-render="{type: 'visible'}" align="center">
                    <template v-slot:edit="scope">
                        <el-switch active-color="#03A4AD" :disabled='scope.row.disabled' v-model="scope.row.display" size="mini"></el-switch>
                    </template>
                </elx-editable-column>
                <elx-editable-column label="操作" width="120" align="center">
                    <template v-slot="scope">
                        <div style="white-space: nowrap; margin:auto -8px;">
                        <va-toolbar-item class="va-toolbar va-table-button" title="删行" @click="deleteRefRow(scope.row,scope.$index,tableRefData)"></va-toolbar-item>
                        <va-toolbar-item class="va-toolbar" title="增行" @click="addRow(scope.row,scope.$index,tableRefData)"></va-toolbar-item>
                        </div>

                    </template>

                </elx-editable-column>
            </elx-editable>
        </div>
</div>
        <div style="padding:10px 16px">
            <div style="float:left;margin-bottom: 10px; margin-top: 5px;">
                查询列
            </div>
            <Button style="float:right;margin-bottom: 10px;" class="ivu-btn-ghost" @click="showselectField">选择字段</Button>
        </div>
        <div class="apar-bill-edittable">
            <elx-editable ref="qureytabledata" id="showField" :data.sync="tableQueryData" :edit-config="tableConfig" border
            row-key="columnName">
                <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
                <elx-editable-column label="排序" width="60" align="center">

                        <svg
                            class="icon va-icon-md-move"
                            aria-hidden="true"
                            style="width:16px; height:16px; vertical-align:middle;"
                            >
                            <use xlink:href="#icon_paixu" />
                        </svg>
                </elx-editable-column>
                <elx-editable-column prop="tablename" label="表名"></elx-editable-column>
                <elx-editable-column prop="fieldname" label="字段"></elx-editable-column>
                <elx-editable-column prop="columnTitle" label="显示名称" :edit-render="{name: 'ElInput'}"></elx-editable-column>
                <elx-editable-column prop="width" label="宽度" :edit-render="{name: 'ElInput'}"></elx-editable-column>
                <elx-editable-column label="操作" width="50" align="center">
                    <template v-slot="scope">
                        <div style="white-space: nowrap; margin:auto -8px;">
                        <va-toolbar-item class="va-toolbar va-table-button" title="删除" @click="deleteFieldRow(scope.row,scope.$index,tableQueryData)"
                        :disabled="scope.row.columnName==='unverifymoney'?true:false"></va-toolbar-item>
                        </div>
                    </template>

                </elx-editable-column>
            </elx-editable>
        </div>

        <Modal v-model="selectFieldModal" :mask-closable="false" :value="fieldvalue" title="选择字段" @on-ok="handleConfirm" :loading="selectFieldLoading" @on-change="val=>change(val)">
            <AparBillRefSelectMultiFieldModal :tableNames="tableNames" ref="selectField" :selectNodes="tableQueryData" :selectFieldModal="selectFieldModal"></AparBillRefSelectMultiFieldModal>
        </Modal>
</div>
</template>

<script>
import XEUtils from 'xe-utils'
import vaWeb from 'va-web'
import Sortable from 'sortablejs'
import AparBillRefSelectMultiFieldModal from './component/select-field-multi/apar-bill-ref-select-field-multi-modal'

import AparBillRefSingleSelectField from './component/select-field-single/apar-bill-ref-select-field'
export default {
    name: 'AparRefConfigModal',
    components: {
        AparBillRefSelectMultiFieldModal,
        AparBillRefSingleSelectField
    },
    configType: 'bill-ref-apar',
    props: {
        title: String,
        state: Number,
        model: Object,
        selectiteimids: String,
        confirm: Boolean,
        reset: Boolean,
        // 初始配置信息参数
        config: String

    },
    watch: {
        confirm (val) {
            this.actionparams()
        },
        reset (val) {
            this.resetConfig()
        }
    },
    computed: {

    },
    data () {
        return {
            title1: '引用按钮配置',
            tableNames: ['FO_APARBILL', 'FO_APARBILL_ITEM'],
            selectFieldModal: false,
            selectFieldLoading: true,
            fieldvalue: '我是value',
            modaltitle: '选择字段',
            selectfield: false,
            tableRefData: [
                {
                    srcfield: '',
                    connector: '',
                    targetfield: '',
                    filter: '',
                    display: false,
                    mappingType: 0
                }],
            tableQueryData: [
                {
                    columnName: 'BILLCODE',
                    columnTitle: '单据编号',
                    columnType: 'NVARCHAR',
                    fieldname: '单据编号[BILLCODE]',
                    tablename: '主表[FO_APARBILL]',
                    id: 'FO_APARBILLBILLCODE',
                    width: 200
                },
                {
                    columnName: 'APARTYPECODE',
                    columnTitle: '业务类型',
                    columnType: 'NVARCHAR',
                    fieldname: '业务类型[APARTYPECODE]',
                    mapping: 'MD_APARTYPE.CODE',
                    mappingType: 1,
                    tablename: '子表[FO_APARBILL_ITEM]',
                    id: 'FO_APARBILL_ITEMAPARTYPECODE',
                    width: 150

                }, {
                    columnName: 'CONTRACTCODE',
                    columnTitle: '合同编码',
                    columnType: 'NVARCHAR',
                    fieldname: '合同编码[CONTRACTCODE]',
                    mapping: 'MD_CONTRACT.CODE',
                    mappingType: 1,
                    tablename: '主表[FO_APARBILL]',
                    id: 'FO_APARBILLCONTRACTCODE',
                    width: 150
                }, {
                    columnName: 'CONTRACTNAME',
                    columnTitle: '合同名称',
                    columnType: 'NVARCHAR',
                    fieldname: '合同名称[CONTRACTNAME]',
                    mapping: 'MD_CONTRACT.CODE',
                    mappingType: 1,
                    tablename: '主表[FO_APARBILL]',
                    id: 'FO_APARBILLCONTRACTNAME',
                    width: 150
                }, {
                    columnName: 'BILLDATE',
                    columnTitle: '单据日期',
                    columnType: 'DATE',
                    fieldname: '单据日期[BILLDATE]',
                    tablename: '主表[FO_APARBILL]',
                    id: 'FO_APARBILLBILLDATE',
                    width: 150
                }, {
                    columnName: 'BILLMONEY',
                    columnTitle: '金额',
                    columnType: 'NUMERIC',
                    fieldname: '金额[BILLMONEY]',
                    tablename: '子表[FO_APARBILL_ITEM]',
                    id: 'FO_APARBILL_ITEMBILLMONEY',
                    width: 150
                }, {
                    'tablename': '',
                    'columnName': 'unverifymoney',
                    'columnTitle': '未核销金额',
                    width: 150
                }
            ],
            defaultCheckKeys: '[5]',
            tableQueryCols: [{
                title: '表名',
                prop: 'tableTitle'
            },
            {
                title: '字段标识',
                prop: 'columnName'
            },
            {
                title: '字段名称',
                prop: 'columnTitle'
            }
            ],

            srcTableNames: ['FO_APARBILL', 'FO_APARBILL_ITEM'],
            targetTableNames: ['FO_APARBILL'],
            connectorTypeList: [
                {
                    showtitle: '等于(=)',
                    value: '='
                },
                {
                    showtitle: '不等于(<>)',
                    value: '<>'
                },
                {
                    showtitle: '大于等于(>=)',
                    value: '>='
                },
                {
                    showtitle: '小于等于(<=)',
                    value: '<='
                },
                {
                    showtitle: '大于(>)',
                    value: '>'
                },
                {
                    showtitle: '小于(<)',
                    value: '<'
                },
                {
                    showtitle: '包含(in)',
                    value: 'in'
                },
                {
                    showtitle: '不包含(not in)',
                    value: 'not in'
                }, {
                    showtitle: '查询子项(start with)',
                    value: 'start with'
                },
                {
                    showtitle: '模糊匹配(like)',
                    value: 'like'
                }
            ],
            connectorTypeListOfString: [
                {
                    showtitle: '等于(=)',
                    value: '='
                },
                {
                    showtitle: '包含(in)',
                    value: 'in'
                },
                {
                    showtitle: '不包含(not in)',
                    value: 'not in'
                }, {
                    showtitle: '查询子项(start with)',
                    value: 'start with'
                },
                {
                    showtitle: '模糊匹配(like)',
                    value: 'like'
                }
            ],
            connectorTypeListOfNumber: [
                {
                    showtitle: '等于(=)',
                    value: '='
                },
                {
                    showtitle: '不等于(<>)',
                    value: '<>'
                },
                {
                    showtitle: '大于等于(>=)',
                    value: '>='
                },
                {
                    showtitle: '小于等于(<=)',
                    value: '<='
                },
                {
                    showtitle: '大于(>)',
                    value: '>'
                },
                {
                    showtitle: '小于(<)',
                    value: '<'
                }
            ],
            tableConfig: {
                showIcon: false,
                showStatus: false,
                clearActiveMethod: () => false
            },
            selectitem: []

        }
    },
    mounted () {
        this.rowDrop()
    },
    methods: {
        async initdata () {
            let props
            try {
                props = JSON.parse(this.config)
            } catch (e) {
                return
            }
            if (props.refcondition.length === 0) {
                let data = [
                    {
                        srcfield: '',
                        connector: '',
                        targetfield: '',
                        filter: '',
                        display: false,
                        mappingType: 0
                    }]
                this.tableRefData = data
            } else {
                this.tableRefData = props.refcondition
            }

            this.tableQueryData = props.querycolumn
        },
        dataFormat (num) {
            return vaWeb.displayFormat.toThousands(vaWeb.displayFormat.strToFloat(num + '', 1, 2))
        },
        formatNumber (val) {
            if (typeof val === 'number') {
                return XEUtils.commafy(val, {
                    fixed: 2
                })
            } else {
                return val
            }
        },
        rowDrop () {
            this.$nextTick(() => {
                Sortable.create(document.querySelector('#showField .el-table__body-wrapper tbody'), {
                    handle: '.va-icon-md-move',
                    onEnd: ({ newIndex, oldIndex }) => {
                        let currRow = this.tableQueryData.splice(oldIndex, 1)[0]
                        this.tableQueryData.splice(newIndex, 0, currRow)
                    }
                })
            })
        },
        handleClose () {
            this.selectItemidMap.clear()

            this.$emit('on-cancel')
        },
        showselectField () {
            this.selectFieldModal = true
        },
        change (val) {

        },
        handleConfirm () {
            const selectnodes = this.$refs.selectField.getData()
            if (!selectnodes) {
                this.selectFieldLoading = false
                this.$nextTick(() => {
                    this.selectFieldLoading = true
                })
                return
            }
            this.selectFieldModal = false

            this.initQueryTable(selectnodes)
        },
        initQueryTable (nodes) {
            // 处理删除的项
            let arraydata = []
            this.tableQueryData.forEach((item1, i) => {
                let exist = false
                if (item1.columnName === 'unverifymoney') {
                    exist = true
                }
                nodes.forEach((item0, i) => {
                    if (item1.columnName === item0.columnName && item1.tablename === item0.tablename) {
                        exist = true
                    }
                })
                if (exist) {
                    arraydata.push(item1)
                }
            })
            this.tableQueryData = arraydata

            // 处理新增的项
            let tempQueryData = this.tableQueryData
            nodes.forEach((item0, i) => {
                let exist = false
                tempQueryData.forEach((item1, i) => {
                    if (item1.columnName === item0.columnName && item1.tablename === item0.tablename) {
                        exist = true
                    }
                })
                if (!exist) {
                    this.tableQueryData.push(item0)
                }
            })

            // this.tableQueryData = this.tableQueryData.concat(nodes)
        },
        deleteRefRow (rows, index, tableRefData) {
            if (tableRefData.length === 1) {
                rows.srcfieldshowtitle = ''
                rows.connector = ''
                rows.targetfieldshowtitle = ''

                tableRefData[0].srcfield = ''
                tableRefData[0].connector = ''
                tableRefData[0].targetfield = ''
                tableRefData[0].filter = ''
                tableRefData[0].display = false
                tableRefData[0].disabled = false
                tableRefData[0].mappingType = 0
                tableRefData.splice(1, 1)
                return
            }
            tableRefData.splice(index, 1)
        },
        deleteFieldRow (rows, index, tableQueryData) {
            this.$Modal.confirm({
                title: '提示信息',
                content: '确定要删除当前字段吗？',
                onOk: () => {
                    tableQueryData.splice(index, 1)
                }
            })
        },

        addRow (rows, index, tableRefData) {
            const refdata = {
                srcfield: '',
                connector: '',
                targetfield: '',
                filter: '',
                display: false,
                mappingType: 0
            }
            tableRefData.push(refdata)
        },
        changeTargetfield (val, row) {
            if (val) {
                row.display = false
                row.filter = ''
                row.disabled = true
            }
        },
        checkColumnType (scope, type) {
            if (scope.row.columnType === type) {
                return true
            } else {
                return false
            }
        },
        checkMappingType (scope, mappingType) {
            if (scope.row.mappingType && scope.row.mappingType === mappingType) {
                return true
            }
            return false
        },
        changeSrcfield (val, row) {

        },
        // 表格相关事件
        getSelectConnectorLabel (value, valueProp, labelProp, list) {
            let item = XEUtils.find(list, item => item[valueProp] === value)
            return item ? item[labelProp] : null
        },
        actionparams () {
            // 校验
            if (this.check()) {
                const param = {
                    refcondition: this.tableRefData,
                    querycolumn: this.tableQueryData
                }

                let params = JSON.stringify(param)
                this.$emit('on-action-changed', params)
                this.$emit('on-success', true)

                // 如果引用条件为空，添加一行空行
                if (this.tableRefData.length === 0) {
                    let data = [{
                        srcfield: '',
                        connector: '',
                        targetfield: '',
                        filter: '',
                        display: false,
                        mappingType: 0
                    }]
                    this.tableRefData = data
                }
            } else {
                this.$emit('on-success', false)
            }
        },
        check () {
            // 删除空行
            let refdata = []
            this.tableRefData.forEach((item, i) => {
                if (item.display === false && item.connector === '' && item.targetfield === '' && item.filter === '' && item.srcfield === '') {
                } else {
                    refdata.push(item)
                }
            })

            this.tableRefData = refdata

            let contentMsg = ''
            this.tableRefData.forEach((item, i) => {
            // 每行源字段不能为空
                if (item.srcfield === '') {
                    if (contentMsg === '') {
                        let current = i + 1
                        contentMsg = '引用条件第' + current + '行源字段不能为空'
                    } else {
                        let current = i + 1
                        contentMsg = contentMsg + '</br>' + '引用条件第' + current + '行源字段不能为空'
                    }
                }
                // 显示列未勾选、过滤范围为空时 目标字段不能为空
                if (item.display === false && item.filter === '' && item.targetfield === '') {
                    if (contentMsg === '') {
                        let current = i + 1
                        contentMsg = '引用条件第' + current + '行目标字段不能为空'
                    } else {
                        let current = i + 1
                        contentMsg = contentMsg + '</br>' + '引用条件第' + current + '行目标字段不能为空'
                    }
                }
            })

            // 查询列配置已选字段字段名称不能有空值
            this.tableQueryData.forEach((item, i) => {
                if (item.columnTitle === '') {
                    if (contentMsg === '') {
                        let current = i + 1
                        contentMsg = '查询列第' + current + '行显示名称不能为空'
                    } else {
                        let current = i + 1
                        contentMsg = contentMsg + '</br>' + '查询列第' + current + '行显示名称不能为空'
                    }
                }
            })
            if (contentMsg !== '') {
                this.$Modal.error({
                    title: '提示信息',
                    content: contentMsg
                })
                return false
            } else {
                return true
            }
        },
        // 重置配置信息
        resetConfig () {
            this.initdata()
        }
    },
    created () {
        this.initdata()
    }
}
</script>

<style lang="less" scoped>

.apar-bill-edittable{
    margin: 16px
}

.ivu-input-wrapper {

    height: 400px;
}
</style>
