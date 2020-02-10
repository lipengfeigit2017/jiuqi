<template>
    <Form :label-width="70" class="cfas-switch-org">
        <!--<FormItem label="组织类型">
            <Select v-model="orgType" @on-change="handleOrgTypeChange">
                <Option v-for="item of orgTypes" :key="item.id" :value="item.name">{{item.title}}</Option>
            </Select>
        </FormItem>-->
        <FormItem :label-width="0">
            <i-input placeholder="请输入组织机构代码、名称" v-model="filterText"></i-input>
        </FormItem>
        <FormItem :label-width="0" style="border: 1px solid #dcdee2;overflow: auto;height: 300px">
            <el-tree ref="orgTree"  :data="orgDatas"
                 :expand-on-click-node="false" :highlight-current="true"
                 node-key="code" :props="defaultProps"
                 :filter-node-method="filterNode" :render-content="renderContent"
            ></el-tree>
        </FormItem>
    </Form>
</template>

<script>
import XEUtils from 'xe-utils'

export default {
    name: 'cfas-switch-org',
    props: {
        loginUnit: String
    },
    data () {
        return {
            orgType: '',
            orgTypes: [],
            orgDatas: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            filterText: ''
        }
    },
    watch: {
        filterText (val) {
            this.$refs.orgTree.filter(val)
        }
    },
    async mounted () {
        await this.getOrgTypes()
        this.$refs.orgTree.setCurrentKey(this.loginUnit)
    },
    methods: {
        async getOrgTypes () {
            const {data: {rows: orgTypes}} = await this.$http.post('/api/vmclient/org/category/list', {})
            this.orgTypes = orgTypes
            if (orgTypes.length) {
                this.orgType = orgTypes[0].name
                await this.getOrgDatas(orgTypes[0].name)
            }
        },
        async getOrgDatas (tablName) {
            const {data: {rows: orgDatas}} = await this.$http.post('/api/vmclient/org/data/list', {
                categoryname: tablName,
                versiontitle: '默认版本'
            })
            this.orgDatas = XEUtils.toArrayTree(orgDatas, {key: 'code', parentKey: 'parentcode'})
        },
        handleOrgTypeChange (tableName) {
            this.getOrgDatas(tableName)
        },
        filterNode (value, data) {
            if (!value) return true
            return data.code.indexOf(value) !== -1 || data.name.indexOf(value) !== -1
        },
        renderContent (h, { node, data, store }) {
            const iconClass = node.isLeaf ? 'iconfont icon_shu-biao' : 'iconfont icon_shu-wenjianjia'
            return <span style="color:#555555">
                <span class={iconClass}></span> <span class="el-tree-node__label">{data.code + ' ' + data.name}</span>
            </span>
        }
    }
}
</script>

<style scoped lang="less">
.ivu-form-item {
    margin-bottom: 4px;
}
</style>
