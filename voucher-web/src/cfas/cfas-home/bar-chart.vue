<template>
    <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import XEUtils from 'xe-utils'
export default {
    name: 'bar-chart',
    props: {
        value: Object,
        text: String,
        subtext: String
    },
    data () {
        return {
            dom: null
        }
    },
    watch: {
        value () {
            this.setOption()
        }
    },
    methods: {
        resize () {
            this.dom.resize()
        },
        setOption () {
            this.$nextTick(() => {
                let xAxisData = Object.keys(this.value)
                let seriesData = Object.values(this.value)
                let option = {
                    title: {
                        text: this.text,
                        subtext: this.subtext,
                        x: 'center'
                    },
                    tooltip: {
                        // trigger: 'item',
                        // formatter: '{a} <br/>{b} : {c} ({d}%)'
                        // formatter: '{b} <br/> 报销金额{c} 元 ({d}%)'
                        formatter: param => `报销金额${XEUtils.commafy(param.data, {fixed: 2})} 元`
                    },
                    xAxis: {
                        type: 'category',
                        data: xAxisData,
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        splitLine: {
                            lineStyle: {
                                type: 'dotted'
                            }
                        },
                        axisLine: {
                            show: false
                        }
                        // axisLabel: {
                        //     formatter: function (value) {
                        //         return `${value / 10000}万`
                        //     }
                        // }
                    },
                    series: [{
                        data: seriesData,
                        type: 'bar',
                        itemStyle: {
                            color: '#03A4AD'
                        }
                    }],
                    barWidth: 8
                }
                this.dom = echarts.init(this.$refs.dom, 'tdTheme')
                this.dom.setOption(option)
                // window.addEventListener('resize', this.resize, false)
            })
        }
    },
    mounted () {
        this.setOption()
        window.addEventListener('resize', this.resize, false)
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.resize, false)
    }
}
</script>
