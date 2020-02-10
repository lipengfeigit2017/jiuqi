<template>
    <div>
        <i-input placeholder="请输入关键字" suffix="ios-search" style="margin-bottom: 10px;" v-model="filterText"></i-input>
        <el-tree :data="treeData" default-expand-all style="height: 400px;overflow: auto"
            highlight-current node-key="id" :render-content="renderContent" :filter-node-method="filterNode"
            :expand-on-click-node="false" ref="tree" :props="{label: 'title', children: 'columns'}" @node-click="handleClick">
        </el-tree>
    </div>
</template>

<script>
export default {
    name: 'apar-bill-ref-meta-tree-single',
    props: {
        tableNames: Array
    },
    data () {
        return {
            treeData: [],
            filterText: '',
            selectNode: ''
        }
    },
    watch: {
        filterText (val) {
            this.$refs.tree.filter(val)
        }
    },
    async mounted () {
        const treeData = []
        for (const name of this.tableNames) {
            const {data} = await this.$http.post('/api/vmclient/dataModel/define/format', {name})
            const filterdata = []
            data.columns.forEach((item, i) => {
                if (item.columnName === 'QUOTECODE' || item.columnName === 'UNITCODE' || item.columnName === 'CUSTSUPPCODE' || item.columnName === 'VER' || item.columnName === 'ORDINAL') {
                    return
                }
                if (item.columnType === 'UUID' || item.columnType === 'DATE' || item.columnType === 'TIMESTAMP') {
                    return
                }
                item.showtitle = item.columnTitle + '[' + item.columnName + ']'
                item.value = item.columnName
                filterdata.push(item)
            })
            data.columns = filterdata

            treeData.push(data)
        }
        this.treeData = treeData
    },
    methods: {
        getData () {
            if (this.selectNode !== '' && this.selectNode.data.columnName) {
                return this.selectNode
            } else {
                this.$Message.info('请选择一个字段')
                return false
            }
        },
        async handleClick (data, node) {
            this.selectNode = node
        },
        filterNode (value, data) {
            if (!value) return true
            value = value.toUpperCase()
            return (data.columnName && data.columnName.indexOf(value) !== -1) || (data.columnTitle && data.columnTitle.indexOf(value) !== -1)
        },
        renderContent (h, { node, data, store }) {
            if (data.columnName) {
                return <span style="color:#555555">
                    <span class="iconfont icon_shu-biao"></span> <span class="el-tree-node__label">{data.columnTitle + '（' + data.columnName + '）'}</span>
                </span>
            } else {
                return <span style="color:#555555">
                    <span class="iconfont icon_shu-wenjianjia"></span> <span class="el-tree-node__label">{data.title + '（' + data.name + '）'}</span>
                </span>
            }
        }
    }
}
</script>
