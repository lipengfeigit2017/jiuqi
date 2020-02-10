<template>
    <Dropdown
        class="jq-select-wrapper"
        trigger="custom"
        ref="dropdown"
        :transfer="true"
        placement="bottom-start"
        :visible="isShowPanel"
        @on-clickoutside="handleHidePanel">
        <Input :element-id = "'input_'+opttime"
            v-model="showText"
            :readonly="readonly"
            :disabled="disabled"
            :title="titleText"
            @on-click="handleTogglePanel"
            @on-focus="handleFocus"
            @on-blur="handleBlur"
            @on-change="handleChange"
            ref="input"
            :placeholder="placeholder"
        />
        <DropdownMenu slot="list" ref="dropdownmenu" class="va-base-data-panel">
                <el-tree ref="tree" :class="panelStyle" v-loading="droppanelLoading"
                         empty-text=" " default-expand-all :show-checkbox="multiple"
                         :data="data" :props="defaultProps" :expand-on-click-node="false" :check-strictly="true" node-key="val"
                         :render-content="renderContent" @check="handleCheck">
                </el-tree>
        </DropdownMenu>
    </Dropdown>
</template>

<script>
import $ from 'jquery'

export default {
    name: 'aparEnumSelect',
    props: {
        queryitem: Object,
        expression: String,
        check: Boolean,
        // 多选: code1,code2 或 [code1,code2]
        value: [Number, Array, String],
        disabled: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String
        },
        delimiter: {
            type: String,
            default: ','
        },
        /**
         * 使用方式
         * noraml 普通模式：停用的基础数据可以选择；控件加载完加载基础数据
         * bill   单据模式：停用的基础数据不可以选择；下拉时加载基础数据
         */
        useMode: {
            type: String,
            default: 'normal',
            validator: function (value) {
                return ['normal', 'bill'].indexOf(value) !== -1
            }
        }
    },
    data () {
        return {
            isShowPanel: false, // 是否显示下拉面板
            droppanelLoading: true,
            showText: '', // 显示文本（获得焦点显示代码，失去焦点显示名称）
            selectedData: [], // 选中的数据
            data: [], // 全部数据
            dataList: [], // 全部数据
            isFlowPanel: false, // 下拉面板是否浮动，用于控制样式
            searchText: '',
            defaultProps: {
                children: 'children',
                label: 'title'
            },
            loading: true,
            baseDataTitle: '',
            isFocus: false,
            opttime: 0,
            total: 0,
            filterText: '',
            multiple: true
        }
    },
    watch: {
        value (val) {
            this.updateValue(val)
        }
    },
    computed: {
        titleText () {
            return this.selectedData.label
        },
        panelStyle () {
            return {
                'jq-select-panel': true,
                'jq-select-panel-overflow': this.isShowPanel
            }
        },
        showTitle () {
            const title = []
            if (Array.isArray(this.selectedData)) {
                for (const item of this.selectedData) {
                    title.push(item.title || item.val)
                }
            }
            return title.join(this.delimiter)
        }
    },
    async mounted () {
        if (this.check === true) {
            this.updateValue(this.value)
        }
    },
    methods: {
        async loadData () {
            try {
                const {data} = await this.$http.post('/api/vmclient/enumData/list', {
                    biztype: this.queryitem.mapping.split('.')[0]
                })
                this.data = []
                this.dataList = data
                for (let i in data) {
                    let filter = false
                    if (this.expression !== undefined && this.expression.length > 0) {
                        this.expression.split(',').forEach((item) => {
                            if (data[i].val === item) {
                                filter = true
                            }
                        })

                        if (filter) {
                            this.data.push({
                                title: data[i].title,
                                val: data[i].val
                            })
                        }
                    } else {
                        this.data.push({
                            title: data[i].title,
                            val: data[i].val
                        })
                    }
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        async updateValue (val) {
            if (this.data.length === 0) {
                const {data} = await this.$http.post('/api/vmclient/enumData/list', {biztype: this.queryitem.mapping.split('.')[0]})
                this.data = data
                this.dataList = data
            }

            const selectedData = []
            const showTextArray = []
            const vals = Array.isArray(val) ? val : val.split(this.delimiter)
            for (const valu of vals) {
                const selectData = this.dataList.find(item => item.val === valu)
                if (selectData) {
                    selectedData.push(selectData)
                    showTextArray.push(selectData.val)
                }
            }
            this.selectedData = selectedData
            this.showText = this.isFocus ? showTextArray.join(this.delimiter) : this.showTitle
            this.$refs.tree.setCheckedKeys(vals)
        },
        renderContent (h, { node, data, store }) {
            if (data.stopflag) {
                return <span class="jq-select-stop">{node.label}</span>
            }
            return <span>{node.label}</span>
        },
        handleComputedPanelStyle () {
            this.$nextTick(() => {
                if (this.$refs.tree) {
                    this.isFlowPanel = this.$refs.tree.$el.clientHeight === 200
                }
            })
        },
        // 切换显示下拉面板
        async handleTogglePanel () {
            if (!this.disabled && !this.readonly) {
                if (!this.dataList.length) {
                    await this.loadData()
                }
                this.handleHidePanel()
            }
        },
        // 隐藏下拉面板
        handleHidePanel () {
            this.isShowPanel = false
        },
        // 显示下拉面板
        handleShowPanel () {
            this.isShowPanel = true
            this.handleComputedPanelStyle()

            this.opttime = new Date().getTime()
            this.$nextTick(() => {
                let inputWidth = $('#input_' + this.opttime).css('width').replace('px', '')
                let panelWidth = parseInt(inputWidth)

                if (panelWidth < 300) {
                    panelWidth = 300
                }

                $('#droppanel_' + this.opttime).css('min-width', '300px')
                $('#droppanel_' + this.opttime).parent().css('width', panelWidth + 'px')

                setTimeout(() => {
                    this.droppanelLoading = false
                }, 150)
            })
        },
        // 获取焦点
        async handleFocus () {
            this.isFocus = true

            await this.loadData()
            this.handleShowPanel()
            this.showText = this.selectedData.map(item => item.title).join(this.delimiter)
            const keys = this.selectedData.map(item => item.val).join(this.delimiter).split(',')
            this.$refs.tree.setCheckedKeys(keys)
        },
        // 失去焦点
        handleBlur () {
            this.isFocus = false
            this.showText = this.showTitle
            this.filterText = this.showText
        },
        handleCheck (data, store) {
            this.selectedData = store.checkedNodes
            this.showText = this.selectedData.map(item => item.title).join(this.delimiter)

            const value = this.selectedData.map(item => item.val).join(this.delimiter)
            this.$emit('on-change', value)
        },
        async handleChange () {
            this.handleShowPanel()
            this.filterText = this.showText
            const {data} = await this.$http.post('/api/vmclient/enumData/list', {biztype: this.queryitem.mapping.split('.')[0], searchKey: this.filterText})
            this.data = data
            this.dataList = data
            if (this.showText === '') {
                this.selectedData = []
                this.$emit('input', this.selectedData.join(this.delimiter))
                this.$emit('on-change', this.selectedData)
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .jq-select-wrapper{
        width:100%;
    }
    .jq-select-panel{
        &/deep/.el-tree__empty-text{
            min-width: 110px;
        }
    }
</style>

<style>
    .jq-select-stop{
        opacity: 0.7;
        font-style:italic;
        font-style:oblique;
    }
    .va-base-data-panel{
        min-width: 110px;
        width: fit-content;
    }
</style>
