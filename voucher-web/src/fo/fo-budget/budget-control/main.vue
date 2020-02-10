<template>
    <div class="cfas-budget-content">
        <va-toolbar>
            <va-toolbar-item title="新建" @click="insertEvent"></va-toolbar-item>
            <va-toolbar-item title="删除" @click="deleteSelectedEvent"></va-toolbar-item>
            <va-toolbar-item title="重算全部执行数" @click="budgetRedoneEvent"></va-toolbar-item>
        </va-toolbar>

        <Split v-model="split1" id="bud-split">
            <div slot="left" class="demo-split-pane">
                <p style="width: 100px;">预算类型：</p>
                <el-tree class="filter-tree" :data="treeData"
                node-key="value" :highlight-current="false"
                :expand-on-click-node="false"
                :props="defaultProps" @node-click="selectNode" ref="groupTree"></el-tree>
            </div>
            <div slot="right" class="demo-split-pane">
                <div v-loading="loading" >
                    <elx-editable ref="elxEditable"
                    :height="tbHeight"
                    size="mini"
                    class="manual-table4"
                    border
                    showIcon="false"
                    row-key="id"
                    :data.sync="list"
                    :row-class-name="tableRowClassName"
                    :edit-config="{trigger: 'manual', showIcon: false, mode: 'row', autoClearActive: false, render: 'scroll'}"
                    style="width: 100%">
                        <elx-editable-column type="selection" align="center" width="50"></elx-editable-column>
                        <elx-editable-column prop="billmodelcode" show-overflow-tooltip width="300" label="*单据模型" :edit-render="{}">
                            <template v-slot:edit="scope">
                                <tree-selector
                                    v-model="scope.row.billmodelcode"
                                    valueKey="uniqueCode"
                                    titleKey="text"
                                    treeLabelKey="text"
                                    :checkOk="checkOk"
                                    :dataTree="billDefineTree"
                                    :readonlyFlag="getRowEditable(scope.row)"
                                    treeIdKey="uniqueCode">
                                </tree-selector>
                            </template>
                            <template v-slot="scope">
                                <label>{{getTitleByUniqueCode(scope.row.billmodelcode)}} </label>
                                <!-- <label :value="getTitleByUniqueCode(scope.row.billmodelcode)" readonly/> -->
                            </template>
                        </elx-editable-column>
                        <elx-editable-column prop="budcontypecode" label="*控制方式" show-overflow-tooltip width="150" :edit-render="{name: 'ElSelect', options: constParam.budContypeList}"></elx-editable-column>
                        <elx-editable-column prop="budcycle" label="*控制周期" width="100" :edit-render="{name: 'ElSelect', options: constParam.budCycleList, optionProps: {value: 'value', label: 'label'}}"></elx-editable-column>
                        <elx-editable-column prop="memo" label="备注" show-overflow-tooltip :edit-render="{name: 'ElInput', max: 1000}"></elx-editable-column>
                        <elx-editable-column fixed="right" label="操作" width="120">
                            <template v-slot="scope">
                                <div style="white-space: nowrap; margin:auto -8px;">
                                    <div v-if="$refs.elxEditable.hasActiveRow(scope.row)">
                                        <va-toolbar-item class="va-toolbar" title="保存" @click="saveRowEvent(scope.row)"></va-toolbar-item>
                                        <va-toolbar-item class="va-toolbar" title="取消" @click="cancelRowEvent(scope.row)"></va-toolbar-item>
                                    </div>
                                    <div v-else>
                                        <va-toolbar-item class="va-toolbar" title="编辑" @click="openActiveRowEvent(scope.row, scope.$index)"></va-toolbar-item>
                                        <va-toolbar-item class="va-toolbar va-table-button" title="删除" @click="removeEvent(scope.row)"></va-toolbar-item>
                                    </div>
                                </div>
                            </template>
                        </elx-editable-column>
                    </elx-editable>
                </div>
            </div>
        </Split>

   <budgetRedone v-if="showBudgetRedone" :title="currentNode.label" :budtype='currentNode.value'  @closeBudgetRedone="closeBudgetRedoneEvent"></budgetRedone>

    </div>
</template>

<script>
import XEUtils from 'xe-utils'
import TreeSelector from './tree-selector'
import {
    treeData,
    budContypeList,
    budCycleList,
    billModalBlackSet
} from './const'
import { cfasBudconApi } from '../../../api/va'
import {createMetaTree, metaType} from './bill-tree.js'

import budgetRedone from '../../fo-budget/budget-redone'

export default {
    name: 'BudgetControl',
    components: {
        TreeSelector,
        budgetRedone
    },
    watch: {

    },
    data () {
        return {
            split1: 0.20,
            loading: false,
            dataType: 2,
            tbHeight: 300,
            list: [],
            backList: [], // 备份列表
            billDefineList: [], // 单据模型定义列表
            billDefineTree: [], // 单据模型定义树
            queryDTO: {
                pagination: false,
                budtype: null
            },
            constParam: {
                treeData: treeData,
                budContypeList: budContypeList,
                budCycleList: budCycleList
            },

            budconRules: {
                // billmodelcode: [{required: true, message: '请选择单据模型.', trigger: 'change'}],
                budcontypecode: [{required: true, message: '请选择控制方式.', trigger: 'change'}],
                budcycle: [{required: true, message: '请选择控制周期.', trigger: 'chenge'}]
            },
            treeData: treeData,
            currentNode: null,
            currentRow: null,
            defaultProps: {
                children: 'child',
                label: 'label'
            },

            // 重算参数
            showBudgetRedone: false
        }
    },
    created () {
        // this.findList()
    },
    mounted () {
        this.findBillDefineList()
        this.$refs.groupTree.setCurrentKey(this.treeData[0].value)
        this.selectNode(this.treeData[0])

        this.winResize()

        let _this = this
        window.addEventListener('resize', function () {
            _this.winResize()
        })
    },
    methods: {
        tableRowClassName ({row, rowIndex}) {
            if (this.$refs.elxEditable.hasActiveRow(row)) {
                return 'box3'
            }
        },
        getTitleByUniqueCode (uniqueCode) {
            if (uniqueCode) {
                let temp = this.billDefineList.find(item => item.uniqueCode === uniqueCode)
                if (temp) {
                    return temp.title
                }
            } else {
                return ''
            }
        },
        dataSelectedEvent (node, row) {
            row.billmodelcode = node.billmodelcode
        },
        getEidtFlag (row) {
            if (this.$refs.elxEditable.hasActiveRow(row)) {
                return false
            } else {
                return true
            }
        },
        getRowEditable (row) {
            if (row.id) {
                return true
            } else {
                return false
            }
        },
        findList () {
            this.loading = true
            this.$http.post(cfasBudconApi.list, this.queryDTO).then(response => {
                let {rows} = response.data
                if (!rows) {
                    rows = []
                }
                this.list = rows
                this.backList = rows
                this.loading = false
            }).catch(e => {
                this.loading = false
            })
        },
        findBillDefineList () {
            this.$http.post(cfasBudconApi.listBillDefine, this.queryDTO).then(response => {
                let {rows} = response.data
                rows = rows.filter(node => { return !billModalBlackSet.has(node.modelName) }) // 过滤属于指定模型的单据
                this.billDefineList = this.handleText(rows)
                this.billDefineTree = createMetaTree(rows)
            }).catch(e => {
                throw new Error(e)
            })
        },
        handleText (list) {
            if (!list || list.length === 0) {
                return
            }
            for (let item of list) {
                if (item.type === metaType.metaData) {
                    item.title = item.title + '(' + item.uniqueCode + ')'
                }
            }
            return list
        },
        formatterFlag (row, column, cellValue, index) {
            return cellValue ? '是' : '否'
        },
        formatterDate (row, column, cellValue, index) {
            return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
        },
        insertEvent () {
            if (!this.currentNode) {
                this.$Message.warning('请选择【预算类型】')
                return
            }
            let activeInfo = this.$refs.elxEditable.getActiveRow()
            let {
                insertRecords
            } = this.$refs.elxEditable.getAllRecords()
            if (!activeInfo && !insertRecords.length) {
                this.$refs.elxEditable.insert({
                }).then(({
                    row
                }) => {
                    this.$refs.elxEditable.setActiveRow(row)
                })
            } else {
                if (activeInfo) {
                    this.checkOutSave(activeInfo.row)
                } else if (insertRecords) {
                    this.checkOutSave(insertRecords[0])
                }
            }
        },
        // 点击表格外面处理
        checkOutSave (row) {
            if (!row.id) {
                this.$Modal.confirm({
                    title: '提示信息',
                    content: '检测到未保存的内容，是否保存当前编辑数据?',
                    onOk: async () => {
                        this.$refs.elxEditable.clearActive()
                        this.saveRowEvent(row)
                    },
                    onCancel: async () => {
                        this.$refs.elxEditable.remove(row)
                    }
                })
            } else if (this.$refs.elxEditable.hasRowChange(row)) {
                this.$Modal.confirm({
                    title: '提示信息',
                    content: '检测到未保存的内容，是否保存当前编辑数据?',
                    onOk: async () => {
                        this.$refs.elxEditable.clearActive()
                        this.saveRowEvent(row)
                    },
                    onCancel: async () => {
                        this.$refs.elxEditable.revert(row)
                        this.$refs.elxEditable.clearActive()
                    }
                })
            }
        },
        // 编辑处理
        openActiveRowEvent (row, index) {
            // $(".demo-split-pane").addClass("box3")
            this.$nextTick(() => {
                let activeInfo = this.$refs.elxEditable.getActiveRow()
                if (activeInfo && activeInfo.isUpdate) {
                    this.$Modal.confirm({
                        title: '提示信息',
                        content: '检测到未保存的内容，是否保存当前编辑数据?',
                        onOk: async () => {
                            this.$refs.elxEditable.setActiveRow(row)
                            await this.saveRowEvent(activeInfo.row)
                        },
                        onCancel: async () => {
                            this.$refs.elxEditable.revert(activeInfo.row)
                            this.$refs.elxEditable.setActiveRow(row)
                        }
                    })
                } else {
                    this.$refs.elxEditable.setActiveRow(row)
                }
            })
        },
        // 取消处理
        cancelRowEvent (row) {
            if (!row.id) {
                this.$Modal.confirm({
                    title: '提示信息',
                    content: '该数据未保存，是否移除?',
                    onOk: async () => {
                        this.$refs.elxEditable.remove(row)
                    }
                })
            } else if (this.$refs.elxEditable.hasRowChange(row)) {
                this.$Modal.confirm({
                    title: '提示信息',
                    content: '检测到未保存的内容，是否取消修改?',
                    onOk: async () => {
                        this.$refs.elxEditable.clearActive()
                        this.$refs.elxEditable.revert(row)
                    },
                    onCancel: async () => {
                        this.$refs.elxEditable.setActiveRow(row)
                    }
                })
            } else {
                this.$refs.elxEditable.clearActive()
            }
        },
        async removeEvent (row) {
            let rows = []
            rows.push(row)
            if (!await this.beforeDelete(rows)) {
                return
            }
            if (row.id) {
                this.$Modal.confirm({
                    title: '提示信息',
                    content: '确定要删除该数据吗?',
                    onOk: async () => {
                        this.loading = true
                        this.$http.post(cfasBudconApi.delete, rows).then(({
                            data: {code, msg, successCount, failCount}
                        }) => {
                            if (code === 0) {
                                this.$Message.success('删除成功')
                            } else {
                                this.$Message.erroe(msg)
                            }
                            this.findList()
                        }).catch(e => {
                            this.loading = false
                        })
                    }
                })
            } else {
                this.$refs.elxEditable.remove(row)
            }
        },
        async beforeDelete (removeRecords) {
            try {
                const {data: {code}} = await this.$http.post(cfasBudconApi.existExenum, removeRecords)
                if (code === 0) {
                    return true
                } else {
                    this.$Message.warning('当前控制策略存在关联的执行数，不允许删除')
                    return false
                }
            } catch (error) {
                throw new Error(error)
            }
        },
        async deleteSelectedEvent () {
            let removeRecords = this.$refs.elxEditable.getSelecteds()
            if (removeRecords.length) {
                if (await this.beforeDelete(removeRecords)) {
                    this.$Modal.confirm({
                        title: '提示信息',
                        content: '确定删除所选数据?',
                        onOk: async () => {
                            this.loading = true
                            this.$http.post(cfasBudconApi.delete, removeRecords).then(({
                                data: {code, msg, successCount, failCount}
                            }) => {
                                if (code === 0) {
                                    this.$Message.success('删除成功: 成功数量：' + successCount + '; 失败数量： ' + failCount)
                                } else {
                                    this.$Message.erroe(msg)
                                }
                                this.findList()
                            }).catch(e => {
                                this.loading = false
                            })
                        }
                    })
                }
            } else {
                this.$Message.warning('请选择至少一条数据')
            }
        },

        async checkCanSave (row) {
            let flag = true
            if (!row.billmodelcode) {
                flag = false
                this.$Message.warning('请选择【单据模型】')
            } else if (!row.budcontypecode) {
                flag = false
                this.$Message.warning('请选择【控制方式】')
            } else if (!row.budcycle) {
                flag = false
                this.$Message.warning('请选择【控制周期】')
            }
            return flag
        },
        async saveRowEvent (row) {
            if (!row.budtype) {
                row.budtype = this.currentNode.value
            }
            if (!this.$refs.elxEditable.hasRowChange(row)) {
                this.$refs.elxEditable.clearActive()
                return
            }
            if (await this.checkCanSave(row)) {
                let url = cfasBudconApi.add
                if (row.id) {
                    url = cfasBudconApi.update
                }
                this.loading = true
                this.$http.post(url, row).then(({
                    data: {code, msg}
                }) => {
                    if (code === 0) {
                        this.$refs.elxEditable.clearActive()
                        this.findList()
                        this.$Message.success('保存成功')
                    } else {
                        this.$Message.error(msg)
                        this.loading = false
                    }
                })
            }
        },
        selectNode (node) {
            this.currentNode = node
            this.queryDTO.budtype = node.value
            if (node) {
                this.findList()
            }
        },
        exportCsvEvent () {
            this.$refs.elxEditable.exportCsv()
        },
        checkOk (currentNode) {
            if (currentNode && currentNode.type === metaType.metaData) {
                return true
            } else {
                return false
            }
        },
        winResize () {
            this.$nextTick(() => {
                let winHeight = document.documentElement.clientHeight
                this.tbHeight = Number(winHeight) - 118
            })
        },

        // 重算按钮
        budgetRedoneEvent () {
            if (!this.currentNode) {
                this.$Message.warning('请选择【预算类型】')
            } else {
                this.showBudgetRedone = true
            }
        },
        // 关闭重算页面
        closeBudgetRedoneEvent () {
            this.showBudgetRedone = false
        }

    }
}
</script>

<style scoped>
    .cfas-budget-content{
        height: 100%;
        margin: 0px;
        overflow-y: hidden;
    }
    #bud-split {
        height: 100%;
        overflow: hidden;
    }
    .left-pane>.demo-split-pane {
        padding: 10px;
    }
    .right-pane>.demo-split-pane {
        padding: 0px 0px 0px 5px;
    }
    .filter-tree {
        margin-top: 5px;
        overflow: auto;
    }
</style>

<style lang="less">
    .ivu-icon{
        font-size: inherit;
    }

    .el-table th {
        background-color: #F8F8F8;
        color: #222;
        height: 38px !important;
    }

    .el-table td {
        padding: 0;
        color: #555;
        height: 36px !important;
    }

    .el-table .cell {
        padding-left: 10px;
        padding-right: 10px;
    }

    .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
        .el-table__body tr.current-row>td,.el-table__body tr.hover-row.current-row>td,
        .el-table__body tr.hover-row.el-table__row--striped.current-row>td,
        .el-table__body tr.hover-row.el-table__row--striped>td,
        .el-table__body tr.hover-row>td {
        background-color: #EAFBFC;
    }
</style>
