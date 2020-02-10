<template>
    <div style="height:100%;">
        <i-input search placeholder="输入关键字查询" v-model="filterText"></i-input>
        <el-tree ref="syncdataconfigtree" node-key="id" class="filter-tree"
            :data="syncdatascheme"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            :highlight-current="true"
            :default-expanded-keys="defaultExpandKeys"
            @node-click="selectItem">
        </el-tree>
    </div>
</template>

<script>
import {
    syncdataApi
} from '../../api/fo'
export default {
    name: 'FoSyncDataConfigTree',
    data () {
        return {
            // 过滤条件
            filterText: '',
            // 同步方案配置数据
            syncdatascheme: [],
            // 默认属性
            defaultProps: {
                children: 'children',
                label: 'text'
            },
            defaultExpandKeys: ['root']
        }
    },
    props: {
        // 刷新
        refresh: Boolean,
        // 当前节点
        currNode: Object
    },
    watch: {
        refresh () {
            this.loadSyncDataScheme()
        },
        filterText (val) {
            this.$refs['syncdataconfigtree'].filter(val)
        }
    },
    mounted () {
        this.loadSyncDataScheme()
    },
    methods: {
        filterNode (value, data) {
            if (!value) return true
            return data.attributes.type === 'define' && (data.text.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
                data.attributes.param.code.toLowerCase().indexOf(value.toLowerCase()) !== -1)
        },
        async loadSyncDataScheme () {
            try {
                const {data: {rs, rows}} = await this.$http.post(syncdataApi.syncdatascheme + '/tree', {})
                if (rs.code === 0) {
                    this.defaultExpandKeys = ['root']
                    this.syncdatascheme = rows
                    this.$emit('loadSchemeList', this.syncdatascheme[0].children)
                    if (!this.currNode || !this.currNode.id) {
                        this.loadItem()
                    } else {
                        if (this.currNode && this.currNode.id) {
                            if (this.currNode.attributes.type === 'define') {
                                this.defaultExpandKeys.push('scheme###' + this.currNode.attributes.param.groupcode)
                            }
                            this.$nextTick(() => {
                                this.$refs['syncdataconfigtree'].setCurrentKey(this.currNode.id)
                                const treeNode = this.$refs['syncdataconfigtree'].getNode(this.currNode.id)
                                this.$emit('selectItem', treeNode.data)
                            })
                        }
                    }
                } else {
                    throw new Error(rs.code)
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        selectItem (data) {
            this.$emit('selectItem', data)
        },
        loadItem () {
            // 默认加载第一个方案节点
            if (this.syncdatascheme && this.syncdatascheme.length > 0 && this.syncdatascheme[0].hasChildren) {
                this.$nextTick(() => {
                    this.$refs['syncdataconfigtree'].setCurrentKey('scheme###' + this.syncdatascheme[0].children[0].attributes.param.code)
                })
                this.$emit('selectItem', this.syncdatascheme[0].children[0])
            }
        }
    }
}
</script>

<style scoped>
    .filter-tree {
        margin-top: 5px;
        overflow: auto;
    }
</style>
