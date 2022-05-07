<template>
  <!-- Home模块 -->
  <section>
    <!-- 商品分类三级列表 -->
    <TypeNav></TypeNav>
    <div class="main">
      <div class="py-container">
        <!--bread 面包屑,带有x的结构-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">
              {{ searchParams.categoryName
              }}<i @click="removeCategoryName">×</i>
            </li>
            <!-- 关键字面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">
              {{ searchParams.keyword }}<i @click="removeKeyword">×</i>
            </li>
            <!-- 品牌面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1]
              }}<i @click="removeTradeMark">×</i>
            </li>
            <!-- 属性面包屑 -->
            <li
              class="with-x"
              v-for="(prop, index) in searchParams.props"
              :key="prop"
            >
              {{ prop.split(":")[1] }}<i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>
        <!--selector 商品属性选择组件-->
        <SearchSelector
          @getTradeMarkInfo="getTradeMarkInfo"
          @getAttrInfo="getAttrInfo">
          </SearchSelector>
        <!--details-->
        <div class="details clearfix">
          <!-- 导航 -->
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li
                  :class="{ active: isActive('1') }"
                  @click="changeOrder('1')"
                >
                  <a
                    >综合
                    <span
                      v-show="isActive('1')"
                      class="iconfont"
                      :class="{ 'icon-down': isDesc, 'icon-up': !isDesc }"
                    ></span>
                  </a>
                </li>
                <li
                  :class="{ active: isActive('2') }"
                  @click="changeOrder('2')"
                >
                  <a
                    >价格<span
                      v-show="isActive('2')"
                      class="iconfont"
                      :class="{ 'icon-down': isDesc, 'icon-up': !isDesc }"
                    ></span
                  ></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 商品列表 -->
          <div class="goods-list" @click="jumpDetail">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="goods in goodsList" :key="goods.id">
                <div class="list-wrap">
                  <!-- 商品图片 -->
                  <div class="p-img" >
                    <a>
                      <img v-lazy="goods.defaultImg" :data-goodsId=goods.id>
                    </a>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i> {{ goods.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a :title="goods.title">{{
                      goods.title
                    }}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 组件-->
          <Pagination
            :pageNo="searchParams.pageNo"
            :pageSize="searchParams.pageSize"
            :total="total"
            :continues="5"
            @jumpPageNo="jumpPageNo"
            @changePageSize="changePageSize"
          ></Pagination>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import SearchSelector from './SearchSelector/SearchSelector'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Search',
  components: {
    SearchSelector
  },
  data () {
    return {
      // 带给服务器的参数
      searchParams: {
        // 一二三级分类id，只能存在一个，每次发请求后需置空
        category1Id: undefined,
        category2Id: undefined,
        category3Id: undefined,
        // 分类名称
        categoryName: undefined,
        // 关键字
        keyword: undefined,
        // 排序 初始状态为综合降序
        order: '1:desc',
        // 第几页
        pageNo: 1,
        // 每一页有多少项数据
        pageSize: 10,
        // 商品属性筛选条件
        props: [],
        // 品牌
        trademark: undefined
      }
    }
  },
  methods: {
    ...mapActions('search', ['getSearchInfo']),
    // 在发请求之前，把接口需要的传递的参数进行整理
    assignSearData () {
      Object.assign(this.searchParams, this.$route.query, this.$route.params)
    },
    // 向服务器发送请求获取search模块数据，(根据参数不同返回不同的数据进行展示)
    // 把请求封装为一个函数，那么需要调用的时候，调用即可
    getSearchData () {
      // 向服务器发送ajax请求
      this.getSearchInfo(this.searchParams)
      // 在发请求之后，需要把三级分类的id置空，好接受下一次请求
      // 分类名和关键字不用清空，因为每一次都会赋予新的值覆盖原值
      this.searchParams.category1Id = undefined
      this.searchParams.category2Id = undefined
      this.searchParams.category3Id = undefined
    },
    // 自定义事件，获取品牌信息
    getTradeMarkInfo (trademark) {
      // 整理品牌字段参数
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
      this.getSearchData()
    },
    // 自定义事件，获取属性信息
    getAttrInfo (attr, attrValue) {
      // 整理属性参数
      let prop = `${attr.attrId}:${attrValue}:${attr.attrName}`
      // 判断数组中是否已经存在该元素  数组去重
      if (!this.searchParams.props.includes(prop)) {
        this.searchParams.props.push(prop)
        this.getSearchData()
      }
    },
    // 删除分类名筛选
    removeCategoryName () {
      // 置空分类名后再次发送请求
      // 可有可无的参数，如果属性值为空字符串，还是会把相应字段带给服务器
      // 可将空字符串的字段设置为undefind，这样将不会把该字段带给服务器，[节省宽带]
      this.searchParams.categoryName = undefined
      // this.getSearchData()
      // 地址栏也需要修改:进行路由跳转
      let location = { name: 'search' }
      // 如果params参数存在，需要保留
      if (Object.keys(this.$route.params).length !== 0) {
        location.params = this.$route.params
      }
      this.$router.push(location)
      // 当使用push后，上面不需要再发请求，因为会被watch监听到
    },
    // 删除关键字筛选
    removeKeyword () {
      this.searchParams.keyword = undefined

      let location = { name: 'search' }
      // 如果query参数存在，需要保留
      if (Object.keys(this.$route.query).length !== 0) {
        location.query = this.$route.query
      }
      // 通知兄弟组件Header清除关键字
      this.$bus.$emit('clear')
      this.$router.push(location)
    },
    // 删除品牌信息筛选
    removeTradeMark () {
      // 整理参数后请求数据
      this.searchParams.trademark = undefined
      this.getSearchData()
    },
    // 删除属性筛选
    removeAttr (index) {
      // 整理参数后请求数据
      this.searchParams.props.splice(index, 1)
      this.getSearchData()
    },
    // 改变排序方式
    changeOrder (flag) {
      // flag，代表用户点击的排序标签是综合(1)还是价格(2)
      // 获取原始排序方式的参数
      let OriginFlag = this.searchParams.order.split(':')[0]
      let OriginSort = this.searchParams.order.split(':')[1]
      // 准备一个变量，接收新的排序方式
      let sort = ''
      // 通过标记，判断用户点击的是否是原排序类型
      if (flag === OriginFlag) {
        // 如果排序类型没变，切换排序方式
        sort = OriginSort === 'desc' ? 'asc' : 'desc'
      } else {
        // 如果排序类型发生了变化
        // 新排序类型默认排序方式是降序
        sort = 'desc'
      }
      this.searchParams.order = flag + ':' + sort
      this.getSearchData()
    },
    // 改变每页显示数据条数
    changePageSize (pageSize) {
      this.searchParams.pageNo = 1
      this.searchParams.pageSize = pageSize
      this.getSearchData()
    },
    // 跳转页数
    jumpPageNo (pageNo) {
      this.searchParams.pageNo = pageNo
      this.getSearchData()
    },
    // 跳转详情页面
    jumpDetail (event) {
      let Element = event.target
      let { goodsid } = Element.dataset
      if (goodsid) {
        this.$router.push({
          name: 'detail',
          params: { skuid: goodsid }
        })
      }
    }
  },

  computed: {
    ...mapGetters('search', ['goodsList', 'total']),
    // 计算哪个排序方式被选中
    isActive () {
      return function (num) {
        return this.searchParams.order.includes(num)
      }
    },
    // 计算是不是降序排序
    isDesc () {
      return this.searchParams.order.includes('desc')
    }
  },
  // 数据监听：监听组件实例身上的属性值的变化
  watch: {
    // 监听属性：
    $route (newValue, oldValue) {
      // 再次整理参数后发送ajax请求
      this.assignSearData()
      this.getSearchData()
    }
  },
  created () {
    // 整理参数
    this.assignSearData()
    // 发送请求
    this.getSearchData()
  }
}
</script>
<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;

                span {
                  font-size: 11px;
                }
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
