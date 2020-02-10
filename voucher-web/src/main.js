// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// 引入iview
import iView from 'iview'
import './styles/index.less'

// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/ele.css'

// 引入va-web
import vaWeb from 'va-web'
import 'va-web/lib/css/va-web.css'

import VueQriously from 'vue-qriously'

// 引入axios插件
import Axios from './utils/axiosPlugin'

// mock
// import './mock'
import $ from 'jquery'
import './styles/iconfont/iconfont.js'

import budgetAudit from './fo/fo-budget/budget-audit'
import budgetInfo from './fo/fo-bill/budget'
vaWeb.approvalComponents.BUDGET = budgetAudit

Vue.use(iView, {
    datePicker: {
        customIcon: 'iconfont icon_shurukuangriqi'
    }
})
Vue.component('budgetInfo', budgetInfo)
Vue.use(ElementUI)
Vue.use(vaWeb)
Vue.use(VueQriously)
Vue.use(Axios)
Vue.use($)

Vue.config.productionTip = false

var EventBus = new Vue()
Object.defineProperties(Vue.prototype, {
    $bus: {
        get: function () {
            return EventBus
        }
    }
})

/* eslint-disable no-new */
var vue = new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>'
})

export default vue
