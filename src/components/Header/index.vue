<template>
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <!-- 未登录 -->
          <p v-if="!userName">
            <span>请</span>
            <!-- 声明式导航，务必要有to属性 -->
            <router-link to="/login">登录</router-link>
            <router-link class="register" to="/register">免费注册</router-link>
          </p>
          <!-- 登录了 -->
          <p v-else>
            <a> {{ userName }}</a>
            <a class="logout" @click="logout">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          <a href="###" v-upper='"我的"'>sph</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" to="/home">
          <img src="./images/logo.png" alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form  class="searchForm" @submit.prevent>
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="keyword"
            @keyup.enter="handleSearch()"
          />
          <button
            class="sui-btn btn-xlarge btn-danger"
            type="button"
            @click="handleSearch()"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      keyword: ''
    }
  },
  methods: {
    ...mapActions('user', ['userLogout']),
    // 搜索按钮的回调函数：需要向Search路由进行跳转
    handleSearch () {
      let location = {
        name: 'search',
        params: { keyword: this.keyword || undefined }
      }

      if (Object.keys(this.$route.params).query !== 0) {
        location.query = this.$route.query
      }
      this.$router.push(location)
    },
    // 退出登录
    async logout () {
      // 退出登录需要做的事情
      // 1：需要发请求，通知服务器退出登录，[清除一些数据，token]
      // 2.清除项目当中的数据[userinfo,token]
      try {
        // 如果退出登录成功
        await this.userLogout()
        // 回到home首页
        this.$router.replace('/home')
      } catch (error) {
        alert(error.message)
      }
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    // 用户名
    userName () {
      return this.userInfo.name
    }
  },
  watch: {
    // 通过监听路由参数清除关键字
    // $route (newValue, oldValue) {
    //   if (!this.$route.params.keyword) {
    //     this.keyword = ''
    //   }
    // }
  },

  mounted () {
    // 通过全局事件总线清除关键字
    this.$bus.$on('clear', () => {
      this.keyword = ''
    })
  }
}
</script>
<style lang='less' scoped>
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register,.logout {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>
