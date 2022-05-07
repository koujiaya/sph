// 订单和交易模块的小仓库
import { reqGetAddressList, reqGetOrderInfo, reqSubmitOrder, reqGetPayInfo, reqGetPayStatus, reqGetOrderList } from '@/api'

const state = {
  addressList: [],
  orderInfo: {},
  orderId: '',
  payInfo: {},
  payStatus: '',
  orderList: []
}
const mutations = {
  changeAddressList (state, addressList) {
    addressList.forEach(item => {
      item.isChecked = item.isDefault
    })
    state.addressList = addressList
  },
  changeOrderInfo (state, orderInfo) {
    state.orderInfo = orderInfo
  },
  changeOrderId (state, orderId) {
    state.orderId = orderId
  },
  changePayInfo (state, payInfo) {
    state.payInfo = payInfo
  },
  changePayStatus (state, payStatus) {
    state.payStatus = payStatus
  },
  changeOrderList (state, orderList) {
    state.orderList = orderList
  }
}
const actions = {
  // 获取用户地址列表
  async getAddressList (store) {
    let res = await reqGetAddressList()
    if (res.code === 200) {
      store.commit('changeAddressList', res.data)
    }
  },
  // 获取订单信息
  async getOrderInfo (store) {
    let res = await reqGetOrderInfo()
    if (res.code === 200) {
      store.commit('changeOrderInfo', res.data)
    }
  },
  // 提交订单信息
  async submitOrder (store, { tradeNo, data }) {
    let res = await reqSubmitOrder(tradeNo, data)
    if (res.code === 200) {
    // 提交订单成功，存储订单号
      store.commit('changeOrderId', res.data)
      return 'ok'
    } else {
      return Promise.reject(new Error(res.code + ':' + res.message))
    }
  },
  // 获取订单支付信息
  async  getPayInfo (store, orderId) {
    let res = await reqGetPayInfo(orderId)
    if (res.code === 200) {
    // 提交订单成功，存储订单号
      store.commit('changePayInfo', res.data)
      return 'ok'
    } else {
      return Promise.reject(new Error(res.code + ':' + res.message))
    }
  },
  // 获取订单支付状态
  async  getPayStatus (store, orderId) {
    let res = await reqGetPayStatus(orderId)
    store.commit('changePayStatus', res.code)
    if (res.code === 200) {
      return res.code
    } else {
      return Promise.reject(new Error(res.code + ':' + res.message))
    }
  },
  // 获取个人订单列表
  async  getOrderList (store, { page, limit }) {
    let res = await reqGetOrderList(page, limit)
    if (res.code === 200) {
      store.commit('changeOrderList', res.data)
      return 'ok'
    } else {
      return Promise.reject(new Error(res.code + ':' + res.message))
    }
  }
}
const getters = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
