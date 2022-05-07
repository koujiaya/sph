// 配置路由的地方
import Vue from 'vue'
// 引入vue-router插件
import VueRouter from 'vue-router'
// 引入路由配置
import routes from './routes'
// 引入store
import store from '@/store'

// 先把VueRouter原型对象的push方法，先保存一份
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace

// 重写push|replace
// 第一个参数：告诉原来的push方法，你往哪里跳，传递哪些参数
// 第二个参数：成功回调
// 第三个参数：失败回调
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    // call||apply区别:
    // 相同点，都可以调用函数一次，都可以篡改函数上下文
    // 不同点：传递参数时，call用逗号隔开，apply传递数组
    originPush.call(this, location, resolve, reject)
  } else {
    originPush.call(this, location, () => {}, () => {})
  }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject)
  } else {
    originReplace.call(this, location, () => {}, () => {})
  }
}

// 使用vue-router插件
Vue.use(VueRouter)

// 创建 router实例
const router = new VueRouter({
  routes,
  // 滚动行为
  scrollBehavior (to, from, savedPosition) {
    // 返回的y=0，代表滚动条在最上方
    return {
      y: 0
    }
  }
})

// 全局守卫：前置守卫（在路由跳转之前进行判断）
router.beforeEach(async (to, from, next) => {
  // to:你要跳转到哪个路由
  // from:你从哪个路由来
  // next：放行函数  1.next() 放行  2.next(path) 放行到指定路由 3.next(false)

  // 获取仓库中的token，确定用户是否登录
  let token = store.state.user.token
  let userName = store.state.user.userInfo.name
  if (token) {
    // 登录了
    if (to.path === '/login') {
      // 已经登录了，还想去login ，不允许，跳转到home主页
      next('/home')
    } else {
      // 已经登录了，去的不是login
      if (userName) {
        // 如果有用户信息，直接放行
        next()
      } else {
        // 登录了，但没有用户信息， 在路由跳转之前获取用户信息
        try {
          // 获取用户信息成功后再放行
          await store.dispatch('user/getUserInfo')
          next()
        } catch (error) {
          // token过期了 退出登录后 重新登录
          await store.dispatch('user/userLogout')
          next('/login')
        }
      }
    }
  } else {
    // 未登录，不能去交易，支付，个人中心页面
    if (to.meta.requiresAuth === true) {
      // 去的路由的meta 需要登录，跳转到登录页面
      next({
        // 去登录页面，带上本来要去页面的重定向query参数
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      // 去的不是需要登录页面，就放行
      next()
    }
  }
})

// 对外暴露
export default router
