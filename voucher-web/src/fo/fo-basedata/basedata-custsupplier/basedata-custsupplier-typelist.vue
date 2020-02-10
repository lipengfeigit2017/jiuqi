<!--客商基础数据界面——左侧客商分类列表-->
<template>
    <div>
        <i-input search placeholder="输入关键字查询" v-model="filterText"></i-input>
        <el-tree class="filter-tree" id="custsuppTypeListTree"
        :data="custsuppTypeList" node-key="id"
        :expand-on-click-node="false"
        :props="defaultProps"
        :default-expanded-keys="['-']"
        :highlight-current="true"
        :filter-node-method="filterNode"
        @node-click="listclickhandle"
        ref="basedatatree">
            <span class="custom-tree-node" slot-scope="{ node, data }"
                style="display:block; position:relative; width:100%;">
                <span v-if="node.isLeaf" class="iconfont iconfont icon_shu-biao" size="16px"/>
                <span v-else class="iconfont icon_shu-wenjianjia"/>
                <span v-if="Number(node.data.attributes.stopflag) === 1" style="font-style: italic; color: #808080;"> {{getShowText(data)   }}</span>
                <span v-else > {{getShowText(data)   }}</span>
                <span v-if="data.id === '-'" style="position:absolute; right:10px;">
                    <Checkbox v-model="isShowTreeNodeCode">显示代码</Checkbox>
                </span>
            </span>
        </el-tree>
    </div>
</template>

<script>
export default {
    name: 'CustsuppTypeList',
    data () {
        return {
            filterText: '',
            defaultProps: {
                children: 'children',
                label: 'text'
            },
            // 显示树节点标识
            isShowTreeNodeCode: false
        }
    },
    props: {
        custsuppTypeList: Array
    },
    mounted () {
        // this.loadBaseDataList()

        this.winResize()

        let _this = this
        window.addEventListener('resize', function () {
            _this.winResize()
        })
    },
    watch: {
        filterText (val) {
            this.$refs.basedatatree.filter(val)
        }
    },
    methods: {
        // async loadBaseDataList () {
        //     try {
        //         let {data: {rs, rows}} = await this.$http.post(vaBaseDataApi.basedata + '/list', {tablename: 'MD_CUSTSUPPTYPE'})
        //         if (rs.code === 0) {
        //             this.custsuppList = rows
        //         } else {
        //             throw new Error(rs.msg)
        //         }
        //     } catch (e) {
        //         throw new Error(e)
        //     }
        // },
        // 获取展示文本
        getShowText (data) {
            if (!data.id || data.id === '-') { // 根节点
                return data.text
            } else {
                return this.isShowTreeNodeCode ? (data.id + ' ' + data.text) : data.text
            }
        },
        filterNode (value, data) {
            if (!value) return true
            return data.id.indexOf(value) !== -1 || data.text.indexOf(value) !== -1
        },
        listclickhandle (data) {
            let groupNames = []
            if (data) {
                if (data.id === '-' && data.children.length > 0) {
                    for (let i in data.children) {
                        groupNames.push(data.children[i].id)
                    }
                } else {
                    groupNames.push(data.id)
                }
            }
            this.$emit('custsuppTypeSelectHandle', data.id, groupNames)
        },
        winResize () {
            this.$nextTick(() => {
                let winHeight = document.documentElement.clientHeight
                var obj = document.getElementById('custsuppTypeListTree')
                if (obj) {
                    obj.style.height = (Number(winHeight) - 172) + 'px'
                }
            })
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
