<template>
  <div>
    <div v-if="filterFlag">
      <DatePicker v-model="showText" v-if="querycitem.conditionType==='SINGLE' || !querycitem.conditionType" transfer :disabled="disabled" @on-open-change="stopPropagation" @on-change="getValue" type="date" placeholder="不限" @click.stop class="queryForm"></DatePicker>
      <DatePicker v-model="showText" v-if="querycitem.conditionType==='RANGE'" transfer @on-open-change="stopPropagation" :disabled="disabled" @on-change="getValue" type="date" placeholder="不限" class="queryForm" @click.stop></DatePicker>
      <label v-if="querycitem.conditionType==='RANGE'">-</label>
      <DatePicker v-model="showTextEnd" v-if="querycitem.conditionType==='RANGE'" transfer @on-open-change="stopPropagation" :disabled="disabled" @on-change="getValueEnd" type="date" placeholder="不限" class="queryForm" @click.stop></DatePicker>
      <DatePicker v-model="showText" v-if="querycitem.conditionType==='MULTI'" multiple transfer @on-open-change="stopPropagation" :disabled="disabled" @on-change="getValue" type="date" placeholder="不限" class="queryForm" @click.stop></DatePicker>
    </div>
    <div v-if="!filterFlag">
      <DatePicker v-model="showText" v-if="querycitem.conditionType==='SINGLE' || !querycitem.conditionType" transfer :disabled="disabled" @on-open-change="stopPropagation" @on-change="getValue" type="date" placeholder="选择日期" @click.stop class="widthall" ></DatePicker>
      <Row v-if="querycitem.conditionType==='RANGE'">
        <i-col span="11">
            <DatePicker v-model="showText" transfer @on-open-change="stopPropagation" :disabled="disabled" @on-change="getValue" type="date" placeholder="开始日期" class="widthall" @click.stop></DatePicker>
        </i-col>
        <i-col span="2" style="text-align: center">-</i-col>
        <i-col span="11">
            <DatePicker v-model="showTextEnd" transfer @on-open-change="stopPropagation" :disabled="disabled" @on-change="getValueEnd" type="date" placeholder="结束日期" class="widthall" @click.stop></DatePicker>
        </i-col>
      </Row>
      <DatePicker v-model="showText" v-if="querycitem.conditionType==='MULTI'" multiple transfer :disabled="disabled" @on-open-change="stopPropagation" @on-change="getValue" type="date" placeholder="选择日期" class="widthall" @click.stop></DatePicker>
    </div>
  </div>
</template>
<script>
export default {
    name: 'CustomDatePicker',
    props: {
        querycitem: Object,
        queryObj: Object,
        filterFlag: Boolean,
        value: [String, Array],
        disabled: Boolean
    },
    watch: {
        value (val, oldval) {
            if (typeof (val) !== 'object') {
                this.showText = val
            } else {
                this.parArr = val
                this.showText = val[0]
                this.showTextEnd = val[1]
            }
        }
    },
    data () {
        return {
            showText: '',
            showTextEnd: '',
            parArr: ['', '']
        }
    },
    methods: {
        getValue (dataValue) {
            this.stopPropagation()
            // 日期调用on-change
            this.$nextTick(() => {
                if (this.querycitem.conditionType === 'RANGE') { // 如果是范围
                    if (this.querycitem.columnType === 'TIMESTAMP' && dataValue) {
                        // this.parArr[0] = dataValue + ' 00:00:00'
                        this.parArr.splice(0, 1, dataValue + ' 00:00:00')
                    } else {
                        // this.parArr[0] = dataValue
                        this.parArr.splice(0, 1, dataValue)
                    }
                    this.$emit('input', this.parArr)
                    this.$emit('on-change', this.parArr)
                } else { // 如果不是范围
                    let par
                    if (this.querycitem.columnType === 'TIMESTAMP' && dataValue) {
                        par = dataValue + ' 00:00:00'
                    } else {
                        par = dataValue
                    }
                    this.$emit('input', par)
                    this.$emit('on-change', par)
                }
            })
        },
        getValueEnd (dataValue) {
            this.stopPropagation()
            // 日期调用on-change
            this.$nextTick(() => {
                if (this.querycitem.columnType === 'TIMESTAMP' && dataValue) {
                    // this.parArr[1] = dataValue + ' 59:59:59'
                    this.parArr.splice(1, 1, dataValue + ' 59:59:59')
                } else {
                    // this.parArr[1] = dataValue
                    this.parArr.splice(1, 1, dataValue)
                }
                this.$emit('input', this.parArr)
                this.$emit('on-change', this.parArr)
            })
        },
        stopPropagation () {
            if (event.stopPropagation) {
                event.stopPropagation()
            } else {
                event.cancelBubble = true
            }
        }
    },
    mounted () {
        if (typeof (this.value) !== 'object') {
            this.showText = this.value
        } else {
            this.showText = this.value[0]
            this.showTextEnd = this.value[1]
        }
    }
}
</script>
