import Vue from 'vue'
import Router from 'vue-router'
import va from 'va-web'
import iview from 'iview'
import '@/cfas/bill-extends'
import '@/fo/fo-bill/fo-bill'

const CfasIndex = () => import('../cfas/index')
const CfasLoginDefault = () => import('../cfas/cfas-login/cfas-login-default')
const CfasLoginLdap = () => import('../cfas/cfas-login/cfas-login-ldap')
const CfasSSOLogin = () => import('../cfas/cfas-login/sso-login')
const CfasSSOFunction = () => import('../cfas/cfas-login/sso-function')
const CfasMain = () => import('../cfas/cfas-main')
const CfasHome = () => import('../cfas/cfas-home')
const BudgetDept = () => import('../fo/fo-budget/budget-dept')
const BudgetProject = () => import('../fo/fo-budget/budget-project')
const BudgetOrg = () => import('../fo/fo-budget/budget-org')
const BudgetControl = () => import('../fo/fo-budget/budget-control')
const Homepage = () => import('../cfas/homepage.vue')
const Coding = () => import('../cfas/cfas-coding')
const TravelApply = () => import('../cfas/cfas-btm/cfas-travelapply-bill.vue')
// const CustSupplier = () => import('../fo/fo-basedata/basedata-custsupplier/basedata-custsupplier-main.vue')
const FoTravelControl = () => import('../fo/fo-option/fo-travel-control')

const FoBill = () => import('@/fo/fo-bill/fo-bill')

const BtmIntf = () => import('@/fo/fo-intf/btm-intf/btm-intf.vue')
const BtmTravelOneIntf = () => import('@/fo/fo-intf/btm-intf/btm-travelone-intf.vue')

const EisIntf = () => import('@/fo/fo-intf/eis-intf')
const FsscIntf = () => import('@/fo/fo-intf/fssc-intf')
const LdapConfig = () => import('../cfas/cfas-login-ldap')

const FoQueryLoan = () => import('../fo/fo-query/fo-query-loan/fo-query-loan.vue')
const FoQueryLoanDept = () => import('../fo/fo-query/fo-query-loan/fo-query-loan-dept.vue')
const FoQueryExpenseDept = () => import('../fo/fo-query/fo-query-expense/fo-query-expense-dept.vue')
const FoQueryBudgetAnnual = () => import('../fo/fo-query/fo-query-budget-annual/fo-query-budget-annual.vue')
const FoQueryBudgetQuarter = () => import('../fo/fo-query/fo-query-budget-quarter/fo-query-budget-quarter.vue')
const FoQueryBudgetMonthly = () => import('../fo/fo-query/fo-query-budget-monthly/fo-query-budget-monthly.vue')

const FoPersonal = () => import('../fo/fo-personal')
const FoConsumption = () => import('../fo/fo-personal/fo-consumption.vue')
const FoConsumptions = () => import('../fo/fo-consumptions')

const FoSyncDataConfigMgr = () => import('../fo/fo-syncdata/fo-syncdata-config-mgr.vue')
const CfasFoBtm = () => import('../fo/fo-btm')
const FoBtmTravelOneSso = () => import('../fo/fo-btm/sso/travelone')

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'CfasIndex',
            component: CfasIndex
        },
        {
            path: '/login',
            name: 'CfasLoginDefault',
            component: CfasLoginDefault
        },
        {
            path: '/login/:tenant',
            name: 'CfasLoginLdap',
            component: CfasLoginLdap,
            props: true
        },
        {
            path: '/sso/login',
            name: 'CfasSSOLogin',
            component: CfasSSOLogin
        },
        {
            path: '/sso/function',
            name: 'CfasSSOFunction',
            component: CfasSSOFunction,
            children: [
                ...va.ssoRoutes,
                {
                    path: '/sso/personal/:queryName',
                    name: 'fo-personal',
                    component: FoPersonal,
                    props: true,
                    meta: {
                        title: '个人中心查询'
                    }
                }
            ]
        },
        {
            path: '/main',
            name: 'CfasMain',
            component: CfasMain,
            children: [
                ...va.routes,
                {
                    path: '/home',
                    name: 'cfas-home',
                    component: CfasHome,
                    meta: {
                        title: '首页',
                        icon: 'iconfont icon_YQshouye',
                        notCache: true
                    }
                },
                {
                    path: '/homepage',
                    name: '/homepage',
                    component: Homepage,
                    meta: {
                        title: '待办首页'
                    }
                },
                {
                    path: '/bill/:defineCode/:billCode/:dataState',
                    name: 'fo-bill',
                    component: FoBill,
                    meta: {
                        title: '单据',
                        aliveId (route, pagePath) {
                            return `/bill/${route.params.defineCode}`
                        }
                    },
                    props: true
                },
                {
                    path: '/FoTravelApplyBillModel',
                    name: 'fo-travelapply-bill',
                    component: TravelApply,
                    props: true,
                    meta: {
                        title: '行程申请单'
                    }
                },
                {
                    path: '/coding',
                    name: '/coding',
                    component: Coding,
                    meta: {
                        title: '建设中'
                    }
                },
                {
                    path: '/budcon',
                    name: 'BudgetControl',
                    component: BudgetControl,
                    meta: {
                        title: '预算控制策略'
                    }
                },
                {
                    path: '/budgetdept',
                    name: 'BudgetDept',
                    component: BudgetDept,
                    meta: {
                        title: '部门预算'
                    }
                },
                {
                    path: '/budproject',
                    name: 'BudgetProject',
                    component: BudgetProject,
                    meta: {
                        title: '项目预算'
                    }
                },
                {
                    path: '/budorg',
                    name: 'BudgetOrg',
                    component: BudgetOrg,
                    meta: {
                        title: '单位预算'
                    }
                },
                // {
                //     path: '/custsupplier',
                //     name: '/custsupplier',
                //     component: CustSupplier,
                //     meta: {
                //         title: '客商'
                //     }
                // },

                {
                    path: '/fo-travel-control',
                    name: 'fo-travel-control',
                    component: FoTravelControl,
                    meta: {
                        title: '差旅标准'
                    }
                },

                {
                    path: '/query/FoQueryLoan/:isQuery?',
                    name: '/FoQueryLoan',
                    component: FoQueryLoan,
                    meta: {
                        title: '个人借款查询'
                    },
                    props: true
                },
                {
                    path: '/query/FoQueryLoanDept',
                    name: '/FoQueryLoanDept',
                    component: FoQueryLoanDept,
                    meta: {
                        title: '部门借款查询'
                    }
                },
                {
                    path: '/query/FoQueryExpenseDept',
                    name: '/FoQueryExpenseDept',
                    component: FoQueryExpenseDept,
                    meta: {
                        title: '部门报销查询'
                    }
                },
                {
                    path: '/query/FoQueryBudgetAnnual/:type',
                    name: '/FoQueryBudgetAnnual',
                    component: FoQueryBudgetAnnual,
                    meta: {
                        title: '年度预算执行查询'
                    },
                    props: true
                },
                {
                    path: '/query/FoQueryBudgetQuarter/:type',
                    name: '/FoQueryBudgetQuarter',
                    component: FoQueryBudgetQuarter,
                    meta: {
                        title: '季度预算执行查询'
                    },
                    props: true
                },
                {
                    path: '/query/FoQueryBudgetMonthly/:type',
                    name: '/FoQueryBudgetMonthly',
                    component: FoQueryBudgetMonthly,
                    meta: {
                        title: '月度预算执行查询'
                    },
                    props: true
                },
                {
                    path: '/btm-intf',
                    name: 'btm-intf',
                    component: BtmIntf,
                    meta: {
                        title: '携程接口'
                    }
                },
                {
                    path: '/ldap-config',
                    name: 'ldap-config',
                    component: LdapConfig,
                    meta: {
                        title: 'LDAP设置'
                    }
                },
                {
                    path: '/btm-travelone-intf',
                    name: 'btm-travelone-intf',
                    component: BtmTravelOneIntf,
                    meta: {
                        title: '差旅壹号接口'
                    }
                },
                {
                    path: '/eis-intf',
                    name: 'eis-intf',
                    component: EisIntf,
                    meta: {
                        title: '影像接口'
                    }
                },
                {
                    path: '/fssc-intf',
                    name: 'fssc-intf',
                    component: FsscIntf,
                    meta: {
                        title: '单据入池接口'
                    }
                },
                {
                    path: '/personal/:queryName',
                    name: 'fo-personal',
                    component: FoPersonal,
                    props: true,
                    meta: {
                        title: '个人中心查询'
                    }
                },
                {
                    path: '/btm/consumption',
                    name: 'fo-consumption',
                    component: FoConsumption,
                    meta: {
                        title: '我的未报行程'
                    }
                },
                {
                    path: '/fo-consumptions',
                    name: 'fo-consumptions',
                    component: FoConsumptions,
                    meta: {
                        title: '消费记录'
                    }
                },
                {
                    path: '/syncdata/config',
                    name: 'FoSyncDataConfigMgr',
                    component: FoSyncDataConfigMgr,
                    meta: {
                        title: '数据同步配置管理'
                    }
                },
                {
                    path: '/foBtm',
                    name: 'CfasFoBtm',
                    component: CfasFoBtm,
                    meta: {
                        title: '差旅壹号行程申请单同步接口映射方案'
                    }
                },
                {
                    path: '/btm-sso-travelone',
                    name: 'FoBtmTravelOneSso',
                    component: FoBtmTravelOneSso,
                    meta: {
                        title: '单点登陆（差旅壹号）'
                    }
                }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    iview.LoadingBar.start()

    if (to.path !== '/home') {
        let flag = false
        if (sessionStorage.markTab) {
            const markTab = JSON.parse(sessionStorage.markTab)
            const mark = markTab.find(item => item.path === to.path)
            if (mark && mark.title) {
                to.meta.title = mark.title
                flag = true
            }
        }

        if (!flag && (to.name === 'va-bill' || to.name === 'fo-bill')) {
            const menus = JSON.parse(sessionStorage.menus)
            const currMenu = menus.find(item =>
                item.biztype === 1 && item.url.indexOf('/bill/CFAS_B') === 0 && to.path.indexOf('/bill/CFAS_B') === 0 &&
                item.url.substring(0, item.url.indexOf('/', 6) + 1) === to.path.substring(0, to.path.indexOf('/', 6) + 1))
            if (currMenu && currMenu.title) {
                to.meta.title = currMenu.title
                flag = true
            } else {
                to.meta.title = from.meta.title
                flag = true
            }
        }

        if (!flag && sessionStorage.menus) {
            const menus = JSON.parse(sessionStorage.menus)
            const currMenu = menus.find(item => item.url === to.path)
            if (currMenu && currMenu.title) {
                to.meta.title = currMenu.title
            }
        }

        if (sessionStorage.markTab) {
            let markTab = JSON.parse(sessionStorage.markTab)
            markTab.push({path: to.path, title: to.meta.title})
            sessionStorage.markTab = JSON.stringify(markTab)
        } else {
            sessionStorage.markTab = JSON.stringify([{path: to.path, title: to.meta.title}])
        }

        to.meta.icon = 'ivu-tag-dot-inner'
    }

    next()

    iview.LoadingBar.finish()
})

va.installRouter(router)

export default router
