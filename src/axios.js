import axios from 'axios'
import Element from 'element-ui'
import router from './router'
import store from './store'

axios.defaults.baseURL = 'http://localhost:8088'
// axios.defaults.baseURL = process.env.NODE_ENV === "development" ? "http://localhost:8088" : "http://xx.xx.xx.xx:8088"
axios.defaults.baseURL = process.env.NODE_ENV === "development" ? "http://gateway.normalblog.cn" : "http://gateway.normalblog.cn"
// axios.defaults.baseURL = process.env.NODE_ENV === "development" ? "http://xx.xx.xx.xx:8088" : "normal-gateway:8088"
// axios.defaults.baseURL = "http://xx.xx.xx.xx:8088"

const request = axios.create({
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
})

// 前置拦截
request.interceptors.request.use(config => {
    config.headers['Authorization'] = localStorage.getItem('token')
    return config
})

request.interceptors.response.use(response => {
        let res = response.data
        if (res.code === 200) {
            return response
        }
        let msg = res.msg ? res.msg : '错了哦，这是一条错误消息'
        Element.Message.error(msg, {duration: 3 * 1000})
        return Promise.reject(response.data.msg)
    },
    error => {
        if (!error.response) {
            Element.Message.error(error.message, {duration: 3 * 1000})
            return Promise.reject(error)
        }
        if (error.response.data && error.response.data.msg) {
            error.message = error.response.data.msg
        } else {
            error.message = '操作失败'
        }

        if (error.response.status === 401) {
            store.commit('REMOVE_INFO')
            // router.push('/')
        }
        Element.Message.error(error.message, {duration: 3 * 1000})
        return Promise.reject(error)
    }
)
export default request