// 登录和注册模块的小仓库
import { reqGetCode, reqUserRegister, reqUserLogin, reqGetUserInfo, reqUserLogout } from '@/api'

import { setToken, getToken, removeToken, setTempToken, getTempToken, removeTempToken } from '@/utils/token'

const state = {
  token: getTempToken() || getToken(),
  userInfo: {}
}

const mutations = {
  changeUserToken (state, token) {
    state.token = token || ''
  },
  changeUserInfo (state, userInfo) {
    state.userInfo = userInfo || {}
  }
}

const actions = {
  // 获取验证码
  async getCode (store, phone) {
    // 获取验证码这个接口，把验证码返回，
    // 正常情况下，后台把验证码发送到用户手机上[省钱]
    let res = await reqGetCode(phone)
    if (res.code === 200) {
      return res.data
    } else {
      return Promise.reject(new Error(res.code + ':' + res.message))
    }
  },
  // 用户注册
  async userRegister (store, data) {
    let res = await reqUserRegister(data)
    if (res.code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error(res.code + ':' + res.message))
    }
  },

  // 用户登录 [token]
  async userLogin (store, { phone, password, auto }) {
    let res = await reqUserLogin({ phone, password })
    // 服务器下发的token，用户唯一标识符
    // 经常通过带token找服务器要用户信息进行展示
    if (res.code === 200) {
      // 用户登录成功切获取到token
      store.commit('changeUserToken', res.data.token)
      if (auto) {
        // 本地持久化存储token
        setToken(res.data.token)
      } else {
        // 临时存储token
        setTempToken(res.data.token)
      }
      return 'ok'
    } else {
      return Promise.reject(new Error(res.code + ':' + res.message))
    }
  },
  // 获取用户信息
  async getUserInfo (store) {
    let res = await reqGetUserInfo()
    if (res.code === 200) {
      store.commit('changeUserInfo', res.data)
      return 'ok'
    } else {
      return Promise.reject(new Error(res.code + ':' + res.message))
    }
  },
  // 退出登录
  async userLogout (store) {
    // 只是向服务器发起请求，通知服务器清除token
    let res = await reqUserLogout()
    if (res.code === 200) {
      // 清除本地数据
      store.commit('changeUserToken')
      store.commit('changeUserInfo')
      removeToken()
      removeTempToken()

      return 'ok'
    } else {
      return Promise.reject(new Error(res.code + ':' + res.message))
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
