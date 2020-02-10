<template>
    <div>
        <i-input placeholder="请输入关键字" suffix="ios-search" style="margin-bottom: 10px;" v-model="filterText"></i-input>
        <el-tree :data="treeData" default-expand-all style="height: 400px;overflow: auto"
            highlight-current node-key="id" :render-content="renderContent" :filter-node-method="filterNode" show-checkbox
            :expand-on-click-node="false" ref="tree" :props="{label: 'title', children: 'newColumns'}"  @check="handleCheck">
        </el-tree>
    </div>
</template>

<script>
// import XEUtils from 'xe-utils'

export default {
    name: 'apar-bill-ref-meta-tree-multi',
    props: {
        tableNames: Array,
        selectNodes: Array,
        selectFieldModal: Boolean

    },
    data () {
        return {
            treeData: [],
            filterText: '',
            selectedData: this.selectNodes
        }
    },
    watch: {
        filterText (val) {
            this.$refs.tree.filter(val)
        },
        selectFieldModal (val) {
            // this.initSelectNodes()
        },
        selectNodes (val) {
            // 默认选中
            this.$nextTick(() => {
                this.$refs.tree.setCheckedNodes(val)
            })
            this.selectedData = val
        }
    },
    async mounted () {
        const treeData = []
        for (const name of this.tableNames) {
            const {data} = await this.$http.post('/api/vmclient/dataModel/define/format', {name})
            const newColumns = []

            data.columns.forEach((item, i) => {
                if (item.columnType === 'UUID' || item.columnName === 'VER' || item.columnName === 'ORDINAL') {
                    return
                }

                if (item.columnName === 'BILLCODE' || item.columnName === 'APARTYPECODE' ||
                 item.columnName === 'CONTRACTCODE' || item.columnName === 'CONTRACTNAME' ||
                 item.columnName === 'BILLMONEY' || item.columnName === 'BILLDATE') {
                    // return
                }
                if (data.name === 'FO_APARBILL') {
                    item.tablename = '主表[' + data.name + ']'
                } else {
                    item.tablename = '子表[' + data.name + ']'
                }
                item.fieldname = item.columnTitle + '[' + item.columnName + ']'
                item.id = data.name + item.columnName
                if (item.columnName === 'BILLCODE') {
                    item.width = 200
                } else if (item.columnType === 'INTEGER') {
                    item.width = 100
                } else {
                    item.width = 150
                }

                newColumns.push(item)
            })
            data.newColumns = newColumns
            treeData.push(data)
        }
        this.treeData = treeData

        // 默认选中
        this.$nextTick(() => {
            this.$refs.tree.setCheckedNodes(this.selectNodes)
        })
    },
    methods: {
        getData () {
            if (this.selectedData === 'undefined') {
                return false
            }
            if (this.selectedData.length === 0) {
                return false
            } else {
                return this.selectedData
            }
        },
        handleCheck (data, store) {
            if (store.checkedNodes.length === 0) {
                this.selectedData = null
            } else {
                let array = []

                store.checkedNodes.forEach((item, i) => {
                    if (!item.biztype) {
                        array.push(item)
                    }
                })
                this.selectedData = array
            }
        },
        filterNode (value, data) {
            if (!value) return true
            value = value.toUpperCase()
            return (data.columnName && data.columnName.indexOf(value) !== -1) || (data.columnTitle && data.columnTitle.indexOf(value) !== -1)
        },
        renderContent (h, { node, data, store }) {
            if (data.columnName) {
                return <span style="color:#555555">

                    <span class="el-tree-node__label">{data.columnTitle + '（' + data.columnName + '）'}</span>
                </span>
            } else {
                return <span style="color:#555555">

                    <span class="el-tree-node__label">{data.title + '（' + data.name + '）'}</span>
                </span>
            }
        }

    }
}
</script>
