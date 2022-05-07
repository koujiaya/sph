// search模块的小仓库

import { reqGetSearchInfo } from '@/api'

const state = {
  searchInfo: {}
}

const mutations = {
  changeSearchInfo (state, searchInfo) {
    state.searchInfo = searchInfo
  }
}

const actions = {
  async getSearchInfo (store, params = {}) {
    // 当前这个函数，需要给服务器传递一个参数[至少是一个空对象]，
    // param参数：用户派发action的时候，传递过来，至少是一个空对象
    let res = await reqGetSearchInfo(params)
    if (res.code === 200) {
      store.commit('changeSearchInfo', res.data)
    }
  }
}
// 计算属性，
// 在项目中，getter主要作用是：简化仓库中的数据
// 可以组件中需要用的数组简化一下，[将来组件获取数据的时候就方便了]
const getters = {
  // 当前形参state，当前仓库中的state，并非大仓库中的state
  goodsList (state) {
    // state.searchInfo.goodsList 如果服务器数据传回来了，没问题，是一个数组
    // 假如网速慢，state.searchInfo返回的是undefined，state.searchInfo.goodsList就会报错
    // 计算新的属性的属性值至少返回一个空数组
    return state.searchInfo.goodsList || []
  },
  attrsList (state) {
    return state.searchInfo.attrsList || []
  },
  trademarkList (state) {
    return state.searchInfo.trademarkList || []
  },
  total (state) {
    return state.searchInfo.total || 0
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
