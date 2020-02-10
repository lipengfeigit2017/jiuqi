<template>
    <div style="height: 100%">
        <va-toolbar>
            <va-toolbar-item title="修改" @click="isEdit = true" :disabled="isEdit"></va-toolbar-item>
            <va-toolbar-item title="保存" @click="handleSave" :disabled="!isEdit"></va-toolbar-item>
            <va-toolbar-item title="初始化" @click="handleInit" :disabled="!initBtn"></va-toolbar-item>
            <va-toolbar-item title="同步" @click="handleSync" :disabled="!initBtn && isEdit"></va-toolbar-item>
        </va-toolbar>
        <div v-if="!initBtn" style="padding: 12px;height: calc(100% - 33px);overflow-y: auto;overflow-x: hidden;">
            <Card title="基本信息" dis-hover>
                <Form :label-width="120">
                    <FormItem label="服务商标识：">
                        <i-input :value="originalData.intfConfig.code" disabled></i-input>
                    </FormItem>
                    <FormItem label="服务商名称：">
                        <i-input :value="originalData.intfConfig.title" disabled></i-input>
                    </FormItem>
                    <FormItem v-for="(generic, index) in generics" :key="index" :label="generic.title + '：'" :prop="generic.code">
                        <i-input :value="generic.value" @on-change="e => handleInputGenericChange(e, index)" :disabled="!isEdit"></i-input>
                    </FormItem>
                </Form>
            </Card>
            <Card class="intfCard" title="接口信息" style="margin-top: 10px;height: calc(100% - 189px);min-height: 500px;" dis-hover>
                <el-tabs tab-position="left" type="border-card" @tab-click="handleTabClick" style="height: 100%">
                    <el-tab-pane v-for="(item, index) in intfs" :label="item.title" :key="index">
                        <Form :label-width="100">
                            <FormItem label="接口标识：">
                                <i-input :value="item.code" @on-change="e => handleInputChange(e, 'code')" disabled></i-input>
                            </FormItem>
                            <FormItem label="接口名称：">
                                <i-input :value="item.title" @on-change="e => handleInputChange(e, 'title')" :disabled="!isEdit"></i-input>
                            </FormItem>
                            <FormItem label="启用标识：">
                                <Checkbox :value="item.startflag" @on-change="val => handleCheckboxChange(val, 'startflag')" :disabled="!isEdit"></Checkbox>
                            </FormItem>
                            <template v-for="(field,index2) in item.fields">
                                <FormItem :label="field.name+'：'" :key="index2">
                                    <i-input :value="field.value" @on-change="e => handleInputFieldsChange(e, index2)" :disabled="!isEdit"></i-input>
                                </FormItem>
                            </template>
                        </Form>
                    </el-tab-pane>
                </el-tabs>
            </Card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'btm-intf',
    data () {
        return {
            intfs: [],
            generics: [],
            formData: {},
            isEdit: false,
            originalData: {intfConfig: {}},
            initBtn: false
        }
    },
    async mounted () {
        this.handleGetInftInfo()
    },
    methods: {
        async handleGetInftInfo () {
            const {data} = await this.$http.post('/api/cfasserver/btm/intf/get?agent=Ctrip')
            if (data.code === 1 && data.msg === '未查询到接口配置信息。') {
                this.initBtn = true
            } else {
                this.originalData = data.data
                this.intfs = data.data.intfConfig.Interfaces
                this.generics = data.data.intfConfig.generic
                this.formData = this.intfs[0]
            }
        },
        handleTabClick (instance) {
            this.formData = this.intfs[instance.index]
        },
        handleInputChange (e, field) {
            this.formData[field] = e.target.value
        },
        handleInputGenericChange (e, index) {
            this.generics[index].value = e.target.value
        },
        handleInputFieldsChange (e, index) {
            this.formData.fields[index].value = e.target.value
        },
        handleCheckboxChange (val, field) {
            this.formData[field] = val
        },
        async handleSave () {
            try {
                this.originalData.intfConfig.Interfaces = this.intfs
                const {data} = await this.$http.post('/api/cfasserver/btm/intf/patch', this.originalData)
                if (data.code === 0) {
                    this.isEdit = false
                    this.handleGetInftInfo()
                    this.$Message.success('保存成功')
                } else {
                    throw new Error(data.msg)
                }
            } catch (e) {
                this.$Message.error(`保存失败：${e.message}`)
                throw new Error(`保存失败：${e.message}`)
            }
        },
        async handleInit () {
            try {
                const {data} = await this.$http.post('/api/cfasserver/btm/intf/init?agent=Ctrip')
                if (data.code === 0) {
                    this.$Message.success('初始化成功')
                    this.initBtn = false
                    this.handleGetInftInfo()
                } else {
                    throw new Error(data.msg)
                }
            } catch (e) {
                this.$Message.error(`初始化失败：${e.message}`)
                throw new Error(`初始化失败：${e.message}`)
            }
        },
        async handleSync () {
            try {
                const {data} = await this.$http.post('/api/cfasserver/btm/intf/sync?agent=Ctrip')
                if (data.code === 0) {
                    this.$Message.success('同步成功')
                    this.initBtn = false
                    this.handleGetInftInfo()
                } else {
                    throw new Error(data.msg)
                }
            } catch (e) {
                this.$Message.error(`初始化失败：${e.message}`)
                throw new Error(`初始化失败：${e.message}`)
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .intfCard {
        & /deep/ .ivu-card-body {
            height: calc(100% - 50px);
        }
    }
</style>
