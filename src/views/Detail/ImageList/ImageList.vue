<template>
  <Carousel
    class="skuImageList"
    :list="skuImageList"
    :pagination="false"
    :autoplay="false"
    :loop='false'
    :slidesPerView="5"
    :slidesPerGroup="2"
  ></Carousel>
</template>

<script>
export default {
  name: 'ImageList',
  props: ['skuImageList'],
  computed: {
    imgObj () {
      return this.skuImageList[0] || {}
    }
  }
}
</script>
