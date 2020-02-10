<template>
    <div style="width: 100%; height: 100%;">
        <bud-main :budtype="budtype" />
    </div>
</template>

<script>
import BudMain from '../budget-common/budget-main'
import { budtypes } from '../budget-common/const'
export default {
    name: 'BudgetProject',
    data () {
        return {
            budtype: budtypes.project
        }
    },
    components: {
        BudMain
    }
}
</script>
<style lang="less">

</style>
