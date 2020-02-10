<!--行程申请单-单据-->
<template>
    <div style="height:100%;">
        <!--<Row style="background-color:#F8F8F8;margin-top: -15px;padding: 4px;position: fixed;width: 100%;top: 110px;z-index: 9">
            <Button @click="handleAddBill">新建</Button>
            <Button :disabled="isEdit" @click="handleModifyBill">修改</Button>
            <Button :disabled="!isEdit" @click="handleSaveBill">保存</Button>
            <Button :disabled="isEdit" @click="handleDeleteBill">删除</Button>
            <Button @click="handleClose">关闭</Button>
            <Button disabled>查看审批轨迹</Button>
            <Button disabled>影像管理</Button>
            <Button disabled>帮助</Button>
        </Row>-->
        <!--<cfas-toolbar style="background-color:#F8F8F8;margin-top: -15px;padding: 4px;position: fixed;width: 100%;top: 110px;z-index: 9">-->
        <!--<Affix :offset-top="87">-->
            <!--<cfas-toolbar style="margin-top: -1px;">-->
            <va-toolbar v-if="showToolBar">
                <va-toolbar-item @click="handleBillAdd" title="新建" :disabled="isEdit"/>
                <va-toolbar-item :disabled="!isEditBtn" @click="handleModifyBill" title="修改"/>
                <va-toolbar-item :disabled="!isEdit" @click="beforeSave" title="保存"/>
                <va-toolbar-item :disabled="isCommit" @click="handleBillCommit" title="提交"/>
                <va-toolbar-item :disabled="isDeleteBtn" @click="handleDeleteBill" divided title="删除"/>
                <va-toolbar-item :disabled="isWorkflow" @click="handleWorkflowTrace" title="流程查看"/>
                <va-toolbar-item :disabled="isSyncTravelOrder" @click="handleSyncTravelOrder" title="事前审批"/>
                <!--<va-toolbar-item @click="handleBudgetPreview" divided title="预览预算执行"/>-->
                <va-toolbar-item @click="handleClose" divided title="关闭"/>
            </va-toolbar>
            <div ref="bill-body" :class="{'va-bill-preview': this.currModelState === 'view', 'bill-body':showToolBar, 'no-toolbar-bill-body':!showToolBar}">
                <Row>
                    <i-col span="21">
                        <div id="baseInfo" style="height: 42px;border-bottom: 1px solid #E8E8E8;margin-bottom: 8px;">
                            <span style="border-left:3px solid #4BC0C6;padding-left: 11px;color:#222222;font-size: 16px;line-height: 42px;font-weight: 500;">基本信息</span>
                        </div>
                        <Form ref="travelApplyForm" :model="mastertable" :rules="travelApplyRule" :label-width="100" :show-message="false">
                            <Row>
                                <i-col span="8">
                                    <FormItem label="申请单号" prop="BILLCODE">
                                        <Input disabled v-model="mastertable.BILLCODE"/>
                                    </FormItem>
                                </i-col>
                                <i-col span="8">
                                    <FormItem label="制单人" prop="CREATEUSER">
                                        <Input disabled v-model="mastertable.CREATEUSER.title"/>
                                    </FormItem>
                                </i-col>
                                <i-col span="8">
                                    <FormItem label="制单日期" prop="CREATETIME">
                                        <DatePicker disabled transfer style="width:100%" type="datetime" :value="mastertable.CREATETIME" @on-change="value => handleDatePickerChange('CREATETIME', value)"/>
                                    </FormItem>
                                </i-col>
                            </Row>
                            <Row>
                                <i-col span="8">
                                    <FormItem label="组织机构" prop="UNITCODE">
                                        <!--<va-org :disabled="!isEdit" tbName="MD_ORG" v-model="mastertable.UNITCODE"></va-org>-->
                                        <va-basedata :disabled="!isEdit" tbName="MD_ORG_FIN" v-model="mastertable.UNITCODE" @on-change="value => handleBaseDataChange('UNITCODE', value)"></va-basedata>
                                    </FormItem>
                                </i-col>
                                <i-col span="8">
                                    <FormItem label="申请日期" prop="BILLDATE">
                                        <DatePicker :disabled="!isEdit" transfer style="width:100%" :value="mastertable.BILLDATE" @on-change="value => handleDatePickerChange('BILLDATE', value)"/>
                                    </FormItem>
                                </i-col>
                                <i-col span="8">
                                    <FormItem label="紧急状态" prop="URGENTSTATECODE">
                                        <va-select tbName="EM_URGENTSTATE" :disabled="!isEdit" placeholder="" v-model="mastertable.URGENTSTATECODE"></va-select>
                                    </FormItem>
                                </i-col>
                                <!--<i-col span="8">
                                    <FormItem label="预算科目" prop="BUDSUBJECTCODE">
                                        <va-basedata :disabled="!isEdit" tbName="MD_BUDGETSUBJECT" v-model="mastertable.BUDSUBJECTCODE"></va-basedata>
                                    </FormItem>
                                </i-col>-->
                            </Row>
                            <Row>
                                <!--<i-col span="8">
                                   <FormItem label="消费类型" prop="EXPENSEKINDCODE">
                                       <va-basedata :disabled="!isEdit" tbName="MD_EXPENSEKIND" v-model="mastertable.EXPENSEKINDCODE" @on-change="value => handleBaseDataChange('EXPENSEKINDCODE', value)"></va-basedata>
                                   </FormItem>
                                </i-col>-->
                                <i-col span="8">
                                    <FormItem label="申请人" prop="STAFFCODE">
                                        <va-basedata :disabled="!isEdit" tbName="MD_STAFF" :param="baseDataParam" v-model="mastertable.STAFFCODE" @on-change="value => handleBaseDataChange('STAFFCODE', value)"></va-basedata>
                                    </FormItem>
                                </i-col>
                                <i-col span="8">
                                    <FormItem label="申请部门" prop="DEPTCODE">
                                        <va-basedata :disabled="!isEdit" tbName="MD_DEPARTMENT" :param="baseDataParam" v-model="mastertable.DEPTCODE"></va-basedata>
                                    </FormItem>
                                </i-col>
                                <i-col span="8">
                                    <FormItem label="项目" prop="PROJECTCODE">
                                        <va-basedata :disabled="!isEdit" tbName="MD_PROJECT" :param="baseDataParam" v-model="mastertable.PROJECTCODE"></va-basedata>
                                    </FormItem>
                                </i-col>
                            </Row>
                            <Row>
                                <!--<i-col span="8">
                                    <FormItem label="预算科目：" prop="BUDSUBJECTCODE">
                                        <va-basedata :disabled="!isEdit" tbName="MD_BUDGETSUBJECT" v-model="mastertable.BUDSUBJECTCODE"></va-basedata>
                                    </FormItem>
                                </i-col>-->
                                <!--<i-col span="8">
                                    <FormItem label="出行城市：" prop="DEPCITYCODE">
                                        <va-basedata :disabled="!isEdit" tbName="MD_CITY" v-model="mastertable.DEPCITYCODE"></va-basedata>
                                    </FormItem>
                                </i-col>-->
                            <!--<Row>
                                <i-col span="8">
                                    <FormItem label="到达城市：" prop="ARRCITYCODE">
                                        <va-basedata :disabled="!isEdit" tbName="MD_CITY" v-model="mastertable.ARRCITYCODE"></va-basedata>
                                    </FormItem>
                                </i-col>
                                <i-col span="8">
                                    <FormItem label="到达城市分类：" prop="ARRCITYTYPECODE" :label-width="120">
                                        <va-basedata :disabled="!isEdit" tbName="MD_CITYTYPE" v-model="mastertable.ARRCITYTYPECODE" @on-change="value => handleBaseDataChange('ARRCITYTYPECODE', value)"></va-basedata>
                                    </FormItem>
                                </i-col>
                            </Row>-->
                                <i-col span="8">
                                    <FormItem label="预订日期">
                                        <DatePicker :disabled="!isEdit" transfer style="width:100%" type="daterange" @on-change="value => handleDatePickerRangeChange('BEGINDATE', 'ENDDATE', value)" :value="[mastertable.BEGINDATE, mastertable.ENDDATE]"/>
                                        <!--<Row>
                                            <i-col span="11">
                                                <FormItem prop="BEGINDATE">
                                                    <DatePicker :disabled="!isEdit" transfer style="width:100%" v-model="mastertable.BEGINDATE" @on-change="value => handleDatePickerChange('BEGINDATE', value)"/>
                                                </FormItem>
                                            </i-col>
                                            <i-col span="2" style="text-align: center">止</i-col>
                                            <i-col span="11">
                                                <FormItem prop="ENDDATE">
                                                    <DatePicker :disabled="!isEdit" transfer style="width:100%" v-model="mastertable.ENDDATE" @on-change="value => handleDatePickerChange('ENDDATE', value)"/>
                                                </FormItem>
                                            </i-col>
                                        </Row>-->
                                    </FormItem>
                                </i-col>
                                <!--<i-col span="8">
                                    <FormItem label="币种" prop="CURRENCYCODE">
                                        <va-basedata :disabled="!isEdit" tbName="MD_CURRENCY" v-model="mastertable.CURRENCYCODE"></va-basedata>
                                    </FormItem>
                                </i-col>-->
                                <i-col span="8">
                                    <FormItem label="申请金额" prop="BILLMONEY">
                                        <va-input-number disabled style="width:100%" v-model="mastertable.BILLMONEY" :precision="2"/>
                                    </FormItem>
                                </i-col>
                            </Row>
                            <Row>
                                <i-col span="24">
                                    <FormItem label="出差事由" prop="MEMO">
                                        <Input type="textarea" :disabled="!isEdit" v-model="mastertable.MEMO"/>
                                    </FormItem>
                                </i-col>
                            </Row>
                            <Row>
                                <i-col span="16">
                                    <FormItem label="" prop="ORDERFLAG">
                                        <Checkbox style="font-size: 14px;" :value="!!mastertable.ORDERFLAG" :disabled="!isEdit" @on-change="handleCheckboxChange">
                                            勾选并填写《住宿和交通》信息可推送商旅平台订票
                                        </Checkbox>
                                    </FormItem>
                                </i-col>
                            </Row>
                        </Form>
                        <!--<Collapse id="attachInfo" simple value="1" style="margin-top:10px">
                            <Panel name="1" class="custom-panel">
                                <span style="color:#222222;font-size: 16px;font-weight: 500;">查看附件</span>
                                <va-upload style="display: inline-block;float: right;margin-top: -5px;" @on-success="handleUploadSuccess">
                                    <Button :disabled="!isEdit" type="primary" ghost><Icon type="md-add" />添加附件</Button>
                                </va-upload>
                                <span style="float: right;color:#888888;font-size: 12px;margin-right:8px;">{{uploadedInfo}}</span>
                                <div slot="content" style="padding: 8px 10px 10px 10px;">
                                    <va-upload-list ref="uploadList" :disabled="!isEdit" :quotecode="this.mastertable.QUOTECODE"></va-upload-list>
                                </div>
                            </Panel>
                        </Collapse>-->
                        <Collapse id="hotelInfo" simple value="1" style="margin-top:10px" @on-change="handleHotelInfoCollapseChange">
                            <Panel name="1" class="custom-panel">
                                <span style="color:#222222;font-size: 16px;font-weight: 500;">住宿信息</span>
                                <Button style="float: right" @click.stop="ctripSSO" :disabled="isSSObtn" type="primary" ghost>携程商旅</Button>
                                <div slot="content" style="padding: 8px 10px 10px 10px;">
                                    <va-detail-table ref="hotelInfo" :isEdit="isEdit"
                                        :table-cols="hotelInfoCols" :table-data="hotelInfoData"
                                        @on-field-change="handleHotelInfoChange"
                                        @on-delete-row="handleTableDeleteRow"
                                        @on-add-row="handleTableAddRow"
                                    ></va-detail-table>
                                </div>
                            </Panel>
                        </Collapse>
                        <Collapse id="trafficInfo" simple value="1" style="margin-top:10px" @on-change="handleTrafficInfoCollapseChange">
                            <Panel name="1" class="custom-panel">
                                <span style="color:#222222;font-size: 16px;font-weight: 500;">交通信息</span>
                                <Button style="float: right" @click.stop="ctripSSO" :disabled="isSSObtn" type="primary" ghost>携程商旅</Button>
                                <div slot="content" style="padding: 8px 10px 10px 10px;">
                                    <va-detail-table ref="trafficInfo" :isEdit="isEdit"
                                        :table-cols="trafficInfoCols" :table-data="trafficInfoData"
                                        @on-field-change="handleTrafficInfoChange"
                                        @on-delete-row="handleTableDeleteRow"
                                        @on-add-row="handleTableAddRow"
                                    ></va-detail-table>
                                </div>
                            </Panel>
                        </Collapse>
                    </i-col>
                <i-col span="3" style="padding-left:8px;">
                    <!--TODO 样式优化-->
                    <div ref="nav" style="background-color: #ffffff;border-radius:0px 0px 0px 6px;border-bottom: 1px solid #E8E8E8;border-left: 1px solid #E8E8E8;position: fixed;right: 0;z-index: 3;">
                        <div style="height: 104px;border-bottom: 1px solid #E8E8E8;">
                            <span style="display: inline-block;margin: 12px 0 16px 12px;color: #222222;font-size:16px;font-weight:500;line-height:24px;">
                                {{billCurrState}}
                                <svg class="icon" aria-hidden="true">
                                    <use :xlink:href="icon"></use>
                                </svg>
                            </span>
                            <div style="padding-left:4px;">
                                <div style="display:inline-block;width:43px;height: 40px;padding: 0 12px 16px 12px;cursor: pointer">
                                    <div style="color:#222222;font-weight:500;font-size:16px;line-height:24px;border-right: 1px solid #E8E8E8;margin-right: -12px;">16</div>
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon_ewmshenheyaodian-hong"></use>
                                    </svg>
                                </div>
                                <div style="display:inline-block;width:43px;height: 40px;padding: 0 12px 16px 12px;cursor: pointer">
                                    <div style="color:#222222;font-weight:500;font-size:16px;line-height:24px;border-right: 1px solid #E8E8E8;margin-right: -12px;">21</div>
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon_ewmshenheyaodian-huang"></use>
                                    </svg>
                                </div>
                                <div style="display:inline-block;width:43px;height: 40px;padding: 0 12px 16px 12px;cursor: pointer">
                                    <div style="color:#222222;font-weight:500;font-size:16px;line-height:24px;">99+</div>
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon_ewmshenheyaodian-lv"></use>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div style="padding-left: 12px;padding-bottom: 16px;">
                            <qriously :value="mastertable.BILLCODE" :size="84" style="margin-left: -4px;"/>
                            <Anchor :container="container" :offset-top="150" class="va-anchor">
                                <AnchorLink href="#baseInfo" title="基本信息">
                                    <span class="va-anchor-ink-ball"></span>
                                </AnchorLink>
                                <AnchorLink href="#hotelInfo" title="住宿信息">
                                    <span class="va-anchor-ink-ball"></span>
                                </AnchorLink>
                                <AnchorLink href="#trafficInfo" title="交通信息">
                                    <span class="va-anchor-ink-ball"></span>
                                </AnchorLink>
                                <AnchorLink href="#baseInfo" title="返回顶部" class="va-anchor-link-back-top">
                                    <span class="va-anchor-ink-ball-back-top"></span>
                                </AnchorLink>
                            </Anchor>
                        </div>
                    </div>
                </i-col>
                </Row>
            </div>
    </div>
</template>

<script>
import uuid from 'uuid/v4'
import WorkflowModal from '../../fo/fo-bill/workflow/fo-workflow-modal'
import XEUtils from 'xe-utils'

export default {
    name: 'fo-travelapply-bill',
    props: {
        billcode: {
            type: String
        },
        modelState: {
            type: String,
            default: 'add'
        },
        data: Object,
        showToolBar: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            container: null,
            id: '',
            mastertable: {
                BILLCODE: '',
                CREATEUSER: '',
                BILLDATE: '',
                UNITCODE: '',
                DEPTCODE: '',
                PROJECTCODE: '',
                EXPENSEKINDCODE: '',
                BUDSUBJECTCODE: '',
                DEPCITYCODE: '',
                ARRCITYCODE: '',
                ARRCITYTYPECODE: '',
                BEGINDATE: '',
                ENDDATE: '',
                CURRENCYCODE: '',
                BILLMONEY: null,
                MEMO: '',
                QUOTECODE: '',
                DEFINECODE: '',
                ORDERFLAG: ''
            },
            travelApplyRule: {
                // EXPENSEKINDCODE: [{ required: true, message: '消费类型不能为空' }],
                UNITCODE: [{ required: true, message: '组织机构不能为空' }],
                BILLDATE: [{ required: true, message: '申请日期不能为空' }],
                // ARRCITYTYPECODE: [{ required: true }],
                // BEGINDATE: [{ required: true }],
                // ENDDATE: [{ required: true }],
                // BUDSUBJECTCODE: [{ required: true }],
                BILLMONEY: [{
                    required: true,
                    validator: (rule, value, callback) => {
                        if (value === '' || value === null) {
                            callback(new Error('申请金额不能为空'))
                        }
                        if (value === 0) {
                            callback(new Error('申请金额不能为0'))
                        }
                        callback()
                    }
                }]
                // PROJECTCODE: [{ required: true }]
            },
            hotelInfoData: [],
            trafficInfoData: [],
            currModelState: this.modelState,
            attachList: [],
            baseDataParam: {},
            model: {}
        }
    },
    computed: {
        hotelInfoCols () {
            return [
                {field: 'EXPENSEKINDCODE', title: '消费类型', width: '', type: 'basedata', tbName: 'MD_EXPENSEKIND'},
                {field: 'STAFFCODE', title: '出行人员', width: '', type: 'basedata', tbName: 'MD_STAFF'},
                {field: 'ARRCITYCODE', title: '入住城市', width: '', type: 'basedata', tbName: 'MD_CITY'},
                {field: 'HOTELSTANDARD', title: '住宿标准', width: '', type: 'number', disabled: true, precision: 2, isSummary: false},
                {field: 'BOOKHOTEL', title: '预订酒店', width: '', type: 'string'},
                {field: 'CHECKINDAYS', title: '入住天数', width: '', type: 'number', isSummary: false},
                {field: 'BILLMONEY', title: '申请金额', width: '', type: 'number', precision: 2},
                {field: 'MEMO', title: '备注', width: '', type: 'string'},
                {field: 'POSITIONCODE', title: '职级', width: '', type: 'basedata', tbName: 'MD_POSITION', disabled: true},
                {field: 'CITYTYPECODE', title: '入住城市分类', type: 'basedata', tbName: 'MD_CITYTYPE', disabled: true}
            ]
        },
        trafficInfoCols () {
            return [
                {field: 'EXPENSEKINDCODE', title: '消费类型', width: '', type: 'basedata', tbName: 'MD_EXPENSEKIND'},
                {field: 'STAFFCODE', title: '出行人员', width: '', type: 'basedata', tbName: 'MD_STAFF'},
                {field: 'DEPCITYCODE', title: '出发地点', width: '', type: 'basedata', tbName: 'MD_CITY'},
                {field: 'ARRCITYCODE', title: '到达地点', width: '', type: 'basedata', tbName: 'MD_CITY'},
                {field: 'VEHICLECODE', title: '交通方式', width: '', type: 'basedata', tbName: 'MD_VEHICLES'},
                {field: 'PLANEPOSITIONCODE', title: '飞机舱位', width: '', type: 'basedata', tbName: 'MD_AIRCRAFTCABIN', disabled: true},
                {field: 'TRAINSEATSCODE', title: '火车席等级', width: '', type: 'basedata', tbName: 'MD_TRAINTGRADE', disabled: true},
                {field: 'BILLMONEY', title: '申请金额', width: '', type: 'number', precision: 2},
                {field: 'MEMO', title: '备注', width: '', type: 'string'},
                {field: 'POSITIONCODE', title: '职级', type: 'basedata', tbName: 'MD_POSITION', disabled: true}
                // {field: 'WAYTYPE', title: '往返', width: '150', type: 'select', options: [{label: '单程', value: 1}, {label: '往返', value: 2}]}
            ]
        },
        isEdit () {
            return this.currModelState !== 'view'
        },
        isEditBtn () {
            const billstate = this.mastertable.BILLSTATE && this.mastertable.BILLSTATE.name
            /* eslint-disable eqeqeq */
            return this.currModelState === 'view' && (billstate == 0 || (billstate & 1) == 1)
        },
        isCommit () {
            const billstate = this.mastertable.BILLSTATE && this.mastertable.BILLSTATE.name
            /* eslint-disable eqeqeq */
            return this.currModelState !== 'view' || !(billstate == 0 || billstate == 33)
        },
        isDeleteBtn () {
            const billstate = this.mastertable.BILLSTATE && this.mastertable.BILLSTATE.name
            /* eslint-disable eqeqeq */
            const flag = this.currModelState === 'view' && (billstate == 0 || (billstate & 1) == 1)
            return !flag
        },
        isWorkflow () {
            const billstate = this.mastertable.BILLSTATE && this.mastertable.BILLSTATE.name
            /* eslint-disable eqeqeq */
            return this.currModelState !== 'view' || billstate == 0 || billstate == undefined
        },
        isSyncTravelOrder () {
            const billstate = this.mastertable.BILLSTATE && this.mastertable.BILLSTATE.name
            const orderflag = this.mastertable.ORDERFLAG
            /* eslint-disable eqeqeq */
            const flag = this.currModelState === 'view' && billstate == 130 && orderflag === 1
            return !flag
        },
        isSSObtn () {
            const billstate = this.mastertable.BILLSTATE && this.mastertable.BILLSTATE.name
            /* eslint-disable eqeqeq */
            const flag = this.currModelState === 'view' && billstate == 130
            return !flag
        },
        uploadedInfo () {
            let allFileSize = 0
            for (const attach of this.attachList) {
                allFileSize += attach.filesize
            }
            return `限制最大文件10MB，已传${this.attachList.length}个文件共${allFileSize / 1024 > 1 ? (allFileSize / 1024).toFixed(2) + 'MB' : allFileSize + 'KB'}`
        },
        billCurrState () {
            const billstate = this.mastertable.BILLSTATE
            if (!billstate) return '制单中'
            if (billstate.title) return billstate.title
            switch (billstate) {
                case 0:
                case 1:
                    return '制单中'
                case 2:
                    return '已确认'
                case 4:
                    return '已废止'
                case 8:
                    return '已提交'
                case 16 + 8:
                    return '审批中'
                case 32 + 1:
                    return '驳回可提交'
                case 64 + 4:
                    return '驳回不可提交'
                case 128 + 2:
                    return '审批通过'
                case 256 + 2:
                    return '部分通过'
            }
            return billstate
        },
        icon () {
            const billstate = this.mastertable.BILLSTATE
            if (!billstate) return '#icon_ewmzhidanzhongtubiao'
            switch (billstate) {
                case 0:
                case 1:
                    return '#icon_ewmzhidanzhongtubiao'
                case 2:
                    return '#icon_ewmyiqueren-zanbutong'
                case 4:
                    return '#icon_ewmyifeizhi'
                case 8:
                    return '#icon_ewmyitijiao'
                case 16 + 8:
                    return '#icon_ewmshenpizhong'
                case 32 + 1:
                    return '#icon_ewmbohuiketijiao'
                case 64 + 4:
                    return '#icon_ewmbohuibuketijiao'
                case 128 + 2:
                    return '#icon_ewmshenpitongguo'
                case 256 + 2:
                    return '#icon_ewmshenpitongguo'
            }
            return '#icon_ewmzhidanzhongtubiao'
        }
    },
    async mounted () {
        // await this.loadBill()
        this.$nextTick(() => {
            this.container = this.$refs['bill-body']
            this.computedNavStyle()
        })
        // this.$nextTick(async () => {
        //     const attachList = await this.$refs.uploadList.reload()
        //     this.attachList = attachList
        // })
    },
    watch: {
        async data () {
            const {state, data} = this.data
            this.id = data.id
            this.mastertable = data.FO_APPLOADBILL[0]
            this.hotelInfoData = data.FO_APPLOADBILL_ITEM.filter(item => item.TRAVELTYPE === 1)
            this.trafficInfoData = data.FO_APPLOADBILL_ITEM.filter(item => item.TRAVELTYPE === 2)
            if (state === 3) {
                this.currModelState = 'view'
            } else if (state === 2) {
                this.currModelState = 'edit'
            } else {
                this.currModelState = 'view'
            }
            this.baseDataParam = {unitcode: this.mastertable.UNITCODE && this.mastertable.UNITCODE.name}
        }
    },
    methods: {
        computedNavStyle () {
            setTimeout(() => {
                const a = this.$refs['bill-body'].clientWidth
                const b = this.$refs['bill-body'].offsetWidth
                this.$refs.nav.style.right = `${b - a}px`
            }, 1000)
        },
        handleHotelInfoCollapseChange () {
            this.computedNavStyle()
        },
        handleTrafficInfoCollapseChange () {
            this.computedNavStyle()
        },
        /**
         * 初始化相关事件
         */
        // 加载单据
        async loadBill () {
            try {
                const {defineCode, billCode, dataState} = this.$route.params
                if (dataState === 'BROWSE' || dataState === 'EDIT') {
                    const {data: {data}} = await this.$http.post(`/api/cfasserver/bill/data/${defineCode}/${billCode}/get`, {})
                    this.id = data.id
                    this.mastertable = data.FO_APPLOADBILL[0]
                    this.hotelInfoData = data.FO_APPLOADBILL_ITEM.filter(item => item.TRAVELTYPE === 1)
                    this.trafficInfoData = data.FO_APPLOADBILL_ITEM.filter(item => item.TRAVELTYPE === 2)
                    this.currModelState = 'view'
                    if (dataState === 'EDIT') {
                        this.currModelState = 'edit'
                    }
                } else if (dataState === 'NEW') {
                    this.handleBillAdd()
                }
            } catch (e) {
                this.$Message.error(`加载单据失败：${e.message}`)
                throw new Error(`加载单据失败：${e.message}`)
            }
        },
        /**
         * 主表表单相关事件
         */
        // handleCheckboxChange
        handleCheckboxChange (val) {
            this.mastertable.ORDERFLAG = val ? 1 : 0
        },
        // 监听日期改变
        handleDatePickerChange (field, value) {
            this.mastertable[field] = value
        },
        handleDatePickerRangeChange (field1, field2, value) {
            this.mastertable[field1] = value[0] ? value[0] : null
            this.mastertable[field2] = value[1] ? value[1] : null
        },
        async handleBaseDataChange (field, value) {
            // 组织机构改变，清空部门和项目
            if (field === 'UNITCODE') {
                this.mastertable.STAFFCODE = ''
                this.mastertable.DEPTCODE = ''
                this.mastertable.PROJECTCODE = ''
                this.baseDataParam = {unitcode: value.code}
            }
            // 组织机构、消费类型、改变时重新计算差旅标准
            // if (field === 'UNITCODE' || field === 'EXPENSEKINDCODE') {
            if (field === 'UNITCODE') {
                // const {UNITCODE, EXPENSEKINDCODE} = this.mastertable
                const {UNITCODE} = this.mastertable
                for (const row of this.$refs.hotelInfo.$refs.editable.getRecords()) {
                    let {EXPENSEKINDCODE, POSITIONCODE, CITYTYPECODE} = row
                    EXPENSEKINDCODE = EXPENSEKINDCODE && EXPENSEKINDCODE.name ? EXPENSEKINDCODE.name : EXPENSEKINDCODE
                    POSITIONCODE = POSITIONCODE && POSITIONCODE.name ? POSITIONCODE.name : POSITIONCODE
                    CITYTYPECODE = CITYTYPECODE && CITYTYPECODE.name ? CITYTYPECODE.name : CITYTYPECODE
                    if (UNITCODE && EXPENSEKINDCODE && POSITIONCODE && CITYTYPECODE) {
                        const {data: travelControl} = await this.$http.post('/api/cfasserver/cfasfo/travelcontrol/get', {
                            positioncode: POSITIONCODE, expensekindcode: EXPENSEKINDCODE, unitcode: UNITCODE, citytypecode: CITYTYPECODE
                        })
                        // 如果住宿标准类型是固定标准，带出住宿标准，赋值子表住宿标准和申请金额
                        if (travelControl.data && travelControl.data.length && travelControl.data[0].staystatype === 0) {
                            row.HOTELSTANDARD = travelControl.data[0].staystaamount
                            row.HOTELSTANDARD_VA_SHOWTITLE = XEUtils.commafy(row.HOTELSTANDARD, {fixed: 2})
                            row.BILLMONEY = travelControl.data[0].staystaamount * (row.CHECKINDAYS ? row.CHECKINDAYS : 0)
                            row.BILLMONEY_VA_SHOWTITLE = XEUtils.commafy(row.BILLMONEY, {fixed: 2})
                        } else {
                            delete row.HOTELSTANDARD
                            delete row.HOTELSTANDARD_VA_SHOWTITLE
                            delete row.BILLMONEY
                            delete row.BILLMONEY_VA_SHOWTITLE
                        }
                    } else {
                        delete row.HOTELSTANDARD
                        delete row.HOTELSTANDARD_VA_SHOWTITLE
                        delete row.BILLMONEY
                        delete row.BILLMONEY_VA_SHOWTITLE
                    }
                }
                this.$refs.hotelInfo.$refs.editable.refresh()
                for (const row of this.$refs.trafficInfo.$refs.editable.getRecords()) {
                    let {EXPENSEKINDCODE, POSITIONCODE, CITYTYPECODE} = row
                    EXPENSEKINDCODE = EXPENSEKINDCODE && EXPENSEKINDCODE.name ? EXPENSEKINDCODE.name : EXPENSEKINDCODE
                    POSITIONCODE = POSITIONCODE && POSITIONCODE.name ? POSITIONCODE.name : POSITIONCODE
                    CITYTYPECODE = CITYTYPECODE && CITYTYPECODE.name ? CITYTYPECODE.name : CITYTYPECODE
                    if (UNITCODE && EXPENSEKINDCODE && POSITIONCODE && CITYTYPECODE) {
                        const {data: travelControl} = await this.$http.post('/api/cfasserver/cfasfo/travelcontrol/get', {
                            positioncode: POSITIONCODE, expensekindcode: EXPENSEKINDCODE, unitcode: UNITCODE, citytypecode: CITYTYPECODE
                        })
                        // 根据差旅标准带出飞机舱位和火车席等级
                        if (travelControl.data && travelControl.data.length && travelControl.data[0].planepositioncode) {
                            const {data: {rows: [aircraftcabinInfo]}} = await this.$http.post('/api/vmclient/baseData/list', {tableName: 'MD_AIRCRAFTCABIN', stopflag: -1, code: travelControl.data[0].planepositioncode})
                            row.PLANEPOSITIONCODE = travelControl.data[0].planepositioncode
                            row.PLANEPOSITIONCODE_VA_SHOWTITLE = aircraftcabinInfo.showTitle
                        } else {
                            delete row.PLANEPOSITIONCODE
                            delete row.PLANEPOSITIONCODE_VA_SHOWTITLE
                        }
                        if (travelControl.data && travelControl.data.length && travelControl.data[0].trainseatscode) {
                            const {data: {rows: [traingradeInfo]}} = await this.$http.post('/api/vmclient/baseData/list', {tableName: 'MD_TRAINTGRADE', stopflag: -1, code: travelControl.data[0].trainseatscode})
                            row.TRAINSEATSCODE = travelControl.data[0].trainseatscode
                            row.TRAINSEATSCODE_VA_SHOWTITLE = traingradeInfo.showTitle
                        } else {
                            delete row.TRAINSEATSCODE
                            delete row.TRAINSEATSCODE_VA_SHOWTITLE
                        }
                    } else {
                        delete row.PLANEPOSITIONCODE
                        delete row.PLANEPOSITIONCODE_VA_SHOWTITLE
                        delete row.TRAINSEATSCODE
                        delete row.TRAINSEATSCODE_VA_SHOWTITLE
                    }
                }
                this.$refs.trafficInfo.$refs.editable.refresh()
                const hotelMoney = this.$refs.hotelInfo.getData().map(item => item.BILLMONEY).reduce((total, currentValue) => total + (currentValue || 0), 0)
                const trafficMoney = this.$refs.trafficInfo.getData().map(item => item.BILLMONEY).reduce((total, currentValue) => total + (currentValue || 0), 0)
                this.mastertable.BILLMONEY = hotelMoney + trafficMoney
            }
            // 申请人切换时切换部门
            if (field === 'STAFFCODE') {
                this.mastertable.DEPTCODE = value.groupname
            }
        },
        // 附件上传成功回调
        async handleUploadSuccess (quotecode) {
            // this.mastertable.QUOTECODE = quotecode
            // this.$nextTick(async () => {
            //     const attachList = await this.$refs.uploadList.reload()
            //     this.attachList = attachList
            //     this.mastertable.ATTACHNUM = this.attachList.length
            // })
        },
        async handleHotelInfoChange (row, column, cell, event) {
            // const {EXPENSEKINDCODE, UNITCODE} = this.mastertable
            const {UNITCODE: {name: UNITCODE}} = this.mastertable
            // 根据出行人带出职级
            if (column.property === 'STAFFCODE') {
                if (row.STAFFCODE) {
                    const {data: {rows: [staffInfo]}} = await this.$http.post('/api/vmclient/baseData/list', {tableName: 'MD_STAFF', stopflag: -1, code: row.STAFFCODE})
                    row.POSITIONCODE = staffInfo.positioncode
                    if (staffInfo.positioncode) {
                        const {data: {rows: [positionInfo]}} = await this.$http.post('/api/vmclient/baseData/list', {tableName: 'MD_POSITION', stopflag: -1, code: staffInfo.positioncode})
                        row.POSITIONCODE_VA_SHOWTITLE = positionInfo.showTitle
                    } else {
                        delete row.POSITIONCODE
                        delete row.POSITIONCODE_VA_SHOWTITLE
                    }
                } else {
                    delete row.POSITIONCODE
                    delete row.POSITIONCODE_VA_SHOWTITLE
                }
            }
            // 根据入住城市带出城市分类
            if (column.property === 'ARRCITYCODE') {
                if (row.ARRCITYCODE) {
                    const {data: {rows: [cityInfo]}} = await this.$http.post('/api/vmclient/baseData/list', {tableName: 'MD_CITY', stopflag: -1, code: row.ARRCITYCODE})
                    if (cityInfo.citytypecode) {
                        const {data: {rows: [citypeInfo]}} = await this.$http.post('/api/vmclient/baseData/list', {tableName: 'MD_CITYTYPE', stopflag: -1, code: cityInfo.citytypecode})
                        row.CITYTYPECODE = citypeInfo.code
                        row.CITYTYPECODE_VA_SHOWTITLE = citypeInfo.showTitle
                    } else {
                        delete row.CITYTYPECODE
                        delete row.CITYTYPECODE_VA_SHOWTITLE
                    }
                } else {
                    delete row.CITYTYPECODE
                    delete row.CITYTYPECODE_VA_SHOWTITLE
                }
            }
            // 根据主表组织机构、消费类型、子表当前行的职级、城市分类带出差旅标准（出行人、入住城市变化时）
            if (column.property === 'STAFFCODE' || column.property === 'ARRCITYCODE' || column.property === 'EXPENSEKINDCODE') {
                if (UNITCODE && row.EXPENSEKINDCODE && row.POSITIONCODE && row.CITYTYPECODE) {
                    const {data: travelControl} = await this.$http.post('/api/cfasserver/cfasfo/travelcontrol/get', {
                        positioncode: row.POSITIONCODE, expensekindcode: row.EXPENSEKINDCODE, unitcode: UNITCODE, citytypecode: row.CITYTYPECODE
                    })
                    // 如果住宿标准类型是固定标准，带出住宿标准，赋值子表住宿标准和申请金额
                    if (travelControl.data && travelControl.data.length && travelControl.data[0].staystatype === 0) {
                        row.HOTELSTANDARD = travelControl.data[0].staystaamount
                        row.HOTELSTANDARD_VA_SHOWTITLE = XEUtils.commafy(row.HOTELSTANDARD, {fixed: 2})
                        row.BILLMONEY = (row.CHECKINDAYS ? row.CHECKINDAYS : 0) * travelControl.data[0].staystaamount
                        row.BILLMONEY_VA_SHOWTITLE = XEUtils.commafy(row.BILLMONEY, {fixed: 2})
                    } else {
                        delete row.HOTELSTANDARD
                        delete row.HOTELSTANDARD_VA_SHOWTITLE
                        delete row.BILLMONEY
                        delete row.BILLMONEY_VA_SHOWTITLE
                    }
                } else {
                    delete row.HOTELSTANDARD
                    delete row.HOTELSTANDARD_VA_SHOWTITLE
                    delete row.BILLMONEY
                    delete row.BILLMONEY_VA_SHOWTITLE
                }
            }
            if (column.property === 'STAFFCODE' || column.property === 'ARRCITYCODE' || column.property === 'CHECKINDAYS' || column.property === 'EXPENSEKINDCODE') {
                if (row.CHECKINDAYS !== null && row.CHECKINDAYS !== undefined && row.HOTELSTANDARD) {
                    row.BILLMONEY = row.CHECKINDAYS * row.HOTELSTANDARD
                    row.BILLMONEY_VA_SHOWTITLE = XEUtils.commafy(row.BILLMONEY, {fixed: 2})
                } else {
                    delete row.BILLMONEY
                    delete row.BILLMONEY_VA_SHOWTITLE
                }
            }
            // 住宿信息和交通信息的申请金额汇总到主表申请金额
            if (column.property === 'BILLMONEY' || column.property === 'STAFFCODE' || column.property === 'ARRCITYCODE' || column.property === 'CHECKINDAYS' || column.property === 'EXPENSEKINDCODE') {
                const hotelMoney = this.$refs.hotelInfo.getData().map(item => item.BILLMONEY).reduce((total, currentValue) => total + (currentValue || 0), 0)
                const trafficMoney = this.$refs.trafficInfo.getData().map(item => item.BILLMONEY).reduce((total, currentValue) => total + (currentValue || 0), 0)
                this.mastertable.BILLMONEY = hotelMoney + trafficMoney
            }
            this.$refs.hotelInfo.$refs.editable.refresh()
        },
        async handleTrafficInfoChange (row, column, cell, event) {
            // const {EXPENSEKINDCODE, UNITCODE} = this.mastertable
            const {UNITCODE: {name: UNITCODE}} = this.mastertable
            // 根据出行人带出职级
            if (column.property === 'STAFFCODE') {
                if (row.STAFFCODE) {
                    const {data: {rows: [staffInfo]}} = await this.$http.post('/api/vmclient/baseData/list', {tableName: 'MD_STAFF', stopflag: -1, code: row.STAFFCODE})
                    row.POSITIONCODE = staffInfo.positioncode
                    if (staffInfo.positioncode) {
                        const {data: {rows: [positionInfo]}} = await this.$http.post('/api/vmclient/baseData/list', {tableName: 'MD_POSITION', stopflag: -1, code: staffInfo.positioncode})
                        row.POSITIONCODE_VA_SHOWTITLE = positionInfo.showTitle
                    } else {
                        delete row.POSITIONCODE
                        delete row.POSITIONCODE_VA_SHOWTITLE
                    }
                } else {
                    delete row.POSITIONCODE
                    delete row.POSITIONCODE_VA_SHOWTITLE
                }
            }
            // 根据入住城市带出城市分类
            if (column.property === 'ARRCITYCODE') {
                if (row.ARRCITYCODE) {
                    const {data: {rows: [cityInfo]}} = await this.$http.post('/api/vmclient/baseData/list', {tableName: 'MD_CITY', stopflag: -1, code: row.ARRCITYCODE})
                    if (cityInfo.citytypecode) {
                        const {data: {rows: [citypeInfo]}} = await this.$http.post('/api/vmclient/baseData/list', {tableName: 'MD_CITYTYPE', stopflag: -1, code: cityInfo.citytypecode})
                        row.CITYTYPECODE = citypeInfo.code
                        row.CITYTYPECODE_VA_SHOWTITLE = citypeInfo.showTitle
                    } else {
                        delete row.CITYTYPECODE
                        delete row.CITYTYPECODE_VA_SHOWTITLE
                    }
                } else {
                    delete row.CITYTYPECODE
                    delete row.CITYTYPECODE_VA_SHOWTITLE
                }
            }
            // 根据主表组织机构、消费类型、子表当前行的职级、城市分类带出差旅标准（职员、到达城市变化时）
            if (column.property === 'STAFFCODE' || column.property === 'ARRCITYCODE' || column.property === 'EXPENSEKINDCODE') {
                if (UNITCODE && row.EXPENSEKINDCODE && row.POSITIONCODE && row.CITYTYPECODE) {
                    const {data: travelControl} = await this.$http.post('/api/cfasserver/cfasfo/travelcontrol/get', {
                        positioncode: row.POSITIONCODE,
                        expensekindcode: row.EXPENSEKINDCODE,
                        unitcode: UNITCODE,
                        citytypecode: row.CITYTYPECODE
                    })
                    // 根据差旅标准带出飞机舱位和火车席等级
                    if (travelControl.data && travelControl.data.length && travelControl.data[0].planepositioncode) {
                        const {data: {rows: [aircraftcabinInfo]}} = await this.$http.post('/api/vmclient/baseData/list', {
                            tableName: 'MD_AIRCRAFTCABIN',
                            stopflag: -1,
                            code: travelControl.data[0].planepositioncode
                        })
                        row.PLANEPOSITIONCODE = travelControl.data[0].planepositioncode
                        row.PLANEPOSITIONCODE_VA_SHOWTITLE = aircraftcabinInfo.showTitle
                    } else {
                        delete row.PLANEPOSITIONCODE
                        delete row.PLANEPOSITIONCODE_VA_SHOWTITLE
                    }
                    if (travelControl.data && travelControl.data.length && travelControl.data[0].trainseatscode) {
                        const {data: {rows: [traingradeInfo]}} = await this.$http.post('/api/vmclient/baseData/list', {
                            tableName: 'MD_TRAINTGRADE',
                            stopflag: -1,
                            code: travelControl.data[0].trainseatscode
                        })
                        row.TRAINSEATSCODE = travelControl.data[0].trainseatscode
                        row.TRAINSEATSCODE_VA_SHOWTITLE = traingradeInfo.showTitle
                    } else {
                        delete row.TRAINSEATSCODE
                        delete row.TRAINSEATSCODE_VA_SHOWTITLE
                    }
                } else {
                    delete row.PLANEPOSITIONCODE
                    delete row.PLANEPOSITIONCODE_VA_SHOWTITLE
                    delete row.TRAINSEATSCODE
                    delete row.TRAINSEATSCODE_VA_SHOWTITLE
                }
            }
            // 住宿信息和交通信息的申请金额汇总到主表申请金额（申请金额变化时）
            if (column.property === 'BILLMONEY') {
                const hotelMoney = this.$refs.hotelInfo.getData().map(item => item.BILLMONEY).reduce((total, currentValue) => total + (currentValue || 0), 0)
                const trafficMoney = this.$refs.trafficInfo.getData().map(item => item.BILLMONEY).reduce((total, currentValue) => total + (currentValue || 0), 0)
                this.mastertable.BILLMONEY = hotelMoney + trafficMoney
            }
            this.$refs.trafficInfo.$refs.editable.refresh()
        },
        handleTableAddRow () {
            this.computedNavStyle()
        },
        handleTableDeleteRow () {
            const hotelMoney = this.$refs.hotelInfo.getData().map(item => item.BILLMONEY).reduce((total, currentValue) => total + (currentValue || 0), 0)
            const trafficMoney = this.$refs.trafficInfo.getData().map(item => item.BILLMONEY).reduce((total, currentValue) => total + (currentValue || 0), 0)
            this.mastertable.BILLMONEY = hotelMoney + trafficMoney
            this.computedNavStyle()
        },
        async ctripSSO () {
            try {
                const { data } = await this.$http.post('/api/cfasserver/cfasfo/btm/ctrip/sso', {})
                if (data.code === 0) {
                    const newWindow = window.open('')
                    newWindow.document.write(data.msg)
                    newWindow.document.close()
                } else {
                    this.$Message.error('打开失败：' + data.msg)
                }
            } catch (e) {
                this.$Message.error('打开失败：' + e.message)
                throw new Error(e)
            }
        },
        /**
         * 工具栏相关事件
         */
        // 新增
        async handleBillAdd () {
            this.currModelState = 'add'
            this.$refs.travelApplyForm.resetFields()
            const {data: {data: modelData}} = await this.$http.post('/api/cfasserver/bill/edit/CFAS_B_TRAVELAPPLY/null/patch', {type: 'bill-add', model: {}})
            this.model = modelData
            this.refreshBillList(modelData)
            this.mastertable = modelData.data.FO_APPLOADBILL[0]
            this.id = modelData.id
            this.hotelInfoData = modelData.data.FO_APPLOADBILL_ITEM.filter(item => item.TRAVELTYPE === 1)
            this.trafficInfoData = modelData.data.FO_APPLOADBILL_ITEM.filter(item => item.TRAVELTYPE === 2)
        },
        // 修改
        async handleModifyBill () {
            const {data: {data}} = await this.$http.post('/api/cfasserver/bill/edit/CFAS_B_TRAVELAPPLY/null/patch', {
                type: 'bill-edit',
                model: {'master.BILLCODE': this.mastertable.BILLCODE, 'master.VER': this.mastertable.VER}
            })
            this.model = data
            this.refreshBillList(data)
            this.id = data.id
            this.mastertable = data.data.FO_APPLOADBILL[0]
            this.hotelInfoData = data.data.FO_APPLOADBILL_ITEM.filter(item => item.TRAVELTYPE === 1)
            this.trafficInfoData = data.data.FO_APPLOADBILL_ITEM.filter(item => item.TRAVELTYPE === 2)
            this.currModelState = 'edit'
        },
        validateField (ruleField) {
            return new Promise(resolve => {
                this.$refs['travelApplyForm'].validateField(ruleField, message => {
                    if (message) {
                        this.$Message.info(message)
                        resolve(false)
                    } else {
                        resolve(true)
                    }
                })
            })
        },
        // 保存
        async beforeSave () {
            setTimeout(async () => {
                for (const ruleField in this.travelApplyRule) {
                    const flag = await this.validateField(ruleField)
                    if (!flag) {
                        return
                    }
                }
                this.$refs['travelApplyForm'].validate(async (valid) => {
                    if (valid) {
                        const {BEGINDATE, ENDDATE} = this.mastertable
                        if (BEGINDATE && ENDDATE && BEGINDATE > ENDDATE) {
                            this.$Message.info('预订开始日期不能晚于预订结束日期')
                            return
                        }
                        this.handleSaveBill()
                    }
                })
            })
        },
        async handleSaveBill () {
            // 构建请求参数
            const data = {}
            // 单据子表 - 住宿信息
            const hotelInfo = this.$refs.hotelInfo.getData().map(item => {
                item.TRAVELTYPE = 1
                return item
            })
            // 单据子表 - 交通信息
            const trafficInfo = this.$refs.trafficInfo.getData().map(item => {
                item.TRAVELTYPE = 2
                return item
            })
            data.FO_APPLOADBILL = [this.mastertable]
            data.FO_APPLOADBILL_ITEM = hotelInfo.concat(trafficInfo).map(item => {
                // TODO 暂时前端生成，后续改成监听增行事件，后台生成
                item.ID = uuid()
                item.MASTERID = this.mastertable.ID
                item.BILLCODE = this.mastertable.BILLCODE
                return item
            })
            try {
                // const url = this.billcode ? travelApplyApi.update(this.billcode) : travelApplyApi.add
                // const {data: {code, msg}} = await this.$http.post(url, data)
                // if (code === 0) {
                //     this.$Message.success('保存成功')
                //     this.handleClose()
                // } else {
                //     throw new Error(msg)
                // }
                const state = this.currModelState === 'edit' ? 2 : 1
                const {data: {code, msg, exception, data: modelData}} = await this.$http.post(`/api/cfasserver/bill/edit/CFAS_B_TRAVELAPPLY/${this.id}/patch`, {type: 'bill-save', model: {state, data}})
                if (code === 0) {
                    this.$Message.success('保存成功')
                    this.model = data
                    this.refreshBillList(modelData)
                    this.id = modelData.id
                    this.mastertable = modelData.data.FO_APPLOADBILL[0]
                    this.hotelInfoData = modelData.data.FO_APPLOADBILL_ITEM.filter(item => item.TRAVELTYPE === 1)
                    this.trafficInfoData = modelData.data.FO_APPLOADBILL_ITEM.filter(item => item.TRAVELTYPE === 2)
                    this.currModelState = 'view'
                } else {
                    throw new Error(exception || msg)
                }
            } catch (e) {
                this.$Message.success(`保存失败：${e.message}`)
                throw new Error(e)
            }
        },
        async handleBillCommit () {
            this.$Modal.confirm({
                title: '是否提交',
                content: '您是否确定提交该单据?',
                onOk: async () => {
                    const {data: {data}} = await this.$http.post('/api/cfasserver/bill/edit/CFAS_B_TRAVELAPPLY/null/patch', {
                        type: 'bill-commit',
                        model: {'master.BILLCODE': this.mastertable.BILLCODE, 'master.VER': this.mastertable.VER}
                    })
                    this.model = data
                    this.refreshBillList(data)
                    this.id = data.id
                    this.mastertable = data.data.FO_APPLOADBILL[0]
                    this.hotelInfoData = data.data.FO_APPLOADBILL_ITEM.filter(item => item.TRAVELTYPE === 1)
                    this.trafficInfoData = data.data.FO_APPLOADBILL_ITEM.filter(item => item.TRAVELTYPE === 2)
                    this.currModelState = 'view'
                    this.$Message.success('提交成功')
                }
            })
        },
        // 删除
        handleDeleteBill () {
            this.$Modal.confirm({
                title: '提示信息',
                content: '确定要删除当前单据吗？',
                onOk: async () => {
                    try {
                        const {data: {data, code, msg}} = await this.$http.post('/api/cfasserver/bill/edit/CFAS_B_TRAVELAPPLY/null/patch', {
                            type: 'bill-delete',
                            model: {'master.BILLCODE': this.mastertable.BILLCODE, 'master.VER': this.mastertable.VER}
                        })
                        this.model = data
                        this.refreshBillList(data)
                        if (code === 0) {
                            this.$Message.success('删除成功')
                            this.id = data.id
                            this.mastertable = {
                                CREATEUSER: {},
                                BILLCODE: '',
                                URGENTSTATECODE: {}
                            }
                            this.hotelInfoData = data.data.FO_APPLOADBILL_ITEM.filter(item => item.TRAVELTYPE === 1)
                            this.trafficInfoData = data.data.FO_APPLOADBILL_ITEM.filter(item => item.TRAVELTYPE === 2)
                            this.currModelState = 'view'
                        } else {
                            throw new Error(msg)
                        }
                    } catch (e) {
                        this.$Message.error(`删除失败：${e.message}`)
                        throw new Error(`删除失败：${e.message}`)
                    }
                }
            })
        },
        async handleWorkflowTrace () {
            const {data} = await this.$http.post('/api/cfasserver/todo/process/view', {extInfo: {bizcode: this.mastertable.BILLCODE}})
            if (data.length) {
                this.$Modal.info({
                    closable: true,
                    width: 960,
                    render: h => {
                        return h(WorkflowModal, {
                            props: {
                                title: '流程查看',
                                processData: data
                            }
                        })
                    }
                })
            } else {
                this.$Message.error('单据未提交工作流')
            }
        },
        async handleSyncTravelOrder () {
            try {
                const {BILLCODE, DEFINECODE} = this.mastertable
                const {data} = await this.$http.post('/api/cfasserver/cfasfo/btm/ctrip/syncTravelOrder', {billcode: BILLCODE, definecode: DEFINECODE})
                if (data.code === 0) {
                    this.$Message.success('同步出差申请单成功')
                } else {
                    throw new Error(data.msg)
                }
            } catch (e) {
                this.$Message.error(`同步出差申请单失败：${e.message}`)
            }
        },
        // 关闭
        handleClose () {
            this.$routerTab.getObj().close()
        },
        refreshBillList (modelData) {
            const { ID: oldId, VER: oldVer } = modelData.data.FO_APPLOADBILL[0] || {}
            const { ID: newId, VER: newVer } = this.mastertable || {}
            if ((oldId === newId || newId === null) && oldVer !== newVer) {
                const { $bus } = this
                if ($bus) $bus.$emit('bill_updated', {defineCode: this.mastertable.DEFINECODE})
            }
        },
        // 预算检查
        async handleBudgetCheck () {
            // 构建请求参数
            const data = {}
            // 单据子表 - 住宿信息
            const hotelInfo = this.$refs.hotelInfo.getData().map(item => {
                item.TRAVELTYPE = 1
                return item
            })
            // 单据子表 - 交通信息
            const trafficInfo = this.$refs.trafficInfo.getData().map(item => {
                item.TRAVELTYPE = 2
                return item
            })
            data.FO_APPLOADBILL = [this.mastertable]
            data.FO_APPLOADBILL_ITEM = hotelInfo.concat(trafficInfo)
            const {DEFINECODE} = this.mastertable
            const state = this.currModelState === 'add' ? 1 : this.currModelState === 'edit' ? 2 : 3
            const {data: rst} = await this.$http.post(`/api/cfasserver/cfasfo/budCtrlPolicy/${DEFINECODE}/check/${state}`, data)
            return rst
        },
        // @deprecated 预算保存走模型的预算保存
        async handleBudgetSaveConfirm1 (rows) {
            const {data} = await this.$http.post('/api/cfasserver/cfasfo/budCtrlPolicy/save', rows)
            if (data.code === 0) {
                this.handleSaveBill()
            } else {
                this.$Message.error(`预算保存失败：${data.msg}`)
            }
        }
    }
}
</script>

<style scoped lang="less">
    .ivu-form-item {
        margin-bottom: 12px;
    }
    .ivu-collapse {
        border: 0;
    }
    .bill-body{
        height: calc(100% - 44px);
        overflow: auto;
        padding: 0px 0px 12px 12px
    }
    .no-toolbar-bill-body{
        height: 100%;
        overflow: auto;
        padding: 0px 0px 12px 12px
    }
    .va-anchor-ink-ball,.va-anchor-ink-ball-back-top{
        display: inline-block;
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: 2px solid #C6C6C6;
        background-color: #fff;
        left: -1px;
        top: 10px;
        -webkit-transition: top 0.2s ease-in-out;
        transition: top 0.2s ease-in-out;
        -webkit-transform: translate(-50%, 2px);
        transform: translate(-50%, 2px);
    }
    .va-anchor{
        & /deep/.ivu-anchor-link-title{
             display: inline;
        }
        & /deep/.ivu-anchor-link{
            position: relative;
        }
        & /deep/.ivu-anchor-ink{
            height: calc(100% - 10px);
        }
    }
    .va-anchor-link-back-top{
        & /deep/.ivu-anchor-link-title{
            color:#515a6e;
        }
    }
    .ivu-anchor-link-active{
        .va-anchor-ink-ball{
            border: 2px solid #03A4AD;
        }
    }
</style>

<style>
    .custom-panel > .ivu-collapse-header {
        border-bottom: 1px solid #E8E8E8 !important;
        padding-left: 0 !important;
    }
    .custom-panel > .ivu-collapse-content {
        padding: 0 !important;
    }
</style>
