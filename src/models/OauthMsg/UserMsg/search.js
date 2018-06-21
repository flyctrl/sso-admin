/**
 * @Author: sunshiqiang
 * @Date: 2017-12-29 14:16:27
 * @Title: 查询
 */

import React, { Component } from 'react'
import { Form, Input, Button, Select } from 'antd'
import api from 'Src/contants/api'

const FormItem = Form.Item
const Option = Select.Option

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [],
    }
  }
  componentWillMount() {
    this._loadDataAddress()
  }
  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log(values)
        this.props.handleSearch(values)
      }
    })
  }
  async _loadDataAddress() {
    const dataAddress = await api.oauthMsg.userMsg.getAllSites() || []
    let options = []
    options = dataAddress && dataAddress.map((item) => {
      return <Option key={item.id}>{item.siteName}</Option>
    })
    this.setState({ options })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { options } = this.state
    return (
      <Form layout={'inline'}
            onSubmit={this.handleSearch}>
        <FormItem
          label='姓名'>
          {getFieldDecorator('lastName2', {
            initialValue: ''
          })(
            <Input
              style={{ width: 200 }}
              type={'text'}
            />
          )}
        </FormItem>
        <FormItem
          label='分管系统'>
          {getFieldDecorator('id', {
            initialValue: ''
          })(
            <Select style={{ width: 200 }}>
              <Option value={''}>全部</Option>
              {options}
            </Select>
          )}
        </FormItem>
        <Button type='primary' htmlType='submit'>查询</Button>
      </Form>
    )
  }
}

export default Form.create()(Search)
