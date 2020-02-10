<template>
    <div>
        <i-input icon="custom iconfont icon_danchugengduo" readonly :value="showTitle" @on-click="showModal"></i-input>
        <Modal v-model="selectFieldModal" :mask-closable="false" title="选择字段" @on-ok="handleConfirm" :loading="selectFieldLoading">
            <AparBillRefSelectFieldModal v-if="selectFieldModal" :tableNames="tableNames" ref="selectField"></AparBillRefSelectFieldModal>
        </Modal>
    </div>
</template>

<script>
import AparBillRefSelectFieldModal from './apar-bill-ref-select-field-modal'

export default {
    name: 'apar-bill-ref-select-field',
    components: {AparBillRefSelectFieldModal},
    props: {
        value: Object,
        tableNames: Array
    },
    data () {
        return {
            selectFieldModal: false,
            maskclosable: false,
            selectFieldLoading: true,
            showTitle: this.tableNames.length === 2 ? this.value.srcfieldshowtitle : this.value.targetfieldshowtitle
        }
    },
    methods: {
        showModal () {
            this.selectFieldModal = true
        },
        handleConfirm () {
            this.selectFieldLoading = true
            const node = this.$refs.selectField.getData()
            if (!node) {
                this.selectFieldLoading = false
                this.$nextTick(() => {
                    this.selectFieldLoading = true
                })
                return
            }
            this.selectFieldModal = false
            const tableName = node.parent.data.name
            const value = node.data.value
            const showTitle = node.data.showtitle
            if (this.tableNames.length === 2) {
                let srcfield = ''
                if (tableName === 'FO_APARBILL') {
                    this.showTitle = `主表.${showTitle}`
                    srcfield = `M.${value}`
                } else {
                    this.showTitle = `子表.${showTitle}`
                    srcfield = `D.${value}`
                }
                this.value.columnType = node.data.columnType
                this.value.srcfield = srcfield
                this.value.srcfieldshowtitle = this.showTitle
                if (node.data.mappingType) {
                    this.value.mappingType = node.data.mappingType
                }
                this.$emit('on-change', this.value)
            } else {
                let targetfield = ''

                this.showTitle = `${showTitle}`
                targetfield = `${value}`

                this.value.targetfield = targetfield
                this.value.targetfieldshowtitle = this.showTitle
                if (node.data.mappingType) {
                    this.value.mappingType = node.data.mappingType
                }
                this.$emit('on-change', this.value)
            }
        }
    }
}
</script>
