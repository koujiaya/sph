// detail模块的小仓库

import { reqGetDetailInfo, reqAddOrUpdateShopCart } from '@/api'

// 引入 游客身份模块 nanoid --> 生成一个随机字符串，不能变
import { getNanoid } from '@/utils/nanoid_token.js'

const state = {
  detailInfo: {},
  // 游客临时身份
  nanoid_token: getNanoid()

}

const mutations = {
  changeDetailInfo (state, detailInfo) {
    state.detailInfo = detailInfo
  }

}

const actions = {
  // 获取产品信息
  async getDetailInfo (store, skuId) {
    let res = await reqGetDetailInfo(skuId)
    if (res.code === 200) {
      store.commit('changeDetailInfo', res.data)
    }
  },
  // 讲产品添加到购物车中
  async addOrUpdateShopCart (store, { skuId, skuNum }) {
    // 发请求，前台讲参数带给服务器
    // 服务器写入数据成功，并没有返回其他的数据，只是一个返回code=200，代表这次操作成功
    // 因此，并不需要将数据存到vuex仓库中
    let res = await reqAddOrUpdateShopCart(skuId, skuNum)

    if (res.code === 200) {
      // 代表服务器加入购物车成功，
      return 'ok'
    } else {
      // 代表服务器加入购物车失败，
      return Promise.reject(new Error(res.code + ':' + res.message))
    }
  }

}

const getters = {
  categoryView (state) {
    return state.detailInfo.categoryView || {}
  },
  skuInfo (state) {
    return state.detailInfo.skuInfo || {}
  },
  spuSaleAttrList (state) {
    return state.detailInfo.spuSaleAttrList || []
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
