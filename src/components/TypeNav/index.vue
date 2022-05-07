<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <!-- 事件委派 -->
      <div @mouseenter="handleShow" @mouseleave="handleHide">
        <h2 class="all">全部商品分类</h2>
        <!-- 三级联动 -->
        <!-- 过渡动画 -->
        <transition name="sort">
          <div class="sort" v-show="isShow">
            <!-- 事件委派+编程式导航实现路由跳转与传递参数 -->
            <!-- 一级分类 -->
            <div class="all-sort-list2" @click="jumpSearch">
              <div
                class="item"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
                :class="{ current: currentIndex === index }"
              >
                <h3 @mouseenter="changeIndex(index)">
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                </h3>
                <!-- 二级分类 -->
                <div
                  class="item-list clearfix"
                  :style="{
                    display: currentIndex == index ? 'block' : 'none',
                  }"
                >
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <!-- 三级分类 -->
                      <dd>
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

// 引入方式：最好按需引入
// import _ from 'lodash'
import { throttle } from 'lodash'
export default {
  name: 'TypeNav',
  data () {
    return {
      // 存储用户鼠标移上哪一个位置
      currentIndex: -1,
      isShow: true
    }
  },
  methods: {
    // 鼠标进入，修改响应式数据currentIndex状态
    changeIndex: throttle(function (index) {
      // index:鼠标移入某一个一级分类元素的索引值
      this.currentIndex = index
      // throttle回调函数别用箭头函数，可能出现上下文this指向的问题
    }, 50),

    // 鼠标移入，显示商品分类列表
    handleShow () {
      if (this.$route.path !== '/home') {
        this.isShow = true
      }
    },
    // 鼠标移出，隐藏商品分类列表
    handleHide () {
      if (this.$route.path !== '/home') {
        this.isShow = false
      }
      // 修改currentIndex为-1
      this.changeIndex(-1)
    },
    // 进行路由跳转的方法
    jumpSearch (event) {
      // 最好的解决方案：编程式导航+事件委派
      // 利用事件委派存在一些问题：
      // ? 1.点击的是哪个标签？[a标签]
      //   --怎么确定点击的是a标签？
      //   --如何区分是哪一级的a标签？
      // ? 2.如何获取参数？[三级分类的产品名字，id]

      // 1.把子节点当中a标签加上自定义属性 data-categoryName，其余子节点是没有的
      let Element = event.target
      // 获取到当前触发事件的节点，需要带有data-categoryname自定义属性的节点，一定是a标签
      // 节点有一个属性dataset属性，可以获取组件的自定义属性值
      let { categoryname, category1id, category2id, category3id } =
        Element.dataset
      // 判断是否是a标签
      if (categoryname) {
        // 整理路由跳转参数
        let location = { name: 'search' }
        let query = { categoryName: categoryname }
        // 判断是哪级分类的a标签
        if (category1id) {
          query.category1Id = category1id
        } else if (category2id) {
          query.category2Id = category2id
        } else {
          query.category3Id = category3id
        }
        // 整理完参数后，判断如果路由跳转的时候，带有params参数，也要传递过去
        if (Object.keys(this.$route.params).length !== 0) {
          location.params = this.$route.params
        }
        location.query = query
        // 路由跳转
        this.$router.push(location)
      }
    }
  },
  computed: {
    // 数组写法
    ...mapState('home', ['categoryList'])
    // 对象写法
    // 右侧需要一个函数，当使用这个计算属性的时候，右侧函数会执行一次，
    // 注入一个参数state，即为大仓库中的数据
    // ...mapState({
    //   categoryList: (state) => state.home.categoryList
    // })
  },
  mounted () {
    // 当组件挂载完毕，让isShow状态变为false
    // 如果不是Home路由组件，将typeNav组件进行隐藏
    if (this.$route.path !== '/home') {
      this.isShow = false
    }
  }
}
</script>
 <style lang='less' scoped>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          // &:hover {
          //   .item-list {
          //     display: block;
          //   }
          // }
        }
        // .item:hover{
        //   background: skyblue;
        // }
        .current {
          background: skyblue;
        }
      }
    }
    // 过渡动画样式
    // 进入开始和离开结束状态
    .sort-enter,
    .sort-leave-to {
      opacity: 0 !important;
    }
    // 进入结束和离开开始状态
    .sort-enter-to,
    .sort-leave {
      opacity: 1 !important;
    }
    //过渡动画时间，速率
    .sort-enter-active,
    .sort-leave-active {
      transition: opacity 0.5s;
    }
  }
}
</style>
