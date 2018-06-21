/*
* @Author: chengbaosheng
* @Date:   2017-09-14 19:46:19
* @Last Modified by:   baosheng
* @Last Modified time: 2017-09-21 20:46:10
*/

class Tooler {
  ltrim(s) { // 去左空格
    try {
      return s.toString().replace(/^\s*/, '')
    } catch (e) {
      this.printErrorLog(e)
      return ''
    }
  }

  rtrim(s) { // 去右空格
    try {
      return s.toString().replace(/\s*$/, '')
    } catch (e) {
      this.printErrorLog(e)
      return ''
    }
  }

  lrtrim(s) { // 左右去空格
    try {
      return this.rtrim(this.ltrim(s))
    } catch (e) {
      this.printErrorLog(e)
      return ''
    }
  }

  trim(s) { // 去全部空格
    try {
      return s.toString().replace(/\s/g, '')
    } catch (e) {
      this.printErrorLog(e)
      return ''
    }
  }

  jsonTrim(json) { // 去json中值的左右空格
    try {
      let result = {}
      for (let attr in json) {
        result[attr] = this.lrtrim(json[attr])
      }
      return result
    } catch (e) {
      this.printErrorLog(e)
      return {}
    }
  }

  isArray(o) { // 是否是数组
    try {
      return Object.prototype.toString.call(o) === '[object Array]'
    } catch (e) {
      this.printErrorLog(e)
      return ''
    }
  }

  aryUnique(arr) { // 数组去重
    try {
      let result = []
      let json = {}
      for (let i = 0, len = arr.length; i < len; i++) {
        if (!json[arr[i]]) {
          json[arr[i]] = 1
          result.push(arr[i]) // 返回没被删除的元素
        }
      }
      return result
    } catch (e) {
      this.printErrorLog(e)
      return []
    }
  }

  isRepeatAry(arr) { // 判断数组是否有重复元素
    try {
      let hash = {}
      for (let i in arr) {
        if (hash[arr[i]]) return true
        hash[arr[i]] = true
      }
      return false
    } catch (e) {
      this.printErrorLog(e)
      return ''
    }
  }

  isContainAry(arry, ele) { // 检测是否在数组内
    try {
      let i = arry.length
      while (i--) {
        if (arry[i] === ele) {
          return true
        }
      }
      return false
    } catch (e) {
      this.printErrorLog(e)
      return ''
    }
  }

  removeAryEle(arr, val) { // 删除数组中的某一个元素
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        arr.splice(i, 1)
        break
      }
    }
  }

  intersection(array1, array2) { // 数组求交集
    try {
      return array1.filter(function(n) {
        return array2.indexOf(n) !== -1
      })
    } catch (e) {
      this.printErrorLog(e)
      return ''
    }
  }

  arryToString(arry) { // 数组转数组格式的字符串
    try {
      if (!this.isArray(arry)) {
        return false
      }
      let strAry = ''
      arry.forEach((value, index, arry) => {
        strAry += value + ','
      })
      return strAry.substring(0, strAry.length - 1)
    } catch (e) {
      this.printErrorLog(e)
      return ''
    }
  }

  returnFloat(number) { // 金额保留两位小数，整数加'.00'
    try {
      if (number === 'undefined' || number === 'null' || number === '' || typeof number === 'undefined') {
        return ''
      }
      let value = Math.round(parseFloat(number) * 100) / 100
      let xsd = value.toString().split('.')
      if (xsd.length === 1) {
        value = value.toString() + '.00'
        return value
      }
      if (xsd.length > 1) {
        if (xsd[1].length < 2) {
          value = value.toString() + '0'
        }
        return value
      }
    } catch (e) {
      this.printErrorLog(e)
      return 0
    }
  }

  getURLParam(name, targetUrl) { // 通过key获取url中的参数值
    try {
      let reg = new RegExp('[?&]' + name + '=([^&]+)')
      targetUrl = targetUrl || window.location.search

      return targetUrl.match(reg) ? RegExp.$1 : null
    } catch (e) {
      this.printErrorLog(e)
      return ''
    }
  }

  parseURLParam(url) { // 把url的参数部分转化成json对象
    try {
      let targeturl = url || window.location.href
      const regUrl = /^[^\?]+\?([\w\W]+)$/
      const regPara = /([^&=]+)=([\w\W]*?)(&|$|#)/g
      let arrUrl = regUrl.exec(targeturl)
      let ret = {}
      if (arrUrl && arrUrl[1]) {
        let strPara = arrUrl[1]
        let result
        while ((result = regPara.exec(strPara)) != null) {
          ret[result[1]] = result[2]
        }
      }
      return ret
    } catch (e) {
      this.printErrorLog(e)
      return {}
    }
  }

// 针对ant design的validator验证规则方法
  checkPhone(rule, value, callback) { // 验证手机号码
    let regular = /^(|1[34578]\d{9})$/
    if (regular.test(value)) {
      callback()
    } else {
      callback('输入正确的手机号码')
    }
  }
  checkTelPhone(rule, value, callback) { // 验证固定电话号码,支持格式：“XXXX-XXXXXXX”，“XXXX-XXXXXXXX”，“XXX-XXXXXXX”，“XXX-XXXXXXXX”，“XXXXXXX”，“XXXXXXXX”
    let regular = /^((d{3,4})|d{3,4}-)?d{7,8}$/
    if (regular.test(value)) {
      callback()
    } else {
      callback('输入正确的固定电话号码')
    }
  }
  checkIdCard(rule, value, callback) { // 验证身份证
    let regular = /^(|\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X))$/
    if (regular.test(value)) {
      callback()
    } else {
      callback('输入正确的身份证号码')
    }
  }
  checkPassword(rule, value, callback) { // 验证6~20位数字+字母的密码
    let regular = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/
    if (regular.test(value)) {
      callback()
    } else {
      callback('密码格式错误，密码由字母和数字组成6~20位字符')
    }
  }
  checkPostalCode(rule, value, callback) { // 验证邮政编码
    let regular = /^(|[1-9]\d{5}(?!\d))$/
    if (regular.test(value)) {
      callback()
    } else {
      callback('输入正确的邮政编码')
    }
  }
  checkEmail(rule, value, callback) { // 验证电子邮箱
    let regular = /^(|\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+)$/
    if (regular.test(value)) {
      callback()
    } else {
      callback('输入正确的电子邮箱')
    }
  }
  replaceChar(value, len, char) { // 超过len长度超出部分替换成char
    return value && value.length > len ? `${value.toString().substr(0, len)}${char}` : value
  }
  printErrorLog(e) { // 打印参数日志
    console.log('error name:', e.name)
    console.log('error message:', e.message)
    console.log('error description:', e.description)
  }
}
const tooler = new Tooler()
export default tooler
