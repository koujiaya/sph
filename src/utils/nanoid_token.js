import { nanoid } from 'nanoid'
// 生成一个随机字符串，且每次执行不能变化，游客身份持久存储
export const getNanoid = () => {
  // 先从本地存储获取nanoid
  let nanoid_token = localStorage.getItem('nanoid_token')
  // 如果没有
  if (!nanoid_token) {
    // 就生成临时游客身份
    nanoid_token = nanoid()
    // 本地存储存储一次  单例
    localStorage.setItem('nanoid_token', nanoid_token)
  }
  // 切记要有返回值，否则返回值为undefined
  return nanoid_token
}
