<template>
    <div style="margin-top: -16px;">
        <div class="toolbar">
            <va-toolbar>
                <va-toolbar-item title="新建" @click="add" :disabled="state!=='browse'"></va-toolbar-item>
                <va-toolbar-item title="修改" @click="edit" :disabled="state!=='browse'"></va-toolbar-item>
                <va-toolbar-item title="删除" @click="remove" :disabled="state!=='browse'"></va-toolbar-item>
                <va-toolbar-item title="保存" @click="save" :disabled="state!=='add'&&state!=='update'"></va-toolbar-item>
            </va-toolbar>
        </div>
        <div class="dbinfos">
            <Split v-model="splitsize" style="height: 400px;border: 1px solid #dcdee2;border-top-width: 0px">
                <div slot="left" class="left-split-pane" style="height: 100%;overflow: auto; padding: 10px">
                    <div class="search" style="margin-bottom:5px;">
                        <Input search placeholder="输入关键字查询" v-model="filterText" style="margin-bottom:5px;"/>
                    </div>
                    <div class="list">
                        <div v-for="info in dbInfos" class="group-list" :key="info.id" style="padding: 5px 10px 5px 10px; border-bottom: 1px dashed #ccc;">
                            <a href="#" @click="selectDBItem(info)" class="hactive" :class="{'aactive': info.id === dbconnect.id}">{{info.code}}</a>
                        </div>
                    </div>
                </div>
                <div slot="right" class="right-split-pane" style="padding: 10px">
                    <Form ref="dbinfo" :label-width="100" :model="dbconnect" :rules="dbInfoRule">
                        <FormItem label="数据源名称" prop="code">
                            <Input v-model="dbconnect.code" placeholder="输入标识" :readonly="state!=='add'"/>
                        </FormItem>
                        <FormItem label="数据库类型" prop="dbtype">
                            <Select v-model="dbconnect.dbtype" @on-change="val => dbtypechange(val)" :disabled="state==='browse'">
                                <Option v-for="item in dbtypes" :value="item.id" :key="item.id">
                                    {{item.name}}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="服务名称" prop="dbname">
                            <Input v-model="dbconnect.dbname" placeholder="输入服务名称" :readonly="state==='browse'"/>
                        </FormItem>
                        <FormItem label="服务地址" prop="address">
                            <Input v-model="dbconnect.address" placeholder="输入服务地址" :readonly="state==='browse'"/>
                        </FormItem>
                        <FormItem label="服务端口号" prop="port">
                            <Input v-model="dbconnect.port" placeholder="输入端口号" :readonly="state==='browse'"/>
                        </FormItem>
                        <FormItem label="用户名" prop="username">
                            <Input v-model="dbconnect.username" autocomplete="off" placeholder="输入用户名" :readonly="state==='browse'"/>
                        </FormItem>
                        <!-- <FormItem label="密码" prop="pwd">
                            <Input v-model="dbconnect.pwd" type="password" autocomplete="off" unselectable="off" placeholder="输入密码" :readonly="state==='browse'"/>
                        </FormItem> -->
                        <FormItem label="密码" prop="pwd">
                            <Input element-id="pwd" type="text" v-model="dbconnect.pwd"
                                placeholder="输入密码"
                                class="va-pwd"
                                readonly
                                @on-change="pwdType('#pwd',false)"
                                @on-keypress ="pwdType('#pwd',true)"
                                @on-keydown="pwdType('#pwd',true)"
                            />
                        </FormItem>
                    </Form>
                    <Button class="connectbutton" type="primary" @click="testconnect">测试连接</Button>
                </div>
            </Split>
        </div>
    </div>
</template>

<script>
import { syncdataApi } from '../../api/fo'
export default {
    name: 'FoSyncDataConfigDBMgr',
    data () {
        return {
            splitsize: 0.35,
            // 过滤文本
            filterText: '',
            // 状态：add、update、browse
            state: 'browse',
            // 数据源列表
            dbInfos: [],
            // 数据库连接
            dbconnect: {
                id: '',
                code: '',
                dbtype: '',
                dbname: '',
                address: '',
                port: '',
                username: '',
                pwd: '',
                ordernum: 0
            },
            // 数据库类型
            dbtypes: [
                {id: 'ORACLE', name: 'Oracle(Thin driver)', port: '1521'},
                {id: 'MY_SQL_SERVER', name: 'MS SQL Server', port: '1433'},
                {id: 'MYSQL', name: 'MySQL', port: '3306'},
                {id: 'DB2', name: 'DB2', port: '50000'},
                {id: 'DM', name: 'DM', port: '5236'}
            ],
            dbInfoRule: {
                code: [{
                    required: true,
                    validator: async (rule, value, callback) => {
                        if (this.state !== 'add') {
                            callback()
                        }
                        if (!value) {
                            callback(new Error('输入数据源名称'))
                            return
                        }
                        let dbInfo = this.dbInfos.find(item => item.code === value)
                        if (dbInfo) {
                            callback(new Error('数据源名称不允许重复'))
                            return
                        }
                        callback()
                    }
                }],
                dbtype: [{
                    required: true,
                    message: '选择数据库类型',
                    trigger: 'blur'
                }],
                dbname: [{
                    required: true,
                    message: '输入服务名称',
                    trigger: 'blur'
                }],
                address: [{
                    required: true,
                    message: '输入服务地址',
                    trigger: 'blur'
                }],
                port: [{
                    required: true,
                    message: '输入端口号',
                    trigger: 'blur'
                }],
                username: [{
                    required: true,
                    message: '输入用户名',
                    trigger: 'blur'
                }],
                pwd: [{
                    required: true,
                    message: '输入密码',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        async loadDBConfigList (item) {
            try {
                const {data: {rs, rows}} = await this.$http.post(syncdataApi.syncdatadbconnect + '/list', {})
                if (rs.code === 0) {
                    this.dbInfos = rows
                    if (this.dbInfos && this.dbInfos.length > 0) {
                        if (item) {
                            let data = this.dbInfos.find(info => info.code === item.code)
                            this.selectDBItem(data)
                        } else {
                            this.selectDBItem(this.dbInfos[0])
                        }
                    }
                } else {
                    throw new Error(rs.code)
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        selectDBItem (data) {
            if (data.code === this.dbconnect.code) {
                return
            }
            if (this.state === 'add' || this.state === 'update') {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>是否保存当前信息？</p>',
                    onOk: () => {
                        this.save(data)
                    },
                    onCancel: () => {
                        this.loadDBConfigItem(data)
                    }
                })
            } else if (this.state === 'browse') {
                this.loadDBConfigItem(data)
            }
        },
        loadDBConfigItem (data) {
            // 重置表单验证结果
            if (this.$refs['dbinfo'] && this.$refs['dbinfo'].fields) {
                this.$refs['dbinfo'].fields.forEach(function (e) {
                    e.resetField()
                })
            }
            this.state = 'browse'
            this.pwdType('#pwd', true)
            if (data) {
                this.dbconnect.id = data.id
                this.dbconnect.code = data.code
                this.dbconnect.dbtype = data.dbtype
                this.dbconnect.dbname = data.dbname
                this.dbconnect.address = data.address
                this.dbconnect.port = data.port
                this.dbconnect.username = data.username
                this.dbconnect.pwd = data.pwd
                this.dbconnect.ordernum = data.ordernum
            } else {
                // 清空当前配置
                for (let key in this.dbconnect) {
                    this.dbconnect[key] = ''
                }
            }
        },
        add () {
            this.state = 'add'
            // 清空当前配置
            for (let key in this.dbconnect) {
                this.dbconnect[key] = ''
            }
        },
        edit () {
            this.state = 'update'
        },
        remove () {
            this.$Modal.confirm({
                title: '提示信息',
                content: '<p>确定要删除当前数据源吗？</p>',
                onOk: async () => {
                    try {
                        const {data: {code, msg}} = await this.$http.post(syncdataApi.syncdatadbconnect + '/delete', {id: this.dbconnect.id})
                        if (code === 0) {
                            this.state = 'browse'
                            this.loadDBConfigList()
                        } else {
                            throw new Error(msg)
                        }
                    } catch (e) {
                        throw new Error(e)
                    }
                }
            })
        },
        // 校验
        validate (val) {
            return val
        },
        async save (data) {
            this.$refs['dbinfo'].validate(async (valid) => {
                if (valid) {
                    try {
                        const {data: {code, msg}} = await this.$http.post(syncdataApi.syncdatadbconnect + '/' + this.state, this.dbconnect)
                        if (code === 0) {
                            this.state = 'browse'
                            if (data) {
                                this.loadDBConfigList(data)
                            } else {
                                this.loadDBConfigList(this.dbconnect)
                            }
                        } else {
                            throw new Error(msg)
                        }
                    } catch (e) {
                        throw new Error(e)
                    }
                }
            })
        },
        dbtypechange (currtype) {
            if (currtype) {
                this.dbconnect.port = currtype.port
            }
        },
        async testconnect () {
            this.$refs['dbinfo'].validate(async (valid) => {
                if (valid) {
                    try {
                        const {data: {code, msg}} = await this.$http.post(syncdataApi.syncdatadbconnect + '/connect', this.dbconnect)
                        if (code === 0) {
                            this.$Message.info(msg)
                        } else {
                            this.$Message.error(msg)
                        }
                    } catch (e) {
                        throw new Error(e)
                    }
                }
            })
        },
        pwdType (obj, flag) {
            /* eslint-disable */
            // 屏蔽浏览器在记住密码后弹提示框问题
            if (flag) {
                $(obj).attr('type', 'password')
                if (this.state!=='browse') {
                    $(obj).removeAttr('readonly')
                } else {
                    $(obj).attr('readonly', 'readonly')
                }

                var _this = this
                setTimeout(function () {
                    _this.pwdType(obj, false)
                }, 500)
            } else {
                var pwd = $(obj).val()
                if (pwd && pwd.length > 0) {
                    $(obj).attr('type', 'password')
                    if (this.state!=='browse') {
                        $(obj).removeAttr('readonly')
                    } else {
                        $(obj).attr('readonly', 'readonly')
                    }
                } else {
                    $(obj).attr('type', 'text')
                    $(obj).attr('readonly', 'readonly')
                }
            }
        }
    },
    async mounted () {
        this.loadDBConfigList()
    }
}
</script>

<style lang="less" scoped>
    .connectbutton {
        float: right;
    }
    .hactive {
        color: #555;
    }
    .aactive {
        color: #03A4AD;
    }
</style>
