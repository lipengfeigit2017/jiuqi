<template>
<!-- 数字 -->
<div>
    <div>
        <i-input @on-blur="blurHandleStart" @on-focus="focusHandleStart"  :disabled="disabled" v-model="dataStart" placeholder="不限" class="queryFormInput"  @on-keyup="dataStart=dataStart.replace(/[^\d+$|^\d*\.\d+$]/g,'')"></i-input>

        <label>-</label>

        <i-input @on-blur="blurHandleEnd" @on-focus="focusHandleEnd" :disabled="disabled" v-model="dataEnd" placeholder="不限" class="queryFormInput" @on-keyup="dataEnd=dataEnd.replace(/[^\d+$|^\d*\.\d+$]/g,'')"></i-input>
    </div>
</div>

</template>
<script>import {displayFormat} from './format'

export default {
    name: 'CustomInputNumber',
    props: {

        querycitem: Object,
        value: [String, Array],
        disabled: Boolean
    },
    watch: {
        value (val, oldval) {
            if (val === '') {
                this.dataValue = ''
                this.dataStart = ''
                this.dataEnd = ''
            }
        }
    },
    data () {
        return {
            dataValue: '',
            dataStart: '',
            dataEnd: '',
            parArr: ['', ''],
            displayFormat: displayFormat
        }
    },
    methods: {

        blurHandle () {
            if (this.dataValue !== '') {
                this.dataValue = this.displayFormat.toThousands(this.displayFormat.strToFloat(this.dataValue, 1, 2))
            }
            this.$emit('input', this.dataValue.split(',').join(''))
            this.$emit('on-change', this.dataValue.split(',').join(''))
        },
        blurHandleStart () {
            if (this.dataStart !== '') {
                this.dataStart = this.displayFormat.toThousands(this.displayFormat.strToFloat(this.dataStart, 1, 2))
            }
            if (this.dataEnd !== '') {
                this.dataEnd = this.displayFormat.toThousands(this.displayFormat.strToFloat(this.dataEnd, 1, 2))
            }
            this.parArr.splice(0, 1, this.dataStart.split(',').join(''))
            this.parArr[1] = this.dataEnd
            this.$emit('input', this.parArr)
            this.$emit('on-change', this.parArr)
        },
        focusHandle () {
            let x = this.dataValue.split(',')
            this.dataValue = x.join('')
        },
        focusHandleStart () {
            let x = this.dataStart.split(',')
            this.dataStart = x.join('')
        },
        blurHandleEnd () {
            if (this.dataEnd !== '') {
                this.dataEnd = this.displayFormat.toThousands(this.displayFormat.strToFloat(this.dataEnd, 1, 2))
            }
            if (this.dataStart !== '') {
                this.dataStart = this.displayFormat.toThousands(this.displayFormat.strToFloat(this.dataStart, 1, 2))
            }
            this.parArr.splice(1, 1, this.dataEnd.split(',').join(''))
            this.parArr[0] = this.dataStart
            this.$emit('input', this.parArr)
            this.$emit('on-change', this.parArr)
        },
        focusHandleEnd () {
            let x = this.dataEnd.split(',')
            this.dataEnd = x.join('')
        }
    },
    mounted () {
        if (typeof (this.value) !== 'object') {
            this.dataValue = this.value
        } else {
            this.dataStart = this.value[0]
            this.dataEnd = this.value[1]
        }
    }
}
</script>
