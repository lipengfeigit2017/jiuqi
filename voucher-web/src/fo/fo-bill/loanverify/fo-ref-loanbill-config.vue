<template>
    <div>
        <div style="padding-top:10px; padding-left:12px">
            借款冲销维度
        </div>
        <div style="padding-top:10px; padding-left:12px">
            <CheckboxGroup v-model="loandimension">
                <Checkbox label="UNITCODE" disabled><span>组织机构</span></Checkbox>
                <Checkbox label="STAFFCODE"><span>报销人</span></Checkbox>
                <Checkbox label="DEPTCODE"><span>部门</span></Checkbox>
                <Checkbox label="PROJECTCODE"><span>项目</span></Checkbox>
                <Checkbox label="SBUCODE"><span>责任中心</span></Checkbox>
            </CheckboxGroup>
        </div>
        <div style="padding-top:10px; padding-left:12px">
            借款冲销条件
        </div>
        <div style="padding-top:10px; padding-left:12px">
            <CheckboxGroup v-model="loancondition" @on-change="loanConditionChange">
                <Checkbox label="WORKFLOWFINISHFLAG"><span>工作流审批通过</span></Checkbox>
                <Checkbox label="SSCFINISHFLAG"><span>共享审批通过</span></Checkbox>
                <Checkbox label="PAYFINISHFLAG"><span>支付成功</span></Checkbox>
                <Checkbox label="VOUCHERFLAG"><span>生成凭证成功</span></Checkbox>
            </CheckboxGroup>
        </div>
        <div style="padding-top:10px; padding-left:12px">
            <Row>
                <i-col span="1">
                    <div style="padding-top:15px;">
                        <label>单据定义：</label>
                    </div>
                </i-col>
                <i-col span="7">
                    <i-input v-model="selectDefineData" style="padding-top:10px;" readonly icon="custom iconfont icon_danchugengduo" @on-click="showMetaModal()">
                    </i-input>
                </i-col>
            </Row>
        </div>
        <div style="padding-top:10px; padding-left:12px">
            查询列
            <Button style="float:right;margin-bottom: 10px;margin-right: 12px;" class="ivu-btn-ghost" @click="selectField">选择字段</Button>
        </div>
        <div style="padding-top:10px; padding-left:12px; padding-right:12px">
            <elx-editable ref="qureytabledata" :data.sync="queryFields" border row-key="columnName">
                <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
                <elx-editable-column label="排序" width="60" align="center">
                    <svg class="icon va-icon-md-move" aria-hidden="true" style="width:16px; height:16px; vertical-align:middle;">
                        <use xlink:href="#icon_paixu"/>
                    </svg>
                </elx-editable-column>
                <elx-editable-column prop="tablename" label="表名"></elx-editable-column>
                <elx-editable-column prop="fieldname" label="字段"></elx-editable-column>
                <elx-editable-column prop="columnTitle" label="显示名称" :edit-render="{name: 'ElInput'}"></elx-editable-column>
                <elx-editable-column prop="width" label="宽度" :edit-render="{name: 'ElInput'}"></elx-editable-column>
                <elx-editable-column label="操作" width="50" align="center">
                    <template v-slot="scope">
                        <div style="white-space: nowrap; margin:auto -8px;">
                            <va-toolbar-item class="va-toolbar va-table-button" title="删除" @click="deleteRow(scope.$index)"
                                :disabled="scope.row.columnName==='unverifymoney'?true:false">
                            </va-toolbar-item>
                        </div>
                    </template>
                </elx-editable-column>
            </elx-editable>
        </div>
        <Modal v-model="showFieldSelect" :mask-closable="false" title="选择字段"
            @on-ok="selectFieldConfrim"
            @on-cancel="cancelSelectFieldConfrim"
            @on-change="val=>change(val)">
            <FoRefLoanBillSelectField ref="selectField"
                :treeData="fields"
                :selectNodes="queryFields"
                :showFieldSelect="showFieldSelect">
            </FoRefLoanBillSelectField>
        </Modal>
        <Modal title="单据定义" v-model="metaModal" :mask-closable="false" @on-ok="handleMetaConfirm" :loading="metaModalLoading">
            <VaBillRefMetaTree :metaModal="metaModal" :selectItems="billTypes" ref="metaTree"></VaBillRefMetaTree>
        </Modal>
    </div>
</template>

<script>
import $ from 'jquery'
import FoRefLoanBillSelectField from './fo-ref-loanbill-selectfield'
import Sortable from 'sortablejs'
import VaBillRefMetaTree from './fo-ref-loanbill-meta-tree'
export default {
    name: 'FoRefLoanBillConfig',
    components: {
        FoRefLoanBillSelectField,
        VaBillRefMetaTree
    },
    configType: 'fo-ref-loanbill',
    props: {
        title: String,
        state: Number,
        model: Object,
        selectiteimids: String,
        confirm: Boolean,
        // 初始配置信息参数
        config: String,
        reset: Boolean
    },
    data () {
        return {
            // 单据定义列表
            billDefines: [],
            // 按钮参数
            param: {},
            // 待选字段
            fields: [],
            // 系统字段
            sysField: ['ID', 'VER', 'ORDINAL'],
            // 默认字段
            defaultField: ['BILLCODE', 'BILLDATE', 'DEPTCODE', 'STAFFCODE', 'PROJECTCODE', 'LOANTYPECODE'],
            // 显示字段选择界面
            showFieldSelect: false,
            // 查询字段
            queryFields: [],
            // 单据定义列表
            billTypes: [],
            selectDefineData: '',
            // 冲借款维度
            loandimension: ['UNITCODE'],
            // 冲借款条件
            loancondition: [],
            opttime: 0,
            // 是否显示单据定义下拉面板
            isShowPanel: false,
            metaModal: false,
            metaModalLoading: true,
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    watch: {
        confirm (val) {
            this.saveActionParams()
        },
        reset (val) {
            this.loadConfigParam()
        }
    },
    computed: {
        panelStyle () {
            return {
                'jq-select-panel': true,
                'jq-select-panel-overflow': this.isShowPanel
            }
        }
    },
    mounted () {
        this.rowDrop()
    },
    methods: {
        // 单据定义弹出模态窗口
        showMetaModal () {
            this.metaModal = true
        },
        // 单据定义选择
        async handleMetaConfirm () {
            this.billTypes = []
            const defines = this.$refs.metaTree.getData()
            let str = ''
            for (let i in defines) {
                if (defines[i].uniqueCode) {
                    this.billTypes.push(defines[i].uniqueCode)
                    str += defines[i].title + '(' + defines[i].name + '),'
                }
            }
            this.metaModal = false
            this.selectDefineData = str.substring(0, str.length - 1)
        },
        // 行拖拽监听
        rowDrop () {
            this.$nextTick(() => {
                Sortable.create(this.$el.querySelector('.el-table__body-wrapper tbody'), {
                    handle: '.va-icon-md-move',
                    onEnd: ({ newIndex, oldIndex }) => {
                        let currRow = this.queryFields.splice(oldIndex, 1)[0]
                        this.queryFields.splice(newIndex, 0, currRow)
                    }
                })
            })
        },
        // 初始化界面
        initPage () {
            // 加载单据定义
            this.loadBillDefines()
            // 加载待选字段
            this.loadAllFields()
        },
        // 加载配置信息
        loadConfigParam () {
            if (!this.config || this.config === '') {
                return
            }
            let props = JSON.parse(this.config)
            if (props) {
                if (props.billTypes) {
                    this.billTypes = props.billTypes
                }
                if (props.loandimension) {
                    this.loandimension = props.loandimension
                }
                if (props.loancondition) {
                    this.loancondition = props.loancondition
                }
                if (props.queryFields) {
                    this.queryFields = props.queryFields
                }
                if (props.selectDefineData) {
                    this.selectDefineData = props.selectDefineData
                }
            }
        },
        // 加载单据定义
        async loadBillDefines () {
            try {
                const {data: {metaInfos}} = await this.$http.post('/api/vbserver/biz/meta/infos/get', {
                    module: 'CFAS',
                    metaType: 'bill',
                    pagination: false,
                    operateType: 'EXECUTE'
                })
                if (metaInfos && metaInfos.length > 0) {
                    for (let i in metaInfos) {
                        if (metaInfos[i].modelName === 'CFAS_B_FOBORROWINGBILL') {
                            this.billDefines.push(metaInfos[i])
                        }
                    }
                }
                // 加载配置信息
                this.loadConfigParam()
            } catch (e) {
                throw new Error(e)
            }
        },
        // 加载默认查询字段
        loadQueryFields () {
            if (this.fields && this.fields[0] && this.fields[0].columns) {
                const columns = this.fields[0].columns
                for (let i in columns) {
                    let index = this.queryFields.findIndex(item => item.columnName === columns[i].columnName)
                    if (index !== -1) {
                        continue
                    }
                    index = this.defaultField.findIndex(item => item === columns[i].columnName)
                    if (index !== -1) {
                        columns[i].tablename = '主表[FO_APPLOANBILL]'
                        columns[i].fieldname = columns[i].columnTitle + '[' + columns[i].columnName + ']'
                        if (columns[i].columnName === 'BILLCODE') {
                            columns[i].width = 200
                        } else {
                            columns[i].width = 150
                        }
                        this.queryFields.push(columns[i])
                    }
                }
            }
            let index = this.queryFields.findIndex(item => item.columnName === 'unverifymoney')
            if (index === -1) {
                this.queryFields.push({columnName: 'unverifymoney', columnTitle: '未核销金额', width: 150})
            }
        },
        // 加载待选字段
        async loadAllFields () {
            const {data} = await this.$http.post('/api/vmclient/dataModel/define/format', {name: 'FO_APPLOANBILL'})
            if (data.columns && data.columns.length > 0) {
                const newColumns = []
                const columns = data.columns
                for (let i in columns) {
                    // 过滤系统字段
                    let index = this.sysField.findIndex(item => item === columns[i].columnName)
                    if (index !== -1) {
                        continue
                    }
                    columns[i].tablename = '主表[FO_APPLOANBILL]'
                    columns[i].fieldname = columns[i].columnTitle + '[' + columns[i].columnName + ']'
                    newColumns.push(columns[i])
                }
                data.columns = newColumns
                this.fields.push(data)
                if (!this.queryFields || this.queryFields.length <= 0) {
                    // 加载默认查询字段
                    this.loadQueryFields()
                }
            }
        },
        // 显示字段选择界面
        async selectField () {
            this.showFieldSelect = true
        },
        // 字段选择确认
        selectFieldConfrim () {
            const tempSelectField = []
            const selectnodes = this.$refs.selectField.getData()
            for (let i in this.queryFields) {
                const field = selectnodes.find(item => item.columnName === this.queryFields[i].columnName)
                if (field || this.queryFields[i].columnName === 'unverifymoney') {
                    tempSelectField.push(this.queryFields[i])
                }
            }
            for (let i in selectnodes) {
                const field = this.queryFields.find(item => item.columnName === selectnodes[i].columnName)
                if (!field) {
                    if (selectnodes[i].columnType === 'INTEGER') {
                        selectnodes[i].width = 100
                    } else {
                        selectnodes[i].width = 150
                    }
                    tempSelectField.push(selectnodes[i])
                }
            }
            this.queryFields = tempSelectField
        },
        cancelSelectFieldConfrim () {
            this.showFieldSelect = false
        },
        // 保存按钮参数
        saveActionParams () {
            const param = {
                billTypes: this.billTypes,
                queryFields: this.queryFields,
                loandimension: this.loandimension,
                loancondition: this.loancondition,
                selectDefineData: this.selectDefineData
            }
            // 校验配置参数
            let flag = this.checkParams(param)
            if (flag) {
                let params = JSON.stringify(param)
                this.$emit('on-action-changed', params)
                this.$emit('on-success', true)
            } else {
                this.$emit('on-success', false)
            }
        },
        // 校验配置参数
        checkParams (param) {
            let queryFields = param.queryFields
            let contentMsg = ''
            let count = 0
            for (let i in queryFields) {
                count += 1
                let columnTitle = queryFields[i].columnTitle
                if (!columnTitle || columnTitle === '') {
                    if (contentMsg === '') {
                        contentMsg = '查询列第' + count + '行显示名称不能为空'
                    } else {
                        contentMsg = contentMsg + '</br>' + '查询列第' + count + '行显示名称不能为空'
                    }
                }
            }
            if (contentMsg !== '') {
                this.$Modal.error({title: '提示信息', content: contentMsg})
                return false
            }
            // let loandimension = param.loandimension
            // if (!loandimension || loandimension.length <= 0) {
            //     this.$Modal.error({title: '提示信息', content: '核销维度不允许为空'})
            //     return false
            // }
            return true
        },
        // 显示数据定义下拉面板
        showPanel () {
            this.isShowPanel = true
            this.opttime = new Date().getTime()
            this.$nextTick(() => {
                let inputWidth = $('#input_' + this.opttime).css('width').replace('px', '')
                let panelWidth = parseInt(inputWidth)

                if (panelWidth < 300) {
                    panelWidth = 300
                }

                $('#droppanel_' + this.opttime).css('min-width', '300px')
                $('#droppanel_' + this.opttime).parent().css('width', panelWidth + 'px')
            })
        },
        // 下拉面板关闭
        handleHidePanel () {
            this.isShowPanel = false
        },
        // 数据定义文本变化
        defineTxtChange () {
            this.isShowPanel = true
            this.opttime = new Date().getTime()
            this.$nextTick(() => {
                let inputWidth = $('#input_' + this.opttime).css('width').replace('px', '')
                let panelWidth = parseInt(inputWidth)

                if (panelWidth < 300) {
                    panelWidth = 300
                }

                $('#droppanel_' + this.opttime).css('min-width', '300px')
                $('#droppanel_' + this.opttime).parent().css('width', panelWidth + 'px')
            })
        },
        // 选择数据定义
        datadefinechange (definename) {
            this.isShowPanel = false
        },
        renderContent (h, { node, data, store }) {
            return <span>{node.data.name + ' ' + node.data.title}</span>
        },
        // 冲销条件变化
        loanConditionChange (conditions) {
            if (conditions && conditions.length > 1) {
                let index = this.loancondition.findIndex(item => item === conditions[0])
                if (index >= 0) {
                    this.loancondition.splice(index, 1)
                }
            }
        },
        // 删除显示列
        deleteRow (index) {
            this.$Modal.confirm({
                title: '提示信息',
                content: '<p>确定要删除当前字段吗？</p>',
                onOk: () => {
                    this.queryFields.splice(index, 1)
                }
            })
        }
    },
    created () {
        this.initPage()
    }
}
</script>

<style lang="less" scoped>
</style>
