<template>
  <div>
    <div class="flex flex-col">
<!--      <div class="post-header">-->
<!--        <h1 v-if="about" class="post-title text-black uppercase">-->
<!--          关于我-->
<!--        </h1>-->
<!--        <ob-skeleton-->
<!--            v-else-->
<!--            class="post-title text-white uppercase"-->
<!--            width="100%"-->
<!--            height="clamp(1.2rem, calc(1rem + 3.5vw), 4rem)" />-->
<!--      </div>-->
      <div class="main-grid">
        <div class="relative">
          <div v-if="about" class="post-html" ref="postRef" v-html="about" />
          <div v-else class="bg-ob-deep-800 px-14 py-16 rounded-2xl shadow-xl block min-h-screen">
<!--            <ob-skeleton tag="div" :count="1" height="36px" width="150px" class="mb-6" />-->
            <br />
<!--            <ob-skeleton tag="div" :count="35" height="16px" width="100px" class="mr-2" />-->
            <br />
            <br />
<!--            <ob-skeleton tag="div" :count="25" height="16px" width="100px" class="mr-2" />-->
          </div>
<!--          <Comment />-->
        </div>
        <div class="col-span-1">
          <Sidebar>
            <Profile author="blog-author" />
<!--            <Sticky :stickyTop="32" endingElId="footer" dynamicElClass="#sticky-sidebar">-->
              <div id="sticky-sidebar">
                <transition name="fade-slide-y" mode="out-in">
                  <div class="sidebar-box mb-4">
<!--                    <SubTitle :title="'titles.toc'" icon="toc" />-->
<!--                    <div id="toc2"></div>-->
                  </div>
                </transition>
                <!--              <Navigator />-->
              </div>
<!--            </Sticky>-->
          </Sidebar>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import MarkdownIt from "markdown-it";
import 'github-markdown-css'
import tocbot from "tocbot";
import Profile from "@/views/Profile";
import Sidebar from "@/components/Sidebar/index";

export default {
  name: "AboutMe",
  components: {Sidebar, Profile},
  data() {
    return {
      about: ''
    }
  },
  created() {
    let MarkdownIt = require('markdown-it')
    let md = new MarkdownIt()
    this.about = md.render("## Time and tide wait for no man.")
  }
}
</script>

<style scoped>

</style>