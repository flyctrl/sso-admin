// let baseUrl = 'http://test.capi.sso.jcease.com'
let baseUrl = 'http://10.0.21.165:8085'

if (process.env.NODE_ENV === 'production') {
  baseUrl = 'http://m.ssoadmin.jcgroup.com.cn'
  if (DEV) {
    console.log('in DEV')
    baseUrl = 'http://10.0.21.165:8085'
  }
  if (TEST) {
    console.log('in TEST')
    baseUrl = 'http://test.capi.sso.jcease.com'
  }
  if (PRE) {
    console.log('in PRE')
    baseUrl = 'http://106.14.14.147:8085'
  }
}

export { baseUrl }
