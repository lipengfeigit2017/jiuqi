<template>
<div>
    <va-toolbar class="bud-toolbar-content">
        <va-toolbar-item title="保存" :disabled="saveDisabledFlag" @click="saveDataHandel"></va-toolbar-item>
        <va-toolbar-item title="提交" :disabled="submitDisabledFlag" @click="submitDataHandel"></va-toolbar-item>
        <va-toolbar-item title="调整" :disabled="adjustDisabledFlag" @click="editState"></va-toolbar-item>
        <va-toolbar-item title="导出模板" @click="exportTmplHandel"></va-toolbar-item>
        <va-toolbar-item title="导入" :disabled="importDisabledFlag" @click="importDataHandel"></va-toolbar-item>
        <va-toolbar-item title="导出" @click="exportDataHandel"></va-toolbar-item>
        <va-toolbar-item title="流程查看" :disabled="processDisabledFlag" @click="viewprocess"></va-toolbar-item>
    </va-toolbar>
</div>
</template>

<script>
export default {
    name: 'BudToolbar',
    props: {
        workflowstate: String,
        dataStopFlag: Boolean,
        ExistGridDate: Boolean,
        ExistGridEditData: Boolean
    },
    computed: {
        saveDisabledFlag () {
            if (this.dataStopFlag) {
                return true
            }
            if (this.workflowstate !== '未保存' && this.workflowstate !== '未提交' && this.workflowstate !== '已退回') {
                return true
            } else {
                if (!this.ExistGridEditData) {
                    return true
                } else {
                    return false
                }
            }
        },
        submitDisabledFlag () {
            if (this.dataStopFlag) {
                return true
            }
            if (this.workflowstate !== '未提交' && this.workflowstate !== '已退回' && this.workflowstate !== '调整中') {
                return true
            } else {
                if (this.ExistGridEditData) {
                    return true
                } else {
                    if (!this.ExistGridDate) {
                        return true
                    } else {
                        return false
                    }
                }
            }
        },
        importDisabledFlag () {
            if (this.dataStopFlag) {
                return true
            }
            if (this.workflowstate !== '未保存' && this.workflowstate !== '未提交' && this.workflowstate !== '已退回') {
                return true
            } else {
                return false
            }
        },
        adjustDisabledFlag () {
            if (this.dataStopFlag) {
                return true
            }
            if (this.workflowstate !== '审批通过' && this.workflowstate !== '已退回') {
                return true
            } else {
                return false
            }
        },
        processDisabledFlag () {
            if (this.workflowstate === '未提交' || this.workflowstate === '未保存' || this.workflowstate === '已退回') {
                return true
            } else {
                return false
            }
        }
    },
    data () {
        return {
        }
    },
    methods: {
        saveDataHandel () {
            this.$emit('saveData')
        },
        editState () {
            this.$emit('editState')
        },
        submitDataHandel () {
            this.$emit('submitData')
        },
        exportTmplHandel () {
            this.$emit('exportTmpl')
        },
        importDataHandel () {
            this.$emit('importData')
        },
        exportDataHandel () {
            // this.$Message.error('功能暂时关闭')
            this.$emit('exportData')
        },
        viewprocess () {
            this.$emit('openBudProcess')
        }
    }
}
</script>

<style scoped>
    .bud-toolbar-content{
        height: 32px;
        padding-left: 4px;
    }
</style>
