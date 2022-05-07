<template>
  <!-- 注册组件 -->
  <div class="register-container">
    <!-- 注册内容 -->
    <div class="register">
      <h3>
        注册新用户
        <span class="go">
          我有账号，去
          <!-- 跳转登录页 -->
          <router-link to="/login">登陆</router-link>
        </span>
      </h3>
      <div class="content">
        <label>手机号:</label>
        <input
          type="text"
          name="phone"
          placeholder="请输入你的手机号"
          v-model="phone"
          v-validate="{ required: true, regex: /^1\d{10}$/ }"
          :class="{ invalid: errors.has('phone') }"
        />
        <span class="error-msg">{{ errors.first("phone") }}</span>
      </div>

      <div class="content">
        <label>登录密码:</label>
        <input
          type="password"
          name="password"
          placeholder="请输入你的登录密码"
          v-model="password"
          v-validate="{ required: true, regex: /^\w{6,20}$/ }"
          :class="{ invalid: errors.has('password') }"
        />
        <span class="error-msg">{{ errors.first("password") }}</span>
      </div>
      <div class="content">
        <label>确认密码:</label>
        <input
          type="password"
          name="rpassword"
          placeholder="请输入确认密码"
          v-model="rpassword"
          v-validate="{ required: true, is: password }"
          :class="{ invalid: errors.has('rpassword') }"
        />
        <span class="error-msg">{{ errors.first("rpassword") }}</span>
      </div>
      <div class="content">
        <label>验证码:</label>
        <input
          type="text"
          name="code"
          placeholder="请输入验证码"
          v-model="code"
          v-validate="{ required: true, regex: /^\d{6}$/ }"
          :class="{ invalid: errors.has('code') }"
        />
        <button class="code" ref="code" :disabled="!flag" @click="getPhoneCode">
          获取验证码
        </button>
        <span class="error-msg">{{ errors.first("code") }}</span>
      </div>
      <div class="controls">
        <input
          type="checkbox"
          name="agree"
          v-model="agree"
          v-validate="{ required: true,agree:true }"
          :class="{ invalid: errors.has('agree') }"
        />
        <span>同意协议并注册《尚品汇用户协议》</span>
        <span class="error-msg">{{ errors.first("agree") }}</span>
      </div>
      <div class="btn">
        <button @click="register">完成注册</button>
      </div>
    </div>

    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机尚品汇</li>
        <li>销售联盟</li>
        <li>尚品汇社区</li>
      </ul>
      <div class="address">地址：北京市昌平区宏福科技园综合楼6层</div>
      <div class="beian">京ICP备19006430号</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Register',
  data () {
    return {
      // 收集表单数据
      // 手机号, 验证码，密码，重复密码，是否同意
      phone: '',
      code: '',
      password: '',
      rpassword: '',
      agree: true,
      flag: true,
      time: 60,
      timer: null
    }
  },
  methods: {
    ...mapActions('user', ['getCode', 'userRegister']),
    // 获取手机验证码
    async getPhoneCode () {
      // 获取发送验证码按钮
      let code = this.$refs.code
      try {
        // 简单判断一下，至少要有手机号
        const { phone } = this
        if (phone) {
          if (this.time === 60) {
            code.innerHTML = '请稍后'
            // 启动定时器
            this.timer = setInterval(this.showTime, 1000)
            // 按钮设置为不可用
            this.flag = false
          }
          let res = await this.getCode(phone)
          // 如果成功，页面弹出验证码，代替手机验证码
          alert(res)
        } else {
          alert('请输入手机号')
        }
      } catch (error) {
        alert(error.message)
      }
    },
    // 定时器函数
    showTime () {
      let code = this.$refs.code
      if (this.time > 0) {
        code.innerHTML = `已发送${this.time}s`
        this.time--
      } else {
        code.innerHTML = '发送验证码'
        // 按钮设置为可用
        this.flag = true
        // 时间重新设置为60s
        this.time = 60
        // 清除定时器
        clearInterval(this.timer)
        this.timer = null
      }
    },
    // 用户注册
    async register () {
      const success = await this.$validator.validateAll()
      // 如果全部表单验证成功，就发送请求
      // 只要有一个表单验证失败，就不会发送请求
      if (success) {
        try {
        // 如果成功---路由跳转
          const { phone, code, password } = this
          await this.userRegister({ phone, code, password })
          this.$router.push('/login')
        } catch (error) {
          alert(error.message)
        }
      }
    }
  },

  beforeDestroy () {
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>

<style lang="less" scoped>
.register-container {
  .register {
    width: 1200px;
    height: 445px;
    border: 1px solid rgb(223, 223, 223);
    margin: 0 auto;

    h3 {
      background: #ececec;
      margin: 0;
      padding: 6px 15px;
      color: #333;
      border-bottom: 1px solid #dfdfdf;
      font-size: 20.04px;
      line-height: 30.06px;

      span {
        font-size: 14px;
        float: right;

        a {
          color: #e1251b;
        }
      }
    }

    div:nth-of-type(1) {
      margin-top: 40px;
    }

    .content {
      padding-left: 390px;
      margin-bottom: 18px;
      position: relative;

      label {
        font-size: 14px;
        width: 96px;
        text-align: right;
        display: inline-block;
      }

      input {
        width: 270px;
        height: 38px;
        padding-left: 8px;
        box-sizing: border-box;
        margin-left: 5px;
        outline: none;
        border: 1px solid #999;
      }

      .code {
        width: 100px;
        height: 38px;
        margin-left: 10px;
        cursor: pointer;
      }

      img {
        vertical-align: sub;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .controls {
      text-align: center;
      position: relative;

      input {
        vertical-align: middle;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .btn {
      text-align: center;
      line-height: 36px;
      margin: 17px 0 0 55px;

      button {
        outline: none;
        width: 270px;
        height: 36px;
        background: #e1251b;
        color: #fff !important;
        display: inline-block;
        font-size: 16px;
      }
    }
  }

  .copyright {
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    line-height: 24px;

    ul {
      li {
        display: inline-block;
        border-right: 1px solid #e4e4e4;
        padding: 0 20px;
        margin: 15px 0;
      }
    }
  }
}
</style>
