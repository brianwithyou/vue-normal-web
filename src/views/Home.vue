<template>
<div class="frame" style="display: flex; flex-flow: column;width: auto">
  <Header></Header>
  <div class="app-banner app-banner-image" :style="headerImage" />
  <div class="app-banner app-banner-screen" />

  <div style="min-height: 1000px;width: auto">
    <router-view />
  </div>
  <UserCenter/>
  <footer style="padding: 20px 0;margin: 20px 0;background-color: white;">
    <p>© 2023 - {{curYear}}  <span>&nbsp;&nbsp;&nbsp;&emsp;&emsp;</span>
      Copyright <a href="https://github.com/brianwithyou"> &nbsp;Normal Blog&nbsp;</a>
      <a href="https://beian.miit.gov.cn/">{{info.recordNum}}</a>
    </p>
  </footer>
</div>
</template>

<script>
import Header from '@/components/Header'
import UserCenter from "@/components/UserCenter";
import Blogs from "@/views/Blogs";
export default {
  name: 'Home',
  components: {
    Blogs,
    Header,
    UserCenter
  },
  data() {
    return {
      curYear: new Date().getFullYear(),
      info: {name: "Normal", recordNum: '京ICP备2023014581号'},
      isCdTopVisible: false,
      defaultAvatar: 'https://p3-search.byteimg.com/obj/labis/da0b2c93004dd284a2f9948d0de1e310', // 默认头像
      drawerSize: "30%",
    }
  },
  mounted() {
    var that = this;
    var offset = 300;
    var after = 0;
    window.addEventListener("scroll", function () {
      let scrollTop = document.documentElement.scrollTop; //当前的的位置
      let scrollHeight = document.documentElement.scrollHeight; //最高的位置

      that.isCdTopVisible = scrollTop > offset;
      that.isVisible = scrollTop <= after;
      after = scrollTop;
    });

    // 屏幕自适应
    window.onresize = () => {
      return (() => {
        that.setSize()
      })()
    }
  },
  created() {
    this.getBrowser()
    this.$store.dispatch('initializeTheme')
  },
  methods: {
    headerImage() {
      return {
        backgroundImage: `url(${require('@/assets/default-cover.jpg')})`,
        opacity:  1
      }
    },
    setSize() {
      // 屏幕大于950px的时候，显示侧边栏
      let clientWidth = document.body.clientWidth
      if(clientWidth > 1360) {
        this.drawerSize = "30%";
        this.showSearch = true
      }else if(clientWidth < 1360 && clientWidth > 950) {
        this.drawerSize = "50%";
        this.showSearch = true
      } else if(clientWidth < 950 && clientWidth > 650) {
        this.drawerSize = "70%";
        this.showSearch = false
      } else {
        this.drawerSize = "95%";
        this.showSearch = false
      }
    },
    //跳转到文章详情
    goToInfo(uid) {
      let routeData = this.$router.resolve({
        path: "/info",
        query: {blogUid: uid}
      });
      window.open(routeData.href, '_blank');
    },

    // 跳转到资源详情
    /**
     * dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
     * @param dateTimeStamp
     * @returns {string}
     */

    close() {
      this.imagecropperShow = false
    },

    returnTop: function () {
      window.scrollTo(0, 0);
    },

    // 获取浏览器类型
    getBrowser() {
      let sBrowser, sUsrAg = navigator.userAgent;
      if (sUsrAg.indexOf("Firefox") > -1) {
        sBrowser = "Mozilla Firefox";
        this.browserFlag = 2;
        // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
      } else if (sUsrAg.indexOf("Chrome") > -1) {
        sBrowser = "Google Chrome or Chromium";
        this.browserFlag = 1;
        // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
      }

    },
  }
}
</script>

<style lang="scss">
.frame {
  margin: 0 20px;
}
</style>