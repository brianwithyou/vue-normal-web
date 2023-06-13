<template>
  <div class="tuijian card-class" v-if="blogs.length > 0">
    <h2 class="hometitle">博客排行</h2>
    <ul class="tjpic" v-if="blogs[0]">
      <i><img style="cursor:pointer" v-if="blogs[0].cover" :src="blogs[0].cover" @click="goToInfo(blogs[0])"></i>
      <p><a href="javascript:void(0);" @click="goToInfo(blogs[0])">{{blogs[0].title}}</a></p>
    </ul>
    <ul class="sidenews">
      <li v-for="(item, index) in blogs" v-if="index !== 0" :key="item.id">
        <i><img style="cursor:pointer"  v-if="item.cover" :src="item.cover" @click="goToInfo(item)"></i>
        <p><a @click="goToInfo(item)">{{item.title}}</a></p>
        <span>{{item.createTime}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import {getHotBlogs} from '@/api/WebApi'

export default {
  name: "HotBlog",
  data() {
    return {
      blogs: [] //热门博客列表
    };
  },
  created() {
    getHotBlogs().then((res) => {
      let data = res.data
      if (data.code === 200) {
        this.blogs = data.data;
      }
    });
  },
  computed: {
    // 添加一个计算属性用于简单过滤掉数组中第一个数据
    sideNews() {
      return this.blogs.filter(blog =>
        this.blogs.indexOf(blog) !== 0
      )
    }
  },
  methods: {
    //跳转到文章详情【或推广链接】
    goToInfo(blog) {
      // if(blog.type === "0") {
        let routeData = this.$router.resolve({
          path: "/info",
          query: {id: blog.id}
        });
        window.open(routeData.href, '_blank');
      // } else if(blog.type === "1") {
      //   var params = new URLSearchParams();
      //   params.append("uid", blog.uid);
      //   getBlogByUid(params).then(response => {
      //     // 记录一下用户点击日志
      //   });
      //   window.open(blog.outsideLink, '_blank');
      // }
    },
  }
};
</script>

<style scoped>

</style>