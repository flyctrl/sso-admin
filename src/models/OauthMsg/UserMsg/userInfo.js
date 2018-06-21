/*
* @Author: baosheng
* @Date:   2017-09-22 16:47:10
* @Last Modified by:   chengbs
* @Last Modified time: 2018-04-12 16:33:17
*/
import React, { Component } from 'react'
import { Row, Col, Form, Input, Icon, Button } from 'antd'
import api from 'Src/contants/api'
import storage from 'Util/storage'
import ModalPwdForm from './ModalPwdForm'

const FormItem = Form.Item

class UserInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      userInfo: {
        userName: '',
        phone: ''
      }
    }
  }

  handleCancel() {
    this.setState({ visible: false })
  }

  handleSubmitPhone(e) {
    e.preventDefault()
    const { userInfo } = this.state
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        await api.oauthMsg.userMsg.modifyUser({ ...userInfo, ...values, ...{ 'power': 'JCER' }})
      }
    })
  }

  handleResetForm() {
    this.props.form.setFieldsValue({ phone: '' })
  }

  async componentWillMount() {
    const res = await api.oauthMsg.userMsg.queryUserByKey({
      id: storage.get('userInfo')['userId']
    })
    const userInfo = {
      id: res.id,
      userName: res.userName,
      phone: res.phone,
      lastName: res.lastName,
      roleIds: res.roleIds,
      memo: res.memo
    }
    this.setState({ userInfo })
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    }
    let safeEle = null
    if (storage.get('userInfo')['srcType'] === 2 || storage.get('userInfo')['userId'] === 1) {
      safeEle = (<div></div>)
    } else {
      safeEle = (
        <div>
          <h3 style={{ marginTop: 10, borderBottom: '1px solid #ccc', lineHeight: '40px' }}>安全设置</h3>
          <Row style={{ marginTop: 20 }}>
            <Col span={6} offset={1}>登录密码</Col>
            <Col><Icon style={{ color: 'green' }} type='check-circle'/> 已设置 <a onClick={() => { this.setState({ visible: true }) }}>修改</a></Col>
          </Row>
        </div>
      )
    }
    const { getFieldDecorator } = this.props.form
    const { userInfo } = this.state
    return (
      <div>
        <Form name='phoneForm' onSubmit={this.handleSubmitPhone.bind(this)}>
          <h3 style={{ marginBottom: 20, borderBottom: '1px solid #ccc', lineHeight: '40px' }}>基本信息</h3>
          <Row>
            <Col span={24}>
              <FormItem
                label='用户名'
                {...formItemLayout}>
                {getFieldDecorator('userName', {
                  initialValue: userInfo.userName
                })(
                  <Input
                    disabled={true}
                    style={{ width: 200 }}
                    type='text'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                label='电话'
                {...formItemLayout}>
                {getFieldDecorator('phone', {
                  initialValue: userInfo.phone,
                  rules: [{ required: true, message: '请输入电话号码' }],
                })(
                  <Input
                    disabled={storage.get('userInfo')['userId'] === 1 || storage.get('userInfo')['srcType'] === 2}
                    style={{ width: 200 }}
                    type='text'
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          {safeEle}
          <Row style={{ marginTop: 100, display: (storage.get('userInfo')['userId'] === 1 || storage.get('userInfo')['srcType'] === 2) ? 'none' : 'block' }}>
            <Col span={24}>
              <FormItem {...formItemLayout}>
                <Button style={{ marginRight: 10 }} type='primary' htmlType='submit'>保存</Button>
                <Button onClick={this.handleResetForm.bind(this)}>取消</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <ModalPwdForm visible={this.state.visible} handleCancel={this.handleCancel.bind(this)} />
      </div>
    )
  }
}

export default Form.create()(UserInfo)
