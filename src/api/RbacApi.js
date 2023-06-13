import axios from '../axios'
import qs from 'qs'

let rbacServer = 'rbac-server'
export function loginApi(param) {
    return axios.post(rbacServer + '/rbac/auth/login', JSON.stringify(param));
}
export function registerApi(param) {
    return axios.post(rbacServer + '/rbac/auth/register', JSON.stringify(param));
}

export function logoutApi(param) {
    // TODO
    return axios.post(rbacServer + '/rbac/auth/logout', JSON.stringify(param));
}

