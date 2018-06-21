/*
* @Author: baosheng
* @Date:   2017-09-22 19:23:21
* @Last Modified by:   baosheng
* @Last Modified time: 2017-09-22 19:46:56
*/
import React, { Component } from 'react'
import { Form, Input, Modal } from 'antd'
import api from 'Src/contants/api'
import storage from 'Util/storage'

const FormItem = Form.Item
class ModalPwd extends Component {
  handleChangePwd(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const res = await api.oauthMsg.userMsg.modifyUserPassword({ ...values, ...{ id: storage.get('userInfo')['userId'] }}) || false
        if (res) {
          this.handleCancel()
        }
      }
    })
  }

  checkPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码输入不一致')
    } else {
      callback()
    }
  }

  handleCancel() {
    this.props.handleCancel()
    this.props.form.resetFields()
  }

  render() {
    const formItemModout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    }
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title='修改密码'
        width={320}
        visible={this.props.visible}
        onOk={this.handleChangePwd.bind(this)}
        onCancel={this.handleCancel.bind(this)}
      >
        <Form onSubmit={this.handleChangePwd.bind(this)}>
          <FormItem
            label='原密码'
            {...formItemModout}>
            {getFieldDecorator('originPassword', {
              initialValue: '',
              rules: [{ required: true, message: '请输入原密码' }],
            })(
              <Input
                style={{ width: 200 }}
                type='password'
              />
            )}
          </FormItem>
          <FormItem
            label='新密码'
            {...formItemModout}>
            {getFieldDecorator('password', {
              initialValue: '',
              rules: [
                { required: true, message: '请输入新密码' },
                { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/, message: '密码为6~20位数字和字母' }
              ]
            })(
              <Input
                style={{ width: 200 }}
                type='password'
              />
            )}
          </FormItem>
          <FormItem
            label='确认密码'
            {...formItemModout}>
            {getFieldDecorator('passwordConfirm', {
              initialValue: '',
              rules: [
                { required: true, message: '请输入确认密码' },
                { validator: this.checkPassword }
              ]
            })(
              <Input
                style={{ width: 200 }}
                type='password'
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalPwd)
