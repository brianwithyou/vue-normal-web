import axios from '../axios'
import qs from 'qs'

let serverName = 'search-server'
// let serverName = ''
// 命名规范 后端 create delete update list get
// 前端 list get create delete update
export function search(body, param) {
    return axios.post(serverName + '/search/search', JSON.stringify(body));
}
export function listWebMenus() {
    return axios.get(serverName + '/web/menu/list')
}

export function getBlogs(param) {
    return axios.post(serverName + '/web/blog/list', JSON.stringify(param));
}

export function getBlogsFeed(body, requestParam) {
    return axios.post(serverName + '/web/blog/feed?' + qs.stringify(requestParam), JSON.stringify(body));
}
export function listBlogs(body, requestParam) {
    return axios.post(serverName + '/web/blog/list?' + qs.stringify(requestParam), JSON.stringify(body));
}
export function getBlogDetail(id) {
    return axios.get(serverName + '/web/blog/' + id);
}
export function deleteBlog(body, requestParam) {
    return axios.post(serverName + '/web/blog/delete' + qs.stringify(requestParam), JSON.stringify(body));
}


export function getHotBlogs() {
    return axios.post(serverName + '/web/rank/blogs')
}
export function create(body) {
    return axios.post(serverName + '/web/blog/create', JSON.stringify(body))
}
export function update(body) {
    return axios.post(serverName + '/web/blog/update', JSON.stringify(body))
}

export function loginApi(body) {
    return axios.post(serverName + '/web/login', JSON.stringify(body))
}
export function registerApi(body) {
    return axios.post(serverName + '/web/register', JSON.stringify(body))
}