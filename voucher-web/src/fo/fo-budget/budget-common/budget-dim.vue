<template>
<div style="height: 42px; padding-left: 16px">
    <Form ref="buddeptForm" :model="buddim" >
        <i-row>
            <i-col span="1" style="margin-right:10px; min-width: 70px; height: 42px; padding-top:5px; vertical-align: middle;">
                <FormItem >
                    <div>预算周期：</div>
                </FormItem>
            </i-col>
             <i-col span="1" class="bud-dim-icol bud-dim-icol-right" style="padding-top: 4px;">
                <FormItem prop="budcycle">
                    <Select class="bud-dim-input" ref="budcycle" v-model="buddim.budcycle" placeholder=""  @on-change="changeDim">
                        <Option v-for="item in budcycleList"  :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </i-col>
            <i-col span="4" class="bud-dim-icol bud-dim-icol-right" v-if="buddim.budcycle !== 'J'">
                <FormItem prop="budyear">
                    <DatePicker class="bud-dim-input" style="width: 100%;" ref="buddate" v-if="buddim.budcycle === 'N'" type="year" placeholder="请选择时期" v-model="buddim.budyear" @on-change="changeDim" ></DatePicker>
                    <DatePicker class="bud-dim-input" style="width: 100%;" ref="buddate" v-if="buddim.budcycle === 'Y'" type="month" placeholder="请选择时期" v-model="buddim.budyear" @on-change="changeDim"></DatePicker>
                </FormItem>
            </i-col>
            <i-col span="2" class="bud-dim-icol" v-if="buddim.budcycle === 'J'">
                <FormItem prop="budyear">
                    <DatePicker class="bud-dim-input" style="width: 100%;" ref="buddate"  type="year" placeholder="请选择时期" v-model="buddim.budyear" @on-change="changeDim"></DatePicker>
                </FormItem>
            </i-col>
            <i-col span="2" v-if="buddim.budcycle === 'J'" class="bud-dim-icol bud-dim-icol-right" style="min-width: 100px; padding-top: 4px;">
                <FormItem prop="cycleitem" >
                    <Select class="bud-dim-input" style="width: 100%"  v-model="buddim.cycleitem" placeholder=""  @on-change="changeDim">
                        <Option v-for="item in bugquarterList"  :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </i-col>
            <i-col v-if="budtype === budtypes.department" span="5" class="bud-dim-icol" style="min-width: 100px;padding-top: 4px;">
                <FormItem prop="deptcode" style="width:98%;">
                    <va-basedata class="bud-dim-input" ref="buddept" tbName="MD_DEPARTMENT" :param="deptParam" v-model="buddim.deptcode" @on-change="changeDim('deptcode')"></va-basedata>
                </FormItem>
            </i-col>
            <i-col v-if="budtype === budtypes.project" span="5" class="bud-dim-icol" style="min-width: 100px;padding-top: 4px;">
                <FormItem prop="prjcode" style="width:98%;">
                    <va-basedata class="bud-dim-input" ref="budProject" tbName="MD_PROJECT" :param="prjParam" v-model="buddim.prjcode" @on-change="changeDim('prjcode')"></va-basedata>
                </FormItem>
            </i-col>
        </i-row>
    </Form>
</div>
</template>

<script>
import { bugquarterList, budcycleList, budtypes } from '../budget-common/const'
export default {
    name: 'DeptDim',
    components: {
    },
    props: {
        budtype: String,
        buddim: Object,
        treenode: Object
    },
    computed: {
        deptParam () {
            if (!this.treenode || !this.treenode.code) {
                return null
            }
            let param = {
                unitcode: this.treenode.code,
                stopflag: -1
            }
            return param
        },
        prjParam () {
            if (!this.treenode || !this.treenode.code) {
                return null
            }
            let param = {
                unitcode: this.treenode.code,
                stopflag: -1
            }
            return param
        }
    },
    data () {
        return {
            bugquarterList: bugquarterList,
            budcycleList: budcycleList,
            budtypes: budtypes
        }
    },
    methods: {
        changeDim (val) {
            this.$emit('changeDim', val)
        },
        getDepartmentTitle () {
            let deptTitle = this.$refs.buddept.showText
            return deptTitle
        },
        getProjectTitle () {
            let prjTitle = this.$refs.budProject.showText
            return prjTitle
        }
    }
}
</script>

<style lang="less" scoped>
    .bud-dim-icol {
        height: 42px;
        padding-top: 5px;
    }
    .bud-dim-icol-right {
        margin-right: 20px;
    }
    .bud-dim-input {
        height: 32px;
    }
</style>
