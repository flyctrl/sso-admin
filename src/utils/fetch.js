import storage from '../utils/storage'
import axios from 'axios'
import { baseUrl } from './index'
let fetcher = axios.create({
  method: 'post',
  baseURL: baseUrl,
  withCredentials: true,
  transformRequest: [function (data) {
    return JSON.stringify(data)
  }],
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }
})
fetcher.interceptors.request.use(function (config) {
  const userInfo = storage.get('userInfo')
  if (userInfo) {
    config.headers.loginName = userInfo.userName
    config.headers.accessToken = userInfo.accessToken
  }
  if (config.data['power'] && config.data['power'] === 'JCER') {
    config.headers.power = 'JCER'
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
fetcher.interceptors.response.use(function (response) {
  if (response.data.code === 89001 || response.data.code === 81001 || response.data.code === 2) {
    location.href = '/login'
  }
  return response.data
}, function (error) {
  return Promise.reject(error)
})
export default fetcher.post
