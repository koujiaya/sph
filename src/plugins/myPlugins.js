// vue插件对外暴露一定是一个对象
let myPlugins = {}

myPlugins.install = function (Vue, options) {
  // Vue.prototype.$bus  中央事件总线
  // Vue.directive       全局指令
  // Vue.component       全局组件
  // Vue.filter          全局过滤器
  Vue.directive(options.name, {
    inserted (el, binding) {
      el.innerHTML = binding.value + el.innerHTML.toUpperCase()
    }
  })
}

export default myPlugins
