<!--元数据定义界面——左侧树界面-->
<template>
    <div>
        <i-input search placeholder="输入关键字查询" v-model="filterText"></i-input>
        <el-tree class="filter-tree" id="budGroupTree"
            node-key="id"
            :expand-on-click-node="false"
            :highlight-current="false"
            :data="organizationdata"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            ref="orgtree"
            @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }"
                style="display:block; position:relative; width:100%;">
                <span v-if="node.isLeaf" class="iconfont iconfont icon_shu-biao" size="16px"/>
                <span v-else class="iconfont icon_shu-wenjianjia"/>
                <span v-if="Number(node.data.attributes.stopflag) === 1" style="font-style: italic; color: #808080;">{{getShowText(data)}}</span>
                <span v-else >{{getShowText(data)}}</span>
            </span>
        </el-tree>
    </div>
</template>

<script>

// let id = 1000
export default {
    name: 'BudOrganizationTree',
    watch: {
        filterText (val) {
            this.$refs.orgtree.filter(val)
        },
        treenode (val) {
            if (val) {
                this.$nextTick(() => { this.$refs.orgtree.setCurrentKey('-') })
            }
        }
    },
    methods: {
        getShowText (data) {
            return data.id === '-' ? data.text : (data.id + '      ' + data.text)
        },
        setCurrentNodeByKey (nodeKey) {
            this.$refs.orgtree.setCurrentKey(nodeKey)
        },
        handleNodeClick (data) {
            if (data.id !== this.treenode.code) {
                this.$refs.orgtree.setCurrentKey(this.treenode.code)
                this.$emit('handleGroupTreeClick', data)
            }
        },
        filterNode (value, data) {
            if (!value) return true
            return data.id.indexOf(value) !== -1 || data.text.indexOf(value) !== -1
        },
        winResize () {
            this.$nextTick(() => {
                let winHeight = document.documentElement.clientHeight
                var obj = document.getElementById('budGroupTree')
                if (obj) {
                    obj.style.height = (Number(winHeight) - 258) + 'px'
                }
            })
        }
    },
    data () {
        return {
            filterText: '',
            defaultProps: {
                children: 'children',
                label: 'text'
            }
        }
    },
    props: {
        categoryname: String,
        versiontitle: String,
        organizationdata: Array,
        treenode: Object
    },
    mounted () {
        this.winResize()

        let _this = this
        window.addEventListener('resize', function () {
            _this.winResize()
        })
    }
}
</script>

<style scoped>
    .filter-tree {
        margin-top: 5px;
        overflow: auto;
    }
</style>
