import Vue from 'vue'
import Vuex from 'vuex'

// 引入小仓库
import home from './home'
import search from './search'
import detail from './detail'
import shopcart from './shopcart'
import user from './user'
import trade from './trade'

// 需要使用插件一次
Vue.use(Vuex)

// 创建store实例
const store = new Vuex.Store({
  // 实现 vuex仓库模块式开发存储数据
  modules: {
    home,
    search,
    detail,
    shopcart,
    user,
    trade
  }
})
export default store
