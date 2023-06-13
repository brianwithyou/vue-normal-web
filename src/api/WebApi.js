import axios from '../axios'
import qs from 'qs'

let serverName = 'web-server'
// let serverName = ''
// 命名规范 后端 create delete update list get
// 前端 list get create delete update

export function listTagsApi(body) {
    return axios.post(serverName + '/web/tag/list', JSON.stringify(body))
}

export function listUserStatisticsApi(body) {
    return axios.post(serverName + '/web/user/statistic', JSON.stringify(body))
}
export function createCommentApi(body) {
    return axios.post(serverName + '/web/comment/create', JSON.stringify(body))
}
export function listCommentApi(body) {
    return axios.post(serverName + '/web/comment/list', JSON.stringify(body))
}

export function listTimelineApi(body) {
    return axios.post(serverName + '/web/timeline/list', JSON.stringify(body))
}
export function loadTags(param) {
    return axios.get(serverName + '/web/tag/list', JSON.stringify(param));
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
export function updateUserApi(body) {
    return axios.post(serverName + '/web/user/update', JSON.stringify(body));
}
export function getBlogDetail(id) {
    return axios.get(serverName + '/web/blog/info?' + qs.stringify({id: id}));
}
export function deleteBlog(body, requestParam) {
    return axios.post(serverName + '/web/blog/delete' + qs.stringify(requestParam), JSON.stringify(body));
}

export function getHotBlogs() {
    return axios.post(serverName + '/web/rank/blogs')
}
export function isCollectedApi(body) {
    return axios.post(serverName + "/web/collect/isCollected", JSON.stringify(body))
}

export function collectBlogApi(param) {
    return axios.get(serverName + "/web/blog/collect?" + qs.stringify(param))
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