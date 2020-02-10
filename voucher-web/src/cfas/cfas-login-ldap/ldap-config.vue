<template>
    <div style="height: 100%">
        <va-toolbar>
            <va-toolbar-item title="修改" @click="isEdit = true" :disabled="isEdit"></va-toolbar-item>
            <va-toolbar-item title="保存" @click="handleSave" :disabled="!isEdit"></va-toolbar-item>
            <va-toolbar-item title="初始化" @click="handleInit" :disabled="!initBtn"></va-toolbar-item>
            <va-toolbar-item title="同步" @click="handleSync" :disabled="!initBtn && isEdit"></va-toolbar-item>
        </va-toolbar>
        <div v-if="!initBtn" style="padding: 12px;height: calc(100% - 33px);overflow-y: auto;overflow-x: hidden;">
            <Card title="配置信息" dis-hover>
                <Form :label-width="120">
                    <FormItem v-for="(generic, index) in generics" :key="index" :label="generic.title + '：'" :prop="generic.code">
                        <i-input :value="generic.value" @on-change="e => handleInputGenericChange(e, index)" :disabled="!isEdit"></i-input>
                    </FormItem>
                </Form>
            </Card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ldap-config',
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
            const {data} = await this.$http.post('/api/cfasserver/login/ldap/intf/get')
            if (data.code === 1 && data.msg === '未查询到配置信息。') {
                this.initBtn = true
            } else {
                this.originalData = data.data
                this.intfs = data.data.intfConfig.Interfaces
                this.generics = data.data.intfConfig.generic
                this.formData = this.intfs[0]
            }
        },
        handleInputGenericChange (e, index) {
            this.generics[index].value = e.target.value
        },
        async handleSave () {
            try {
                this.originalData.intfConfig.Interfaces = this.intfs
                this.originalData.intfConfig.generic = this.generics
                const {data} = await this.$http.post('/api/cfasserver/login/ldap/intf/patch', this.originalData)
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
                const {data} = await this.$http.post('/api/cfasserver/login/ldap/intf/init')
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
                const {data} = await this.$http.post('/api/cfasserver/login/ldap/intf/sync')
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
