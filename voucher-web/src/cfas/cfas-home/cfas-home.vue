<template>
    <div class="cfas-home">
        <Row class="cfas-home-content1">
            <i-col :md="12" :lg="6" v-for="(item,index) in todolist" :key="index" style="cursor: pointer;">
                <span @click="handleClick(index)">
                    <Card dis-hover :bordered="false">
                        <!--<Card dis-hover :bordered="false">-->
                        <div v-if="index === todolist.length - 1" class="cfas-home-card" style="border: 0">
                            <div>
                                <div class="card-title">{{item.title}}</div>
                                <div class="card-flex">
                                    <!--<span class="card-num">{{item.num}}</span>-->
                                    <ICountUp class="card-num" :endVal="item.num"/>
                                    <!--<span style="color: #FA6D6C;" class="card-icon iconfont icon_jiantoujian"></span>-->
                                </div>
                            </div>
                            <!--<span :class="['iconfont', item.icon]" style="font-size: 50px;"></span>-->
                            <svg class="icon" aria-hidden="true" style="height: 50px;width: 50px;">
                              <use :xlink:href="item.icon"></use>
                            </svg>
                        </div>
                        <div v-else class="cfas-home-card">
                            <div>
                                <div class="card-title">{{item.title}}</div>
                                <div class="card-flex">
                                    <!--<span class="card-num">{{item.num}}</span>-->
                                    <ICountUp class="card-num" :endVal="item.num"/>
                                    <!--<span v-if="index%2 === 0" class="card-icon iconfont icon_jiantouzeng"></span>-->
                                    <!--<span v-else style="color: #FA6D6C;" class="card-icon iconfont icon_jiantoujian"></span>-->
                                </div>
                            </div>
                            <!--<span :class="['iconfont', item.icon]" style="font-size: 50px;"></span>-->
                            <svg class="icon" aria-hidden="true" style="height: 50px;width: 50px;">
                              <use :xlink:href="item.icon"></use>
                            </svg>
                        </div>
                    </Card>
                </span>
            </i-col>
        </Row>
        <div class="cfas-home-content-title">我的账单</div>
        <Row class="cfas-home-content2">
            <i-col :md="24" :lg="8" v-for="(item,index) in bills" :key="index" style="cursor: pointer;">
                <span @click="handleClick2(index)">
                    <Card dis-hover :bordered="false">
                    <div v-if="index === bills.length - 1" class="cfas-home-card" style="border: 0">
                        <div class="card-billtitle">
                            {{item.billtitle}}
                            <!--<span class="card-billcode">{{item.billcode}}</span>-->
                        </div>
                        <div class="card-money">
                            <span>￥</span>
                            <!--{{item.money}}-->
                            <ICountUp class="money" :endVal="item.money" :options="{decimalPlaces: 2}"/>
                        </div>
                        <div class="card-org">{{item.unitname}}</div>
                        <!--<div calss="card-flex2" style="display: flex;justify-content: space-between;">
                            <span class="card-user">{{item.username}}</span>
                            <span class="card-date">{{item.billdate}}</span>
                        </div>-->
                    </div>
                    <div v-else class="cfas-home-card">
                        <div class="card-billtitle">
                            {{item.billtitle}}
                            <!--<span class="card-billcode">{{item.billcode}}</span>-->
                        </div>
                        <div class="card-money">
                            <span>￥</span>
                            <!--{{item.money}}-->
                            <ICountUp class="money" :endVal="item.money" :options="{decimalPlaces: 2}"/>
                        </div>
                        <div class="card-org">{{item.unitname}}</div>
                        <!--<div calss="card-flex2" style="display: flex;justify-content: space-between;">
                            <span class="card-user">{{item.username}}</span>
                            <span class="card-date">{{item.billdate}}</span>
                        </div>-->
                    </div>
                </Card>
                </span>
            </i-col>
        </Row>
        <div class="cfas-home-content-title">报账统计
            <!--<DatePicker placeholder="请选择日期"></DatePicker>-->
        </div>
        <Row class="cfas-home-content3" ref="charts">
            <!--<div style="background-color: #ffffff;padding: 12px 0 12px 24px;">-->
                <!--<Input icon="ios-search" style="width: 180px;margin-right: 16px;" placeholder="请输入文字"/>-->
                <!--<Select style="width: 180px;" placeholder="设置条件筛选显示"></Select>-->
            <!--</div>-->
            <i-col :md="24" :lg="9">
                <Card dis-hover :bordered="false">
                    <!--<div style="height: 300px;display: flex;align-items: center;justify-content: center;flex-direction: column">-->
                    <!--<div style="position: relative;height: 300px;text-align: center;">-->
                        <!--<Circle
                            :size="170"
                            :percent="62.5"
                            stroke-color="#008CF8">
                            <h1>58,800万</h1>
                            <div style="color:#93D384;margin-top: 24px;"><Icon type="md-arrow-up" />20%</div>
                        </Circle>
                        <span style="font-size: 14px;color:#888888;font-weight: 400;margin-top: 12px;">账目年度统计（2019年）</span>-->
                        <!--<Circle style="position: absolute; left: 0; opacity: 0.2;"
                                :size="170"
                                :percent="75"
                                stroke-color="#4BC0C6">
                            <h1>58,800万</h1>
                            20%
                        </Circle>-->
                    <!--</div>-->
                    <pie-chart style="height: 300px;padding-left: 24px;" :value="pieData" text="我的年度报销构成"/>
                </Card>
            </i-col>
            <i-col :md="24" :lg="15">
                <Card dis-hover :bordered="false">
                    <bar-chart style="height: 300px;" :value="barData" text="我的年度报销分布"/>
                </Card>
            </i-col>
        </Row>
    </div>
</template>

<script>
import BarChart from './bar-chart'
import PieChart from './pie-chart'
import ICountUp from 'vue-countup-v2'

export default {
    name: 'cfas-home',
    components: {BarChart, PieChart, ICountUp},
    data () {
        return {
            todolist: [
                {title: '我的待办', num: 0, icon: '#icon_wodedaiban'},
                {title: '我的已办', num: 0, icon: '#icon_wodeyiban'},
                {title: '我的待提交', num: 0, icon: '#icon_wodeyijie'},
                {title: '我的代报中', num: 0, icon: '#icon_wodehangcheng'}
            ],
            bills: [
                {billtitle: '借款余额', billcode: 'JQRJCLS000001', money: 0, unitname: '当前借款余额', username: '钱艳', billdate: '2018-12-06 17:58:58'},
                {billtitle: '报账中', billcode: 'JQRJCLS000001', money: 0, unitname: '审批未完成报账单', username: '常秀兰', billdate: '2018-12-06 17:58:58'},
                {billtitle: '报账退回', billcode: 'JQRJCLS000001', money: 0, unitname: '驳回及退回报账单', username: '秦明', billdate: '2018-12-06 17:58:58'}
                // {billtitle: '未报行程', billcode: 'JQRJCLS000001', money: 0, unitname: '当前未核销消费记录', username: '楮翠琳', billdate: '2018-12-06 17:58:58'}
            ],
            barData: {
                // '201901': Math.ceil(Math.random() * 10) * 1000,
                // '201902': Math.ceil(Math.random() * 10) * 1000,
                // '201903': Math.ceil(Math.random() * 10) * 1000,
                // '201904': Math.ceil(Math.random() * 10) * 1000,
                // '201905': Math.ceil(Math.random() * 10) * 1000,
                // '201906': Math.ceil(Math.random() * 10) * 1000,
                // '201907': Math.ceil(Math.random() * 10) * 1000,
                // '201908': Math.ceil(Math.random() * 10) * 1000,
                // '201909': Math.ceil(Math.random() * 10) * 1000,
                // '201910': Math.ceil(Math.random() * 10) * 1000,
                // '201911': Math.ceil(Math.random() * 10) * 1000,
                // '201912': Math.ceil(Math.random() * 10) * 1000
            },
            pieData: [
                // { value: Math.ceil(Math.random() * 10) * 10, name: '物业管理费' },
                // { value: Math.ceil(Math.random() * 10) * 10, name: '车位管理费' },
                // { value: Math.ceil(Math.random() * 10) * 10, name: '周转材料其他' },
                // { value: Math.ceil(Math.random() * 10) * 10, name: '差旅费' },
                // { value: Math.ceil(Math.random() * 10) * 10, name: '房屋租金' }
            ]
        }
    },
    async created () {
        this.getSection1Data()
        this.getSection2Data()
        this.getChartData()
    },
    mounted () {
        this.$nextTick(() => {
            const mainDom = document.getElementById('main-content')
            if (!mainDom) return

            const currDom = this.$el
            if (currDom.clientHeight < mainDom.clientHeight) {
                // this.$el.style.height = `${mainDom.clientHeight + 100}px`
                this.$refs.charts.$el.style.height = `${mainDom.clientHeight - 471}px`
            }
        })
        window.addEventListener('resize', this.setHeight, false)
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.setHeight, false)
    },
    methods: {
        async getSection1Data () {
            const {data: {data}} = await this.$http.get('/api/cfasserver/todo/count', {})
            this.todolist[0].num = data.taskUnFinishedCount || 0
            this.todolist[1].num = data.taskFinishedCount || 0
            const {data: data1} = await this.$http.post('/api/cfasserver/cfasfo/portal/queryToBeSubmitCount', {})
            this.todolist[2].num = data1.count || 0
            const {data: data2} = await this.$http.post('/api/cfasserver/cfasfo/portal/queryProxyExpenseCount', {})
            this.todolist[3].num = data2.count || 0
        },
        async getSection2Data () {
            const {data: bill1} = await this.$http.post('/api/cfasserver/cfasfo/portal/queryLoanbalanceMoney', {})
            this.bills[0].money = bill1.billmoney || 0
            const {data: bill2} = await this.$http.post('/api/cfasserver/cfasfo/portal/queryReimbursingMoney', {})
            this.bills[1].money = bill2.billmoney || 0
            const {data: bill3} = await this.$http.post('/api/cfasserver/cfasfo/portal/queryReimburseReturnMoney', {})
            this.bills[2].money = bill3.billmoney || 0
            // const {data: bill4} = await this.$http.post('/api/cfasserver/cfasfo/portal/queryUnExpenseTravelConsumerMoney', {})
            // this.bills[3].money = bill4.billmoney || 0
        },
        async getChartData () {
            const {data: chart1} = await this.$http.post('/api/cfasserver/cfasfo/portal/queryYearExpenseConstitute', {})
            const {data: chart2} = await this.$http.post('/api/cfasserver/cfasfo/portal//queryYearExpenseDistribution', {})
            this.pieData = chart1.data || []
            this.barData = (chart2.data && chart2.data.distribution) || {}
        },
        setHeight () {
            const mainDom = document.getElementById('main-content')
            if (!mainDom) return

            const currDom = this.$el
            if (currDom.clientHeight < mainDom.clientHeight) {
                // this.$el.style.height = `${mainDom.clientHeight}px`
                this.$refs.charts.$el.style.height = `${mainDom.clientHeight - 471}px`
            }
        },
        handleClick (index) {
            let url = ''
            switch (index) {
                case 0:
                    url = '/VaNeedToDo'
                    break
                case 1:
                    url = '/VaAlreadyDone'
                    break
                case 2:
                    url = '/personal/tobe-submit'
                    break
                case 3:
                    url = '/personal/agent-expense'
                    break
                default: break
            }
            this.$router.push(url)
        },
        handleClick2 (index) {
            let url = ''
            switch (index) {
                case 0:
                    url = '/query/FoQueryLoan/true'
                    break
                case 1:
                    url = '/personal/accounting'
                    break
                case 2:
                    url = '/personal/account-return'
                    break
                case 3:
                    url = '/btm/consumption'
                    break
                default: break
            }
            this.$router.push(url)
        }
    }
}
</script>

<style lang="less" scoped>
.cfas-home {
    background: #f5f7f9;
    padding: 12px;
    overflow: auto;
    height: 100%;
    .cfas-home-content-title{
        background-color:#FFFFFF;
        height: 60px;
        color: #222222;
        font-size: 20px;
        font-weight:500;
        line-height:60px;
        padding-left: 24px;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding-right: 24px;
    }
    .card-date{
        font-size: 12px;
        color: #C6C6C6;
        font-weight:400;
    }
    .cfas-home-content1{
        margin-bottom: 12px;
        .cfas-home-card{
            padding-right:30px;
            border-right: 1px solid #E8E8E8;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .card-title{
                font-size: 16px;
                color: #888888;
                font-weight:400;
            }
            .card-flex{
                display: flex;
                align-items: baseline;
                .card-num{
                    font-size: 32px;
                    color: #222222;
                    font-weight:bold;
                }
                .card-icon{
                    padding-left: 16px;
                    color: #376AF5;
                }
            }
        }
        & /deep/ .ivu-card-body {
            padding: 33px 0 32px 30px;
        }
    }
    .cfas-home-content2{
        margin-bottom: 12px;
        & /deep/ .ivu-card-body {
            padding: 12px 0 24px 24px;
        }
        .cfas-home-card {
            padding-right: 30px;
            border-right: 1px solid #E8E8E8;
            .card-billtitle{
                color: #222222;
                font-size: 16px;
                font-weight:400;
                margin-bottom: 16px;
                .card-billcode{
                    font-size: 12px;
                    color: #888888;
                    font-weight:400;
                }
            }
            .card-money{
                color: #222222;
                font-size: 30px;
                font-weight:500;
                margin-bottom: 10px;
                span {
                    font-size: 14px;
                    color: #888888;
                    font-weight:400;
                }
                .money {
                    color: #222222;
                    font-size: 30px;
                    font-weight:500;
                    margin-bottom: 10px;
                }
            }
            .card-org{
                font-size: 12px;
                color: #888888;
                font-weight:400;
                margin-bottom: 16px;
            }
            .card-flex{
                display: flex;
                justify-content: space-between;
                .card-user{
                    color: #555555;
                    font-size: 14px;
                    font-weight:400;
                }
            }

        }
    }
    .cfas-home-content3 {
        background-color: #ffffff;
        & /deep/ .ivu-card-body {
            padding: 0;
        }
    }
}
</style>
