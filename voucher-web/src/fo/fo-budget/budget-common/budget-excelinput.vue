
<template>
  <div id="tableDiv" style="height: 100%;">
    <elx-editable
      v-if="editFlag === 'edit'"
      ref="elxEditable"
      class="excel-table5"
      border
      size="customSize"
      :data.sync="list"
      row-key="budsubjectcode"
      showIcon="false"
      @blur-active="treeSum"
      :custom-columns.sync="customColumns"
      :edit-config="{trigger: 'click', mode: 'cell', showStatus: false, showIcon: false, isDelKey: true,
        isTabKey: true, isArrowKey: true, isCheckedEdit: true,  checkedEditMethod: checkedEditMethod,
        keydownMethod: keydownMethod, props: {children: 'children'}}"
      :height="tbHeight"
      style="width:100%;"
      @cell-click="cellClick"
      >
      <elx-editable-column  prop="budsubjectcode" label="科目编码" style="font-weight: bold" header-align="left" align="left" min-width="150px" width="200px" fixed show-overflow-tooltip>
      </elx-editable-column>
      <elx-editable-column  prop="budsubjectname" label="科目名称" style="font-weight: bold" header-align="left" align="left" min-width="100px" width="200px" fixed show-overflow-tooltip>
      </elx-editable-column>
      <elx-editable-column  prop="beginmoney" label="期初预算金额" readonly header-align="right" align="right" min-width="80px" width="150px" show-overflow-tooltip :formatter="moneyFormatter" :edit-render="{name: 'ElInput', readonly: true}">
      </elx-editable-column>
      <elx-editable-column  prop="curtotalmoney" label="本期累计调整" header-align="right" align="right" min-width="80px" width="150px" show-overflow-tooltip :formatter="moneyFormatter" :edit-render="{name: 'ElInput'}">
      </elx-editable-column>
      <elx-editable-column  prop="endmoney" label="期末预算金额"  header-align="right" align="right" min-width="80px" width="150px" show-overflow-tooltip :formatter="moneyFormatter" :edit-render="{name: 'ElInput'}">
      </elx-editable-column>
      <elx-editable-column  prop="memo" label="备注" min-width="200px" header-align="left" align="left" show-overflow-tooltip :edit-render="{name: 'ElInput'}">
      </elx-editable-column>
    </elx-editable>
    <elx-editable
      v-if="editFlag === 'view'"
      ref="elxEditable"
      class="excel-table5"
      border
      size="customSize"
      :data.sync="list"
      row-key="budsubjectcode"
      showIcon="false"
      :custom-columns.sync="customColumns"
      :edit-config="{trigger: 'dblclick', mode: 'cell', showStatus: false, showIcon: false, props: {children: 'children'}}"
      :height="tbHeight"
      style="width:100%;"
      @cell-click="cellClick"
      >
      <elx-editable-column prop="budsubjectcode" label="科目编码" style="font-weight: bold" header-align="left" align="left" min-width="150px" width="200px" fixed show-overflow-tooltip>
      </elx-editable-column>
      <elx-editable-column prop="budsubjectname" label="科目名称" style="font-weight: bold" header-align="left" align="left" min-width="100px" width="200px" fixed show-overflow-tooltip>
      </elx-editable-column>
      <elx-editable-column  prop="beginmoney" label="期初预算金额" header-align="right" :formatter="moneyFormatter" align="right" width="150px" min-width="80" show-overflow-tooltip>
      </elx-editable-column>
      <elx-editable-column  prop="curtotalmoney" label="本期累计调整" header-align="right" :formatter="moneyFormatter" align="right" min-width="80" width="150px" show-overflow-tooltip>
      </elx-editable-column>
      <elx-editable-column  prop="endmoney" label="期末预算金额" header-align="right" :formatter="moneyFormatter" align="right" min-width="80" width="150px" show-overflow-tooltip>
      </elx-editable-column>
      <elx-editable-column  prop="memo" show-overflow-tooltip label="备注" header-align="left" align="center">
      </elx-editable-column>
    </elx-editable>
  </div>
</template>

<script>
import XEClipboard from 'xe-clipboard'
import {budSubjectFieldNames} from './const'
export default {
    name: 'DeptExcelInput',
    props: {
        dataStopFlag: Boolean,
        workflowstate: String,
        deptGridData: Array,
        budList: Array
    },
    data () {
        return {
            tbHeight: 300,
            trueFlag: true,
            dialogVisible: false,
            editFlag: 'view',
            cellEditFlag: false,
            customColumns: [],
            selectColumns: [],
            originalDataMap: null, // 原始数据备份map
            list: []
        }
    },
    watch: {
        deptGridData () {
            this.findList()
        },
        workflowstate () {
            if ((this.workflowstate === '未提交' || this.workflowstate === '未保存') && !this.dataStopFlag) {
                this.editFlag = 'edit'
            } else {
                this.editFlag = 'view'
            }
        },
        dataStopFlag () {
            if ((this.workflowstate === '未提交' || this.workflowstate === '未保存') && !this.dataStopFlag) {
                this.editFlag = 'edit'
            } else {
                this.editFlag = 'view'
            }
        }
    },
    mounted () {
        this.winResize()

        let _this = this
        window.addEventListener('resize', function () {
            _this.winResize()
        })
    },
    computed: {
        allCustomColumnList () {
            return this.customColumns.filter(item => item.prop)
        }
    },
    methods: {
        // 当单元格的编辑状态消失时，自动汇总预算金额
        treeSum (row, column, cell, event) {
            let property = column.property
            if (property !== budSubjectFieldNames.beginmoney &&
                property !== budSubjectFieldNames.curtotalmoney &&
                property !== budSubjectFieldNames.endmoney) {
                this.checkEditData()
                return
            }
            this.treeSumExe(row, property, this.list)
            this.checkEditData()
            this.cellEditFlag = true
        },
        // 执行汇总递归-O(n)
        treeSumExe (row, property, list) {
            if (!list || list.length === 0) {
                return false
            }
            for (let data of list) {
                if (data[budSubjectFieldNames.budsubjectcode] === row[budSubjectFieldNames.budsubjectcode]) {
                    this.computedEndMoney(data) // 处理行数据计算

                    // 处理树数据汇总
                    let res = 0
                    for (let item of list) {
                        res += Number.isFinite(Number(item[property])) ? Number(item[property]) : 0
                    }
                    return res
                }
                let subRes = this.treeSumExe(row, property, data.children)
                if (subRes !== false) {
                    if (this.originalDataMap.get(data[budSubjectFieldNames.budsubjectcode])[property] !== null || subRes !== 0) {
                        data[property] = subRes
                    } else {
                        data[property] = null
                    }
                    this.computedEndMoney(data) // 处理行数据计算

                    // 处理树数据汇总
                    let res = 0
                    for (let item of list) {
                        res += Number.isFinite(Number(item[property])) ? Number(item[property]) : 0
                    }
                    return res
                }
            }
            return false
        },
        computedEndMoney (data) {
            let beginMoney = Number(data[budSubjectFieldNames.beginmoney])
            beginMoney = Number.isFinite(beginMoney) ? beginMoney : 0
            let curtotalmoney = Number(data[budSubjectFieldNames.curtotalmoney])
            curtotalmoney = Number.isFinite(curtotalmoney) ? curtotalmoney : 0

            let endMoney = beginMoney + curtotalmoney
            if (this.originalDataMap.get(data[budSubjectFieldNames.budsubjectcode])[budSubjectFieldNames.endmoney] !== null || endMoney !== 0) {
                data[budSubjectFieldNames.endmoney] = endMoney
            } else {
                data[budSubjectFieldNames.endmoney] = null
            }
        },
        getBudDataMap (map, list) {
            if (!list || list.length === 0) {
                return
            }
            if (!map) {
                map = new Map()
            }
            for (let data of list) {
                map.set(data[budSubjectFieldNames.budsubjectcode], data)
                this.getBudDataMap(map, data.children)
            }
        },
        winResize () {
            this.$nextTick(() => {
                let winHeight = document.documentElement.clientHeight
                this.tbHeight = Number(winHeight) - 202
            })
        },
        moneyFormatter (row, column) {
            let property = column.property
            if (!row[property] || parseFloat(row[property]) === 0.00) {
                return ''
            }
            row[property] = parseFloat(row[property]).toFixed(2)
            let res = this.formatAmt(row[property])
            if (res === 'NaN') {
                row[property] = null
                return null
            }
            return res
        },
        formatAmt (amt) {
            if (amt.length <= 3) {
                return amt
            }

            if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(amt)) {
                return amt
            }
            var a = RegExp.$1
            var b = RegExp.$2
            var c = RegExp.$3
            var re = new RegExp()
            re.compile('(\\d)(\\d{3})(,|$)')
            while (re.test(b)) {
                b = b.replace(re, '$1,$2$3')
            }
            return a + '' + b + '' + c
        },
        getGridList () {
            return this.list
        },
        getEditData () {
            if (this.cellEditFlag) { // 界面第一次初始化数据时，初始化的数据都会被认为是编辑数据，因此要特殊处理
                return this.$refs.elxEditable.getUpdateRecords()
            } else {
                return []
            }
        },
        // 针对初始化的异常情况，切换组织机构时，编辑数据的检测开关
        setCellEditFlag (val) {
            this.cellEditFlag = false
        },
        checkEditData () {
            if (this.$refs.elxEditable.getUpdateRecords().length > 0) {
                this.$emit('setExistGridEditData', true)
            } else {
                this.$emit('setExistGridEditData', false)
            }
        },
        findList () {
            this.list = this.deptGridData // await XEUtils.toArrayTree(this.deptGridData,{key:'budsubjectcode', parentKey: 'parentname'}),
            this.$nextTick(() => {
                /* eslint-disable */
                $('.el-icon-arrow-right').click()
                this.$nextTick(() => {
                    if (this.$refs.elxEditable) {
                        this.$refs.elxEditable.doLayout()
                        this.originalDataMap = new Map()
                        this.getBudDataMap(this.originalDataMap, this.deptGridData)
                    }
                })
            })
        },
        cellClick (row, column, cell, event) {
            if(column.property === 'budsubjectcode' || column.property === 'budsubjectname') {
                return
            }

            let tdatas = this.$refs.elxEditable._getTDatas()
            for (let rowTData of tdatas) {
                if (rowTData.data.budsubjectcode === row.budsubjectcode) {
                    rowTData.checked = column.property
                } else {
                    rowTData.checked  = null
                }
            }
        },
        keydownMethod ({active, checked}, event) {
            if (event.keyCode >= 37 && event.keyCode <= 40 || event.keyCode === 9){
                if(checked.columnIndex < 2) {
                    let tdatas = this.$refs.elxEditable._getTDatas()
                    tdatas[checked.rowIndex].checked ='beginmoney'
                }
            } else if (event.keyCode === 13) {
                this.$refs.elxEditable.clearActive()

                let tdatas = this.$refs.elxEditable._getTDatas()
                if(active){
                    tdatas[active.rowIndex].checked =  active.column.property
                } else if(checked) {
                    tdatas[checked.rowIndex].checked = checked.column.property
                }
            } else if (event.ctrlKey && checked) {
                let currVal = checked.row[checked.column.property]

                if(event.code === 'KeyC') {
                    XEClipboard.copy(currVal)
                } else if(event.code === 'KeyX') {
                    XEClipboard.copy(currVal)
                    checked.row[checked.column.property] = ''
                } else if (event.code === 'KeyV') {
                    this.$refs.elxEditable.setActiveCell(checked.row, checked.column.property)
                }
            }
        },
        checkedEditMethod ({row, rowIndex, column, columnIndex, cell}, event) {
            if(row.children && row.children.length > 0){
                return false
            }
            if (column.property === budSubjectFieldNames.endmoney) {
                return false
            }
            return true
        }
    }
}

</script>

<style>
.excel-table5 .el-table__body .elx-editable-row>.elx-editable-column {
  cursor: cell;
}

.excel-table5 .el-table__header th,
.excel-table5 .el-table__body .elx-editable-row>.elx-editable-column:first-child,
.excel-table5 .el-table__body .elx-editable-row:hover>.elx-editable-column:first-child,
.excel-table5 .el-table__body .elx-editable-row>.elx-editable-column:nth-child(2),
.excel-table5 .el-table__body .elx-editable-row:hover>.elx-editable-column:nth-child(2) {
    background-color: #f5f5f5;
}

.excel-table5 .el-table__body .elx-editable-row>.elx-editable-column:first-child>.cell,
.excel-table5 .el-table__body .elx-editable-row:hover>.elx-editable-column:first-child>.cell,
.excel-table5 .el-table__body .elx-editable-row>.elx-editable-column:nth-child(2)>.cell,
.excel-table5 .el-table__body .elx-editable-row:hover>.elx-editable-column:nth-child(2)>.cell {
    color: #222;
    font-size: 12px;
    font-weight: bold;
}

.excel-table5 .el-table__body .elx-editable-row>.elx-editable-column:first-child,
.excel-table5 .el-table__body .elx-editable-row:hover>.elx-editable-column:nth-child(2) {
  cursor: default;
}

.excel-table5 .el-table__body .elx-editable-row:hover>.elx-editable-column {
  background-color: inherit;
}

.excel-table5 .el-table__body .elx-editable-row>.elx-editable-column.elx_checked,
.excel-table5 .el-table__body .elx-editable-row>.elx-editable-column.elx_active {
  border: 1px solid #4BC0C6;
}

.excel-table5 .el-table__body .elx-editable-row>.elx-editable-column .cell {
  width: 100% !important;
  padding: 0;
}

.excel-table5 .el-table__body .elx-editable-row>.elx-editable-column .cell .el-input__inner {
  border-radius: 0;
  border: 0;
  padding: 0;
}

#tableDiv{
    padding-right: 3px;
}
#tableDiv .el-table--group, #tableDiv .el-table--border{
    border: none;
}
#tableDiv .el-table::before{
    height: 0px;
}

#tableDiv .excel-table5 .el-table__header .elx-editable-column.elx-header_checked,
#tableDiv .excel-table5 .el-table__header .elx-editable-column.elx-header_active,
#tableDiv .excel-table5 .el-table__body .elx-editable-row.elx_checked > .elx-editable-column:first-child,
#tableDiv .excel-table5 .el-table__body .elx-editable-row.elx_active > .elx-editable-column:first-child,
#tableDiv .excel-table5 .el-table__body .elx-editable-row.elx_checked > .elx-editable-column:nth-child(2),
#tableDiv .excel-table5 .el-table__body .elx-editable-row.elx_active > .elx-editable-column:nth-child(2){
    color: #03A4AD;
    background-color: #fff;
}

#tableDiv .excel-table5 .el-table__body .elx-editable-row.elx_checked > .elx-editable-column:first-child>.cell,
#tableDiv .excel-table5 .el-table__body .elx-editable-row.elx_active > .elx-editable-column:first-child>.cell,
#tableDiv .excel-table5 .el-table__body .elx-editable-row.elx_checked > .elx-editable-column:nth-child(2)>.cell,
#tableDiv .excel-table5 .el-table__body .elx-editable-row.elx_active > .elx-editable-column:nth-child(2)>.cell{
    color: #03A4AD;
    font-size: 12px;
    font-weight: bold;
}

#tableDiv .excel-table5 .el-table__header th{
    padding: 0;
    height: 38px !important;
}

#tableDiv .excel-table5 .el-table__header th>.cell {
    padding: 0px 10px 0px 10px;
}

#tableDiv .el-table td {
    padding: 0 10px 0 10px;
    height: 36px !important;
}

#tableDiv .elx-editable .elx-editable-row.elx_disabled,
#tableDiv .elx-editable .elx-editable-column.elx_edit.elx_disabled {
  background-color: #fff;
}

#tableDiv .el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: #fff !important;
}

</style>
