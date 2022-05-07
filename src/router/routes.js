// 引入一级路由组件
// import Home from '@/views/Home'
// import Login from '@/views/Login'
// import Register from '@/views/Register'
// import Search from '@/views/Search'
// import Detail from '@/views/Detail'
// import AddCartSuccess from '@/views/AddCartSuccess'
// import ShopCart from '@/views/ShopCart'
// import Trade from '@/views/Trade'
// import Pay from '@/views/Pay'
// import PaySuccess from '@/views/PaySuccess'
// import Center from '@/views/Center'

// 引入二级路由组件
// import MyOrder from '@/views/Center/myOrder'
// import GroupOrder from '@/views/Center/groupOrder'

/*
路由懒加载：
当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。
如果我们能把不同路由对应的组件分割成不同的代码块，
然后当路由被访问的时候才加载对应组件，这样就会更加高效。
 */

/* 路由组件能不能传递props数据？
   1.布尔值写法:params
     props: true
   2.对象写法:额外的给路由组件传递一些props
     props: {a: 1,b: 2}
   3.函数写法:可以parms参数，query参数，通过props传递给路由组件
    props: $route => ({ keyword: $route.params.keyword, k: $route.query.k })
  */

/* 配置路由信息
 1.路径的前面需要有/
 2.路径中的单词都是小写的
 3.组件不要加引号 [组件是对象VueComponent类的实例]
 */

const routes = [
  {
    name: 'home',
    path: '/home',
    component: () => import('@/views/Home')

  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/Login'),
    // meta 路由元信息
    meta: {
      hidden: true
    }
  },
  {
    name: 'register',
    path: '/register',
    component: () => import('@/views/Register'),
    meta: {
      hidden: true
    }
  },
  {
    name: 'search',
    // ？代表 param参数可传递也可以不传递
    path: '/search/:keyword?',
    component: () => import('@/views/Search')
  },
  {
    name: 'detail',
    path: '/detail/:skuid?',
    component: () => import('@/views/Detail')
  },
  {
    name: 'addcartsuccess',
    path: '/addcartsuccess',
    component: () => import('@/views/AddCartSuccess')
  },
  {
    name: 'shopcart',
    path: '/shopcart',
    component: () => import('@/views/ShopCart')
  },
  {
    name: 'trade',
    path: '/trade',
    component: () => import('@/views/Trade'),
    meta: {
      requiresAuth: true
    },
    // 路由独享守卫
    beforeEnter: (to, from, next) => {
    // 去交易页面，必须从购物车页面来
      if (from.path === '/shopcart') {
      // 从购物车来，放行
        next()
      } else {
      // 从其他路由组件来的,停留在当前页
        next(false)
      }
    }
  },
  {
    name: 'pay',
    path: '/pay',
    component: () => import('@/views/Pay'),
    meta: {
      requiresAuth: true
    },
    beforeEnter: (to, from, next) => {
      if (from.path === '/trade') {
        next()
      } else {
        next(false)
      }
    }
  },
  {
    name: 'paysuccess',
    path: '/paysuccess',
    component: () => import('@/views/PaySuccess'),
    meta: {
      requiresAuth: true
    },
    beforeEnter: (to, from, next) => {
      if (from.path === '/pay') {
        next()
      } else {
        next(false)
      }
    }
  },
  {
    name: 'center',
    path: '/center',
    component: () => import('@/views/Center'),
    // 二级路由组件
    children: [{
      name: 'myorder',
      path: 'myorder',
      component: () => import('@/views/Center/myOrder'),
      meta: {
        requiresAuth: true
      }
    }, {
      name: 'grouporder',
      path: 'grouporder',
      component: () => import('@/views/Center/groupOrder'),
      meta: {
        requiresAuth: true
      }
    }, {
    // 二级路由重定向
      path: '/center',
      redirect: '/center/myorder'
    }]
  },
  {
    // 重定向，在项目跑起来的时候，访问/，立马让他定向到首页
    path: '*',
    redirect: '/home'
  }
]

// 对外暴露
export default routes
