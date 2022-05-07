<template>
  <section>
    <div class="cart">
      <h4>全部商品</h4>
      <div class="cart-main">
        <div class="cart-th">
          <div class="cart-th1">全部</div>
          <div class="cart-th2">商品</div>
          <div class="cart-th3">单价（元）</div>
          <div class="cart-th4">数量</div>
          <div class="cart-th5">小计（元）</div>
          <div class="cart-th6">操作</div>
        </div>
        <div class="cart-body">
          <ul class="cart-list" v-for="cart in cartInfoList" :key="cart.skuId">
            <li class="cart-list-con1">
              <input
                type="checkbox"
                name="chk_list"
                :checked="cart.isChecked === 1"
                @change="updateChecked(cart.skuId, cart.isChecked)"
              />
            </li>
            <li class="cart-list-con2">
              <img :src="cart.imgUrl" @click="jumpDetail(cart.skuId)" >
              <div class="item-msg"  @click="jumpDetail(cart.skuId)">{{ cart.skuName }}</div>
            </li>
            <!-- <li class="cart-list-con3">
              <div class="item-txt">语音升级款</div>
            </li> -->
            <li class="cart-list-con4">
              <span class="price">{{ cart.cartPrice|currency('￥') }}</span>
            </li>
            <li class="cart-list-con5">
              <button
                class="mins"
                :disabled="cart.skuNum === 1"
                @click="updateSkuNum('minus', -1, cart)"
              >
                -
              </button>
              <input
                type="text"
                class="itxt"
                :value="cart.skuNum"
                minnum="1"
                autocomplete="off"
                @input="updateSkuNum('input', $event.target.value * 1, cart)"
              />
              <button class="plus" @click="updateSkuNum('plus', 1, cart)">
                +
              </button>
            </li>
            <li class="cart-list-con6">
              <span class="sum">{{ cart.cartPrice * cart.skuNum |currency('￥') }}</span>
            </li>
            <li class="cart-list-con7">
              <a class="sindelet" @click="deleteCart(cart.skuId)">删除</a>
              <br />
              <a href="#none">移到收藏</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="cart-tool">
        <div class="select-all">
          <input
            class="chooseAll"
            type="checkbox"
            :checked="isAllChecked && cartInfoList.length > 0"
            :disabled="cartInfoList.length === 0"
            @change="updateAllChecked"
          />
          <span>全选</span>
        </div>
        <div class="option">
          <a @click="deleteAllChecked">删除选中的商品</a>
          <a href="#none">移到我的关注</a>
          <a href="#none">清除下柜商品</a>
        </div>
        <div class="money-box">
          <div class="chosed">
            已选择 <span>{{ totalItem }}</span
            >件商品
          </div>
          <div class="sumprice">
            <em>总价（不含运费） ：</em>
            <i class="summoney">{{ totalPrice|currency('￥') }}元</i>
          </div>
          <div class="sumbtn">
            <a class="sum-btn" @click="jumpTrade">结算</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { debounce } from 'lodash'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ShopCart',
  methods: {
    ...mapActions('shopcart', [
      'getCartList',
      'deleteCartById',
      'updateCheckedById',
      'deleteAllCheckedCart',
      'updateAllCheckedCart'
    ]),
    ...mapActions('detail', ['addOrUpdateShopCart']),
    // 获取购物车列表信息
    getCartData () {
      this.getCartList()
    },
    // 修改购买的商品数 (函数防抖)
    updateSkuNum: debounce(async function (type, num, cart) {
      // type形参： 区分是哪个元素导致的变化
      // num形参：+ 变化量(1) -变化量(-1) input 最终个数(并不是变化量)
      // cart形参：获取商品id 和原购买个数
      // 修改数量
      switch (type) {
        case 'plus':
          num = 1
          break
        case 'minus':
          // 判断产品的个数大于1，才可以传递给服务器-1
          // 如果出现产品的个数小于等于1，传递给服务器个数0
          num = cart.skuNum > 1 ? -1 : 0
          break
        case 'input':
          // 如果用户输入的最终量，是非法的(带有汉字或小于1)，原封不动
          if (isNaN(num) || num < 1) {
            num = 0
          } else {
            // 计算变化量，小数取整
            num = parseInt(num - cart.skuNum)
          }
      }
      // 派发action
      try {
        // 修改成功
        await this.addOrUpdateShopCart({
          skuId: cart.skuId,
          skuNum: num
        })
        // 再一次获取服务器最新的数据进行展示
        this.getCartData()
      } catch (error) {
        alert(error.message)
      }
    }, 500),
    // 删除购物车中某一个商品
    async deleteCart (skuId) {
      try {
        // 如果删除成功,再次发请求获取新的数据
        await this.deleteCartById(skuId)
        this.getCartData()
      } catch (error) {
        alert(error.message)
      }
    },
    // 修改购物车某一个商品的选中状态
    async updateChecked (skuId, isChecked) {
      try {
        // 带给服务器的参数ischecked,不是布尔值，而是0和1
        isChecked = isChecked === 0 ? 1 : 0
        // 如果删除成功,再次发请求获取新的数据
        // console.log(skuId, isChecked)
        await this.updateCheckedById({
          skuId,
          isChecked
        })
        this.getCartData()
      } catch (error) {
        alert(error.message)
      }
    },
    // 删除所有选中的商品
    // 这个回调函数，没办法收集到有用的数据
    async deleteAllChecked () {
      try {
        // 派发一个action
        await this.deleteAllCheckedCart()
        // 再发一次请求，获取购物车列表
        this.getCartData()
      } catch (error) {
        alert(error.message)
      }
    },
    // 修改全部商品的选中状态
    async updateAllChecked () {
      try {
        // 如果全选，则传参数为0，取消全选，反之则传1，表示全选
        let isChecked = this.isAllChecked ? 0 : 1
        // 派发action
        await this.updateAllCheckedCart(isChecked)
        // 再发一次请求，获取购物车列表
        this.getCartData()
      } catch (error) {
        alert(error.message)
      }
    },
    // 跳转到商品详情页
    jumpDetail (skuId) {
      this.$router.push({
        name: 'detail',
        params: { skuid: skuId }
      })
    },
    // 跳转到交易页面
    jumpTrade () {
      this.$router.push('/trade')
    }
  },
  computed: {
    ...mapGetters('shopcart', ['cartList']),
    // 购物车数据
    cartInfoList () {
      return this.cartList.cartInfoList || []
    },
    // 计算购买商品的总价
    totalPrice () {
      let sum = 0
      this.cartInfoList.forEach((item) => {
        sum += item.skuNum * item.cartPrice
      })
      return sum
    },
    // 计算选中了几项商品
    totalItem () {
      let total = 0
      this.cartInfoList.forEach((item) => {
        if (item.isChecked === 1) {
          total++
        }
      })
      return total
    },
    // 是否全选 [全部商品都被选中，才被勾选]
    isAllChecked () {
      // 遍历数组，只要全部元素 ischecked都为1，返回true，否则为false
      return this.cartInfoList.every((item) => item.isChecked === 1)
    }
  },
  created () {
    this.getCartData()
  }

}
</script>
<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 20%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 13.75%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 30%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con3 {
          width: 10%;

          .item-txt {
            text-align: center;
          }
        }

        .cart-list-con4 {
          width: 11%;
        }

        .cart-list-con5 {
          width: 16%;
          button {
            border: 1px solid #ddd;
            float: left;
            background-color: #fff;
            color: #666;
            text-align: center;
            padding: 8px;
            cursor: pointer;
            width: 25px;
            height: 35px;

            &[disabled] {
              background-color: #f4f4f5;
              cursor: not-allowed;
            }
          }

          .mins {
            border-right: 0;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border-left: 0;
          }
        }

        .cart-list-con6 {
          width: 14%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 225px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
