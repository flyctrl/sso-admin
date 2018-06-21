/**
 * @Author: sunshiqiang
 * @Date: 2018-01-04 15:04:14
 * @Title: 分配用户
 */
import React, { Component } from 'react'
import { Form, Select, Modal } from 'antd'
import api from 'Src/contants/api'

const FormItem = Form.Item
const Option = Select.Option

class BindUsers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [],
      confirmLoading: false, // 对话框按钮加载状态
      roleData: null, // 角色信息
      bindUsersVisible: false,
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      bindUsersVisible: props.bindUsersVisible
    })
  }

// 对话框确认
  handleOk = (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          confirmLoading: true,
        })
        const { roleData } = this.props
        const userIds = values.userIds.map(function (item) {
          return item.key
        })
        const data = await api.oauthMsg.roleMsg.bindUsers({ userIds, roleId: roleData.roleId })
        this.setState({
          confirmLoading: false
        })
        if (data) {
          this.props.hideBindUsersModal()
          this.props.form.resetFields()
          this.setState({ options: null })
        }
      }
    })
  }
// 对话框取消
  handleCancel = (e) => {
    e.preventDefault()
    this.props.hideBindUsersModal()
    this.props.form.resetFields()
    this.setState({ options: null })
  }

  handleSearch = (value) => {
    value && this._loadData(value)
  }
  async _loadData(lastName) {
    const dataAddress = await api.oauthMsg.roleMsg.searchUser({ lastName }) || []
    let options = []
    options = dataAddress && dataAddress.map((item) => {
      return <Option key={item.id}>{item.lastName}-{item.dptName}</Option>
    })
    console.log(options)
    this.setState({ options })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { confirmLoading, options, bindUsersVisible } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    }
    return <div>
      <Modal title={'分配用户'}
             visible={bindUsersVisible}
             confirmLoading={confirmLoading}
             onOk={this.handleOk}
             onCancel={this.handleCancel}>
        <Form style={{ marginBottom: '10px' }}>
          <FormItem
            label='用户名'
            {...formItemLayout}>
            {getFieldDecorator('userIds', {
              initialValue: [],
              rules: [{
                type: 'array', required: true, message: '请输入用户名'
              }]
            })(
              <Select
                mode={'multiple'}
                style={{ width: 300 }}
                labelInValue
                filterOption={false}
                onSearch={this.handleSearch}
                defaultActiveFirstOption={true}
                allowClear={true}
              >
                {options}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  }
}

export default Form.create()(BindUsers)
