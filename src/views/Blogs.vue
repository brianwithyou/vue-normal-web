<template>
  <div style="display: flex;">
    <div class="blogsbox">
      <div v-for="item in blogs" class="blogs" style="border-radius: 1rem; display: flex "
           data-scroll-reveal="enter bottom over 1s">
        <div>
          <div>
            <h3 class="blogtitle">
              <span @click="detail(item)" v-html="item.title">{{ item.title }}</span>
            </h3>
            <p class="blogtext">{{ item.summary }}</p>
          </div>
          <div class="bloginfo">
            <ul>
              <li v-if="item.blogSort" class="lmname">
                <span class="iconfont">&#xe603;</span>
                <a href="javascript:void(0);" @click="goToList(item.blogSort.uid)">{{ item.blogSort.sortName }}</a>
              </li>
              <li class="view">
                <span class="iconfont">&#xe8c7;</span>
                <span>{{ item.readCount }}</span>
              </li>
              <li class="like">
                <span class="iconfont">&#xe663;</span>
                {{ item.collectCount }}
              </li>
              <li class="createTime">
                <span class="iconfont">&#xe606;</span>
                {{ item.createTime }}
              </li>
              <li class="author">
                <span class="iconfont">作者: </span>
                <a href="javascript:void(0);" @click="goToAuthor(item.author)">{{ item.author }}</a>
              </li>
              <li class="author" v-if="getUser ? item.uid === getUser.id : false">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                      <i class="el-icon-more-outline el-icon--right"></i>
                  </span>
                  <el-dropdown-menu>
                    <el-dropdown-item command="delete" @click.native="deleteBlog(item.id)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </li>
            </ul>
          </div>
        </div>

        <span class="blogpic" style="margin-left: auto;">
          <a href="javascript:void(0);" title @click="detail(item)">
            <img v-if="item.cover" style="max-height: 140px" :src="item.cover" alt>
          </a>
        </span>
      </div>

      <div class="isEnd">
        <div v-if="!isEnd&&!loading" class="loadContent" @click="loadContent">点击加载更多</div>
        <div v-if="!isEnd&&loading" class="lds-css ng-scope">
          <div class="lds-facebook" style="width:100%;height:100%">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <span v-if="isEnd && this.blogs.length === 0">{{ endSentence }}~</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {Loading} from 'element-ui'
import {deleteBlog, listBlogs} from '@/api/WebApi'
import {search} from "@/api/SearchApi";

export default {
  name: 'Blogs',
  components: {},
  mounted() {
    this.loading = false
  },
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    keyword() {
      return this.$store.state.keyword
    }
  },
  watch: {
    keyword(newVal, oldVal) {
        this.newBlogList(newVal)
    }
  },
  data() {
    return {
      endSentence: '我也是有底线的',
      loading: false, //是否正在加载
      isEnd: false, //是否到底底部了
      loadingInstance: null, // loading对象
      blogs: [],
      lastId: Date.now(),
      offset: 0,
      pageNum: 1,
      pageSize: 10
    }
  },
  methods: {
    deleteBlog(blogId) {
      deleteBlog({id: blogId}).then(res => {
        if (res.data.code === 200) {
          this.blogs = this.blogs.filter(blog => blog.id !== blogId)
        }
      })
    },
    goToAuthor(author) {
      let routeData = this.$router.push({
        path: '/list',
        query: {author: author}
      })
    },
    detail(blog) {
      let routeData = this.$router.resolve({
        path: '/info',
        query: {id: blog.id}
      })
      window.open(routeData.href, '_blank')
    },
    loadContent: function () {
      var that = this
      that.loading = false
      let params = {
        pageNum: this.pageNum + 1,
        pageSize: this.pageSize
      }
      listBlogs(params).then(res => {
        if (res.data.code === 200 && res.data.data.records.length > 0) {
          that.isEnd = false
          var newData = that.blogs.concat(res.data.data.records)
          that.blogs = newData

          that.total = res.data.data.total
          that.pageSize = res.data.data.size
          that.pageNum = res.data.data.current
          //全部加载完毕
          if (newData.length < that.pageSize) {
            that.isEnd = true
          }
        } else {
          that.isEnd = true
        }
        that.loading = false
      })
    },
    //最新博客列表
    newBlogList(keyword) {
      // let query = this.$route.query;
      if (keyword) {
        console.log('do search...')
        search({keyword}).then(res => {
            this.blogs = res.data.data.content
        })
        if (this.blogs.length === 0) {
          this.isEnd = true
          this.endSentence = '空空如也'
        }
        return
      }
      let that = this
      that.loadingInstance = Loading.service({
        lock: true,
        text: '正在努力加载中……',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      let requestParam = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      listBlogs(requestParam).then(res => {
        if (res.data.code === 200 && res.data.data) {
          that.blogs = res.data.data.records
          // 使用滚动分页，只需要 lastId(即本次查询的最小时间)和offset(后台传过来的)
          // this.lastId = res.data.data.minTime
          // this.offset = res.data.data.offset
          that.total = res.data.data.total
          that.pageSize = res.data.data.size
          that.currentPage = res.data.data.current
        }
        that.loadingInstance.close()
      }, function (err) {
        that.loadingInstance.close()
      })
      // let requestParam = {
      //   lastId: this.lastId,
      //   offset: this.offset
      // }
      // feed流
      // getBlogsFeed(null, requestParam).then(res => {
      //   if (res.data.code === 200 && res.data.data) {
      //     that.blogs = res.data.data.list;
      //     // 使用滚动分页，只需要 lastId(即本次查询的最小时间)和offset(后台传过来的)
      //     this.lastId = res.data.data.minTime
      //     this.offset = res.data.data.offset
      //     // that.total = res.data.data.total;
      //     // that.pageSize = res.data.data.size;
      //     // that.currentPage = res.data.data.current;
      //   }
      //   that.loadingInstance.close();
      // },function(err){
      //   that.loadingInstance.close();
      // });
    }
  },
  created() {
      this.newBlogList(this.keyword)
  }
}
</script>

<
<style>
.el-loading-mask {
  z-index: 2002;
}

.isEnd {
  float: left;
  width: 100%;
  height: 80px;
  text-align: center;
}

.ng-scope {
  margin: 0 auto;
  width: 18%;
  height: 10%;
}

.loadContent {
  width: 120px;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  margin: 0 auto;
  color: aliceblue;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.8);
}

@keyframes lds-facebook_1 {
  0% {
    top: 0px;
    height: 200px;
  }
  50% {
    top: 80px;
    height: 40px;
  }
  100% {
    top: 80px;
    height: 40px;
  }
}

@-webkit-keyframes lds-facebook_1 {
  0% {
    top: 0px;
    height: 200px;
  }
  50% {
    top: 80px;
    height: 40px;
  }
  100% {
    top: 80px;
    height: 40px;
  }
}

@keyframes lds-facebook_2 {
  0% {
    top: 20px;
    height: 160px;
  }
  50% {
    top: 80px;
    height: 40px;
  }
  100% {
    top: 80px;
    height: 40px;
  }
}

@-webkit-keyframes lds-facebook_2 {
  0% {
    top: 20px;
    height: 160px;
  }
  50% {
    top: 80px;
    height: 40px;
  }
  100% {
    top: 80px;
    height: 40px;
  }
}

@keyframes lds-facebook_3 {
  0% {
    top: 40px;
    height: 120px;
  }
  50% {
    top: 80px;
    height: 40px;
  }
  100% {
    top: 80px;
    height: 40px;
  }
}

@-webkit-keyframes lds-facebook_3 {
  0% {
    top: 40px;
    height: 120px;
  }
  50% {
    top: 80px;
    height: 40px;
  }
  100% {
    top: 80px;
    height: 40px;
  }
}

.lds-facebook {
  position: relative;
}

.lds-facebook div {
  position: absolute;
  width: 20px;
}

.lds-facebook div:nth-child(1) {
  left: 40px;
  background: #1d0e0b;
  -webkit-animation: lds-facebook_1 1s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  animation: lds-facebook_1 1s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  -webkit-animation-delay: -0.2s;
  animation-delay: -0.2s;
}

.lds-facebook div:nth-child(2) {
  left: 90px;
  background: #774023;
  -webkit-animation: lds-facebook_2 1s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  animation: lds-facebook_2 1s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  -webkit-animation-delay: -0.1s;
  animation-delay: -0.1s;
}

.lds-facebook div:nth-child(3) {
  left: 140px;
  background: #d88c51;
  -webkit-animation: lds-facebook_3 1s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  animation: lds-facebook_3 1s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}

.lds-facebook {
  width: 90px !important;
  height: 90px !important;
  -webkit-transform: translate(-45px, -45px) scale(0.45) translate(45px, 45px);
  transform: translate(-45px, -45px) scale(0.45) translate(45px, 45px);
}

.iconfont {
  font-size: 15px;
  margin-right: 2px;
}

</style>