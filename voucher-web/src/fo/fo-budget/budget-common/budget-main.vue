<template>
    <div class="cfas-budget-content">
        <BudToolbar
            :workflowstate="workflowstate"
            :isEdit="isEdit"
            :dataStopFlag="dataStopFlag"
            :ExistGridDate="ExistGridDate"
            :ExistGridEditData="ExistGridEditData"
            @saveData="saveData"
            @submitData="submitData"
            @exportTmpl="exportTmpl"
            @importData="importData"
            @exportData="exportData"
            @closeWin="closeWin"
            @editState="editState"
            @openBudProcess="openBudProcess"
        ></BudToolbar>

        <div style="height: 42px;">
            <bud-dim
            ref="buddim"
            :budtype="budtype"
            :treenode="treenode"
            :buddim="buddim"
            @changeDim="changeDim"
            @reloadData="loadData"
            />
        </div>

        <Split v-model="split1" id="bud-split">
            <div slot="left" class="demo-split-pane">
                <GroupTree ref="groupTree" @handleGroupTreeClick="handleGroupTreeClick" :organizationdata="organizationdata" :categoryname="categoryname" :versiontitle="versiontitle" :treenode="treenode"></GroupTree>
            </div>
            <div slot="right" class="demo-split-pane">
                <BudExcelInput
                :dataStopFlag="dataStopFlag"
                :workflowstate="workflowstate"
                :deptGridData="deptGridData"
                ref="gridList"
                @setExistGridEditData="setExistGridEditData"></BudExcelInput>
            </div>
        </Split>

        <div class="budState">
            <bud-state :budtype="budtype" :workflowstate="workflowstate" :treenode="treenode" :deptnode="deptnode" :prjnode="prjnode"/>
        </div>
        <div style="display: none;">
            <a id="downloadFile" target='_self'><span>download</span></a>
        </div>
        <input
            id='imFile'
            ref="importInput"
            v-if="importInputShowFlag"
            type='file'
            @change='importFile(this)'
            style='display: none'
            accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
        />
    </div>
</template>

<script>

// import XLSX from 'xlsx'
import $ from 'jquery'
import XEUtils from 'xe-utils'
import BudToolbar from '../budget-common/budget-toolbar'
import BudExcelInput from '../budget-common/budget-excelinput'
import GroupTree from '../budget-common/budget-group-tree'
import BudState from '../budget-common/budget-state'
import BudDim from '../budget-common/budget-dim'
import workflowModal from './budget-workflow-modal'

import { vaLoginApi, vaOrganizationApi, vaBaseDataApi, budgetApi } from '../../../api/va'
import { cfasTodoApi } from '../../../api/cfas'
// import {saveAs} from '../budget-common/myexport'
import { budtypes, budDataTable, budBalanceTable, fileName, budSubjectFieldNames } from '../budget-common/const'
import { formatDate } from '@/utils'

export default {
    name: 'BudMain',
    props: {
        budtype: String // 预算类型
    },
    data () {
        return {
            // importUrl: '',
            // importParam: {},
            // importHead: {},
            importInputShowFlag: true,

            budapi: budgetApi.input, // 预算编制统一api
            budDataTable: '', // 预算数据表
            budBalanceTable: '', // 预算余额表
            fileName: '', // 导出文件名称
            split1: 0.20, // 主界面分栏比例

            workflowstate: '-', // 流程状态
            bizcode: null, // 流程记录对应的bizcode
            processData: null, // 审批流程记录

            currentLoginUnitCode: null, // 当前登录组织
            organizationdata: [], // 组织机构树
            // departmentList: [], // 部门列表 取得部门title用
            budBalanceMap: new Map(), // 预算余额map，保存校验使用
            deptGridData: [], // 表格数据
            ExistGridEditData: false,
            categoryname: 'MD_ORG_FIN', // 组织机构类型（金融组织）
            versiontitle: '默认版本', // 组织机构版本
            treenode: {}, // 当前组织机构树节点
            deptnode: {}, // 当前部门
            prjnode: {}, // 当前项目节点
            isShow: true,
            isEdit: false,
            buddim: { // 预算维度
                budcycle: 'N', // 预算周期
                budyear: formatDate(new Date(), 'yyyy'), // 预算年度
                cycleitem: '1', // 预算周期子项，当预算周期为年时，默认为1
                deptcode: null, // 部门
                prjcode: null, // 项目
                unitcode: null // 组织机构
            },
            // <---导入处理参数---
            fullscreenLoading: false, // 加载中
            imFile: '', // 导入文件el
            errorMsg: '', // 错误信息内容
            keyMap: { // 表格name 与 title 映射
                'budsubjectcode': '科目编码',
                'budsubjectname': '科目名称',
                'beginmoney': '期初预算金额',
                'curtotalmoney': '本期累计调整',
                'endmoney': '期末预算金额',
                'memo': '备注'
            }
            // ---导入处理参数--->
        }
    },
    components: {
        BudToolbar,
        BudExcelInput,
        GroupTree,
        BudState,
        BudDim
    },
    computed: {
        ExistGridDate () {
            if (this.deptGridData && this.deptGridData.length > 0) {
                return this.checkExistBudData(this.deptGridData)
            } else {
                return false
            }
        },
        dataStopFlag () {
            if (this.treenode && this.treenode.stopflag && this.treenode.stopflag === 1) {
                return true
            }

            if (this.budtype === budtypes.department) {
                if (this.deptnode && this.deptnode.stopflag && this.deptnode.stopflag === 1) {
                    return true
                }
            } else if (this.budtype === budtypes.project) {
                if (this.prjnode && this.prjnode.stopflag && this.prjnode.stopflag === 1) {
                    return true
                }
            }

            return false
        }
    },
    async mounted () {
        await this.initMainParam()
        this.imFile = document.getElementById('imFile')
        await this.initLoginUnitCode()
        this.$nextTick(async () => {
            await this.loadOrgTree(this.categoryname, this.versiontitle)
        })

        this.winResize()

        let _this = this
        window.addEventListener('resize', function () {
            _this.winResize()
        })
    },
    methods: {
        // 检测是否存在预算预算数据，无数据禁止提交或保存
        checkExistBudData (list) {
            if (!list || list.length === 0) {
                return false
            }
            for (let item of list) {
                if (item['beginmoney'] !== null || item['curtotalmoney'] !== null ||
                item['endmoney'] !== null || item['memo'] !== null) {
                    return true
                }
                let res = this.checkExistBudData(item.children)
                if (res) {
                    return true
                }
            }
            return false
        },
        // 标记存在编辑数据
        setExistGridEditData (flag) {
            this.ExistGridEditData = flag
        },
        // 根据预算类型，初始化全局主参数
        initMainParam () {
            if (this.budtype === budtypes.department) {
                this.budDataTable = budDataTable.department
                this.budBalanceTable = budBalanceTable.department
                this.fileName = fileName.department
            } else if (this.budtype === budtypes.organization) {
                this.budDataTable = budDataTable.organization
                this.budBalanceTable = budBalanceTable.organization
                this.fileName = fileName.organization
            } else if (this.budtype === budtypes.project) {
                this.budDataTable = budDataTable.project
                this.budBalanceTable = budBalanceTable.project
                this.fileName = fileName.project
            }
        },
        // 获取审批工作流
        async getProcess () {
            if (!this.bizcode) {
                this.processData = null
                return
            }
            try {
                let param = {
                    extInfo: {
                        bizcode: this.bizcode
                    }
                }
                const {data} = await this.$http.post(cfasTodoApi.process, param)
                this.processData = data
            } catch (e) {
                this.$Message.error('获取流程失败')
            }
        },
        // 加载登录组织机构code
        async initLoginUnitCode () {
            try {
                const {data: {code, msg, loginUnit}} = await this.$http.get(vaLoginApi.getLoginUnit, {})
                if (code === 0) {
                    this.currentLoginUnitCode = loginUnit
                } else {
                    this.$Message.error('获取登录组织机构失败：' + msg)
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        checkEditData (newNode) {
            let editData = this.$refs.gridList.getEditData()
            if (editData && editData.length > 0) {
                this.$Modal.confirm({
                    title: '提示信息',
                    content: '检测到未保存的数据，是否放弃这些数据?',
                    onOk: async () => {
                        this.$refs.groupTree.setCurrentNodeByKey(newNode.id)
                        this.getNodeClick(newNode)
                    },
                    onCancel: () => {
                    }
                })
            } else {
                this.getNodeClick(newNode)
            }
        },
        handleGroupTreeClick (node) {
            this.checkEditData(node)
        },
        // 左侧组织机构树节点点击事件
        async getNodeClick (node) {
            if (!node || node.id === '-') {
                return
            }
            try {
                let stopflag = node.attributes ? node.attributes.stopflag : null
                let param = {
                    code: node.id,
                    stopflag: stopflag,
                    categoryname: this.categoryname,
                    versiontitle: this.versiontitle
                }
                const {data: {rs, rows}} = await this.$http.post(vaOrganizationApi.organization + '/list', param)
                if (rs.code === 0) {
                    this.treenode = rows[0]
                    this.buddim.unitcode = this.treenode.code
                    await this.loadDepartmentList()
                    await this.loadProjectList()
                    await this.loadData()
                } else {
                    throw new Error(rs.msg)
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        // 加载组织机构树
        async loadOrgTree (categoryname, versiontitle) {
            try {
                let param = {
                    categoryname: categoryname,
                    versiontitle: versiontitle,
                    stopflag: -1
                }
                const {data: {rs, rows}} = await this.$http.post(vaOrganizationApi.organization + '/tree', param)
                if (rs.code === 0) {
                    this.organizationdata = rows
                    let initorg = this.findOrgNodeById(rows, this.currentLoginUnitCode)
                    this.getNodeClick(initorg)
                } else {
                    this.$Message.warning(rs.code)
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        // 根据节点id寻找组织机构节点
        findOrgNodeById (tree, id) {
            if (!tree || !id) {
                return null
            }
            for (let org of tree) {
                if (org.id && org.id === id) {
                    return org
                } else {
                    if (org.hasChildren) {
                        let subres = this.findOrgNodeById(org.children, id)
                        if (subres) {
                            return subres
                        }
                    }
                }
            }
            return null
        },
        // 设置部门默认选中节点
        async loadDepartmentList () {
            if (this.budtype !== budtypes.department) {
                return
            }
            this.deptnode = {}
            try {
                let param = {
                    tableName: 'MD_DEPARTMENT',
                    unitcode: this.buddim.unitcode
                }
                const {data: {rs, rows}} = await this.$http.post(vaBaseDataApi.basedata + '/list', param)
                if (rs) {
                    if (rs.code === 0) {
                        if (rows && rows.length > 0) {
                            this.deptnode = rows[0]
                        }
                        this.buddim.deptcode = this.deptnode.code
                    } else {
                        this.$Message.warning(rs.msg)
                    }
                } else {
                    this.$Message.error('错误码：抱歉！遇到点小问题，请稍后再试')
                    throw new Error('基础数据接口异常')
                }
            } catch (e) {
                throw new Error(e)
            }
        },

        // 加载当前的部门节点
        async loadCurrentDepartment () {
            if (this.budtype !== budtypes.department) {
                return
            }
            try {
                let param = {
                    tableName: 'MD_DEPARTMENT',
                    unitcode: this.buddim.unitcode,
                    code: this.buddim.deptcode
                }
                const {data: {rs, rows}} = await this.$http.post(vaBaseDataApi.basedata + '/list', param)
                if (rs) {
                    if (rs.code === 0) {
                        if (rows && rows.length > 0) {
                            this.deptnode = rows[0]
                        }
                    } else {
                        this.$Message.warning(rs.msg)
                    }
                } else {
                    this.$Message.error('错误码：抱歉！遇到点小问题，请稍后再试')
                    throw new Error('基础数据接口异常')
                }
            } catch (e) {
                throw new Error(e)
            }
        },

        // 设置项目默认选中节点
        async loadProjectList () {
            if (this.budtype !== budtypes.project) {
                return
            }
            this.prjnode = {}
            try {
                let param = {
                    tableName: 'MD_PROJECT',
                    unitcode: this.buddim.unitcode
                }
                const {data: {rs, rows}} = await this.$http.post(vaBaseDataApi.basedata + '/list', param)
                if (rs) {
                    if (rs.code === 0) {
                        if (rows && rows.length > 0) {
                            this.prjnode = rows[0]
                        }
                        this.buddim.prjcode = this.prjnode.code
                    } else {
                        this.$Message.warning(rs.msg)
                    }
                } else {
                    this.$Message.warning('错误码：抱歉！遇到点小问题，请稍后再试')
                    throw new Error('基础数据接口异常')
                }
            } catch (e) {
                throw new Error(e)
            }
        },

        // 获取当前项目详细数据
        async loadCurrentProject () {
            if (this.budtype !== budtypes.project) {
                return
            }
            this.prjnode = {}
            try {
                let param = {
                    tableName: 'MD_PROJECT',
                    unitcode: this.buddim.unitcode,
                    code: this.buddim.prjcode
                }
                const {data: {rs, rows}} = await this.$http.post(vaBaseDataApi.basedata + '/list', param)
                if (rs) {
                    if (rs.code === 0) {
                        if (rows && rows.length > 0) {
                            this.prjnode = rows[0]
                        }
                    } else {
                        this.$Message.warning(rs.msg)
                    }
                } else {
                    this.$Message.error('错误码：抱歉！遇到点小问题，请稍后再试')
                    throw new Error('基础数据接口异常')
                }
            } catch (e) {
                throw new Error(e)
            }
        },

        getDimParam () {
            let param = {}
            param.tablename = this.budDataTable
            param.budcycle = this.buddim.budcycle
            param.budyear = formatDate(this.buddim.budyear, 'yyyy')
            param.cycleitem = this.buddim.cycleitem
            param.deptcode = this.buddim.deptcode
            param.prjcode = this.buddim.prjcode
            param.unitcode = this.buddim.unitcode
            if (param.budcycle === 'N') {
                param.cycleitem = 1
            } else if (param.budcycle === 'Y') {
                param.cycleitem = formatDate(this.buddim.budyear, 'MM')
            }
            return param
        },
        // 加载预算数据
        async loadData () {
            this.ExistGridEditData = false
            if (!this.checkDim()) {
                this.deptGridData = null
                this.workflowstate = ''
                return false
            }
            try {
                let param = this.getDimParam()
                const {data: {rs, data}} = await this.$http.post(this.budapi + '/list', param)
                if (rs.code === 0) {
                    this.deptGridData = await XEUtils.toArrayTree(data, {key: 'budsubjectcode', parentKey: 'parentname'})
                    // this.$refs.gridList.expandTable()
                    this.$refs.gridList.setCellEditFlag(false)
                    this.loadState()
                } else {
                    throw new Error(rs.code)
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        // 调整已提交预算
        async editState () {
            try {
                let param = this.getDimParam()
                const {data: {code, msg}} = await this.$http.post(this.budapi + '/editState', param)
                if (code === 0) {
                    this.loadData()
                } else {
                    throw new Error(msg)
                }
            } catch (e) {
                throw new Error(e)
            }
        },

        // 加载预算提交状态
        async getBizcode () {
            try {
                let param = this.getDimParam()
                const {data: {code, bizcode}} = await this.$http.post(this.budapi + '/getBizcode', param)
                if (code === 0) {
                    this.bizcode = bizcode
                } else {
                    this.bizcode = null
                    throw new Error('bizcode接口异常')
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        // 加载预算提交状态
        async loadState () {
            try {
                let param = this.getDimParam()
                const {data: {code, state}} = await this.$http.post(this.budapi + '/getstate', param)
                if (code === 0) {
                    this.workflowstate = state
                } else {
                    throw new Error('预算状态接口异常')
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        changeDim (val) {
            this.loadData()
            if (val === 'deptcode') {
                this.loadCurrentDepartment()
            } else if (val === 'prjcode') {
                this.loadCurrentProject()
            }
        },
        async openBudProcess () {
            await this.getBizcode()
            await this.getProcess()
            let budmain = this
            this.$Modal.info({
                closable: true,
                render: function (createElement) {
                    return createElement(
                        workflowModal, {
                            props: {
                                title: '流程查看',
                                processData: budmain.processData
                            }
                        }
                    )
                },
                width: 960
            }
            )
        },
        async saveData () {
            let dataList = XEUtils.toTreeArray(this.$refs.gridList.getGridList(), {children: 'children'})
            if (await this.checkCanSave(dataList)) {
                try {
                    let param = this.getDimParam()
                    param.data = dataList
                    const {data: {code, msg}} = await this.$http.post(this.budapi + '/add', param)
                    if (code === 0) {
                        this.$Message.info(msg)
                        this.loadData()
                    } else {
                        this.$Message.error(msg)
                    }
                } catch (e) {
                    throw new Error(e)
                }
            }
        },
        // 初始化当前预算对应的以发生数（保存时校验用）
        async initBalanceData () {
            try {
                let param = this.getDimParam()
                param.tablename = this.budBalanceTable
                const {data: {rs, rows}} = await this.$http.post(this.budapi + '/getBudBalanceList', param)
                if (rs) {
                    if (rs.code === 0) {
                        let map = new Map()
                        if (rows) {
                            for (let item of rows) {
                                map.set(item.budsubjectcode, item.premoney + item.execmoney)
                            }
                        }
                        this.budBalanceMap = map
                    } else {
                        this.$Message.warning(rs.msg)
                    }
                } else {
                    throw new Error('预算余额列表接口异常')
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        checkDim () {
            if (!this.buddim.unitcode) {
                this.$message.warning('请选择组织机构')
                return false
            } else if (this.budtype === budtypes.department && !this.buddim.deptcode) {
                this.$message.warning('请选择部门')
                return false
            } else if (this.budtype === budtypes.project && !this.buddim.prjcode) {
                this.$message.warning('请选择项目')
                return false
            } else if (!this.buddim.budcycle) {
                this.$message.warning('请选择预算周期类型')
                return false
            } else if (!this.buddim.budyear) {
                this.$message.warning('请选择预算周期时间')
                return false
            }
            return true
        },
        moneyFormatter (val) {
            if (!val) {
                return '0.00'
            }
            val = parseFloat(val).toFixed(2)
            let res = this.formatAmt(val)
            if (res === 'NaN') {
                return this.moneyFormatter(0)
            }
            return res
        },
        formatAmt (amt) {
            if (amt.length <= 3) {
                return amt
            }
            if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(amt)) {
                return amt
            }
            var a = RegExp.$1
            var b = RegExp.$2
            var c = RegExp.$3
            var re = new RegExp()
            re.compile('(\\d)(\\d{3})(,|$)')
            while (re.test(b)) {
                b = b.replace(re, '$1,$2$3')
            }
            return a + '' + b + '' + c
        },
        async checkCanSave (dataList) {
            if (!this.checkDim() || !this.checkMoney(dataList)) {
                return false
            }
            await this.initBalanceData()
            if (!this.budBalanceMap || this.budBalanceMap.size === 0) {
                return true
            }

            let errorList = []
            for (let item of dataList) {
                if (item.endmoney == null) {
                    continue
                }
                let balance = this.budBalanceMap.get(item.budsubjectcode)
                if (item.endmoney - balance < 0) {
                    let error = '预算科目：【' + item.budsubjectcode + ' ' + item.budsubjectname + '】 预算数[' +
                                this.moneyFormatter(item.endmoney) + '] 不能小于 实际发生数[' + this.moneyFormatter(balance) + ']'
                    errorList.push(error)
                }
            }
            if (errorList.length !== 0) {
                let error = ''
                if (errorList.length > 4) {
                    error = '<div style="width:100%; overflow:auto; height:270px;">'
                }

                for (let info of errorList) {
                    error = error + info + '<br>'
                }
                error = error + '</div>'

                this.$Modal.info({
                    title: '提示',
                    width: 800,
                    content: error
                })

                return false
            } else {
                return true
            }
        },
        checkMoney (dataList) {
            let errorList = []
            for (let item of dataList) {
                let beginmoney = Number.isFinite(Number(item.beginmoney)) ? Number(item.beginmoney) : 0
                let curtotalmoney = Number.isFinite(Number(item.curtotalmoney)) ? Number(item.curtotalmoney) : 0
                let temp = beginmoney + curtotalmoney
                let endmoney = Number.isFinite(Number(item.endmoney)) ? Number(item.endmoney) : 0
                if (temp !== endmoney) {
                    let error = '  ' + item.budsubjectcode + ' ' + item.budsubjectname
                    errorList.push(error)
                }
            }
            if (errorList.length === 0) {
                return true
            } else {
                let error = ''
                error = error + '以下科目的【期初预算金额】与【本期累计调整金额】之和不等于【期末预算金额】，请修正：<br>'
                if (errorList.length > 10) {
                    error = error + '<div style="width:100%; overflow:auto; height:270px;">'
                }
                for (let info of errorList) {
                    error = error + info + '<br>'
                }
                if (errorList.length > 10) {
                    error = error + '</div>'
                }

                this.$Modal.info({
                    title: '提示',
                    width: 800,
                    content: error
                })
                return false
            }
        },
        checkTreeSum (list) {
            let msgList = []
            let map = new Map()
            for (let item of list) {
                map.set(item[budSubjectFieldNames.budsubjectcode], item)
            }
            this.treeSumExe(this.deptGridData, msgList, map)
            if (msgList.length > 0) {
                let error = ''
                error += '下列科目的预算数应等于下级科目对应的预算汇总数，请核对数据：<br/>'
                if (msgList.length > 10) {
                    error += '<div style="width:100%; overflow:auto; height:270px;">'
                }

                for (let info of msgList) {
                    error = error + info + '<br>'
                }
                if (msgList.length > 10) {
                    error = error + '</div>'
                }

                this.$Modal.info({
                    title: '提示',
                    width: 800,
                    content: error
                })

                return false
            } else {
                return true
            }
        },
        // 执行汇总递归-O(nlog(n))
        treeSumExe (list, msgList, map) {
            if (!list || list.length === 0) {
                return false
            }
            let [beginmoneySum, curtotalmoneySum, endmoneySum] = [0, 0, 0]
            for (let data of list) {
                if (!data[budSubjectFieldNames.children] || data[budSubjectFieldNames.children].length === 0) {
                    // 处理树数据汇总
                    data = map.get(data[budSubjectFieldNames.budsubjectcode])
                    data = data === null ? {} : data

                    let temp = Number(data[budSubjectFieldNames.beginmoney])
                    beginmoneySum += Number.isFinite(temp) ? temp : 0
                    temp = Number(data[budSubjectFieldNames.curtotalmoney])
                    curtotalmoneySum += Number.isFinite(temp) ? temp : 0
                    temp = Number(data[budSubjectFieldNames.endmoney])
                    endmoneySum += Number.isFinite(temp) ? temp : 0
                } else {
                    let {beginmoney, curtotalmoney, endmoney} = this.treeSumExe(data.children, msgList, map)
                    let moneytitle = ''
                    data = map.get(data[budSubjectFieldNames.budsubjectcode])
                    data = data === null ? {} : data
                    if (!(!beginmoney && !data[budSubjectFieldNames.beginmoney]) && beginmoney !== Number(data[budSubjectFieldNames.beginmoney])) {
                        moneytitle += '【期初预算金额】'
                    }
                    if (!(!curtotalmoney && !data[budSubjectFieldNames.curtotalmoney]) && curtotalmoney !== Number(data[budSubjectFieldNames.curtotalmoney])) {
                        moneytitle += '【本期累计调整】'
                    }
                    if (!(!endmoney && !data[budSubjectFieldNames.endmoney]) && endmoney !== Number(data[budSubjectFieldNames.endmoney])) {
                        moneytitle += '【期末预算金额】'
                    }

                    let temp = Number(data[budSubjectFieldNames.beginmoney])
                    beginmoneySum += Number.isFinite(temp) ? temp : 0
                    temp = Number(data[budSubjectFieldNames.curtotalmoney])
                    curtotalmoneySum += Number.isFinite(temp) ? temp : 0
                    temp = Number(data[budSubjectFieldNames.endmoney])
                    endmoneySum += Number.isFinite(temp) ? temp : 0

                    if (moneytitle.length > 0) {
                        let subject = '【' + data[budSubjectFieldNames.budsubjectcode] + ' ' + data[budSubjectFieldNames.budsubjectname] + '】'
                        let msg = subject + ':' + moneytitle
                        msgList.push(msg)
                    }
                }
            }
            return {beginmoney: beginmoneySum, curtotalmoney: curtotalmoneySum, endmoney: endmoneySum}
        },
        async submitData () {
            this.$Modal.confirm({
                title: '提示信息',
                content: '确定提交?',
                onOk: async () => {
                    if (this.checkDim() && (this.workflowstate === '未提交' || this.workflowstate === '已退回' || this.workflowstate === '调整中')) {
                        try {
                            let param = this.getDimParam()
                            const {data: {code, msg}} = await this.$http.post(this.budapi + '/submit', param)
                            if (code === 0) {
                                this.$Message.success('提交成功')
                                this.loadData()
                                this.loadState()
                            } else {
                                this.$Message.error(msg)
                            }
                        } catch (e) {
                            this.$Message.error('错误码：抱歉！遇到点小问题，请稍后再试')
                        }
                    }
                }
            })
        },
        exportTmpl () {
            let url = budgetApi.input + '/exportTemplate?'
            let param = this.getDimParam()
            let i = 0
            for (let key in param) {
                if (i !== 0) {
                    url += '&'
                }
                url = url + key + '=' + param[key]
                i++
            }
            url += '&JTOKENID=' + sessionStorage.token
            $('#downloadFile').attr('href', url)
            $('#downloadFile span').click()
        },

        // <---导入相关---
        importData () {
            // this.$Message.error('功能暂时关闭')
            this.imFile = document.getElementById('imFile')
            this.imFile.click()
        },
        async importFile () {
            this.fullscreenLoading = true
            let obj = this.imFile
            if (!obj.files) {
                this.fullscreenLoading = false
                return
            }
            let file = obj.files[0]
            let extName = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
            if (extName !== 'xls' && extName !== 'xlsx') {
                this.$Message.info('请上传xls/xlsx格式的文件')
                return
            }
            let size = file.size
            size = size / (1024 * 1024)
            if (size > 5) { // 5M
                this.$Message.info('上传的文件不能超过5MB')
                return
            }
            try {
                let formData = new FormData()
                formData.append('multipartFile', file) // name需要与后台的参数name相同
                let param = this.getDimParam()
                formData.append('tablename', param.tablename)
                formData.append('budcycle', param.budcycle)
                formData.append('budyear', param.budyear)
                formData.append('cycleitem', param.cycleitem)
                formData.append('unitcode', param.unitcode)
                if (param.tablename === budDataTable.project) {
                    formData.append('prjcode', param.prjcode)
                } else if (param.tablename === budDataTable.department) {
                    formData.append('deptcode', param.deptcode)
                }

                const {data: {code, msg}} = await this.$http.post(budgetApi.input + '/import', formData, {
                    headers: {'Content-Type': 'multipart/form-data'} // excel附件类型
                })
                if (code === 0) {
                    this.$Message.info(msg)
                    this.loadData()
                } else {
                    this.$Message.error(msg)
                }
            } catch (error) {
            } finally {
                this.importInputShowFlag = false // 用于刷新上传组件，消除上传同名附件无效的bug
                this.$nextTick(() => {
                    this.importInputShowFlag = true
                })
            }
        },

        exportData () {
            let url = budgetApi.input + '/export?'
            let param = this.getDimParam()
            let i = 0
            for (let key in param) {
                if (i !== 0) {
                    url += '&'
                }
                url = url + key + '=' + param[key]
                i++
            }
            url += '&JTOKENID=' + sessionStorage.token
            $('#downloadFile').attr('href', url)
            $('#downloadFile span').click()
        },
        closeWin () {

        },
        winResize () {
            this.$nextTick(() => {
                let winHeight = document.documentElement.clientHeight
                var obj = document.getElementById('bud-split')
                if (obj) {
                    obj.style.height = (Number(winHeight) - 200) + 'px'
                }
            })
        }
    }
}
</script>
<style scoped>
    .cfas-budget-content{
        padding: 0;
        height:100%;
        overflow-y: hidden;
    }
    #bud-split {
        margin-top: 0px;
        height: 300px;
        border-bottom: 1px solid #d8d8d8;
        border-top: 1px solid #d8d8d8;
    }
    .left-pane>.demo-split-pane {
        padding: 10px;
    }
    .right-pane>.demo-split-pane {
        padding: 0px 0px 0px 5px;
    }
    .budState {
        height: 42px;
    }
</style>

<style>
    .ivu-icon{
        font-size: inherit;
    }
</style>
