// 统一管理项目的 API接口
// 引入二次封装的axios(带有请求，响应拦截器)
import request from './request'
import mockRequest from './mockRequest'

// 对外暴露一个函数，只要外部调用这个函数，就像服务器发ajax请求

// 获取三级列表菜单数据，地址：/api/product/getBaseCategoryList，请求方式：get
// 参数：不需要带参数，只需要把服务器返回的结果返回即可
export const reqGetCategoryList = () => request({
  url: '/product/getBaseCategoryList',
  method: 'get'
})

// 获取Banner列表数据(Home首页轮播图接口)
export const reqGetBannerList = () => mockRequest({
  url: '/banner',
  method: 'get'
})

// 获取Floor列表数据
export const reqGetFloorList = () => mockRequest({
  url: '/floor',
  method: 'get'
})

// 获取搜索模块数据
// 当前这个接口，需要给服务器传递一个参数[至少是一个空对象]，
export const reqGetSearchInfo = (params) => request({
  url: '/list',
  method: 'post',
  data: params
})

// 获取商品详情信息数据
export const reqGetDetailInfo = (skuId) => request({
  url: `/item/${skuId}`,
  method: 'get'
})

// 讲商品添加到购物车(或更新某一个产品的个数)
export const reqAddOrUpdateShopCart = (skuId, skuNum) => request({
  url: `/cart/addToCart/${skuId}/${skuNum}`,
  method: 'post'
})

// 获取购物车列表数据
export const reqGetCartList = () => request({
  url: '/cart/cartList',
  method: 'get'
})

// 删除购物车商品
export const reqDeleteCartById = (skuId) => request({
  url: `/cart/deleteCart/${skuId}`,
  method: 'delete'
})

// 修改商品选中状态
export const reqUpdateCheckedById = (skuId, isChecked) => request({
  url: `/cart/checkCart/${skuId}/${isChecked}`,
  method: 'get'
})

// 获取验证码
export const reqGetCode = (phone) => request({
  url: `/user/passport/sendCode/${phone}`,
  method: 'get'
})

// 用户注册
export const reqUserRegister = (data) => request({
  url: '/user/passport/register',
  method: 'post',
  data
})

// 用户登录
export const reqUserLogin = (data) => request({
  url: '/user/passport/login',
  method: 'post',
  data
})

// 获取用户信息 [需要带着用户的token向服务器要用户信息]
export const reqGetUserInfo = () => request({
  url: '/user/passport/auth/getUserInfo',
  method: 'get'
})

// 退出登录
export const reqUserLogout = () => request({
  url: '/user/passport/logout',
  method: 'get'
})

// 获取用户地址列表
export const reqGetAddressList = () => request({
  url: '/user/userAddress/auth/findUserAddressList',
  method: 'get'
})

// 获取订单清单
export const reqGetOrderInfo = () => request({
  url: '/order/auth/trade',
  method: 'get'
})

// 提交订单
export const reqSubmitOrder = (tradeNo, data) => request({
  url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
  method: 'post',
  data
})

// 获取订单支付信息
export const reqGetPayInfo = (orderId) => request({
  url: `/payment/weixin/createNative/${orderId}`,
  method: 'get'
})

// 获取支付订单状态
export const reqGetPayStatus = (orderId) => request({
  url: `/payment/weixin/queryPayStatus/${orderId}`,
  method: 'get'
})

// 获取订单列表
export const reqGetOrderList = (page, limit) => request({
  url: `/order/auth/${page}/${limit}`,
  method: 'get'
})
