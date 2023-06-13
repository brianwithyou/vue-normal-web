import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import BlogEdit from '../views/BlogEdit.vue'


Vue.use(VueRouter)
//先保存router原型对象的push
let origin = VueRouter.prototype.push
//第一个参数：告诉push方法往哪里跳转，并传递哪些参数
VueRouter.prototype.push = function(location, resolve, reject) {
  if (resolve && reject) {
    //js中的每个函数都有call和apply方法，唯一区别就是call传参用逗号隔开，apply使用数组，相同点都可以调用函数一次
    origin.call(this, location, resolve, reject)
  } else {
    origin.call(this, location, () => {}, () => {})
  }
}
VueRouter.prototype.replace = function(location, resolve, reject) {
  if (resolve && reject) {
    //js中的每个函数都有call和apply方法，唯一区别就是call传参用逗号隔开，apply使用数组，相同点都可以调用函数一次
    origin.call(this, location, resolve, reject)
  } else {
    origin.call(this, location, () => {}, () => {})
  }
}

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Home,
    children: [
      { path: '/', component: () => import('@/views/Body') },
      { path: '/info', component: () => import('@/views/BlogDetail') },
      { path: '/timeline', component: () => import('@/views/Timeline') },
      { path: '/list', component: () => import('@/views/SearchList') },
      { path: '/edit', component: () => import('@/views/BlogEdit'), name: 'BlogEdit' },
      { path: '/talk', component: () => import('@/views/TalkList'), name: 'Talk' },
      { path: '/leaveMessage', component: () => import('@/views/LeaveMessage'), name: 'LeaveMessage' },
      { path: '/mall', component: () => import('@/views/Mall') },
      { path: '/tag', component: () => import('@/views/Tag') },
      { path: '/about', component: () => import('@/views/AboutMe') },
    ]
  },
  { path: '/userProfile', component: () => import('@/views/UserProfile') },
  { path: '/404', component: () => import('@/views/404') },
  { path: '/500', component: () => import('@/views/500') },
  { path: '/502', component: () => import('@/views/502') },
  // { path: '/*', component: () => import('@/views/404') }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
