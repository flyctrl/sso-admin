import React, { Component } from 'react'
// import { connect } from 'react-redux'
// import md5 from 'md5'
import { Form, Input, Button, Row, message } from 'antd'
import { baseUrl } from 'Util/index'
// import { toLogin } from '../../actions'
import style from './style.css'
import storage from 'Util/storage'
import fetch from 'Util/fetch'
// import tooler from 'Src/contants/tooler'

const FormItem = Form.Item

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      passwd: '',
      referrer: '',
      imgSrc: ''
    }
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handlePasswdChange = this.handlePasswdChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleCodeChange = this.handleCodeChange.bind(this)
    this.handleImgChange = this.handleImgChange.bind(this)
  }

  componentDidMount() {
    this.setState({
      imgSrc: baseUrl + '/single-sign-on/sys/verification.json?rand=' + (new Date()).valueOf(),
      referrer: document.referrer
    })
  }
  handleNameChange(event) {
    this.setState({
      userName: event.target.value
    })
  }

  handlePasswdChange(event) {
    this.setState({
      passwd: event.target.value
    })
  }
  handleCodeChange(event) {
    this.setState({
      code: event.target.value
    })
  }
  handleImgChange() {
    this.setState({
      imgSrc: baseUrl + '/single-sign-on/sys/verification.json?rand=' + (new Date()).valueOf()
    })
  }

  handleLogin() {
    const loginData = {
      userName: this.state.userName,
      password: this.state.passwd,
      gotoUrl: this.state.referrer,
      code: this.state.code
    }
    fetch('/single-sign-on/sys/login.json', loginData).then(res => {
      if (res.code === 0) {
        storage.set('userInfo', {
          userName: loginData.userName,
          accessToken: res.data.accessToken,
          userId: res.data.id,
          srcType: res.data.srcType,
          NOUSERINFO: true
        })
        if (res.data.gotoUrl) {
          location.href = res.data.gotoUrl
        } else {
          location.href = '/'
        }
      } else {
        message.error(res.errmsg)
      }
    })
  }

  render() {
    return (
      <div className={style.form}>
        <div className={style.logo}>
          <img alt={'logo'} src={require('../../assets/logo.png')} />
          <span>业务运营平台管理系统</span>
        </div>
        <form>
          <FormItem hasFeedback>
            <Input size='large' value={this.state.userName} onPressEnter={this.handleLogin} placeholder='输入帐号' onChange={this.handleNameChange} />
          </FormItem>
          <FormItem hasFeedback>
            <Input size='large' value={this.state.passwd} type='password' onPressEnter={this.handleLogin} placeholder='输入密码' onChange={this.handlePasswdChange} />
          </FormItem>
          <FormItem hasFeedback style={{ 'overFlow': 'hidden' }}>
            <Input size='large' className={style['codeInput']} value={this.state.code} onPressEnter={this.handleLogin} placeholder='输入验证码' onChange={this.handleCodeChange} />
            <img className={style['codeimg']} alt='点击刷新' title='点击刷新' onClick={this.handleImgChange} src={this.state.imgSrc} />
          </FormItem>
          <Row>
            <Button type='primary' size='large' onClick={this.handleLogin}>
              登录
            </Button>
          </Row>

        </form>
      </div>
    )
  }
}

export default Login

