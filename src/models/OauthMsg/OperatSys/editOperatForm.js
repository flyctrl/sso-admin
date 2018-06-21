/*
* @Author: chengbs
* @Date:   2018-01-04 16:01:44
* @Last Modified by:   chengbs
* @Last Modified time: 2018-01-08 18:10:26
*/
import React, { Component } from 'react'
import { Form, Select, Input, Button, Modal } from 'antd'
import api from 'Src/contants/api'
const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
}

class EditOperatForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      adminOptions: [],
      sysData: []
    }
  }
  handleCancel() {
    this.props.handleCancel()
    this.props.form.resetFields()
  }
  handleReset = () => {
    this.props.form.resetFields()
  }
  async _loaduserList(value) {
    const userList = await api.oauthMsg.operatSys.searchUser({
      lastName: value
    }) || []
    const adminOptions = userList.map(d => <Option key={d.id}>{d.lastName + '-' + d.dptName}</Option>)
    this.setState({ adminOptions })
  }
  handleChange = (value) => {
    if (value) {
      this.setState({ adminData: [] })
      this._loaduserList(value)
    } else {
      return
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        if (this.props.editData['isEdit']) { // 编辑模式
          const res = await api.oauthMsg.operatSys.update({ ...values, ...{ uid: values.uid['key'], id: this.props.editData['id'] }}) || false
          if (res) {
            this.props.handleCancel()
          }
        } else { // 新增模式
          const res = await api.oauthMsg.operatSys.add({ ...values, ...{ uid: values.uid['key'] }}) || false
          if (res) {
            this.props.handleCancel()
          }
        }
      }
    })
  }
  async _loadList() {
    const tablelist = await api.oauthMsg.operatSys.getAllSites({}) || []
    if (tablelist) {
      this.setState({ sysData: tablelist })
    }
  }
  componentWillMount() {
    if (this.props.editData['isEdit']) {
      const adminOptions = <Option key={this.props.editData['uid']}>{this.props.editData['lastName'] + '-' + this.props.editData['dptName']}</Option>
      this.setState({ adminOptions })
    }
  }
  componentDidMount() {
    this._loadList()
    const _t = this
    if (this.props.editData['isEdit']) {
      this.props.form.setFieldsValue({
        uid: { key: _t.props.editData['uid'].toString(), label: _t.props.editData['lastName'] + '-' + _t.props.editData['dptName'] },
        siteId: this.props.editData['siteId'],
        siteDesc: this.props.editData['desc']
      })
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const sysOptions = this.state.sysData.map(d => <Option key={d.id}>{d.siteName}</Option>)
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    }
    return (
      <Modal
          visible={this.props.visible}
          onCancel={this.handleCancel.bind(this)}
          title={'业务系统配置'}
          footer={null}
        >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label='业务系统名称'
          >
          {getFieldDecorator('siteId', {
            rules: [{ required: true, message: '请选择业务系统名称' }]
            // initialValue: this.props.editData ? this.props.editData['siteId'] : null
          })(
            <Select
              placeholder='请选择业务系统名称'
            >
              {sysOptions}
            </Select>
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='系统管理员'
          >
          {getFieldDecorator('uid', {
            rules: [{ required: true, message: '请搜索管理员名称' }]
            // initialValue: () => { this.props.editData ? { key: this.props.editData['uid'].toString(), label: this.props.editData['lastName'] + '-' + this.props.editData['dptName'] } : null }
          })(
            <Select
              showSearch={true}
              placeholder='请搜索系统管理员'
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              labelInValue
              onSearch={this.handleChange.bind(this)}
            >
              {this.state.adminOptions}
            </Select>
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='备 注'
          >
            {getFieldDecorator('siteDesc', {
              rules: [{ max: 30, message: '超过30个字符' }]
            })(
              <Input placeholder='请输入备注' type='textarea' />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type='primary' style={{ marginRight: 10 }} htmlType='submit'>保 存</Button>
            <Button type='primary' style={{ marginRight: 10 }} onClick={this.props.handleCancel.bind(this)}>取 消</Button>
            <Button type='primary' style={{ marginRight: 10 }} onClick={this.handleReset.bind(this)}>重 置</Button>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(EditOperatForm)
