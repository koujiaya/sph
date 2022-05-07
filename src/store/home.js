// home模块的小仓库

// 引入 接口函数
import { reqGetCategoryList, reqGetBannerList, reqGetFloorList } from '@/api'

const state = {
  // state 仓库初始状态
  // state中数据默认初始值别瞎写
  // 服务器返回数组，初始值为空数组，返回对象，初始值为空对象
  categoryList: [],
  bannerList: [],
  floorList: []
}

const mutations = {
  changeCategoryList (state, categoryList) {
    state.categoryList = categoryList.splice(0, categoryList.length - 1)
  },
  changeBannerList (state, bannerList) {
    state.bannerList = bannerList
  },
  changeFloorList (state, floorList) {
    state.floorList = floorList
  }
}

const actions = {
  // 通过API里面的接口函数调用，向服务器发请求，获取服务器的数据
  async getCategoryList (store) {
    let res = await reqGetCategoryList()
    if (res.code === 200) {
      store.commit('changeCategoryList', res.data)
    }
  },
  async getBannerList (store) {
    let res = await reqGetBannerList()
    if (res.code === 200) {
      store.commit('changeBannerList', res.data)
    }
  },
  async getFloorList (store) {
    let res = await reqGetFloorList()
    if (res.code === 200) {
      store.commit('changeFloorList', res.data)
    }
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
