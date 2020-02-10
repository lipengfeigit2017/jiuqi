<template>
    <DatePicker
        :open="isOpen" transfer
        type="date"
        format="yyyy-MM-dd D"
        v-model="currdate"
        @on-change="handleDatePickerChange"
        @on-clickoutside="isOpen = false">
        <a href="javascript:void(0)" @click="handleSelectDate" style="color: #ffffff;opacity: 0.6;font-weight: 400;">
            <!--<span class="iconfont icon_shurukuangriqi" style="font-size: 18px;"></span>-->
            <svg class="icon" aria-hidden="true" style="opacity: 0.6;font-size: 16px;">
                <use xlink:href="#icon_topriqi"></use>
            </svg>
            {{selectDate}}
        </a>
    </DatePicker>
</template>

<script>
import {vaLoginApi} from '@/api/va'

export default {
    data () {
        return {
            currdate: '2019-01-01',
            isOpen: false,
            selectDate: null
        }
    },
    async mounted () {
        const {data: {loginDate}} = await this.$http.get(vaLoginApi.getLoginDate, {})

        const d = new Date(loginDate)
        this.currdate = d

        const year = d.getFullYear()
        const month = (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1)
        const date = (d.getDate() < 10 ? '0' : '') + d.getDate()
        const days = ['日', '一', '二', '三', '四', '五', '六']
        const day = d.getDay()
        this.selectDate = `${year}-${month}-${date} 星期${days[day]}`
    },
    methods: {
        handleSelectDate () {
            // this.isOpen = !this.isOpen
        },
        handleDatePickerChange (date) {
            this.isOpen = !this.isOpen
            const days = ['日', '一', '二', '三', '四', '五', '六']
            this.selectDate = date.substring(0, 11) + '星期' + days[date.substring(11, 12)]

            // this.$http.post(vaLoginApi.changeLoginDate, {loginDate: date.substring(0, 11)})
        }
    }
}
</script>
