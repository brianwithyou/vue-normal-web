import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const setTheme = (theme) => {
  if (theme === 'theme-dark') {
    document.body.classList.remove('theme-light')
    document.body.classList.add('theme-dark')
  } else {
    document.body.classList.remove('theme-dark')
    document.body.classList.add('theme-light')
  }
}
export default new Vuex.Store({
  state: {
    token: '',
    showUserCenter: false,
    keyword: '',
    userInfo: JSON.parse(sessionStorage.getItem("userInfo"))
  },
  mutations: {
    // set
    updateAvatar(state, avatar) {
      state.userInfo.avatar = avatar
    },
    SET_KEYWORD: (state, keyword) => {
      console.log('set key word..' + keyword)
      state.keyword = keyword
    },
    SET_TOKEN: (state, token) => {
      state.token = token
      localStorage.setItem("token", token)
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo))
    },
    REMOVE_INFO: (state) => {
      state.token = ''
      state.userInfo = {}
      localStorage.setItem("token", '')
      sessionStorage.setItem("userInfo", JSON.stringify(''))
    },
    SHOW_USER_CENTER: (state, flag) => {
      state.showUserCenter = flag
    },

  },
  getters: {
    // get
    getUser: state => {
      return state.userInfo == null ? {} : state.userInfo
    },
    getKeyword: state => {
      return state.keyword
    },
    userInfo: state => {
      return state.userInfo == null ? {} : state.userInfo
    },
    showUserCenter: state => {
      return state.showUserCenter
    },
  },
  actions: {
    initializeTheme(mode) {
      setTheme(mode)
    },
    toggleTheme(isDark) {
      this.themeConfig.theme =
          isDark === true || this.themeConfig.theme === 'theme-light' ? 'theme-dark' : 'theme-light'
      cookies.set('theme', this.themeConfig.theme, { expires: 7 })
      setTheme(this.themeConfig.theme)
    },
  },
  modules: {
  }
})
