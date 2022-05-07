<template>
     <!-- Home模块 -->
   <section>
       <!-- 三级联动全局组件 不需要再引入-->
      <TypeNav></TypeNav>
      <ListContainer></ListContainer>
      <Recommend></Recommend>
      <Rank></Rank>
      <Like></Like>
      <Floor v-for="floor in floorList" :key="floor.id" :floor='floor'></Floor>
      <Brand></Brand>
   </section>
</template>
<script>
// 引入其余的组件
import ListContainer from '@/views/Home/ListContainer'
import Recommend from '@/views/Home/Recommend'
import Rank from '@/views/Home/Rank'
import Like from '@/views/Home/Like'
import Floor from '@/views/Home/Floor'
import Brand from '@/views/Home/Brand'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand
  },
  methods: {
    ...mapActions('home', ['getFloorList'])
  },
  computed: {
    ...mapState('home', ['floorList'])
  },
  created () {
    // 派发action，获取floor组件的数据
    this.getFloorList()
  }
}
</script>
<style scoped>

</style>
