<template>
  <div>
    <header id="header" :class="isVisible ? 'header-navigation slideDown':'header-navigation slideUp'" style="margin-bottom: 20px">
      <nav style="width: auto;display: flex; justify-content: flex-start;">
        <div class="logo" style="display: flex;justify-content: flex-start;flex-grow: 1">
          <router-link style="margin-left: 10px" to="/">
            <a v-if="info.name" href="javascript:void(0);">{{ info.name }}</a>
          </router-link>
        </div>
        <ul style="flex-grow: 10;display: flex; justify-content: flex-start;">
          <li v-for="menu in webMenus" :key="menu.id" style="margin-left: 15px">
            <span v-if="menu.childWebNavbar && menu.childWebNavbar.length > 0">
              <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                {{ menu.name }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(childWebNavbar, index)  in menu.childWebNavbar" :key="index">
                  <router-link v-if="childWebNavbar.isJumpExternalUrl === 0" :to="childWebNavbar.url">
                    <a href="javascript:void(0);" @click="openHead">{{ childWebNavbar.name }}</a>
                  </router-link>
                  <a v-if="childWebNavbar.isJumpExternalUrl === 1" :href="childWebNavbar.url"
                     target="_blank">{{ childWebNavbar.name }}</a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            </span>
            <span v-else>
              <router-link v-if="menu.isJumpExternalUrl === 0" :to="{path:menu.url, query: null}">
              <a :class="[saveTitle === menu.url ? 'title' : '']" href="javascript:void(0);"
                 @click="openHead">{{ menu.name }}</a>
              </router-link>
              <a v-else :class="[saveTitle === menu.url ? 'title' : '']" :href="menu.url"
                 target="_blank">{{ menu.name }}</a>
            </span>
          </li>
        </ul>
        <div class="searchbox" style="flex-grow: 3">
          <div id="search_bar" :class="'search_bar search_open'">
            <input ref="searchInput" v-model="keyword" class="input" name="keyboard" placeholder="Redis"
                   type="text" v-on:keyup.enter="search">
            <p :style="(browserFlag === 1)?'':'top:17px'" class="search_ico" @click="doSearch">
              <span></span>
            </p>
          </div>
        </div>
<!--        <div v-if="userInfo.username" style="flex-grow: 2;">-->
        <div style="flex-grow: 2;">
          <el-button style="margin-left: auto;right: 50px;height: auto" type="primary" @click="createBlog">写文章</el-button>
        </div>
        <div style="flex-grow: 1;">
          <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
<!--            <el-badge  :value="userReceiveCommentCount"  class="item" :hidden="!hasLogin || userReceiveCommentCount === 0">-->
                <el-avatar :src='userInfo.avatar == null ? defaultAvatar : userInfo.avatar' size="medium"
                           style="margin-top: 10px"></el-avatar>
            <!--            </el-badge>-->
          </span>
            <el-dropdown-menu>
              <el-dropdown-item v-show="!hasLogin" command="login">登录</el-dropdown-item>
              <el-dropdown-item v-show="hasLogin" command="showUserCenter">个人中心</el-dropdown-item>
              <el-dropdown-item v-show="hasLogin" command="showUserProfile">个人主页</el-dropdown-item>
              <el-dropdown-item v-show="hasLogin" command="content">内容管理</el-dropdown-item>
              <!--              <el-dropdown-item command="showUserCenter" v-show="hasLogin">我的订单</el-dropdown-item>-->
              <el-dropdown-item v-show="hasLogin" command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </nav>
    </header>
    <LoginBox v-if="showLogin" @closeLoginBox="closeLoginBox"></LoginBox>
  </div>
</template>

<script>
import LoginBox from '@/components/LoginBox'
import {logoutApi} from '@/api/RbacApi'
import {listWebMenus} from "@/api/WebApi";
import {mapGetters} from "vuex";

export default {
  name: 'Header',
  components: {LoginBox},
  computed: {
    userInfo: {
      get() {
        return this.$store.getters.getUser
      },
      set(val) {}
    },
    hasLogin: {
      get() {
        return this.$store.getters.getUser && this.$store.getters.getUser.username
      },
      set(val) {}
    }
  },
  data() {
    return {
      saveTitle: '',
      showLogin: false,
      info: {name: 'Normal'},
      keyword: 'redis',
      userReceiveCommentCount: 0, // 用户收到的评论数
      browserFlag: 1, // 浏览器标志【默认Chrome】
      showHead: true, //控制导航栏的弹出
      isVisible: true, //控制web端导航的隐藏和显示
      webMenus: [
        {name: '首页', childWebNavbar: false, id: 'portal'},
        {name: '社区', childWebNavbar: false, id: 'forum'},
        {name: '课程', childWebNavbar: false, id: 'class'},
        {name: '关于本站', childWebNavbar: false, id: 'about'}
      ],
      defaultAvatar: 'https://p3-search.byteimg.com/obj/labis/da0b2c93004dd284a2f9948d0de1e310',
    }
  },
  methods: {
    loadAvatar() {
      let avatar = this.userInfo.avatar
      return avatar == null ? this.defaultAvatar : avatar
    },
    createBlog() {
      if (!this.hasLogin || this.userInfo.username == null) {
        this.showLogin = true
        return
      }
      let routeData = this.$router.resolve({
        path: '/edit'
      })
      window.open(routeData.href, '_blank')
    },
    closeLoginBox: function () {
      this.showLogin = false
    },
    search: function () {
      if (this.keyword === '' || this.keyword.trim() === '') {
        this.$message.warning('请输入搜索内容')
        return
      }
      this.$router.push({path: '/list'})
      this.$store.commit('SET_KEYWORD', this.keyword)
    },
    // 点击头像触发的动作
    handleCommand(command) {
      switch (command) {
        case 'logout' :
          this.logout()
          break
        case 'login':
          this.showLogin = true
          break
        case 'content':
          this.$message.success("fake feature")
          break
        case 'showUserCenter' :
          this.$store.commit("SHOW_USER_CENTER", true)
          break
        case 'showUserProfile':
          this.$router.push('/userProfile')
          break;
      }
    },
    doSearch: function () {
      if (this.keyword !== '') {
        this.search()
      }
      //获取焦点
      this.$refs.searchInput.focus()
    },
    openHead: function () {
      this.isVisible = true
      this.showHead = !this.showHead
    },
    logout() {
      const _this = this
      _this.hasLogin = false
      this.userInfo = {}
      _this.$store.commit('REMOVE_INFO')
      _this.$router.push('/')
    }
  },
  created() {
    listWebMenus().then(res => {
      if (res.data.code === 200) {
        this.webMenus = res.data.data
      }
    })
    let user = this.$store.getters.getUser
    if (user && user.username) {
      this.userInfo = user
      this.hasLogin = true
    }
  }
}
</script>

<style lang="scss">
@import "../assets/css/emoji.css";

.emoji-panel-btn:hover {
  cursor: pointer;
  opacity: 0.8;
}

.emoji-size-small {
  zoom: 0.3;
}
</style>

<style scoped>
.el-tag {
  height: 25px;
  line-height: 25px;
  margin-left: 6px;
}

#starlist li .title {
  color: #00a7eb;
}


.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  margin: 0 0 0 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

</style>