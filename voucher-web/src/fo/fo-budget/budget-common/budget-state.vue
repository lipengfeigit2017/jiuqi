<template>
    <div class="cfas-dim-content">
        <div style="display:inline;">{{label1}}</div>
        <div style="display:inline;"><Divider v-if="showSedlab" type="vertical" />{{label2}}</div>
        <Divider type="vertical" />状态：<span id="budStatePoint" class="budstate-point"></span>{{label3}}

    </div>
</template>

<script>
import $ from 'jquery'
import { budtypes } from '../budget-common/const'

export default {
    name: 'DeptState',
    data () {
        return {
        }
    },
    computed: {
        label1 () {
            return this.treenode.name
        },
        label2 () {
            if (this.budtype === budtypes.department) {
                return this.deptnode.name
            } else if (this.budtype === budtypes.project) {
                return this.prjnode.name
            } else {
                return ''
            }
        },
        label3 () {
            if (this.workflowstate === '未提交') {
                $('#budStatePoint').css({'background': 'rgba(255,157,0,1)', 'display': 'inline-block'})
            } else if (this.workflowstate === '已提交') {
                $('#budStatePoint').css({'background': 'rgba(0,140,248,1)', 'display': 'inline-block'})
            } else if (this.workflowstate === '已退回') {
                $('#budStatePoint').css({'background': 'rgba(245,88,88,1)', 'display': 'inline-block'})
            } else if (this.workflowstate === '审批通过') {
                $('#budStatePoint').css({'background': 'rgba(86,186,62,1)', 'display': 'inline-block'})
            } else {
                $('#budStatePoint').css({'display': 'none'})
            }
            return this.workflowstate
        },
        showSedlab () {
            if (this.budtype === budtypes.organization) {
                return false
            } else {
                return true
            }
        }
    },
    props: {
        budtype: String,
        workflowstate: String,
        treenode: Object,
        deptnode: Object,
        prjnode: Object
    },
    methods: {
    }
}
</script>

<style lang="less" scoped>
    .budstate-point {
        display: inline-block;
        margin-right: 4px;
        border-radius: 50%;
        position: relative;
        color: #888888;
        width: 6px;
        height: 6px;
        top: -2px;
    }
</style>

<style scoped>
    .cfas-dim-content{
        position: relative;
        left: 0;
        right: 0;
        line-height: 42px;
        margin-left: 14px;
    }
</style>
