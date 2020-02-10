<template>
    <div>
        <div>
            <Form ref="queryForm" :label-width="90" :model="queryForm">
                <Row>
                    <i-col span="6">
                        <FormItem label="组织机构" prop="orgname">
                            <Input placeholder="组织机构" clearable v-model.trim="queryForm.orgname"/>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="制单人" prop="billmakeuser">
                            <Select v-model="queryForm.billmakeuser">
                                <Option v-for="item in billmakeusers" :key="item.username" :value="item.username">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem label="接收时间">
                            <Row>
                                <i-col span="11">
                                    <FormItem prop="receivingtimeStart">
                                        <Date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" v-model="queryForm.receivingtimeStart"
                                        @on-change="(value)=>handleDatePickerChange('receivingtimeStart', value)"></Date-picker>
                                    </FormItem>
                                </i-col>
                                <i-col span="2" style="text-align: center">-</i-col>
                                <i-col span="11">
                                    <FormItem prop="receivingtimeEnd">
                                        <Date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间" v-model="queryForm.receivingtimeEnd"
                                         @on-change="(value)=>handleDatePickerChange('receivingtimeEnd', value)"></Date-picker>
                                    </FormItem>
                                </i-col>
                            </Row>
                        </FormItem>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="6" style="float:right;text-align: right;">
                        <Button @click="handleClear('queryForm')">清空</Button>
                        <Button @click="handleQuery('queryForm')" type="primary">查询</Button>
                    </i-col>
                </Row>
            </Form>
        </div>
        <div>
            <el-table :data="tableData" style="width: 100%" >
                <el-table-column v-for="(th, key) in tableHeader" :key="key" :prop="th.prop" :label="th.label" align="center" :formatter="th.formatter">
                </el-table-column>
            </el-table>

        <Page :total="this.total" :current="this.condition.pageIndex" :page-size="this.condition.limit" show-elevator show-sizer show-total
            placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size-opts="[20, 50, 100, 200]">
        </Page>

        </div>
    </div>
</template>

<script>
import {cfasTodoApi} from '@/api/cfas'

export default {
    data () {
        return {
            clearData: false,
            billmakeusers: {},
            queryForm: {
                orgname: '',
                billmakeuser: '',
                receivingtimeStart: '',
                receivingtimeEnd: '',
                customcondition: '',
                limit: 20,
                offset: 0,
                pageIndex: 1
            },
            condition: {},
            // 表头数据
            tableHeader: [
                { prop: 'RECEIVINGTIME', label: '接收时间' },
                { prop: 'BILLCODE', label: '单据编号' },
                { prop: 'BILLTYPE', label: '单据类型' },
                { prop: 'ORGNAME', label: '组织机构' },
                { prop: 'BILLMAKEUSERNAME', label: '制单人' },
                { prop: 'AMOUNT', label: '金额' },
                { prop: 'REMARK', label: '备注' }
            ],
            tableData: [],
            total: 0
        }
    },
    methods: {
        // 查询相关内容
        handleDatePickerChange (fieldName, value) {
            this.queryForm[fieldName] = value
        },
        handleClear (name) {
            this.clearData = true
            this.$nextTick(() => {
                this.clearData = false
                this.$refs[name].resetFields()
                this.condition = Object.assign({}, this.queryForm)
                this.getTodoList()
            })
        },
        handleQuery (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    const {receivingtimeStart, receivingtimeEnd} = this.queryForm
                    if (receivingtimeStart && receivingtimeEnd && receivingtimeStart > receivingtimeEnd) {
                        this.$Message.info('开始时间不能晚于结束时间')
                    } else {
                        this.condition = Object.assign({}, this.queryForm)
                        this.getTodoList()
                    }
                }
            })
        },
        // 分页相关
        pageChange (pageIndex) {
            this.condition.pageIndex = pageIndex
            this.condition.offset = (pageIndex - 1) * this.condition.limit
            this.getTodoList()
        },
        pageSizeChange (pageSize) {
            let currentPage = this.condition.pageIndex
            this.condition.pageIndex = 1
            this.condition.offset = 0
            this.condition.limit = pageSize
            if (currentPage === 1) {
                this.getTodoList()
            }
        },
        // 获取待办列表
        async getTodoList () {
            const {data: {rs, rows, total}} = await this.$http.post(cfasTodoApi.todo, this.condition)
            if (rs.code === 0) {
                this.tableData = rows
                this.total = total
            }
        },
        // 获取待办列表
        async getbillMakerUserList () {
            const {data: {code, data}} = await this.$http.get(cfasTodoApi.billmakeusers)
            if (code === 0) {
                this.billmakeusers = data
            }
        }
    },
    mounted () {
        this.condition = Object.assign({}, this.queryForm)
        this.getTodoList()
        this.getbillMakerUserList()
    }
}
</script>
