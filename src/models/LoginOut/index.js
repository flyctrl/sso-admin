/*
* @Author: baosheng
* @Date:   2017-10-17 10:58:28
* @Last Modified by:   baosheng
* @Last Modified time: 2017-10-17 14:59:28
*/
import React, { Component } from 'react'
import fetch from 'Util/fetch'
import api from 'Src/contants/api'

class LoginOut extends Component {
  componentWillMount() {
    fetch(api.oauthMsg.userMsg.logout, {}).then((res) => {
      if (res.code === 0) {
        if (res.data) {
          window.location.href = '/login'
        }
      }
    })
  }
  render() {
    return (<div></div>)
  }
}

export default LoginOut
