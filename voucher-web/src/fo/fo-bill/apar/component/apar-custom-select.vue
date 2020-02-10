<template>
<!-- 整数 -->
<div>
    <div>

        <Select :multiple="multiple" :clearable="clearable" @on-change="changeHandle" v-model="dataValue" :placeholder="placeholder" class="queryFormSelect">
            <Option v-for="item in states" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
    </div>
</div>

</template>

<script>

export default {
    name: 'AparCustomSelect',
    props: {
        queryitem: Object,
        value: [Number, Array, String],
        disabled: Boolean,
        placeholder: String,
        expression: String
    },
    watch: {
        value (val) {
            if (typeof (val) !== 'object') {
                this.dataValue = val
            } else {
                this.parArr = val
            }
        }
    },
    data () {
        return {
            aa: 'aa',
            clearable: true,
            multiple: true,
            dataValue: '',

            states: [

            ]
        }
    },
    methods: {
        changeHandle (dataValue) {
            this.$nextTick(() => {
                this.$emit('input', this.dataValue)
                this.$emit('on-change', this.dataValue)
            })
        },
        async loadData () {
            const {data} = await this.$http.post('/api/vmclient/enumData/list', {
                biztype: this.queryitem.mapping.split('.')[0]
            })
            this.states = []
            for (let i in data) {
                let filter = false
                if (this.expression) {
                    this.expression.split(',').forEach((item) => {
                        if (data[i].val === item) {
                            filter = true
                        }
                    })
                }
                if (!filter) {
                    this.states.push({
                        label: data[i].title,
                        value: data[i].val
                    })
                }
            }
        }
    },
    mounted () {
        this.loadData()
        if (typeof (this.value) !== 'object') {
            this.dataValue = this.value
        }
    }
}
</script>
