<template>
  <div ref="dom" style="width: 100%" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import XEUtils from 'xe-utils'
export default {
    name: 'pie-chart',
    props: {
        value: Array,
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
                let legend = this.value.map(_ => _.name)
                let option = {
                    title: {
                        text: this.text,
                        subtext: this.subtext,
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        // formatter: '{a} <br/>{b} : {c} ({d}%)'
                        // formatter: '{b} <br/> 报销金额{c} 元 ({d}%)'
                        formatter: param => `${param.data.name}<br/>报销金额${XEUtils.commafy(param.data.value, {fixed: 2})} 元(${param.percent}%)`
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: legend,
                        show: false
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: '55%',
                            center: ['45%', '50%'],
                            data: this.value,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
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
