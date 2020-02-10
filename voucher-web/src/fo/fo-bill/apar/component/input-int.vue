<template>
<!-- 整数 -->
<div>
    <div>
         <i-input @on-change="changeHandle" v-model="dataValue" :disabled="disabled" placeholder="不限" @on-keyup="dataValue=dataValue.replace(/[^\d|,]/g,'')"  class="queryFormInput"></i-input>
    </div>
</div>

</template>
<script>
export default {
    name: 'CustomInputInt',
    props: {
        value: [String, Array],
        disabled: Boolean
    },
    watch: {
        value (val) {
            if (typeof (val) !== 'object') {
                this.dataValue = val
            }
        }
    },
    data () {
        return {
            dataValue: ''
        }
    },
    methods: {
        changeHandle (dataValue) {
            this.$nextTick(() => {
                this.$emit('input', this.dataValue)
                this.$emit('on-change', this.dataValue)
            })
        }
    },
    mounted () {
        if (typeof (this.value) !== 'object') {
            this.dataValue = this.value
        }
    }
}
</script>
