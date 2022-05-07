<template>
  <div>
    <Header></Header>
    <!-- 路由组件出口 -->
    <router-view></router-view>
    <!-- 在Home，Search是显示的，在Login，Register是隐藏的 -->
    <Footer v-show="!isHidden"></Footer>
  </div>
</template>
<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  methods: {
    ...mapActions('home', ['getCategoryList'])
  },
  computed: {
    isHidden () {
      return this.$route.meta.hidden
    }
  },
  created () {
    // 组件实例创建完毕，可以向服务器发请求
    // 派发一个action，通知Vuex发请求，获取数据，存储在仓库当中
    this.getCategoryList()
  }
}
</script>
