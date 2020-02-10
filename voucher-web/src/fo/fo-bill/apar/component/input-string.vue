<template>
<div>
    <div>
        <i-input v-model="dataValue" placeholder="不限" @on-change="changeHandle" class="queryFormInput"></i-input>
    </div>

</div>

</template>
<script>
export default {
    name: 'CustomInputString',
    props: {
        filterFlag: Boolean,
        value: [String, Object, Array]
    },
    watch: {
        value (val) {
            if (typeof (val) !== 'object') {
                this.dataValue = val
            } else {
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
