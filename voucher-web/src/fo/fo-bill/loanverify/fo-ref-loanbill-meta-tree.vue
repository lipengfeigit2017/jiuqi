<template>
    <div>
        <i-input placeholder="请输入关键字" suffix="ios-search" style="margin-bottom: 10px;" v-model="filterText"></i-input>
        <el-tree :data="treeData" default-expand-all style="height: 400px;overflow: auto" show-checkbox
            highlight-current node-key="uniqueCode" :render-content="renderContent" :filter-node-method="filterNode"
            :expand-on-click-node="false" ref="tree" :props="{label: 'title', children: 'children'}" @node-click="handleClick">
        </el-tree>
    </div>
</template>

<script>
import XEUtils from 'xe-utils'

export default {
    name: 'va-bill-ref-meta-tree',
    props: {
        selectItems: Array,
        metaModal: Boolean
    },
    data () {
        return {
            treeData: [],
            filterText: '',
            selectData: ''
        }
    },
    watch: {
        filterText (val) {
            this.$refs.tree.filter(val)
        },
        metaModal (val) {
            this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys(this.selectItems)
            })
        }
    },
    async mounted () {
        const {data: {groups}} = await this.$http.post('/api/vbserver/biz/meta/groups/all', {metaType: 'bill', operateType: 'DESIGN'})
        const {data: {metaInfos}} = await this.$http.post('/api/vbserver/biz/meta/infos/get', {metaType: 'bill', module: 'CFAS', operateType: 'DESIGN'})
        if (metaInfos && metaInfos.length > 0) {
            const newarry = []
            metaInfos.forEach(item => {
                item.parentName = item.groupName
                if (item.modelName === 'CFAS_B_FOBORROWINGBILL') {
                    newarry.push(item)
                }
            })
            const newgroups = []
            for (var group of groups) {
                let index = newarry.findIndex(items => items.parentName === group.name)
                if (index !== -1) {
                    newgroups.push(group)
                }
            }
            const data = newgroups.concat(newarry)
            const treeData = XEUtils.toArrayTree(data, {key: 'name', parentKey: 'parentName'})
            this.treeData = treeData
        }
    },
    methods: {
        getData () {
            const allnode = this.$refs.tree.getCheckedNodes()
            return allnode
        },
        async handleClick (data) {
            this.selectData = data
        },
        filterNode (value, data) {
            if (!value) return true
            value = value.toUpperCase()
            return data.name.indexOf(value) !== -1 || data.title.indexOf(value) !== -1
        },
        renderContent (h, { node, data, store }) {
            const iconClass = data.uniqueCode ? 'iconfont icon_shu-biao' : 'iconfont icon_shu-wenjianjia'
            return <span style="color:#555555">
                <span class={iconClass}></span> <span class="el-tree-node__label">{data.title + '（' + data.name + '）'}</span>
            </span>
        }
    }
}
</script>
