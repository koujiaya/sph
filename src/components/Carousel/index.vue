<template>
<!-- 轮播组件 -->
  <div class="swiper-container" ref="mySwiper" :key="list.length">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(carousel,index) in list" :key="carousel.id" >
        <img :src="carousel.imgUrl" :class="{active:currentIndex===index}" @click=changeCurrentIndex(index)>
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination" v-show="pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>
<script>
import Swiper from 'swiper/swiper-bundle'
export default {
  name: 'Carousel',
  props: {
    list: {
      type: Array
    },
    pagination: {
      type: Boolean,
      default: true
    },
    autoplay: {
      default () {
        return {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        }
      }
    },
    loop: {
      type: Boolean,
      default: true
    },
    slidesPerView: {
      type: Number,
      default: 1
    },
    slidesPerGroup: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      currentIndex: 0
    }
  },
  methods: {
    changeCurrentIndex (index) {
      let className = this.$refs.mySwiper.className
      if (className.includes('skuImageList')) {
        // 修改当前索引为选中索引
        this.currentIndex = index
        //  通知 Zoom组件
        this.$bus.$emit('changeIndex', index)
      }
    }
  },
  watch: {
    list: {
      immediate: true,
      handler (newValue, oldValue) {
        // 数据已经有了，但是v-for动态熏染结构，还是没办法确定的，因此还是要用nextTick
        this.$nextTick(() => {
          var mySwiper = new Swiper(this.$refs.mySwiper, {
            // 自动播放
            autoplay: this.autoplay,
            loop: this.loop,
            slidesPerView: this.slidesPerView,
            slidesPerGroup: this.slidesPerGroup,
            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
              // 点击小球的时候，也切换图片
              clickable: true
            },
            // 如果需要前进后退按钮
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            }
          })
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.skuImageList {
  height: 56px;
  width: 402px;
  box-sizing: border-box;
  padding: 0 12px;

  .swiper-slide {
    width: 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      padding: 2px;
      width: 50px;
      height: 50px;
      display: block;

      &.active {
        border: 2px solid #f60;
        padding: 1px;
      }

      &:hover {
        border: 2px solid #f60;
        padding: 1px;
      }
    }
  }

  .swiper-button-next {
    left: auto;
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
    right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    box-sizing: border-box;
    width: 12px;
    height: 56px;
    background: rgb(235, 235, 235);
    border: 1px solid rgb(204, 204, 204);
    top: 0;
    margin-top: 0;
    &::after {
      font-size: 12px;
    }
  }
}
</style>
