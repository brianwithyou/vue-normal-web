import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import axios from 'axios'
import tagCloud from '@/components/tag-cloud'
// 仿 github每日贡献度热力图
import VueCalendarHeatmap from 'vue-calendar-heatmap'


import mavonEditor from 'mavon-editor'
import { registerSvgIcon } from '@/icons'
// PostCSS、TailwindCSS、能让你少写很多代码的css工具库
// 引入图片懒加载插件
import VueLazyload from 'vue-lazyload'

import "element-ui/lib/theme-chalk/index.css"
import 'mavon-editor/dist/css/index.css'
import "@/assets/iconfont/iconfont.css";
import '../static/css/ckeditor.css';
import '../static/css/index.scss';
import '../static/css/sidebar-box.scss';

import "./axios"
import "./permission"

import config from "../config";

Vue.use(VueCalendarHeatmap)
Vue.use(Element)
Vue.use(mavonEditor)
Vue.use(tagCloud)

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.config = config

registerSvgIcon(Vue)

// Vue.use(VueLazyload) // 直接使用
Vue.use(VueLazyload, { // 添加自定义选项
  preLoad: 1.3,
  // 必须使用require
  error: require('@/assets/default-cover.jpg'), // 加载错误时候的图片
  loading: require('@/assets/default-cover.jpg'), // 加载中的图片
  attempt: 7,
  listenEvents: ['scroll'],
})

let app = new Vue({
  router,
  store,
  render: h => h(App)
});
app.$mount('#app');

