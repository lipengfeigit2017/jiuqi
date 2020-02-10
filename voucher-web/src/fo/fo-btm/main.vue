<template>

<div>
    <va-toolbar class="bud-toolbar-content">
        <va-toolbar-item title="修改" :disabled="editflag" @click="editEvent"></va-toolbar-item>
        <va-toolbar-item title="保存" :disabled="!editflag" @click="saveEvent"></va-toolbar-item>
        <va-toolbar-item title="同步缓存" :disabled="editflag" @click="syncCacheEvent"></va-toolbar-item>
    </va-toolbar>
    <el-table ref="table" :data="dataList" :height="tbHeight" :span-method="objectSpanMethod" border
        :edit-config="{trigger: 'manual', showIcon: false, mode: 'row', autoClearActive: false, render: 'scroll'}" style="width: 100%;">
        <el-table-column  prop="checked" :edit-render="{name: 'ElSwitch', type: 'visible'}" label="勾选" min-width="45" width="45">
            <template v-slot="scope">
                <Checkbox v-if="scope.row.readonly !== true" :true-value=1 :false-value=0 v-model="scope.row.checked" :disabled="scope.row.required === 1 || !editflag"></Checkbox>
                <label v-else>{{scope.row.categoryTitle}}</label>
            </template>
        </el-table-column>
        <el-table-column prop="intfName" width="200" min-width="300" label="接口字段名称">
        </el-table-column>
        <el-table-column prop="intfCode" width="200" min-width="300" label="接口字段标识">
        </el-table-column>
        <el-table-column prop="fieldType" width="100" min-width="50" label="字段类型">
        </el-table-column>
        <el-table-column prop="required" width="50" :formatter="requiredFormatter" label="必填">
        </el-table-column>
        <el-table-column :formatter="mappingTableFormatter" width="350" min-width="200" label="映射表">
        </el-table-column>
        <el-table-column width="250" min-width="100" label="映射字段">
            <template v-slot="scope">
                <i-select v-if="editflag" v-model="scope.row.mappingFieldName"  style="width: 100%;">
                    <Option v-for="item in columnData.get(scope.row.mappingTableName)" @click.native="mappingfieldChange(item, scope.row)" :value="item.columnName" v-bind:key="item.columnName">{{ item.columnTitle }} ({{item.columnName}}) </Option>
                </i-select>
                <label v-else-if="scope.row.mappingFieldName !== null">{{scope.row.mappingFieldTitle}} ({{scope.row.mappingFieldName}})</label>
            </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" :edit-render="{name: 'ElInput'}" :show-overflow-tooltip="true">
            <template v-slot="scope">
                <i-input v-if="editflag" v-model="scope.row.remark" style="width: 100%;"/>
                <label v-else-if="scope.row.remark !== null">{{scope.row.remark}}</label>
            </template>
        </el-table-column>
    </el-table>
</div>
</template>

<script>
import {vaDataModal} from '../../api/va'
import {foBtm} from '../../api/fo'
export default {
    name: 'CfasFoBtm',
    data () {
        return {
            tbHeight: 0,
            editflag: false,
            columnData: new Map(),

            // 全局控制参数
            columnNum: 8,
            categoryRowIndexSet: new Set(),
            dataList: null, // 表格构建数据
            topJson: null // 记录接口返回的json
        }
    },

    async mounted () {
        this.winResize()

        let _this = this
        window.addEventListener('resize', function () {
            _this.winResize()
        })
        await this.initData()
    },
    methods: {
        editEvent () {
            this.editflag = true
        },
        saveEvent () {
            this.$http.post(foBtm.updata, this.topJson).then(({data: {code, msg}}) => {
                if (code === 0) {
                    this.$Message.info('保存成功')
                    this.editflag = false
                } else {
                    this.$Message.error(msg)
                }
            })
        },
        syncCacheEvent () {
            this.$http.post(foBtm.syncCache).then(({data: {code, msg}}) => {
                if (code === 0) {
                    this.$Message.info('同步成功')
                } else {
                    this.$Message.error(msg)
                }
            })
            setTimeout(() => {
                this.initData()
            }, 300)
        },
        winResize () {
            this.$nextTick(() => {
                let winHeight = document.documentElement.clientHeight
                this.tbHeight = Number(winHeight) - 130
            })
        },
        mappingfieldChange (item, row) {
            row.mappingFieldName = item.columnName
            row.mappingFieldTitle = item.columnTitle
        },
        requiredFormatter (row, column) {
            return row.required === 1 ? '是' : '否'
        },
        mappingTableFormatter (row, column) {
            return row['mappingTableTitle'] + '(' + row['mappingTableName'] + ')'
        },
        mappingFieldFormatter (row, column) {
            return row['mappingFieldTitle'] + '(' + row['mappingFieldName'] + ')'
        },
        async initData () {
            this.columnNum = 8
            const {data: {code, msg, data}} = await this.$http.post(foBtm.get, null)
            if (code !== 0) {
                this.$Message.error(msg)
                return
            }
            let json = data
            this.topJson = json
            let i = 0
            this.dataList = []
            this.categoryRowIndexSet = new Set()
            for (let key in json) {
                if (key === 'tenantName' || key === 'extInfo') {
                    continue
                }

                let category = json[key]
                this.dataList[i] = {
                    categoryTitle: category.tltle + '(' + key + ')',
                    readonly: true
                }
                this.categoryRowIndexSet.add(i)
                i++
                let categoryData = category['attribute']
                for (let subKey in categoryData) {
                    let row = categoryData[subKey]
                    if (row.required === 1) {
                        row.checked = 1
                    }
                    await this.initTableField(row.mappingTableName)
                    this.dataList[i] = row
                    i++
                }
            }
            let temp = this.dataList
            this.dataList = null
            this.$nextTick(() => {
                this.dataList = temp
            })
        },
        getColumnData (mappingTableName) {
            return this.columnData[mappingTableName]
        },
        // 获取表格字段，初始化映射表字段选择属性
        async initTableField (mappingTableName) {
            if (this.columnData.has(mappingTableName)) {
                return
            }
            const {data} = await this.$http.post(vaDataModal.get, {name: mappingTableName})
            this.columnData.set(mappingTableName, data.columns)
        },
        // 行合并操作
        objectSpanMethod ({row, column, rowIndex, columnIndex}) {
            if (columnIndex === 0) {
                if (this.categoryRowIndexSet.has(rowIndex)) {
                    return [1, this.columnNum]
                }
            }
        }
    }
}
</script>
