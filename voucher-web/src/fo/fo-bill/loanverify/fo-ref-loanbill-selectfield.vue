<template>
    <div>
        <i-input placeholder="请输入关键字" suffix="ios-search" style="margin-bottom: 10px;" v-model="filterText"></i-input>
        <el-tree :data="treeData" default-expand-all style="height: 400px;overflow: auto"
            highlight-current node-key="columnName" :render-content="renderContent" :filter-node-method="filterNode" show-checkbox
            :expand-on-click-node="false" ref="tree" :props="{label: 'title', children: 'columns'}"  @check="handleCheck">
        </el-tree>
    </div>
</template>

<script>

export default {
    name: 'fo-ref-loanbill-selectfield',
    props: {
        treeData: Array,
        selectNodes: Array,
        showFieldSelect: Boolean
    },
    data () {
        return {
            filterText: '',
            selectedData: []
        }
    },
    watch: {
        filterText (val) {
            this.$refs.tree.filter(val)
        },
        showFieldSelect () {
            this.$nextTick(() => {
                this.$refs.tree.setCheckedNodes(this.selectNodes)
            })
        }
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
