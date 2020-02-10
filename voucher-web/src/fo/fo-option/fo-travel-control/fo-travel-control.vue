<!--差旅标准-->
<template>
    <div style="height: 100%;">
        <va-toolbar>
            <va-toolbar-item title="修改" :disabled="!isCanEdit ? true : isEdit" @click="handleModify"></va-toolbar-item>
            <va-toolbar-item title="保存" :disabled="!isEdit" @click="handleSave"></va-toolbar-item>
        </va-toolbar>
        <div style="padding: 0 10px 10px 0;height:calc(100% - 32px);">
            <Split v-model="splitRate" style="height:100%;border-right: 1px solid #DDDDDD;border-bottom: 1px solid #DDDDDD;">
                <div slot="left" style="overflow:auto;height: 100%;padding: 12px;">
                    <i-input placeholder="请输入关键字" suffix="ios-search" style="margin-bottom: 10px;" v-model="filterText"></i-input>
                    <el-tree :data="orgDatas" default-expand-all style="height: calc(100% - 42px);"
                             highlight-current node-key="id"
                             :expand-on-click-node="false" ref="orgTree"
                             :render-content="renderContent"
                             :props="defaultProps" @node-click="handleNodeClick"
                             :filter-node-method="filterNode"
                    >
                    </el-tree>
                </div>
                <div slot="right" style="overflow:auto;padding: 10px;height: 100%;">
                    <Form>
                        <Row>
                            <i-col span="8" style="color:#888888">
                                <FormItem label="组织机构：" :label-width="90">
                                    <va-basedata tbName="MD_ORG_FIN" :value="selectedOrg.code" @on-change="handleOrgChange" :disabled="!isCanEdit"></va-basedata>
                                </FormItem>
                            </i-col>
                            <i-col span="3" style="color:#555555">
                                <FormItem label="管控下级：" :label-width="90">
                                    <Checkbox :disabled="!isEdit"
                                              :value="contronflag == 1 ? true : false"
                                              @on-change="handleCheckboxChange">
                                    </Checkbox>
                                </FormItem>
                            </i-col>
                            <i-col span="6" style="color:#888888">
                                <FormItem label="消费类型：" :label-width="90">
                                    <va-basedata tb-name="MD_EXPENSEKIND" :value="expensekindcode" @on-change="handleBaseDataChange" :disabled="!isCanEdit"
                                        @on-basedata-define="handelBaseDataDefine" :param="baseDataParam"
                                    ></va-basedata>
                                </FormItem>
                            </i-col>
                        </Row>
                    </Form>
                    <va-detail-table ref="editable" style="height: calc(100% - 47px);"
                        :show-summary="false" :isEdit="isEdit" height="100%"
                        :table-cols="tableCols" :table-data="tableData"
                        @on-field-change="handleFieldChnage"
                        @on-delete-row="handleDeleteRow"
                    ></va-detail-table>
                </div>
            </Split>
        </div>
    </div>
</template>

<script>
import XEUtils from 'xe-utils'
import {travelControlApi} from '@/api/fo/fo-option'

export default {
    name: 'fo-travel-control',
    data () {
        return {
            splitRate: 0.2,
            orgDatas: [],
            selectedOrg: {},
            expensekindcode: '',
            contronflag: 0,
            tableData: [],
            isEdit: false,
            isCanEdit: true,
            deleteRows: [],
            filterText: '',
            baseDataDefine: {},
            baseDataParam: {}
        }
    },
    computed: {
        defaultProps () {
            return {
                children: 'children',
                label: 'name'
            }
        },
        tableCols () {
            return [
                {field: 'positioncode', title: '职级', width: '150', type: 'basedata', tbName: 'MD_POSITION'},
                {field: 'planepositioncode', title: '飞机舱位', width: '150', type: 'basedata', tbName: 'MD_AIRCRAFTCABIN'},
                {field: 'trainseatscode', title: '火车席等级', width: '150', type: 'basedata', tbName: 'MD_TRAINTGRADE'},
                {field: 'citytypecode', title: '城市分类', width: '150', type: 'basedata', tbName: 'MD_CITYTYPE'},
                {title: '住宿标准',
                    children: [
                        {
                            field: 'staystatype',
                            title: '类型',
                            type: 'select',
                            options: [{label: '固定标准', value: 0}, {label: '实报实销', 'value': 1}]
                        },
                        {field: 'staystaamount', title: '金额', type: 'number', precision: 2}
                    ]
                },
                {field: 'subsidysta', title: '补助标准', width: '150', type: 'number', precision: 2},
                {title: '餐补标准',
                    children: [
                        {field: 'mealstatype',
                            title: '类型',
                            type: 'select',
                            options: [{label: '固定标准', value: 0}, {label: '实报实销', 'value': 1}]},
                        {field: 'mealstaamount', title: '金额', type: 'number', precision: 2}
                    ]
                }
            ]
        }
    },
    watch: {
        filterText (val) {
            this.$refs.orgTree.filter(val)
        }
    },
    mounted () {
        this.initFinOrg()
    },
    methods: {
        handelBaseDataDefine (baseDataDefine) {
            this.baseDataDefine = baseDataDefine
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
        },
        /** 初始化 */
        async initFinOrg () {
            try {
                const {data: {rs, rows}} = await this.$http.post('/api/vmclient/org/data/list', {
                    categoryname: 'MD_ORG_FIN',
                    versiontitle: '默认版本'
                })
                if (rs.code === 0) {
                    const orgDatas = XEUtils.toArrayTree(rows, {key: 'code', parentKey: 'parentcode'})
                    this.orgDatas = [{id: 0, code: '', name: '财务组织', children: orgDatas, disabled: true}]
                    if (this.orgDatas.length) {
                        this.$nextTick(() => {
                            this.$refs.orgTree.setCurrentKey(this.orgDatas[0].id)
                            this.handleNodeClick(this.orgDatas[0])
                        })
                    }
                } else {
                    throw new Error(rs.msg)
                }
            } catch (e) {
                this.$Message.error('加载财务组织失败：' + e.message)
                throw new Error(e)
            }
        },
        /** 工具栏 */
        handleModify () {
            this.isEdit = true
        },
        async handleSave () {
            const {contronflag, expensekindcode, selectedOrg} = this
            if (!expensekindcode) {
                this.$Message.info('消费类型不能为空')
                return
            }
            const params = this.$refs.editable.getData()
            if (params && !params.length) {
                // this.$Message.info('请填写差旅标准')
                // return
            }
            const validateParams = []
            for (let i = 0; i < params.length; i++) {
                const param = params[i]
                const index = validateParams.findIndex(({positioncode, citytypecode}) =>
                    positioncode === param.positioncode && citytypecode === param.citytypecode)
                if (index === -1) {
                    validateParams.push(param)
                } else {
                    this.$Message.info(`第${index + 1}行与第${i + 1}行职级、城市分类重复，请修改`)
                    return
                }
                param.unitcode = selectedOrg.code
                param.contronflag = contronflag
                param.expensekindcode = expensekindcode
            }
            for (const param of this.deleteRows) {
                param.deleteFlag = 1
                params.push(param)
            }
            try {
                const {data: {code, msg, data}} = await this.$http.post(travelControlApi.save, params)
                if (code === 0) {
                    if (data.length) {
                        this.contronflag = data[0].contronflag
                    }
                    this.isEdit = false
                    await this.getList()
                    this.$Message.success('保存成功')
                } else {
                    throw new Error(msg)
                }
            } catch (e) {
                this.$Message.error(`保存失败：${e.message}`)
                throw new Error(`保存失败：${e.message}`)
            }
        },
        /** 其他 */
        async handleNodeClick (data) {
            if (this.baseDataDefine && this.baseDataDefine.sharetype === 1) {
                this.baseDataParam = {unitcode: data.code}
            }
            if (data.id === 0) {
                this.isCanEdit = false
                this.expensekindcode = ''
            } else {
                this.isCanEdit = true
            }
            if (this.selectedOrg.id === data.id) {
            } else {
                if (this.isEdit) {
                    this.$Modal.confirm({
                        title: '提示信息',
                        content: '是否保存当前数据？',
                        onOk: async () => {
                            await this.handleSave()
                            this.isEdit = false
                            this.selectedOrg = Object.assign({}, data)
                            await this.getList()
                            if (this.baseDataDefine && this.baseDataDefine.sharetype === 1) {
                                this.expensekindcode = ''
                            }
                        },
                        onCancel: () => {
                            if (this.baseDataDefine && this.baseDataDefine.sharetype === 1) {
                                this.expensekindcode = ''
                            }
                            this.isEdit = false
                            this.selectedOrg = Object.assign({}, data)
                            this.getList()
                        }
                    })
                } else {
                    if (this.baseDataDefine && this.baseDataDefine.sharetype === 1) {
                        this.expensekindcode = ''
                    }
                    this.isEdit = false
                    this.selectedOrg = Object.assign({}, data)
                    this.getList()
                }
            }
        },
        handleBaseDataChange (val) {
            if (this.isEdit && this.expensekindcode) {
                this.$Modal.confirm({
                    title: '提示信息',
                    content: '是否保存当前数据？',
                    onOk: async () => {
                        await this.handleSave()
                        this.isEdit = false
                        this.expensekindcode = val.code
                        this.getList()
                    },
                    onCancel: () => {
                        this.expensekindcode = val.code
                        this.getList()
                    }
                })
            } else {
                if (val && val.code) {
                    this.expensekindcode = val.code
                    this.getList()
                }
            }
        },
        handleOrgChange (val) {
            this.$refs.orgTree.setCurrentKey(val.id)
            this.handleNodeClick(val)
        },
        handleCheckboxChange (val) {
            this.contronflag = val ? 1 : 0
        },
        handleDeleteRow (row) {
            this.deleteRows.push(row)
        },
        handleFieldChnage (row) {
            if (row.staystatype === 1) {
                row['staystaamount_VA_DISABLED'] = true
                row['staystaamount_VA_SHOWTITLE'] = ''
                row['staystaamount'] = null
            } else {
                row['staystaamount_VA_DISABLED'] = false
            }
            if (row.mealstatype === 1) {
                row['mealstaamount_VA_DISABLED'] = true
                row['mealstaamount_VA_SHOWTITLE'] = ''
                row['mealstaamount'] = null
            } else {
                row['mealstaamount_VA_DISABLED'] = false
            }
        },
        async getList () {
            this.deleteRows = []
            const {expensekindcode, selectedOrg} = this
            const params = {unitcode: selectedOrg.code}
            if (expensekindcode) {
                params.expensekindcode = expensekindcode
            }
            try {
                const {data: rst} = await this.$http.post(travelControlApi.query, params)
                const {code, msg} = rst
                if (code === 0) {
                    if (rst.data) {
                        if (rst.data.length) {
                            this.contronflag = rst.data[0].contronflag
                            this.expensekindcode = rst.data[0].expensekindcode
                        }
                        let tableData = []
                        tableData = rst.data.map(item => {
                            this.handleFieldChnage(item)
                            return item
                        })
                        if (!expensekindcode) {
                            tableData = tableData.filter(item => item.expensekindcode === this.expensekindcode)
                        }
                        this.tableData = tableData
                        if ((rst.lock && rst.lock === 1) || selectedOrg.id === 0) {
                            this.isCanEdit = false
                        } else {
                            this.isCanEdit = true
                        }
                    } else {
                        this.tableData = []
                        this.contronflag = 0
                    }
                } else {
                    throw new Error(msg)
                }
            } catch (e) {
                this.$Message.error(`加载组织机构${selectedOrg.code}差旅标准失败：${e.message}`)
                throw new Error(`加载组织机构${selectedOrg.code}差旅标准失败：${e.message}`)
            }
        }
    }
}
</script>
