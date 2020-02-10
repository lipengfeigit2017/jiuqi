<template>
    <div style="height: 100%">
        <va-toolbar>
            <va-toolbar-item title="修改" @click="isEdit = true" :disabled="isEdit"></va-toolbar-item>
            <va-toolbar-item title="保存" @click="handleSave" :disabled="!isEdit"></va-toolbar-item>
            <!-- <va-toolbar-item title="初始化" @click="handleInit" :disabled="!initBtn"></va-toolbar-item> -->
        </va-toolbar>
        <div v-if="!initBtn" style="padding: 12px;height: calc(100% - 33px);overflow-y: auto;overflow-x: hidden;">
            <Card title="基本信息" dis-hover>
                <Form :label-width="120">
                    <FormItem label="共享系统标识：">
                        <i-input v-model="baseData.name" :disabled="!isEdit"></i-input>
                    </FormItem>
                    <FormItem label="共享系统名称：">
                        <i-input v-model="baseData.title" :disabled="!isEdit"></i-input>
                    </FormItem>
                     <FormItem label="用户名：">
                        <i-input v-model="baseData.sscusername" :disabled="!isEdit"></i-input>
                    </FormItem>
                    <FormItem label="密码：">
                        <i-input v-model="baseData.sscpassword" :disabled="!isEdit"></i-input>
                    </FormItem>
                     <FormItem label="服务地址：">
                        <i-input v-model="baseData.address" :disabled="!isEdit"></i-input>
                    </FormItem>
                </Form>

            </Card>
            <Card class="intfCard" title="接口信息" style="margin-top: 10px;height: calc(100% - 183px);min-height: 500px;" dis-hover>
                <el-tabs tab-position="left" type="border-card" @tab-click="handleTabClick" style="height: 100%">
                    <el-tab-pane v-for="(item, index) in intfs" :label="item.define" :key="index">
                        <Form :label-width="100">

                            <FormItem label="参数内容：" >
                                <i-input type="textarea"  :rows='20' :value="item.param" @on-change="e => handleInputChange(e, 'param')" :disabled="!isEdit"></i-input>
                            </FormItem>
                        </Form>
                    </el-tab-pane>
                </el-tabs>
            </Card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'fssc-intf',
    data () {
        return {
            intfs: [],
            formData: {},
            baseData: {

            },
            isEdit: false,
            originalData: {
                intfConfig: {},
                sscusername: '',
                sscpassword: ''

            },
            initBtn: false
        }
    },
    async mounted () {
        this.handleGetInftInfo()
    },
    methods: {
        async handleGetInftInfo () {
            const {data} = await this.$http.post('/api/cfasserver/cfasfo/ssc/config/listParam', {})

            this.originalData = data.rows
            this.intfs = data.rows
            this.formData = this.intfs[0]
            this.baseData = this.intfs[0]
        },
        handleTabClick (instance) {
            this.formData = this.intfs[instance.index]
        },
        handleInputChange (e, field) {
            this.formData[field] = e.target.value
        },
        handleInputFieldsChange (e, index) {
            this.formData.fields[index].value = e.target.value
        },
        handleCheckboxChange (val, field) {
            this.formData[field] = val
        },
        async handleSave () {
            try {
                const errorInfos = []
                this.intfs.forEach((intf) => {
                    const param = intf.param
                    if (param) {
                        try {
                            JSON.parse(param)
                        } catch (error) {
                            errorInfos.push(intf.define)
                        }
                    }
                })
                if (errorInfos.length > 0) {
                    this.$Message.error(`参数内容格式错误：${errorInfos}`)
                    return
                }
                this.originalData.intfConfig = this.intfs

                const paramData = {}
                paramData.intfConfig = this.intfs
                paramData.sscusername = this.baseData.sscusername
                paramData.sscpassword = this.baseData.sscpassword
                paramData.name = this.baseData.name
                paramData.title = this.baseData.title
                paramData.address = this.baseData.address
                const {data} = await this.$http.post('/api/cfasserver/cfasfo/ssc/config/update', paramData)
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
