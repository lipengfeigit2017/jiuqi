<template>
    <div>
        <Input
            width="500px"
            icon="ios-arrow-down"
            v-model="showText"
            readonly
            @on-click="openModal"
            @on-change="inputChange"
        />
        <tree-modal
            v-if="showModal"
            :treeData="treeData"
            :treeLabelKey="treeLabelKey"
            :treeChildrenKey="treeChildrenKey"
            :treeIdKey="treeIdKey"
            :titleKey="titleKey"
            :valueKey="valueKey"
            @selectNodeEvent="selectNodeEvent"
            @closeWindow="closeModel"
        >

        </tree-modal>
    </div>
</template>

<script>
import TreeModal from './tree-modal'
import XEUtils from 'xe-utils'
export default {
    computed: {
    },
    components: {
        TreeModal
    },
    props: {
        value: String,
        readonlyFlag: {
            type: Boolean,
            default: false
        },
        titleKey: {
            type: String,
            default: 'title'
        },
        valueKey: {
            type: String,
            default: 'name'
        },
        dataList: {
            type: Array
        },
        dataTree: {
            type: Array
        },
        treeLabelKey: {
            type: String,
            default: 'title'
        },
        treeChildrenKey: {
            type: String,
            default: 'children'
        },
        treeIdKey: {
            type: String,
            default: 'id'
        }
    },
    watch: {
        filterText (val) {
            this.$refs.datatree.filter(val)
        }
    },
    data () {
        return {
            showText: '',
            showModal: false,
            treeData: []
        }
    },
    created () {

    },
    mounted () {
        // 如果绑定了数据树，则优先加载数据树，否则根据数据列表初始化控件
        if (this.dataTree) {
            this.treeData = this.dataTree
            if (this.value) {
                this.showText = this.findTextInTree(this.treeData, this.value) || ''
            }
            return
        }
        if (this.dataList) {
            this.treeData = XEUtils.toArrayTree(this.dataList, {key: 'name', parentKey: 'parentName'})
        }
        if (this.value) {
            let temp = this.dataList.find(item => item[this.valueKey] === this.value)
            if (temp) {
                this.showText = temp[this.titleKey]
            }
        }
    },
    methods: {
        findTextInTree (list, value) {
            if (!list || list.length === 0) {
                return null
            }
            for (let item of list) {
                if (item[this.valueKey] === value) {
                    return item[this.titleKey]
                }
                let res = this.findTextInTree(item[this.treeChildrenKey], value)
                if (res !== null) {
                    return res
                }
            }
            return null
        },
        selectNodeEvent (node) {
            this.showText = node[this.titleKey]
            this.$emit('input', node[this.valueKey])
            this.closeModel()
        },
        openModal () {
            if (this.readonlyFlag) {
                return
            }
            this.showModal = true
        },
        closeModel () {
            this.showModal = false
        },
        inputChange (event) {
            this.$emit('on-change', event)
        }
    }
}
</script>

<style>

</style>
