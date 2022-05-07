// 存储token
export const setToken = (token) => {
  localStorage.setItem('token', token)
}
// 获取token
export const getToken = () => {
  return localStorage.getItem('token')
}
// 清除token
export const removeToken = () => {
  localStorage.removeItem('token')
}

// 存储token
export const setTempToken = (token) => {
  sessionStorage.setItem('token', token)
}
// 获取token
export const getTempToken = () => {
  return sessionStorage.getItem('token')
}
// 清除token
export const removeTempToken = () => {
  sessionStorage.removeItem('token')
}
