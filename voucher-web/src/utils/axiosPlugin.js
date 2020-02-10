/* eslint-disable */
import Config from '../config'
import Axios from 'axios'
import iView from 'iview'
// import Qs from 'qs'

import router from '../router'

export const axios = Axios.create({
    headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
    },
    timeout: Config.axiosTimeout
})

// 在发送请求之前
axios.interceptors.request.use((config) => {
    // 附加token信息
    if (sessionStorage.token) {
        config.headers.Authorization = sessionStorage.token
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

// 返回状态判断
axios.interceptors.response.use((res) => {
    return res
}, (error) => {
    if (error.response && error.response.status && error.response.status === 401) {
        window.location.href = '/'
        return
    } else {
        return Promise.reject(error)
    }
})

export default {
    install (Vue) {
        Object.defineProperty(Vue.prototype, '$http', { value: axios })
    }
}
