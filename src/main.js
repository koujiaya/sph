import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from './router'
// 引入仓库
import store from './store'
// 引入 Swiper 样式
import 'swiper/swiper-bundle.css'
// 引入mockServer.js ---mock数据
import '@/mock/mockServer'
// 统一引入 统一接口api文件夹里面的全部函数
import * as API from '@/api'

// 引入组件，三级分类，轮播图，分页器组件
import TypeNav from '@/components/TypeNav'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'
import { Button, MessageBox } from 'element-ui'
// 引入过滤器，金额格式
import { currency } from '@/utils/currency'
// 引入图片懒加载插件
import VueLazyload from 'vue-lazyload'
// 引入加载图片
import loadingGif from '@/assets/loading.gif'
// 引入自定义插件
import myPlugins from '@/plugins/myPlugins'
// 引入表单校验插件
import '@/plugins/validate'
// 注册自定义插件
Vue.use(myPlugins, {
  name: 'upper'
})
// 注册图片懒加载插件
Vue.use(VueLazyload, {
  // 懒加载默认图片
  loading: loadingGif
})
// 注册全局组件，参数：组件的名字，哪一个组件
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagination.name, Pagination)
// 第一种写法
Vue.component(Button.name, Button)
// 第二种写法，挂载在原型上
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert

// 注册为全局过滤器
Vue.filter('currency', currency)

Vue.config.productionTip = false

new Vue({
  beforeCreate () {
    Vue.prototype.$bus = this
    Vue.prototype.$API = API
  },
  // KV一致省略V
  // 注册路由，当这里书写router的时候，组件身上都拥有$router和$route属性
  router,
  // 注册仓库：这里书写store的时候，组件实例身上添加了$store属性
  store,
  render: h => h(App)
}).$mount('#app')
