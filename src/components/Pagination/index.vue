<template>
  <!--分页器组件-->
  <div class="pagination">
    <!-- 左半部分 -->
    <button
      :disabled="pageNo===1"
      @click="jumpPageNo(pageNo - 1)"
    >
      <span class="iconfont icon-left"></span>上一页
    </button>
    <button v-show="startAndEndNum.start > 1" @click="jumpPageNo(1)">1</button>
    <button v-show="startAndEndNum.start > 2" disabled>···</button>

    <!-- 中间部分 -->
    <button
      v-for="(page, index) in startAndEndNum.end"
      :key="index"
      v-show="page >= startAndEndNum.start"
      :class="{ active: page === pageNo }"
      :disabled="page === pageNo"
      @click="jumpPageNo(page)"
    >
      {{ page }}
    </button>

    <!-- 右半部分 -->
    <button v-show="startAndEndNum.end < totalPage - 1" disabled>···</button>
    <button
      v-show="startAndEndNum.end < totalPage"
      @click="jumpPageNo(totalPage)"
    >
      {{ totalPage }}
    </button>
    <button
      :disabled="pageNo === totalPage"
      @click="jumpPageNo(pageNo + 1)"
    >
      下一页<span class="iconfont icon-right"></span>
    </button>

    <!-- 额外功能 -->
    <span>
      每页<select @change="changePageSize($event)">
        <option
          v-for="size in sizeList"
          :key="size"
          :value="size"
          :selected="size === pageSize"
        >
          {{ size }}
        </option></select
      >条</span
    >
    <span>
      到第<input
        type="number"
        :value="pageNo"
        :max="totalPage"
        :min="1"
        ref="no"
      />页</span
    >
    <button @click="jumpPageNo($refs.no.value - 0)">确定</button>
  </div>
</template>
<script>
export default {
  name: 'Pagination',
  // 父组件传递给子组件的数据，当前页，每页条数，总条数，连续页码数
  props: ['pageNo', 'pageSize', 'total', 'continues'],
  data () {
    return {
      sizeList: [5, 10, 15, 20, 25, 30]
    }
  },
  methods: {
    jumpPageNo (pageNo) {
      this.$emit('jumpPageNo', pageNo)
    },
    changePageSize (event) {
      this.$emit('changePageSize', event.target.value)
    }
  },
  computed: {
    // 计算一共有多少页
    totalPage () {
      return Math.ceil(this.total / this.pageSize)
    },
    // 计算连续的页码起始数字和结束数字
    startAndEndNum () {
      // 定义两个变量，用来存储起始和结束数字
      let start = 1
      let end = 1
      // 结构出 当前页，连续页码数，总页数
      const { pageNo, continues, totalPage } = this
      // 连续页码数是5，[至少5项]
      // 如果出现不正常的现象，[不够5项]
      if (totalPage < continues) {
        // 总页数小于连续页码数
        start = 1
        end = totalPage
      } else {
        // 总页数大于连续页码数
        start = pageNo - Math.floor(continues / 2)
        end = pageNo + Math.floor(continues / 2)
        // 如果起始页小于1，则连续页码数起始页为1
        if (start < 1) {
          start = 1
          end = continues
        }
        // 如果结束页大于总页数，则连续页码数结束页为总页数
        if (end > totalPage) {
          start = totalPage - continues + 1
          end = totalPage
        }
      }
      return { start, end }
    }
  }
}
</script>
<style lang='less' scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
    &.total {
      margin-left: 30px;
    }
    span {
      &.iconfont {
        font-size: 13px !important;
      }
    }
  }
  span {
    height: 28px;
    line-height: 28px;
    input {
      width: 35px;
      margin: 0 5px;
    }
    select {
      margin: 0 5px;
    }
  }
}
</style>
