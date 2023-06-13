<template>
  <div class="container">
    <div style="display: flex;width: 60px;height:500px;position: fixed;
    align-items: center;justify-content: center">
      <el-button v-if="isCollector" circle icon="el-icon-star-on" plain class="btn"
                 style="color: #e8a112;font-size: 30px;
                 background-color:transparent;border: none"
                 @click="collectBlog($event)">
      </el-button>
      <el-button v-else circle icon="el-icon-star-on" plain  class="btn"
                 style="font-size: 30px;
                 background-color:transparent;border: none;color:gray"
                 @click="collectBlog($event)">
      </el-button>
    </div>
<!--    <el-button round  style="color:#d68b2a;background-color:transparent;margin-top: 3px;font-size: 30px" icon="el-icon-star-on">-->
<!--      </el-button>-->

<!--    <div style="display: flex;width: 60px;margin-right: 20px;align-items: center;justify-content: center"></div>-->
    <div style="display: flex;margin-left: 60px;">
      <div class="mblog">
        <h2> {{ blog.title }}</h2>
        <div v-if="blog.uid" class="bloginfo">
          <ul>
            <li class="author">
              <a href="javascript:void(0);" @click="goToAuthor(blog.author)">
                <span class="iconfont">&#xe60f;</span>
                {{ blog.author }}
              </a>
            </li>
            <li class="lmname">
              <span class="iconfont">&#xe603;</span>
              <a href="javascript:void(0);" @click="goToSortList(blog.blogSort.uid)">
                {{ blog.blogSort ? blog.blogSort.sortName : '' }}</a>
            </li>
            <li class="createTime">
              <span class="iconfont">&#xe606;</span>
              {{ blog.createTime }}
            </li>
            <li class="view">
              <span class="iconfont">&#xe8c7;</span>
              {{ blog.readCount }}
            </li>
            <li class="like">
              <span class="iconfont">&#xe663;</span>
              {{ blog.collectCount }}
            </li>
            <el-link v-if="ownBlog" icon="el-icon-edit" style="float: right">
              <router-link :to="{name: 'BlogEdit', params: {blogId: blog.id}}">编辑</router-link>
            </el-link>
          </ul>
        </div>
        <div v-if="blog.tagList" class="tags">
          <a v-for="item in blog.tagList" v-if="blog.tagList"
             :key="item.uid"
             href="javascript:void(0);"
             target="_blank"
             @click="goToList(item.uid)"
          >{{ item.content }}</a>
        </div>
        <div class="news_about" style="display: flex;margin: 10px 0 0 0;">
          <div style="">
            <strong>版权</strong>
            <span v-html="blog.copyright">
            {{ blog.copyright }}
          </span>
          </div>
        </div>
        <el-divider></el-divider>
<!--        <div>-->
<!--          <div class="post-html" ref="articleRef" v-html="blog.content"></div>-->
<!--        </div>-->
        <template v-if="blog.content">
          <div class="post-html" ref="articleRef" v-html="blog.content" />
        </template>
      </div>

<!--        <Sidebar>-->
<!--          <Sticky :stickyTop="32" endingElId="footer" dynamicElClass="#sticky-sidebar">-->
<!--            <div id="sticky-sidebar">-->
<!--              <transition name="fade-slide-y" mode="out-in">-->
<!--                <div class="sidebar-box mb-4">-->
<!--                  <h2 class="hometitle">文章目录</h2>-->
<!--                  <div id="toc1"/>-->
<!--                </div>-->
<!--              </transition>-->
<!--            </div>-->
<!--          </Sticky>-->
<!--        </Sidebar>-->
      <Sticky :stickyTop="32" endingElId="footer" dynamicElClass="#sticky-sidebar">
        <div id="sticky-sidebar">
          <transition name="fade-slide-y" mode="out-in">
            <div class="sidebar-box mb-4">
              <h2 class="hometitle">文章目录</h2>
              <div id="toc1"></div>
            </div>
          </transition>
        </div>
      </Sticky>
    </div>
<!--    <div class="sidebar" style="margin: 0 10px;flex-grow: 1">-->
<!--    </div>-->
  </div>
</template>

<script>
import 'github-markdown-css'
import tocbot from "tocbot";
import Sticky from "@/components/Sticky";
import {collectBlogApi, getBlogDetail, isCollectedApi} from '@/api/WebApi'
import Sidebar from "@/components/Sidebar";

export default {
  name: 'BlogDetail',
  components: {
    Sidebar,
    Sticky,
  },
  data() {
    return {
      blog: {
        id: '',
        title: '',
        content: '',
        author: '',
      },
      isCollector: false,
      ownBlog: true
    }
  },
  methods: {
    initTocbot() {
      let nodes = this.$refs.articleRef.children
      if (nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i]
          let reg = /^H[1-4]{1}$/
          if (reg.exec(node.tagName)) {
            node.id = i
          }
        }
      }
      tocbot.init({
        tocSelector: '#toc1',
        contentSelector: '.post-html',
        headingSelector: 'h1, h2, h3',
        onClick: function (e) {
          e.preventDefault()
        }
      })
      const imgs = this.$refs.articleRef.getElementsByTagName('img')
      // for (var i = 0; i < imgs.length; i++) {
      //   reactiveData.images.push(imgs[i].src)
      //   imgs[i].addEventListener('click', function (e) {
      //     handlePreview(e.target.currentSrc)
      //   })
      // }
    },
    collectBlog(e) {
      let curUser = this.$store.getters.getUser
      if (!curUser || curUser.username == null) {
        this.$message.warning("请先登录")
        return
      }
      let param = {
        id: this.blog.id,
        flag: this.isCollector === true ? 0 : 1
      }
      collectBlogApi(param).then(res => {
        if (res.data.code === 200) {
          this.isCollector = !this.isCollector
          this.$message.success('操作成功')
        }
      })

      let target = e.target
      if (target.nodeName === 'SPAN') {
        target = e.target.parentNode
      }
      target.blur()
    },
  },
  beforeDestroy() {
    tocbot.destroy()
  },
  created() {
    let curUser = this.$store.getters.getUser;
    const blogId = this.$route.query.id
    const _this = this
    getBlogDetail(blogId).then(res => {
      const blog = res.data.data
      _this.blog = res.data.data
      let MarkdownIt = require('markdown-it')
      let md = new MarkdownIt()
      _this.blog.content = md.render(blog.content)
      _this.ownBlog = (blog.uid === curUser.id)

      this.$nextTick(() => {
        // Prism.highlightAll()
        this.initTocbot()
      })

      if (curUser && curUser.username) {
        isCollectedApi({id: blogId}).then(res => {
          if (res.data.code === 200) {
            this.isCollector = res.data.data;
          }
        })
      }
    })
  },
  destroyed() {
    tocbot.destroy()
  },
}
</script>

<style scoped lang="scss">
.btn .btn:focus {
  border: none;
  color: #ff9b26;
  background-color: #fff0df;
}
.container {
  display: flex;
}

.el-divider--horizontal {
  margin: 10px;
}

.mblog {
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-height: 800px;
  width: 800px;
  max-width: 960px;
  padding: 3.5rem;
}
.sidebar-box {
  min-width: 320px;
  margin-left: 20px;
  background-color: var(--background-secondary);
  border-radius: 1rem;
  margin-bottom: 2rem;
  padding: 2rem;
  position: relative;
  --tw-shadow: 0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04);
  box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);
  width: 100%;
}
.markdown-body {
  background-color: white;
}
#toc1 > ol {
  list-style: none;
  counter-reset: li;
  padding-left: 1.5rem;
  > li {
    @apply font-medium pb-1;
    &.is-active-li > .node-name--H1 {
      @apply text-ob;
    }
    &.is-active-li > .node-name--H2 {
      @apply text-ob;
    }
    &.is-active-li > .node-name--H3 {
      @apply text-ob;
    }
  }

  ol li {
    @apply font-medium mt-1.5 mb-1.5;
    padding-left: 1.5rem;
    &.is-active-li > .node-name--H2 {
      @apply text-ob;
    }
    &.is-active-li > .node-name--H3 {
      @apply text-ob;
    }
    ol li {
      @apply font-medium mt-1.5 mb-1.5;
      padding-left: 1.5rem;
      &.is-active-li .node-name--H3 {
        @apply text-ob;
      }
    }
  }

  ol,
  ol ol {
    position: relative;
  }

  > li::before,
  ol > li::before,
  ol ol > li::before,
  ol ol ol > li::before,
  ol ol ol ol > li::before {
    content: '•';
    color: var(--text-accent);
    display: inline-block;
    width: 1em;
    margin-left: -1.15em;
    padding: 0;
    font-weight: normal;
    text-shadow: 0 0 0.5em var(--accent-2);
  }

  > li::before {
    @apply text-xl;
  }

  > li > ol::before,
  > li > ol > li > ol::before {
    content: '';
    border-left: 1px solid var(--text-accent);
    position: absolute;
    opacity: 0.35;
    left: -1em;
    top: 0;
    bottom: 0;
  }

  > li > ol::before {
    left: -1.25em;
    border-left: 2px solid var(--text-accent);
  }
}
//.post-html {
//  word-wrap: break-word;
//  word-break: break-all;
//}
</style>