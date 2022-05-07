// shopcart模块的小仓库
import { reqGetCartList, reqDeleteCartById, reqUpdateCheckedById } from '@/api'

const state = {
  cartList: []
}
const mutations = {
  changeCartList (state, cartList) {
    state.cartList = cartList
  }
}
const actions = {
  // 获取购物车列表信息
  async getCartList (store) {
    let res = await reqGetCartList()
    if (res.code === 200) {
      store.commit('changeCartList', res.data)
    }
  },
  // 删除购物车某一个商品
  async deleteCartById (store, skuId) {
    let res = await reqDeleteCartById(skuId)
    if (res.code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error(res.code + ':' + res.message))
    }
  },
  // 修改购物车某一个商品的选中状态
  async updateCheckedById (store, { skuId, isChecked }) {
    let res = await reqUpdateCheckedById(skuId, isChecked)
    if (res.code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error(res.code + ':' + res.message))
    }
  },
  // 删除购物车选中的全部产品
  deleteAllCheckedCart (store) {
    // store:小仓库
    // commit：提交 mutations修改state
    // getters: 计算属性
    // dispatch：派发action
    // state: 当前仓库数据
    // 获取购物车中全部的产品，是一个数组
    let promiseAll = []
    store.getters.cartList.cartInfoList.forEach(item => {
      if (item.isChecked === 1) {
        let promise = store.dispatch('deleteCartById', item.skuId)
        // 将每一次返回的promise添加到数组中
        promiseAll.push(promise)
      }
    })
    // 只要全部的promise都成功，返回的就是成功，
    // 如果有一个失败，返回的就是失败
    return Promise.all(promiseAll)
  },
  // 修改所有商品的选中状态
  updateAllCheckedCart (store, isChecked) {
    let promiseAll = []
    store.getters.cartList.cartInfoList.forEach(item => {
      console.log(item.isChecked !== isChecked)
      if (item.isChecked !== isChecked) {
        let promise = store.dispatch('updateCheckedById', {
          skuId: item.skuId,
          isChecked
        })

        // 将每一次返回的promise添加到数组中
        promiseAll.push(promise)
      }
    })
    // 只要全部的promise都成功，返回的就是成功，
    // 如果有一个失败，返回的就是失败
    return Promise.all(promiseAll)
  }
}
const getters = {
  cartList (state) {
    return state.cartList[0] || {}
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
