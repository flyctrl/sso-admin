/*
* @Author: chengbs
* @Date:   2018-01-19 16:49:03
* @Last Modified by:   chengbs
* @Last Modified time: 2018-01-31 17:51:21
*/

import React, { Component } from 'react'
import { Form, Input, Button, Row, Col, DatePicker, Table } from 'antd'
import moment from 'moment'
import api from 'Src/contants/api'

const FormItem = Form.Item
class LogWatch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
      params: {},
      tableList: {} // 表格信息
    }
  }

  // 加载列表
  async _loadList(params = {}) {
    const tableList = await api.oauthMsg.OauthMsg.query({
      ...params,
      ...{ pageSize: '10', page: params.currentPage || '1' }
    }) || []
    this.setState({ tableList, params })
  }
  // 分页切换
  handlePaginationChange = (currentPage) => {
    this._loadList({ ...this.state.params, currentPage })
  }

  // 搜索列表
  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this._loadList({
          ...values, ...{ startTime: values.startTime.valueOf(), endTime: values.endTime.valueOf() }
        })
      }
    })
  }

  // 日期选择
  // (5 * 24 * 60 * 60 * 1000) = 5天
  diffTime = (difftime) => { // 与现在时间对比时分秒， 是否大于现在时间，（大于返回true）时间格式HH:mm:ss 24小时制
    let nowDate = new Date()
    let nowHour = nowDate.getHours()
    let nowMin = nowDate.getMinutes()
    let nowSec = nowDate.getSeconds()
    if (difftime.split(':')[0] > nowHour) {
      return true
    } else if (difftime.split(':')[0] === nowHour) {
      if (difftime.split(':')[1] > nowMin) {
        return true
      } else if (difftime.split(':')[1] === nowMin) {
        if (difftime.split(':')[2] > nowSec) {
          return true
        } else if (difftime.split(':')[2] === nowSec) {
          return false
        }
      }
    }
    return false
  }
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue
    if (startValue && !endValue) {
      return startValue > moment().endOf('day')
    } else if (startValue && endValue) {
      return startValue.valueOf() > endValue.valueOf() + (24 * 60 * 60 * 1000) || startValue.valueOf() <= endValue.valueOf() - (4 * 24 * 60 * 60 * 1000)
    } else if (!startValue || !endValue) {
      return false
    }
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue
    if (endValue && !startValue) {
      return endValue > moment().endOf('day')
    } else if (endValue && startValue) {
      if (this.diffTime(startValue.format('YYYY-MM-DD HH:mm:ss').split(' ')[1])) {
        return endValue.valueOf() <= startValue.valueOf() - (12 * 60 * 60 * 1000) || endValue > moment().endOf('day') || endValue.valueOf() >= startValue.valueOf() + (4 * 24 * 60 * 60 * 1000)
      } else {
        return endValue.valueOf() <= startValue.valueOf() || endValue > moment().endOf('day') || endValue.valueOf() >= startValue.valueOf() + (5 * 24 * 60 * 60 * 1000)
      }
    } else if (!endValue || !startValue) {
      return false
    }
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    })
  }

  onStartChange = (value) => {
    this.onChange('startValue', value)
  }

  onEndChange = (value) => {
    this.onChange('endValue', value)
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  }

  handleEndOpenChange = (open) => {
    let startVal = 0
    if (this.state.startValue) {
      startVal = this.state.startValue.valueOf() + 5 * 24 * 60 * 60 * 1000
    }
    if (this.props.form.getFieldValue('endTime') && this.props.form.getFieldValue('endTime').valueOf() > startVal) {
      this.props.form.setFieldsValue({ 'endTime': null })
      return false
    }
    this.setState({ endOpen: open })
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    const { getFieldDecorator } = this.props.form
    const { tableList, endOpen } = this.state
    const columns = [
      {
        title: '系统名称',
        dataIndex: 'siteName',
        key: 'siteName'
      },
      {
        title: '请求时间',
        dataIndex: 'logTime',
        key: 'logTime',
      },
      {
        title: '请求用户',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: 'IP',
        dataIndex: 'ip',
        key: 'ip',
      },
      {
        title: 'MAC地址',
        dataIndex: 'mac',
        key: 'mac',
      },
      {
        title: '请求菜单',
        dataIndex: 'controller',
        key: 'controller',
      },
      {
        title: '请求功能',
        dataIndex: 'functionName',
        key: 'functionName',
      }
    ]
    return (
      <div>
        <Form onSubmit={this.handleSearch.bind(this)}>
          <Row>
            <Col span={8}>
              <FormItem { ...formItemLayout } label={'起始时间'}>
                {getFieldDecorator('startTime', {
                  rules: [{
                    required: true, message: '请选择起始时间',
                  }]
                })(
                  <DatePicker
                    disabledDate={this.disabledStartDate}
                    showTime
                    format='YYYY-MM-DD HH:mm:ss'
                    placeholder='起始时间'
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem { ...formItemLayout } label={'结束时间'}>
                {getFieldDecorator('endTime', {
                  rules: [{
                    required: true, message: '请选择结束时间',
                  }]
                })(
                  <DatePicker
                    disabledDate={this.disabledEndDate}
                    showTime
                    format='YYYY-MM-DD HH:mm:ss'
                    placeholder='结束时间'
                    onChange={this.onEndChange}
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='请求菜单'
              >
                {getFieldDecorator('controller')(
                  <Input placeholder='请输入请求菜单' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='请求功能'
              >
                {getFieldDecorator('functionName')(
                  <Input placeholder='请输入请求功能' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='请求用户'
              >
                {getFieldDecorator('userName')(
                  <Input placeholder='请输入请求用户' />
                )}
              </FormItem>
            </Col>
            <Col span={6} offset={2}>
              <Button type='primary' htmlType='submit' style={ { width: '50%' } }>查 询</Button>
            </Col>
          </Row>
          <Row>
            <Table
            columns={columns}
            rowKey='id'
            dataSource={tableList.logs}
            pagination={{
              showQuickJumper: true,
              total: tableList.count,
              onChange: this.handlePaginationChange,
              pageSize: 10,
              current: tableList.nowpage || 1
            }}/>
          </Row>
        </Form>
      </div>
    )
  }
}

export default Form.create()(LogWatch)
