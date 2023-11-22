import axios from 'axios'
import VueAxios from 'vue-axios'
import Vue from 'vue'
import { Message } from 'element-ui'


axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL
let errorResp = "errorResp"

// 附加token
axios.interceptors.request.use(config => {
    // 附加上token
    config.headers['token'] = window.sessionStorage.getItem("token")
    return config
})

/**
 * 拦截器
 *  - 检查是否是出错
 *  - 去除封装
 */
axios.interceptors.response.use(
    resp => {
        let result = resp.data

        // 如果状态码报错
        if(result.code != 0){
            Message.error(result.msg)
            console.log(result)
            return errorResp
        }

        return resp.data
    },

    // 抛异常的错误
    error => {
        console.profileEnd(error)
        if (error.response.status == 401) {
            window.location.href = '/login'
        } else if (error.response.status == 404) {
            Message.error("404: 资源不存在")
            return Promise.reject(error)
        } else {
            Message.error(result.msg)
            return Promise.reject(error)
        }
    }
)

// 挂载axios
console.log(process.env.VUE_APP_FLUSH_INTERVAL)
Vue.use(VueAxios, axios)

// 封装Get请求
export function doGet(url, data, responseFunction) {
    axios.get(url, { params: data }).then((resp) => {
        if (responseFunction != null && resp != errorResp) {
            responseFunction(resp)
        }
    })
}

// 封装Post请求
export function doPost(url, data, responseFunction) {
    axios.post(url, data).then((resp) => {
        if (responseFunction != null && resp != errorResp) {
            responseFunction(resp)
        }
    })
}

// 封装Put请求
export function doPut(url, data, responseFunction) {
    axios.put(url, data).then((resp) => {
        if (responseFunction != null && resp != errorResp) {
            responseFunction(resp)
        }
    })
}

// 封装Delete请求
export function doDelete(url, data, responseFunction) {
    axios.delete(url, { params: data }).then((resp) => {
        if (responseFunction != null && resp != errorResp) {
            responseFunction(resp)
        }
    })
}
