<!-- 单据预览预算执行界面 -->
<template>
<div>
    <h4>{{title}}</h4>
    <Collapse simple accordion>

        <Panel v-bind:key="key" v-for="(element, key) in budgetdata" v-if="element.outbudget === 1 || param === 'preview'">
            {{element.budInfo.simplemessage}}

            <div slot="content">
                <!-- <label>{{element.budInfo.budgetctrlname}}</label> -->

                <Form label-position="right" :label-width="100">

                    <FormItem label="时期">
                        <label class="ivu-form-item-label ivu-form-item-label-left-detail">{{element.budInfo.budgetCycleItemName}}</label>
                    </FormItem>
                    <FormItem label="组织机构">
                        <label class="ivu-form-item-label ivu-form-item-label-left-detail">{{element.budInfo.unitName}}</label>
                    </FormItem>
                    <FormItem label="项目" v-if ='element.budInfo.projectName'>
                        <label class="ivu-form-item-label ivu-form-item-label-left-detail">{{element.budInfo.projectName}}</label>
                    </FormItem>
                     <FormItem label="预算部门" v-if ='element.budInfo.deptName'>
                        <label class="ivu-form-item-label ivu-form-item-label-left-detail">{{element.budInfo.deptName}}</label>
                    </FormItem>
                    <FormItem label="预算科目">
                        <label class="ivu-form-item-label ivu-form-item-label-left-detail">{{element.budInfo.budgetDimensionName}}</label>
                    </FormItem>
                    <FormItem label="控制方式">
                        <label class="ivu-form-item-label ivu-form-item-label-left-detail">{{element.budInfo.budgettype}}</label>
                    </FormItem>
                    <FormItem label="预算总额为">

                        <label  :title=element.budInfo.budmoney class="ivu-form-item-label ivu-form-item-label-right-detail">
                            {{ dataFormat(element.budInfo.budmoney) }}
                        </label>

                    </FormItem>
                    <FormItem label="已发生额为">
                        <label :title=element.budInfo.usedmoney class="ivu-form-item-label ivu-form-item-label-right-detail">

                            {{ dataFormat(element.budInfo.usedmoney) }}
                        </label>
                    </FormItem>
                    <FormItem label="已超预算为">
                        <label :title=element.budInfo.overmoney class="ivu-form-item-label ivu-form-item-label-right-detail">

                            {{ dataFormat(element.budInfo.overmoney) }}
                        </label>
                    </FormItem>
                </Form>
            </div>
        </Panel>
    </Collapse>
</div>
</template>

<script>

import vaWeb from 'va-web'
export default {
    name: 'TestModal',

    props: {
        title: String,
        budgetdata: Array,
        action: String
    },
    data () {
        return {
            simpledata: this.budgetdata,
            param: this.action
        }
    },
    mounted () {
        this.initdata()
    },
    methods: {
        initdata () {

        },
        dataFormat (num) {
            return vaWeb.displayFormat.toThousands(vaWeb.displayFormat.strToFloat(num + '', 1, 2))
        }
    },
    created () {
        this.initdata()
    }
}
</script>

<style scoped>

.ivu-form-item {
    margin-bottom: 2px;
}

.ivu-form-item-label-left-detail {
    background: rgba(248, 248, 248, 1);
    border-radius: 2px;
    text-align: left;
    width: 100%;
}

.ivu-form-item-label-right-detail {
    background: rgba(248, 248, 248, 1);
    border-radius: 2px;
    width: 100%;
}
</style>

<style>

    .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
        height: auto !important;
    }

</style>
