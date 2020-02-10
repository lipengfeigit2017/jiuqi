<template>
    <div>
        <Modal
            width="500px"
            v-model="treeModal"
            title="数据选择"
            :loading="loading"
            :mask-closable="falseFlag"
            :mask="trueFlag"
            @on-ok="handleOk"
            @on-cancel="handleCancel">
                <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
                <el-tree class="filter-tree"
                    :node-key="treeIdKey"
                    :expand-on-click-node="false"
                    :data="treeData"
                    :props="defaultProps"
                    default-expand-all
                    :filter-node-method="filterNode"
                    ref="datatree"
                    @node-click="handleNodeClick">
                </el-tree>
        </Modal>
    </div>
</template>

<script>

export default {
    computed: {
        showText () {
            if (this.currentNode) {
                return this.currentNode[this.titleKey]
            } else {
                return ''
            }
        }
    },
    components: {
    },
    props: {
        treeData: {
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
        },
        titleKey: {
            type: String,
            default: 'title'
        },
        valueKey: {
            type: String,
            default: 'name'
        }
    },
    watch: {
        filterText (val) {
            this.$refs.datatree.filter(val)
        }
    },
    data () {
        return {
            loading: true,
            treeModal: true,
            trueFlag: true,
            falseFlag: false,
            filterText: '',
            currentNode: null,
            defaultProps: {
                children: this.treeChildrenKey,
                label: this.treeLabelKey
            }
        }
    },
    created () {

    },
    mounted () {
        if (this.value) {

        }
    },
    methods: {
        handleNodeClick (node) {
            this.currentNode = node
        },
        handleOk () {
            if (!this.currentNode || this.currentNode.type !== 'METADATA') {
                this.messageWarningFn('请选择有效数据')
            } else {
                this.$emit('selectNodeEvent', this.currentNode)
            }
        },
        handleCancel () {
            this.$emit('closeWindow')
        },
        filterNode (value, data) {
            if (!value) return true
            return data[this.titleKey].indexOf(value) !== -1 || data[this.valueKey].indexOf(value) !== -1
        },
        messageWarningFn (text) {
            this.$Message.warning(text)
            setTimeout(() => {
                this.loading = false
                this.$nextTick(() => {
                    this.loading = true
                })
            }, 1000)
        }
    }
}
</script>

<style>

</style>
