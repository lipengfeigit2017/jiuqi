<template>
    <div style="margin-bottom: 8px">
        <label style="width: 100px">预算时期：{{buddateInfo}}</label>
        <Divider type="vertical" />
        <label style="width: 100px">组织机构：{{orgTitle}}</label>
        <Divider v-if="datatype === 'department'" type="vertical" />
        <label style="width: 100px" v-if="datatype === 'department'">部门：{{deptTitle}}</label>
        <Divider v-if="datatype === 'project'" type="vertical" />
        <label style="width: 100px" v-if="datatype === 'project'">项目：{{prjTitle}}</label>
    </div>
</template>
<script>
import { biztype, orgParam } from './budget-audit-const'
import {
    vaOrganizationApi,
    vaBaseDataApi
} from '../../../api/va'
export default {
    props: {
        dataLoadFlag: Boolean,
        budtype: String,
        buddim: Object
    },
    watch: {
        dataLoadFlag (value) {
            if (value === true) {
                this.initBuddimInfo()
            }
        }
    },
    computed: {
        buddateInfo () {
            if (!this.buddimInfo.isInit) {
                return
            }
            let year = this.buddim['budyear']
            let cycle = this.buddim['budcycle']
            let item = this.buddim['cycleitem']
            let info = year + '年'
            if (cycle === 'Y') {
                info += item + '月'
            } else if (cycle === 'J') {
                let Jtitle = ''
                if (item === 1) {
                    Jtitle = '第一季度'
                } else if (item === 2) {
                    Jtitle = '第二季度'
                } else if (item === 3) {
                    Jtitle = '第三季度'
                } else if (item === 4) {
                    Jtitle = '第四季度'
                }
                info += Jtitle
            }
            return info
        },
        orgTitle () {
            return this.buddimInfo.organization.name
        },
        deptTitle () {
            return this.buddimInfo.department.name
        },
        prjTitle () {
            return this.buddimInfo.project.name
        },
        datatype () {
            if (this.budtype === biztype.department) {
                return 'department'
            } else if (this.budtype === biztype.project) {
                return 'project'
            } else if (this.budtype === biztype.organization) {
                return 'organization'
            }
        }
    },
    data () {
        return {
            buddimInfo: {
                organization: {},
                department: {},
                project: {},
                isInit: false
            }
        }
    },
    methods: {
        // 加载预算维度信息
        initBuddimInfo () {
            this.loadOrg()
            if (this.budtype === biztype.department) {
                this.loadDepartment()
            } else if (this.budtype === biztype.project) {
                this.loadProject()
            }
            this.buddimInfo.isInit = true
        },
        loadOrg () {
            if (!this.buddim.unitcode) {
                return
            }
            let param = {
                code: this.buddim.unitcode,
                categoryname: orgParam.categoryname,
                versiontitle: orgParam.versiontitle,
                stopflag: -1,
                recoveryflag: -1
            }
            this.$http.post(vaOrganizationApi.organization + '/get', param).then((res) => {
                const {data} = res
                if (data) {
                    this.buddimInfo.organization = data
                } else {
                    this.$message.error('未查询到组织机构')
                }
            }).catch((err) => {
                throw new Error(err)
            })
        },
        loadDepartment () {
            if (!this.buddim.deptcode) {
                return
            }
            let param = {
                tableName: 'MD_DEPARTMENT',
                code: this.buddim.deptcode
            }
            this.$http.post(vaBaseDataApi.basedata + '/list', param).then((res) => {
                const {data: {rs, rows}} = res
                if (rs.code === 0) {
                    this.buddimInfo.department = rows[0]
                } else {
                    this.$Message.error(rs.code)
                }
            }).catch((err) => {
                throw new Error(err)
            })
        },
        loadProject () {
            if (!this.buddim.prjcode) {
                return
            }
            let param = {
                tableName: 'MD_PROJECT',
                code: this.buddim.prjcode
            }
            this.$http.post(vaBaseDataApi.basedata + '/get', param).then((res) => {
                const {data: {rs, rows}} = res
                if (rs.code === 0) {
                    this.buddimInfo.project = rows[0]
                } else {
                    this.$Message.error(rs.code)
                }
            }).catch((err) => {
                throw new Error(err)
            })
        }
    }
}
</script>
