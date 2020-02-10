<template>
<div>
    <Modal v-model="modal" :title="title" @on-ok="ok" @on-cancel="cancel" :loading="loading">
        <Form :model="formItem" :label-width="80">
            <FormItem label="预算年度">

                <DatePicker type="year" placeholder="选择想要进行重算的年度" v-model="formItem.year" style='width: 100%;'></DatePicker>

            </FormItem>
            <FormItem label="组织机构">

                <va-basedata class="budget-redone-unit" :readonly=false v-model="formItem.unitcodes" :tbName="tablename" :multiple="multiple" :delimiter="delimiter"></va-basedata>
            </FormItem>
        </Form>

        <div>
            <Steps :current="current" :status="stepstatus">
                <!-- <Step :title="one" :content="contentone" v-if="false"></Step> -->
                <Step :title="one" :content="contentone"></Step>
            </Steps>

        </div>

        <!-- <Circle :percent="percent" v-if='circlestatus === 2'>
            <span class="demo-Circle-inner" style="font-size:24px">{{percent}}%</span>
        </Circle>
        <Circle :percent="percent" stroke-color="#5cb85c"  v-else-if ='circlestatus === 0'>
            <Icon type="ios-checkmark" size="60" style="color:#5cb85c"></Icon>
        </Circle>
        <Circle :percent="percent" stroke-color="#ff5500" v-else-if ='circlestatus === 1'>
            <span class="demo-Circle-inner">
                <Icon type="ios-close" size="50" style="color:#ff5500"></Icon>
            </span>
        </Circle> -->

        <div slot="footer">
            <Button type="text" size="large" :loading="loading"  @click="cancel">关闭</Button>
            <Button type="primary" size="large" :loading="loading" @click="ok">开始重算</Button>
        </div>
    </Modal>

</div>
</template>

<script>

import { formatDate } from '@/utils'
export default {
    data () {
        return {
            modal: true,
            loading: false,
            formItem: {
                unitcodes: {

                },
                year: formatDate(new Date(), 'yyyy')
            },
            type: this.title === '部门预算' ? 1 : this.title === '项目预算' ? 2 : this.title === '部门预算' ? 3 : 0,

            // 是否多选
            multiple: true,
            // 多选时分隔符
            delimiter: ',',

            tablename: 'MD_ORG',

            // step
            current: 0,
            stepstatus: 'wait',
            // icon: 'ios-alert-outline',
            one: '待进行',
            contentone: '重算待处理',
            // two: '待进行',
            // contentwo: '删除预算明细表中的数据，创建单据模型',
            // third: '待进行',
            // contentthird: '单据执行占预算操作，更新预算明细表数据，记录预算维度',
            // four: '待进行',
            // contentfour: '更新预算余额表数据',

            // circle
            percent: 0,
            circlestatus: 2
        }
    },
    props: {
        title: String,
        budtype: String
    },

    methods: {
        ok () {
            this.resetStatus()
            if (this.current === 0) {
                this.one = '进行中'
                this.contentone = '重算进行中'
            }

            this.BudgetRedone(this.current)
        },
        cancel () {
            this.$emit('closeBudgetRedone')
        },

        // 重算接口
        async BudgetRedone (current) {
            if (this.current !== 0) {
                return
            }
            try {
                const {data: {rs, total}} = await this.$http.post('/api/cfasserver/budget/redone/yearAndUnit', {
                    budtype: this.budtype,
                    year: formatDate(this.formItem.year, 'yyyy'),
                    unitcodes: this.formItem.unitcodes
                })

                this.one = '已完成'
                if (rs.code === 0) {
                    this.$Message.success('重算成功')
                    this.stepstatus = 'finish'

                    this.contentone = '重算成功，单据数量：' + total + '张'
                    // console.log(rows)
                    // console.log(this.formItem.year + this.formItem.unitcodes + '重算成功')
                } else {
                    this.one = '重算失败'
                    this.contentone = rs.msg
                    this.stepstatus = 'error'

                    // throw new Error(rs.msg)
                    // console.log(this.formItem.year + this.formItem.unitcodes + rs.msg)
                }
            } catch (e) {
                this.one = '重算失败'
                // console.log(this.formItem.year + this.formItem.unitcodes + e)
                this.contentone = '重算发生错误'
                this.stepstatus = 'error'

                throw new Error(e)
            }
        },
        resetStatus () {
            this.one = '待进行'
            this.contentone = '重算待处理'
            this.stepstatus = 'wait'
            // this.icon = 'ios-alert-outline'
        }
    }
}
</script>

<style>

.ivu-steps {
    padding-left: 12px;
}

 .ivu-steps-head-inner > .ivu-steps-icon {
    color: black;
}
</style>
