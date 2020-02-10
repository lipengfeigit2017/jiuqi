<template>
    <div style="height: calc(100% - 32px)" :class="{'va-bill-preview': isBrowse}">
        <FoSyncDataConfigToolbar :state="state"
            :currTreeNode="currTreeNode"
            @dbconfig="showdbconfig"
            @addScheme="addScheme"
            @addDefine="addDefine"
            @edit="edit"
            @save="save"
            @remove="remove"
            @exportmsg="exportmsg">
        </FoSyncDataConfigToolbar>
        <Split v-model="splitsize">
            <div slot="left" class="left-split-pane" style="height:100%;">
                <FoSyncDataConfigTree :refresh="refreshTree" :currNode="currNode"
                    @selectItem="treeNodeChange"
                    @loadItem="loadCurrScheme"
                    @loadSchemeList="loadSchemeList">
                </FoSyncDataConfigTree>
            </div>
            <div slot="right" class="right-split-pane" style="height: 100%;overflow: auto;">
                <div v-if="type==='scheme'" style="margin-top: 10px;">
                    <Form ref="scheme" :label-width="100" :model="scheme" :rules="schemeRule">
                        <FormItem label="标识" style="width: 400px" prop="code">
                            <Input v-model="scheme.code" placeholder="输入标识" :readonly="state!=='add'"  @on-change="changeUppercase(0)"/>
                        </FormItem>
                        <FormItem label="名称" style="width: 400px" prop="name">
                            <Input v-model="scheme.name" placeholder="输入名称" :readonly="state==='browse'"/>
                        </FormItem>
                        <FormItem label="同步方式" style="width: 400px" prop="synctype_str">
                            <RadioGroup v-model="scheme.synctype_str">
                                <Radio label="1" :disabled="true">
                                    <span>中间库</span>
                                </Radio>
                                <Radio label="2" :disabled="state==='browse'">
                                    <span>resful接口</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="同步类型" style="width: 400px" prop="datatype">
                            <RadioGroup v-model="scheme.datatype_str">
                                <Radio label="1" :disabled="state==='browse'">
                                    <span>基础数据</span>
                                </Radio>
                                <Radio label="2" :disabled="state==='browse'">
                                    <span>单据</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="数据来源" style="width: 400px" prop="datasource">
                            <RadioGroup v-model="scheme.datasource_str">
                                <Radio label="1" :disabled="state==='browse'">
                                    <span>推送</span>
                                </Radio>
                                <Radio label="2" :disabled="true">
                                    <span>拉取</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="数据源名称" style="width: 400px" prop="databasecode">
                            <Select v-model="scheme.databasecode" :disabled="state==='browse' || scheme.synctype_str === '2'">
                                <Option v-for="item in dbInfos" :value="item.code" :key="item.id">
                                    {{item.code}}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="接口地址" style="width: 400px" prop="exturl">
                            <Input v-model="scheme.exturl" :readonly="state==='browse' || scheme.synctype_str === '1' || scheme.datasource_str === '1'"/>
                        </FormItem>
                        <FormItem label="备注" style="width: 400px" prop="remark">
                            <Input v-model="scheme.remark" type="textarea" :rows="3" :readonly="state==='browse'"/>
                        </FormItem>
                    </Form>
                </div>
                <div v-if="type==='define'" style="margin-top: 10px;">
                    <Form ref="define" :label-width="160" :model="define" :rules="defineRule">
                        <div style="max-height: 275px; overflow:auto;">
                            <Row>
                                <i-col span="7">
                                    <FormItem :label-width="100" label="标识" prop="code">
                                        <Input v-model="define.code" placeholder="输入标识" :readonly="state!=='add'" @on-change="changeUppercase(1)"/>
                                    </FormItem>
                                </i-col>
                                <i-col span="8">
                                    <FormItem label="名称" prop="name">
                                        <Input v-model="define.name" placeholder="输入名称" :readonly="state==='browse'"/>
                                    </FormItem>
                                </i-col>
                            </Row>
                            <Row>
                                <i-col span="7">
                                    <FormItem :label-width="100" label="数据定义" prop="definecode">
                                        <!-- <Select v-model="define.definecode" :disabled="state==='browse'" :transfer="true" @on-change="val => datadefinechange(val)">
                                            <Option v-for="item in (scheme.datatype === 2 ? billDefines : baseDataDefines)" :value="(scheme.datatype === 2 ? item.uniqueCode : item.name)" :key="item.id">
                                                {{item.name + ' ' + item.title}}
                                            </Option>
                                        </Select> -->
                                        <Dropdown style="width: 100%" placement="bottom-start" trigger="custom"
                                            :visible="state!=='browse' && isShowPanel"
                                            :transfer="true"
                                            @on-clickoutside="handleHidePanel"
                                            @on-click="datadefinechange">
                                            <Input icon="custom iconfont icon_yqyeqiangengduo-shouqi"
                                                :element-id="'input_' + opttime"
                                                :disabled="state==='browse'"
                                                v-model="defineInputValue"
                                                @on-change="defineTxtChange"
                                                @on-focus="showPanel"/>
                                            <DropdownMenu slot="list" :width="300" :id="'droppanel_'+opttime">
                                                <DropdownItem v-for="item in (defineList)"
                                                    :value="(scheme.datatype === 2 ? item.uniqueCode : item.name)" :key="item.id"
                                                    :name="(scheme.datatype === 2 ? item.uniqueCode : item.name)"
                                                >{{item.name + ' ' + item.title}}</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </FormItem>
                                </i-col>
                                <i-col span="8">
                                    <FormItem label="外部定义标识" prop="extdefinecode">
                                        <Input v-model="define.extdefinecode" placeholder="输入外部定义标识" :readonly="state==='browse'"/>
                                    </FormItem>
                                </i-col>
                            </Row>
                            <Row v-for="(table, row) in define.mappingdataobj" :key="row">
                                <i-col span="7">
                                    <FormItem :label-width="100" label="目标表标识">
                                        <Input placeholder="输入标识" :readonly="true" :value="table.tablename"/>
                                    </FormItem>
                                </i-col>
                                <i-col span="8">
                                    <FormItem label="外部表标识"
                                        :prop="'mappingdataobj.' + row + '.exttablename'"
                                        :rules="row === 0 ? {required: true, message: '输入外部表标识', trigger: 'blur'} : null">
                                        <Input v-model="table.exttablename" placeholder="输入外部表标识" :readonly="state==='browse'"/>
                                    </FormItem>
                                </i-col>
                            </Row>
                        </div>
                        <Tabs v-if="define.mappingdataobj.length > 0" :value="define.mappingdataobj[0].tablename">
                            <TabPane :label="table.title + '(' + table.tablename + ')'" :name="table.tablename" v-for="(table, row) in define.mappingdataobj" :key="row">
                                <Button class="ivu-btn-ghost" @click="selectBillTableColumn(table.tablename)" :disabled="state==='browse'">选择字段</Button>
                                <div style="margin-top: 10px">
                                    <elx-editable class="va-heightall" height="350"
                                        :data.sync="define.mappingdataobj.find(item => item.tablename === table.tablename) == null ? [] : define.mappingdataobj.find(item => item.tablename === table.tablename).mapping"
                                        :edit-config="tableConfig" row-key="name" border>
                                        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
                                        <elx-editable-column prop="targetfield" label="同步字段" width="200">
                                            <template slot-scope="scope">
                                                <span>{{(scope.row.fieldtitle?scope.row.fieldtitle:'') + '(' + scope.row.targetfield + ')'}}</span>
                                            </template>
                                        </elx-editable-column>
                                        <elx-editable-column prop="srcfield" label="外部映射字段" :edit-render="state!=='browse'?{name: 'ElInput'}:null"></elx-editable-column>
                                        <elx-editable-column prop="reftable" label="关联表"></elx-editable-column>
                                        <elx-editable-column prop="reffield" label="关联字段" :edit-render="state!=='browse'?{name: 'ElInput'}:null">
                                            <template v-slot:edit="scope">
                                                <el-select v-model="scope.row.reffield" size="mini" clearable
                                                    :disabled="state==='browse' || !scope.row.reftype || scope.row.reftype !== 1"
                                                    @visible-change="val => pulldownactive(val, scope.row)">
                                                    <el-option v-for="item in tableFieldsCache[scope.row.reftable]" :key="item.columnName" :value="item.columnName" :label="item.columnName"></el-option>
                                                </el-select>
                                                <!-- <Select v-model="scope.row.reffield" :disabled="state==='browse'">
                                                    <Option v-for="item in tableFieldsCache[scope.row.reftable]" :value="item.columnName" :key="item.columnName">
                                                        {{item.columnName}}
                                                    </Option>
                                                </Select> -->
                                            </template>
                                        </elx-editable-column>
                                        <elx-editable-column prop="props" label="默认值" :edit-render="state!=='browse'?{name: 'ElInput'}:null"></elx-editable-column>
                                        <elx-editable-column prop="checkval" label="校验有效性" :edit-render="{type: 'visible'}" width="90">
                                            <template v-slot:edit="scope">
                                                <el-switch active-color="#03A4AD" :disabled="state==='browse' || !scope.row.reffield || scope.row.reffield === ''"
                                                    v-model="scope.row.checkval" size="mini">
                                                </el-switch>
                                            </template>
                                        </elx-editable-column>
                                        <elx-editable-column prop="primarykey" label="主键" :edit-render="{type: 'visible'}" width="65">
                                            <template v-slot:edit="scope">
                                                <el-switch active-color="#03A4AD" :disabled="state==='browse'"
                                                    v-model="scope.row.primarykey" size="mini">
                                                </el-switch>
                                            </template>
                                        </elx-editable-column>
                                        <elx-editable-column label="操作" width="60">
                                            <template slot-scope="scope">
                                                <div style="white-space: nowrap; margin:auto -8px;">
                                                    <va-toolbar-item class="va-toolbar" style="margin:auto -8px"
                                                        :disabled="state==='browse' || (table.tablename === define.mappingdataobj[0].tablename
                                                            && ((scheme.datatype === 1 && baseDataDefaultFieldMapping.findIndex(item => item === scope.row.targetfield) !== -1)
                                                            || (scheme.datatype === 2 && billDefaultFieldMapping.findIndex(item => item === scope.row.targetfield) !== -1)))"
                                                        @click="deleteColumnMapping(scope.$index, table.tablename)" title="删除">
                                                    </va-toolbar-item>
                                                </div>
                                            </template>
                                        </elx-editable-column>
                                    </elx-editable>
                                </div>
                            </TabPane>
                        </Tabs>
                    </Form>
                </div>
            </div>
        </Split>

        <div v-if="showdbmgr">
            <Modal v-model="showdbmgr" title="数据源配置" :width="700" :mask-closable="false">
                <FoSyncDataConfigDBMgr></FoSyncDataConfigDBMgr>
            </Modal>
        </div>
        <div v-if="billTableColumnModal">
            <Modal v-model="billTableColumnModal" title="选择字段" width="600" style="height:500px;"
                :mask-closable="false"
                @on-ok="columnSelectConfirm"
                @on-cancel="cancelColumnSelect">
                <Input placeholder="输入关键字查询" search v-model="searchText" style="margin-bottom:10px;"/>
                <el-table :data="tableData" border style="width: 100%;" height="400" highlight-current-row @selection-change="selectchange">
                    <el-table-column type="selection" width="60" align="center" :reserve-selection="true"></el-table-column>
                    <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
                    <el-table-column prop="columnName" label="标识"></el-table-column>
                    <el-table-column prop="columnTitle" label="名称"></el-table-column>
                </el-table>
            </Modal>
        </div>
        <div v-if="showImportMsg">
            <Modal v-model="showImportMsg" title="数据导入报文" :width="500" :mask-closable="false">
                <Input :value="currDefineImportMsg" type="textarea" :rows="12"/>
            </Modal>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import FoSyncDataConfigToolbar from './fo-syncdata-config-toolbar'
import FoSyncDataConfigTree from './fo-syncdata-config-tree'
import FoSyncDataConfigDBMgr from './fo-syncdata-config-dbmgr'
import { syncdataApi } from '../../api/fo'
import { vaBaseDataApi } from '../../api/va'
export default {
    name: 'FoSyncDataConfigMgr',
    components: {
        FoSyncDataConfigToolbar,
        FoSyncDataConfigTree,
        FoSyncDataConfigDBMgr
    },
    data () {
        return {
            splitsize: 0.20,
            // 类型：scheme、define
            type: 'scheme',
            // 状态：add、update、browse
            state: 'browse',
            // 显示数据源管理界面
            showdbmgr: false,
            // 显示字段选择界面
            billTableColumnModal: false,
            // 字段选择界面搜索文本
            searchText: '',
            // 显示报文界面
            showImportMsg: false,
            // 当前定义导入报文
            currDefineImportMsg: '',
            // 表格编辑配置
            tableConfig: {
                showIcon: false,
                showStatus: false
            },
            // 当前表
            currTableName: '',
            // 待选列
            columns: [],
            // 选择列
            selectCols: [],
            // 数据源列表
            dbInfos: [],
            // 当前树节点（前台界面点击节点）
            currTreeNode: {},
            // 当前树节点（后台代码定位节点）
            currNode: {},
            // 刷新左侧树
            refreshTree: false,
            // 基础数据定义列表
            baseDataDefines: [],
            // 单据定义列表
            billDefines: [],
            // 方案列表
            schemelist: [],
            // 系统字段
            systemcolumns: ['ID', 'VER', 'DEFINECODE', 'CREATETIME', 'VALIDTIME', 'INVALIDTIME',
                'RECOVERYFLAG', 'PARENTS'],
            // 基础数据默认映射字段
            baseDataDefaultFieldMapping: ['CODE', 'NAME', 'UNITCODE', 'CREATEUSER'],
            // 单据默认映射字段
            billDefaultFieldMapping: ['BILLDATE', 'UNITCODE', 'CREATEUSER'],
            // 关联表字段缓存
            tableFieldsCache: {},
            // 数据定义列表
            defineList: [],
            // 配置方案
            scheme: {
                id: '',
                code: '',
                name: '',
                // 同步方式（1.中间库；2.接口）
                synctype: 2,
                // 同步方式
                synctype_str: '2',
                // 同步类型（1.基础数据；2.单据）
                datatype: 1,
                // 同步类型
                datatype_str: '1',
                // 数据来源（1.推送；2.拉取）
                datasource: 1,
                // 数据来源
                datasource_str: '1',
                databasecode: '',
                exturl: '',
                remark: '',
                ordernum: 0
            },
            // 配置定义
            define: {
                id: '',
                code: '',
                name: '',
                // 数据定义标识
                definecode: '',
                // 外部定义标识
                extdefinecode: '',
                groupcode: '',
                mappingdata: '',
                mappingdataobj: [],
                ordernum: 0
            },
            // 方案规则
            schemeRule: {
                code: [{
                    required: true,
                    trigger: 'blur',
                    validator: async (rule, value, callback) => {
                        if (this.state !== 'add') {
                            callback()
                        }
                        // 校验必填
                        if (!value) {
                            callback(new Error('输入标识'))
                            return
                        }
                        // 校验有效
                        var preg = /^[A-Z][A-Z0-9_]*$/g
                        if (!preg.test(value)) {
                            callback(new Error('必须以大写字母开头，可包含大写字母、数字、下划线'))
                        }
                        // 校验唯一
                        let scheme = this.schemelist.find(item => item.attributes.param.code === value)
                        if (scheme) {
                            callback(new Error('标识不允许重复'))
                            return
                        }
                        callback()
                    }
                }],
                name: [{
                    required: true,
                    trigger: 'blur',
                    validator: async (rule, value, callback) => {
                        // 校验必填
                        if (!value) {
                            callback(new Error('输入名称'))
                            return
                        }
                        callback()
                    }
                }]
            },
            // 定义规则
            defineRule: {
                code: [{
                    required: true,
                    trigger: 'blur',
                    validator: async (rule, value, callback) => {
                        if (this.state !== 'add') {
                            callback()
                        }
                        // 校验必填
                        if (!value) {
                            callback(new Error('输入标识'))
                            return
                        }
                        // 校验有效
                        var preg = /^[A-Z][A-Z0-9_]*$/g
                        if (!preg.test(value)) {
                            callback(new Error('必须以大写字母开头，可包含大写字母、数字、下划线'))
                        }
                        // 校验唯一
                        for (let i in this.schemelist) {
                            let defines = this.schemelist[i].children
                            if (!defines || defines.length <= 0) {
                                continue
                            }
                            let define = defines.find(item => item.attributes.param.code === value)
                            if (define) {
                                callback(new Error('标识不允许重复'))
                                return
                            }
                        }
                        callback()
                    }
                }],
                name: [{
                    required: true,
                    trigger: 'blur',
                    validator: async (rule, value, callback) => {
                        // 校验必填
                        if (!value) {
                            callback(new Error('输入名称'))
                            return
                        }
                        callback()
                    }
                }],
                definecode: [{
                    required: true,
                    trigger: 'change',
                    validator: async (rule, value, callback) => {
                        // 校验必填
                        if (!value) {
                            callback(new Error('选择数据定义'))
                            return
                        }
                        callback()
                    }
                }],
                extdefinecode: [{
                    required: true,
                    trigger: 'blur',
                    validator: async (rule, value, callback) => {
                        // 校验必填
                        if (!value) {
                            callback(new Error('输入外部定义标识'))
                            return
                        }
                        callback()
                    }
                }]
            },
            // 是否数据定义显示下拉面板
            isShowPanel: false,
            // 数据定义输入值
            defineInputValue: '',
            opttime: 0,
            isBrowse: true
        }
    },
    async mounted () {
        // 加载数据源信息列表
        this.loadDBInfos()
        // 加载基础数据定义列表
        this.loadBaseDataDefineList()
        // 加载单据定义列表
        this.loadBillDefineList()
    },
    computed: {
        tableData () {
            return this.searchText ? this.columns.filter(o => o.columnName.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1 ||
                o.columnTitle.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1) : this.columns
        }
    },
    methods: {
        // 展示数据源配置界面
        showdbconfig () {
            this.showdbmgr = true
        },
        // 展示字段选择界面
        async selectBillTableColumn (tablename) {
            this.currTableName = tablename
            this.columns = []
            const {data: {columns}} = await this.$http.post('/api/vmclient/dataModel/get', {name: tablename})
            for (let i in columns) {
                // 过滤系统字段
                if (this.systemcolumns && this.systemcolumns.length > 0) {
                    let col = this.systemcolumns.find(item => item === columns[i].columnName)
                    if (col) {
                        continue
                    }
                }
                // 过滤已选字段
                let tablemapping = this.define.mappingdataobj.find(item => item.tablename === tablename)
                if (tablemapping && tablemapping.mapping && tablemapping.mapping.length > 0) {
                    let col = tablemapping.mapping.find(item => item.targetfield === columns[i].columnName)
                    if (col) {
                        continue
                    }
                }
                this.columns.push(columns[i])
            }
            this.billTableColumnModal = true
        },
        // 下拉动作
        async pulldownactive (flag, row) {
            if (!flag) {
                return
            }
            // 加载关联表字段
            if (!row || !row.reftable || this.tableFieldsCache[row.reftable]) {
                return
            }
            const {data: {columns}} = await this.$http.post('/api/vmclient/dataModel/get', {name: row.reftable})
            if (!columns || columns.length <= 0) {
                this.tableFieldsCache[row.reftable] = []
                return
            }
            if (this.systemcolumns && this.systemcolumns.length > 0) {
                for (let k in this.systemcolumns) {
                    const index = columns.findIndex(item => item.columnName === this.systemcolumns[k])
                    if (index !== -1) {
                        columns.splice(index, 1)
                    }
                }
            }
            this.$set(this.tableFieldsCache, row.reftable, columns)
            this.tableFieldsCache[row.reftable] = columns
        },
        // 选择数据变化
        selectchange (data) {
            this.selectCols = data
        },
        // 字段选择确认
        async columnSelectConfirm () {
            // 清空搜索字符
            this.searchText = ''
            if (!this.selectCols || this.selectCols.length === 0) {
                return
            }
            let tableMapping = this.define.mappingdataobj.find(item => item.tablename === this.currTableName)
            if (!tableMapping) {
                return
            }
            let fieldMappings = tableMapping.mapping
            if (!fieldMappings) {
                fieldMappings = []
                tableMapping.mapping = fieldMappings
            }
            for (let i in this.selectCols) {
                let fieldMapping = {
                    targetfield: this.selectCols[i].columnName,
                    srcfield: this.selectCols[i].columnName,
                    fieldtitle: this.selectCols[i].columnTitle,
                    reftype: this.selectCols[i].mappingType
                }
                if (this.selectCols[i].mapping && this.selectCols[i].mapping.split('.').length > 1) {
                    fieldMapping.reftable = this.selectCols[i].mapping.split('.')[0]
                    fieldMapping.reffield = this.selectCols[i].mapping.split('.')[1]
                }
                if (this.currTableName === this.define.mappingdataobj[0].tablename) {
                    if (this.scheme.datatype === 1) {
                        // 设置CODE为主键
                        if (this.selectCols[i].columnName === 'CODE') {
                            fieldMapping.primarykey = true
                        }
                        // 设置隔离维度字段为主键
                        let define = this.baseDataDefines.find(item => item.name === this.currTableName)
                        if (define && define.sharefieldname && define.sharefieldname !== '') {
                            const sharefields = define.sharefieldname.split(',')
                            if (sharefields && sharefields.length > 0 && sharefields.findIndex(item => item === fieldMapping.targetfield) !== -1) {
                                fieldMapping.primarykey = true
                            }
                        }
                    } else if (this.scheme.datatype === 2) {
                        // 设置BILLCODE为主键
                        // 单据同步时自行设置主键
                        // if (this.selectCols[i].columnName === 'BILLCODE') {
                        //     fieldMapping.primarykey = true
                        // }
                    }
                }
                fieldMappings.push(fieldMapping)
            }
            // 清除选择字段
            this.selectCols = []
        },
        // 取消字段选择
        cancelColumnSelect () {
            // 清除选择字段
            this.selectCols = []
            // 清空搜索字符
            this.searchText = ''
        },
        // 删除字段映射
        deleteColumnMapping (index, tablename) {
            this.$Modal.confirm({
                title: '提示信息',
                content: '<p>确定要删除当前字段吗？</p>',
                onOk: () => {
                    let tableMapping = this.define.mappingdataobj.find(item => item.tablename === tablename)
                    if (!tableMapping) {
                        return
                    }
                    let fieldMapping = tableMapping.mapping

                    if (!fieldMapping || fieldMapping.length < index + 1) {
                        return
                    }
                    fieldMapping.splice(index, 1)
                }
            })
        },
        // 加载数据源信息列表
        async loadDBInfos () {
            try {
                const {data: {rs, rows}} = await this.$http.post(syncdataApi.syncdatadbconnect + '/list', {})
                if (rs.code === 0) {
                    this.dbInfos = rows
                } else {
                    throw new Error(rs.code)
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        // 加载基础数据定义列表
        async loadBaseDataDefineList () {
            try {
                const {data: {rs, rows}} = await this.$http.post(vaBaseDataApi.basedata + 'Define/list', {})
                if (rs.code === 0) {
                    this.baseDataDefines = rows
                } else {
                    throw new Error(rs.msg)
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        // 加载单据定义列表
        async loadBillDefineList () {
            try {
                const {data: {metaInfos}} = await this.$http.post('/api/vbserver/biz/meta/infos/get', {
                    module: 'CFAS',
                    metaType: 'bill',
                    pagination: false,
                    operateType: 'EXECUTE'
                })
                this.billDefines = metaInfos
            } catch (e) {
                throw new Error(e)
            }
        },
        // 加载方案列表
        loadSchemeList (data) {
            this.schemelist = data
        },
        // 缓存关联表字段
        async cacheRefTableFields () {
            this.tableFieldsCache = {}
            if (!this.define.mappingdataobj || this.define.mappingdataobj.length <= 0) {
                return
            }
            for (let i in this.define.mappingdataobj) {
                let fieldMappings = this.define.mappingdataobj[i].mapping
                if (!fieldMappings || fieldMappings.length <= 0) {
                    continue
                }
                for (let j in fieldMappings) {
                    if (!fieldMappings[j].reftype || fieldMappings[j].reftype !== 1) {
                        continue
                    }
                    let refTable = fieldMappings[j].reftable
                    if (!refTable || refTable === '' || this.tableFieldsCache[refTable]) {
                        continue
                    }
                    const {data: {columns}} = await this.$http.post('/api/vmclient/dataModel/get', {name: refTable})
                    if (!columns || columns.length <= 0) {
                        continue
                    }
                    if (this.systemcolumns && this.systemcolumns.length > 0) {
                        for (let k in this.systemcolumns) {
                            const index = columns.findIndex(item => item.columnName === this.systemcolumns[k])
                            if (index !== -1) {
                                columns.splice(index, 1)
                            }
                        }
                    }
                    this.tableFieldsCache[refTable] = columns
                }
            }
        },
        // 加载当前方案配置数据
        loadCurrScheme (scheme) {
            if (scheme) {
                this.scheme.id = scheme.id
                this.scheme.code = scheme.code
                this.scheme.name = scheme.name
                this.scheme.synctype = scheme.synctype
                if (this.scheme.synctype === 1) {
                    this.scheme.synctype_str = '1'
                } else if (this.scheme.synctype === 2) {
                    this.scheme.synctype_str = '2'
                }
                this.scheme.datatype = scheme.datatype
                if (this.scheme.datatype === 1) {
                    this.scheme.datatype_str = '1'
                } else if (this.scheme.datatype === 2) {
                    this.scheme.datatype_str = '2'
                }
                this.scheme.datasource = scheme.datasource
                if (this.scheme.datasource === 1) {
                    this.scheme.datasource_str = '1'
                } else if (this.scheme.datasource === 2) {
                    this.scheme.datasource_str = '2'
                }
                this.scheme.exturl = scheme.exturl
                this.scheme.remark = scheme.remark
                this.scheme.ordernum = scheme.ordernum
            } else {
                // 清空当前配置
                for (let key in this.scheme) {
                    this.scheme[key] = ''
                }
            }
        },
        // 加载当前定义配置数据
        async loadCurrDefine (define) {
            if (define) {
                // 先加载方案
                let scheme = this.schemelist.find(item => item.attributes.param.code === define.groupcode)
                this.loadCurrScheme(scheme.attributes.param)
                this.define.id = define.id
                this.define.code = define.code
                this.define.name = define.name
                this.define.definecode = define.definecode
                this.define.extdefinecode = define.extdefinecode
                this.define.groupcode = define.groupcode
                this.define.mappingdataobj = JSON.parse(define.mappingdata)
                this.define.ordernum = define.ordernum
                this.defineInputValue = this.define.definecode
                if (this.scheme.datatype === 1) {
                    this.defineList = this.baseDataDefines
                } else if (this.scheme.datatype === 2) {
                    this.defineList = this.billDefines
                }
            } else {
                // 清空当前配置
                for (let key in this.define) {
                    this.define[key] = ''
                }
            }
        },
        // 树节点选中
        treeNodeChange (data) {
            // 选中节点为当前节点时不处理
            if (data && data.attributes && this.currTreeNode && this.currTreeNode.attributes &&
                this.currTreeNode.attributes.param.code === data.attributes.param.code &&
                this.currTreeNode.attributes.type === data.attributes.type) {
                return
            }
            // 关闭下拉界面
            if (this.isShowPanel) {
                this.isShowPanel = false
            }
            if (this.state === 'add' || this.state === 'update') {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>是否保存当前信息？</p>',
                    onOk: () => {
                        this.save(data)
                    },
                    onCancel: () => {
                        this.loadSelectItem(data)
                    }
                })
            } else {
                this.loadSelectItem(data)
            }
        },
        // 加载选中项
        loadSelectItem (data) {
            this.currTreeNode = data
            if (this.currTreeNode && this.currTreeNode.id === 'root') {
                this.type = 'scheme'
                this.state = 'browse'
                this.isBrowse = true
                this.loadCurrScheme(null)
                this.loadCurrDefine(null)
                return
            }
            if (this.currTreeNode && this.currTreeNode.attributes && this.currTreeNode.attributes.param) {
                this.type = this.currTreeNode.attributes.type
                if (this.type === 'scheme') {
                    this.loadCurrScheme(this.currTreeNode.attributes.param)
                } else if (this.type === 'define') {
                    this.loadCurrDefine(this.currTreeNode.attributes.param)
                }
            } else {
                this.type = 'scheme'
                this.loadCurrScheme(null)
                this.loadCurrDefine(null)
            }
            this.state = 'browse'
            this.isBrowse = true
        },
        // 显示数据定义下拉面板
        showPanel () {
            this.isShowPanel = true
            this.opttime = new Date().getTime()
            this.$nextTick(() => {
                let inputWidth = $('#input_' + this.opttime).css('width').replace('px', '')
                let panelWidth = parseInt(inputWidth)

                if (panelWidth < 300) {
                    panelWidth = 300
                }

                $('#droppanel_' + this.opttime).css('min-width', '300px')
                $('#droppanel_' + this.opttime).parent().css('width', panelWidth + 'px')
            })
        },
        // 下拉面板关闭
        handleHidePanel () {
            this.isShowPanel = false
            this.defineInputValue = this.define.definecode
        },
        // 数据定义文本变化
        defineTxtChange () {
            this.isShowPanel = true
            this.opttime = new Date().getTime()
            this.$nextTick(() => {
                let inputWidth = $('#input_' + this.opttime).css('width').replace('px', '')
                let panelWidth = parseInt(inputWidth)

                if (panelWidth < 300) {
                    panelWidth = 300
                }

                $('#droppanel_' + this.opttime).css('min-width', '300px')
                $('#droppanel_' + this.opttime).parent().css('width', panelWidth + 'px')
            })
            if (this.scheme.datatype === 1) {
                // 过滤基础数据列表
                if (this.defineInputValue && this.defineInputValue !== '') {
                    this.defineList = this.baseDataDefines.filter(item => item.name.toLowerCase().match(new RegExp(this.defineInputValue.toLowerCase())) ||
                        item.title.toLowerCase().match(new RegExp(this.defineInputValue.toLowerCase())))
                } else {
                    this.defineList = this.baseDataDefines
                }
            } else if (this.scheme.datatype === 2) {
                // 过滤单据定义列表
                if (this.defineInputValue && this.defineInputValue !== '') {
                    this.defineList = this.billDefines.filter(item => item.name.toLowerCase().match(new RegExp(this.defineInputValue.toLowerCase())) ||
                        item.title.toLowerCase().match(new RegExp(this.defineInputValue.toLowerCase())))
                } else {
                    this.defineList = this.billDefines
                }
            }
        },
        // 选择数据定义
        async datadefinechange (definename) {
            this.isShowPanel = false
            this.define.mappingdataobj = []
            this.define.extdefinecode = definename
            this.define.definecode = definename
            this.defineInputValue = this.define.extdefinecode
            if (this.scheme.datatype === 1) {
                // 加载基础数据主子表
                let define = this.baseDataDefines.find(item => item.name === definename)
                this.define.mappingdataobj.push({tablename: definename, title: define.title, exttablename: definename})
                // 加载默认字段映射
                const {data: {columns}} = await this.$http.post('/api/vmclient/dataModel/get', {name: definename})
                if (!columns || columns.length <= 0) {
                    return
                }
                for (let i in columns) {
                    let index = this.baseDataDefaultFieldMapping.findIndex(item => item === columns[i].columnName)
                    if (index !== -1) {
                        this.selectCols.push(columns[i])
                    }
                }
                this.currTableName = definename
                this.columnSelectConfirm()
                this.currTableName = null
            } else if (this.scheme.datatype === 2) {
                // 加载单据主子表
                const billDefine = this.billDefines.find(define => define.uniqueCode === definename)
                const {data} = await this.$http.get('/api/vbserver/biz/meta/datas/' + billDefine.id)
                if (data && data.plugins && data.plugins.length > 0) {
                    let tables = []
                    for (let i in data.plugins) {
                        if (data.plugins[i].type === 'data') {
                            tables = data.plugins[i].tables
                            break
                        }
                    }
                    if (tables && tables.length > 0) {
                        if (!this.define.mappingdataobj) {
                            this.define.mappingdataobj = []
                        }
                        for (let i in tables) {
                            this.define.mappingdataobj.push({tablename: tables[i].name, title: tables[i].title, exttablename: tables[i].name})
                            if (i !== '0') {
                                continue
                            }
                            // 加载默认字段映射
                            const {data: {columns}} = await this.$http.post('/api/vmclient/dataModel/get', {name: tables[i].name})
                            if (!columns || columns.length <= 0) {
                                continue
                            }
                            for (let i in columns) {
                                let index = this.billDefaultFieldMapping.findIndex(item => item === columns[i].columnName)
                                if (index !== -1) {
                                    this.selectCols.push(columns[i])
                                }
                            }
                            this.currTableName = tables[i].name
                            this.columnSelectConfirm()
                            this.currTableName = null
                        }
                    }
                }
            }
            if (this.scheme.datatype === 1) {
                this.defineList = this.baseDataDefines
            } else if (this.scheme.datatype === 2) {
                this.defineList = this.billDefines
            }
        },
        // 新建方案
        addScheme () {
            this.state = 'add'
            this.isBrowse = false
            this.type = 'scheme'
            // 清空当前配置
            for (let key in this.scheme) {
                this.scheme[key] = ''
            }
            this.scheme.synctype = 2
            this.scheme.synctype_str = '2'
            this.scheme.datatype = 1
            this.scheme.datatype_str = '1'
            this.scheme.datasource = 1
            this.scheme.datasource_str = '1'
        },
        // 新建定义
        addDefine () {
            this.state = 'add'
            this.type = 'define'
            this.isBrowse = false
            // 清空当前配置
            this.defineInputValue = ''
            for (let key in this.define) {
                this.define[key] = ''
            }
            this.define.groupcode = this.scheme.code
            if (this.scheme.datatype === 1) {
                this.defineList = this.baseDataDefines
            } else if (this.scheme.datatype === 2) {
                this.defineList = this.billDefines
            }
        },
        // 编辑
        edit () {
            this.state = 'update'
            this.isBrowse = false
            if (this.type === 'define') {
                this.cacheRefTableFields()
            }
        },
        // 校验
        validate (val) {
            return val
        },
        // 保存
        async save (currdata) {
            this.$refs[this.type].validate(async (valid) => {
                if (valid) {
                    try {
                        if (this.type === 'scheme') {
                            this.handleCurrSchemeValue()
                            const {data: {code, msg}} = await this.$http.post(syncdataApi.syncdatascheme + '/' + this.state, this.scheme)
                            if (code === 0) {
                                this.state = 'browse'
                                this.isBrowse = true
                                this.refreshTree = !this.refreshTree
                                if (currdata && currdata.id) {
                                    this.currNode = currdata
                                } else {
                                    this.currNode = {id: 'scheme###' + this.scheme.code, attributes: {type: 'scheme', param: this.scheme}}
                                }
                            } else {
                                throw new Error(msg)
                            }
                        } else if (this.type === 'define') {
                            this.handleCurrDefineValue()
                            const {data: {code, msg}} = await this.$http.post(syncdataApi.syncdatadefine + '/' + this.state, this.define)
                            if (code === 0) {
                                this.state = 'browse'
                                this.isBrowse = true
                                this.refreshTree = !this.refreshTree
                                if (currdata && currdata.id) {
                                    this.currNode = currdata
                                } else {
                                    this.currNode = {id: 'define###' + this.define.code, attributes: {type: 'define', param: this.define}}
                                }
                            } else {
                                throw new Error(msg)
                            }
                        }
                    } catch (e) {
                        throw new Error(e)
                    }
                }
            })
        },
        // 处理当前方案的字段值
        handleCurrSchemeValue () {
            if (this.scheme.synctype_str && this.scheme.synctype_str === '1') {
                this.scheme.synctype = 1
            } else if (this.scheme.synctype_str && this.scheme.synctype_str === '2') {
                this.scheme.synctype = 2
            }
            if (this.scheme.datatype_str && this.scheme.datatype_str === '1') {
                this.scheme.datatype = 1
            } else if (this.scheme.datatype_str && this.scheme.datatype_str === '2') {
                this.scheme.datatype = 2
            }
            if (this.scheme.datasource_str && this.scheme.datasource_str === '1') {
                this.scheme.datasource = 1
            } else if (this.scheme.datasource_str && this.scheme.datasource_str === '2') {
                this.scheme.datasource = 2
            }
        },
        // 处理当前定义的字段值
        handleCurrDefineValue () {
            this.define.mappingdata = JSON.stringify(this.define.mappingdataobj)
        },
        // 删除
        async remove () {
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确定要删除当前' + (this.type === 'scheme' ? '方案' : '定义') + '吗？</p>',
                onOk: async () => {
                    try {
                        if (this.type === 'scheme') {
                            const {data: {code, msg}} = await this.$http.post(syncdataApi.syncdatascheme + '/delete', this.scheme)
                            if (code === 0) {
                                this.state = 'browse'
                                this.isBrowse = true
                                this.refreshTree = !this.refreshTree
                            } else {
                                throw new Error(msg)
                            }
                        } else if (this.type === 'define') {
                            const {data: {code, msg}} = await this.$http.post(syncdataApi.syncdatadefine + '/delete', this.define)
                            if (code === 0) {
                                this.state = 'browse'
                                this.isBrowse = true
                                this.refreshTree = !this.refreshTree
                            } else {
                                throw new Error(msg)
                            }
                        }
                    } catch (e) {
                        throw new Error(e)
                    }
                }
            })
        },
        // 导出报文
        exportmsg () {
            this.currDefineImportMsg = ''
            this.showImportMsg = true
            const importMsg = {
                token: '',
                type: this.scheme.datatype === 1 ? 'basedata' : 'billdata',
                definecode: this.define.extdefinecode
            }
            if (this.scheme.datatype === 1) {
                this.setBaseDataMsg(importMsg)
            } else {
                this.setBillDataMsg(importMsg)
            }
            this.currDefineImportMsg = JSON.stringify(importMsg, null, 4)
        },
        // 设置基础数据导入报文
        setBaseDataMsg (msg) {
            msg.data = []
            if (this.define.mappingdataobj && this.define.mappingdataobj.length > 0) {
                let data = {}
                for (let i in this.define.mappingdataobj[0].mapping) {
                    if (this.define.mappingdataobj[0].mapping[i].srcfield && this.define.mappingdataobj[0].mapping[i].srcfield !== '') {
                        data[this.define.mappingdataobj[0].mapping[i].srcfield] = ''
                    }
                }
                msg.data.push(data)
            }
        },
        // 设置单据导入报文
        setBillDataMsg (msg) {
            msg.data = []
            if (this.define.mappingdataobj && this.define.mappingdataobj.length > 0) {
                let param = {}
                for (let i in this.define.mappingdataobj) {
                    let tableMapping = this.define.mappingdataobj[i]
                    let data = {}
                    if (tableMapping.mapping && tableMapping.mapping.length > 0) {
                        for (let j in tableMapping.mapping) {
                            if (tableMapping.mapping[j].srcfield && tableMapping.mapping[j].srcfield !== '') {
                                data[tableMapping.mapping[j].srcfield] = ''
                            }
                        }
                    }
                    if (tableMapping.exttablename && tableMapping.exttablename !== '') {
                        if (i === '0') {
                            param[tableMapping.exttablename] = data
                        } else {
                            param[tableMapping.exttablename] = [data]
                        }
                    }
                }
                msg.data.push(param)
            }
        },
        changeUppercase (flag) {
            if (flag === 0) {
                this.scheme.code = this.scheme.code.toUpperCase()
            } else if (flag === 1) {
                this.define.code = this.define.code.toUpperCase()
            }
        }
    },
    created () {

    }
}
</script>

<style lang="less" scoped>
    .left-split-pane {
        padding: 10px;
    }
    .right-split-pane {
        padding: 10px 10px 10px 15px;
    }
    .ivu-radio-group-item {
        width: 100px
    }
</style>
