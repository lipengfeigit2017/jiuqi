<!--客商主界面-->
<template>
    <div class="custsupplier-main-content">
        <CustsuppToolbar
            :currentRowCode="currentRowCode"
            :custsupptypecode="custsupptypecode"
            :rowData="rowData"
            @addcustsupplier="addcustsupplier"
            @modifycustsupplier="modifycustsupplier"
            @baseDataMoveHandel="baseDataMoveHandel"
            @stopcustsupplieritem="stopcustsupplieritem"
            @startcustsupplieritem="startcustsupplieritem"
        >
        </CustsuppToolbar>
        <Split v-model="split1">
            <div slot="left" class="demo-split-pane">
                <CustsuppTypeList
                    @custsuppTypeSelectHandle="custsuppTypeSelectHandle"
                    :custsuppTypeList="custsuppTypeList">
                </CustsuppTypeList>
            </div>
            <div slot="right" class="demo-split-pane">
                <CustSupplierList
                    @currentRowHandle="currentRowHandle"
                    @edit="modifycustsupplier"
                    @stop="stopcustsupplieritem"
                    @start="startcustsupplieritem"
                    @updateCurrQueryParam="updateCurrQueryParam"
                    :checkCanMove="checkCanMove"
                    :refreshList="refreshList"
                    :moveType="moveType"
                    :custsupptypecode="custsupptypecode"
                    :groupNames="groupNames"
                    :showcolumns="showcolumns"
                    :extendfields="define.extendFields"
                    :custsuppTypeList="custsuppTypeList">
                </CustSupplierList>
            </div>
        </Split>
        <AddCustSupplier
            v-if="showAddCustSupplier"
            :title="title"
            :custsupplier="custsupplier"
            :custsupptypecode="custsupptypecode"
            :define="define"
            @closeAddCustSupplier="closeAddCustSupplier"
            @refreshCustSuppList="refreshCustSuppList">
      </AddCustSupplier>
    </div>
</template>

<script>
import CustsuppToolbar from './basedata-custsupplier-toolbar'
import CustsuppTypeList from './basedata-custsupplier-typelist'
import CustSupplierList from './basedata-custsupplier-list'
import AddCustSupplier from './basedata-custsupplier-add'
import {
    vaBaseDataApi
} from '../../../api/va'

export default {
    name: 'CustSupplierMain',
    data () {
        return {
            currentRowCode: null,
            title: String,
            showAddCustSupplier: false,
            rowData: null,
            refreshList: false,
            custsupptypecode: '',
            groupNames: [],
            custsupplier: null,
            split1: 0.20,
            custsuppTypeList: [],
            queryParam: {},
            checkCanMove: false,
            moveType: '',
            define: {}
        }
    },
    components: {
        CustsuppToolbar,
        CustsuppTypeList,
        CustSupplierList,
        AddCustSupplier
    },
    methods: {
        addcustsupplier () {
            this.title = '新建客商'
            this.showAddCustSupplier = true
            this.custsupplier = null
        },
        modifycustsupplier (val) {
            this.title = '修改客商'
            this.showAddCustSupplier = true
            if (val) {
                this.custsupplier = val
            } else {
                this.custsupplier = this.rowData
            }
        },
        closeAddCustSupplier () {
            this.showAddCustSupplier = false
        },
        currentRowHandle (currrow) {
            this.rowData = currrow
            this.currentRowCode = currrow.code
        },
        custsuppTypeSelectHandle (custsupptype, groupNames) {
            this.custsupptypecode = custsupptype
            this.groupNames = groupNames
            this.rowData = null
            this.currentRowCode = null
        },
        async baseDataMoveHandel (type) {
            this.moveType = type
            try {
                let {
                    data: {msg, code}
                } = await this.$http.post(vaBaseDataApi.basedata + '/move', {
                    id: this.rowData.id,
                    tableName: 'MD_CUSTSUPP',
                    moveType: type,
                    queryParam: this.queryParam})
                if (code === 0) {
                    this.$Message.success((type === 'UP' ? '上移' : '下移') + '成功')
                    this.refreshList = !this.refreshList
                } else {
                    this.$Message.error(msg)
                    throw new Error(msg)
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        async startcustsupplieritem () {
            if (this.rowData != null && this.rowData.code) {
                try {
                    let {data: {msg, code}} = await this.$http.post(vaBaseDataApi.basedata + '/stop', {
                        tableName: 'MD_CUSTSUPP',
                        id: this.rowData.id,
                        code: this.rowData.code,
                        stopflag: 0
                    })
                    if (code === 0) {
                        this.$Message.success('启用成功')
                        this.refreshList = !this.refreshList
                    } else {
                        throw new Error(msg)
                    }
                } catch (e) {
                    throw new Error(e)
                }
            } else {
                this.$Message.error('请选择一条基础数据')
            }
        },
        async stopcustsupplieritem () {
            if (this.rowData != null && this.rowData.code) {
                try {
                    let {data: {msg, code}} = await this.$http.post(vaBaseDataApi.basedata + '/stop', {
                        tableName: 'MD_CUSTSUPP',
                        id: this.rowData.id,
                        code: this.rowData.code,
                        stopflag: 1
                    })
                    if (code === 0) {
                        this.$Message.success('停用成功')
                        this.refreshList = !this.refreshList
                    } else {
                        throw new Error(msg)
                    }
                } catch (e) {
                    throw new Error(e)
                }
            } else {
                this.$Message.error('请选择一条基础数据')
            }
        },
        refreshCustSuppList () {
            this.refreshList = !this.refreshList
        },
        async loadBaseDataList () {
            try {
                let formdata = {
                    tableName: 'MD_CUSTSUPPTYPE',
                    pagination: false,
                    searchKey: this.searchText,
                    stopflag: -1,
                    queryDataStructure: 'ALL'
                }
                let {data: {rs, rows}} = await this.$http.post(vaBaseDataApi.basedata + '/tree', formdata)
                if (rs.code === 0) {
                    this.custsuppTypeList = rows
                } else {
                    throw new Error(rs.msg)
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        updateCurrQueryParam (queryParam) {
            this.queryParam = queryParam
        },
        // 加载基础数据定义
        async loadDefine () {
            const {data: {rs, rows}} = await this.$http.post(vaBaseDataApi.basedata + 'Define/list', {name: 'MD_CUSTSUPP'})
            if (rs.code === 0) {
                if (rows && rows.length > 0 && rows[0].define) {
                    this.define = JSON.parse(rows[0].define)
                }
            } else {
                throw new Error(rs.msg)
            }
        }
    },
    computed: {
        showcolumns () {
            const columns = []
            if (this.define && this.define.showFields) {
                let showFields = this.define.showFields
                for (let i in showFields) {
                    if (showFields[i].isQueryColumn) {
                        columns.push(showFields[i])
                    }
                }
            }
            return columns
        }
    },
    async mounted () {
        await this.loadDefine()
        this.loadBaseDataList()
    }
}
</script>

<style lang="less" scoped>
    .custsupplier-main-content{
        height: 100%;
        padding: 0;
        overflow: hidden;
    }
    .left-pane>.demo-split-pane {
        padding: 10px;
    }

    .right-pane>.demo-split-pane {
        padding: 10px 10px 10px 15px;
    }
</style>
