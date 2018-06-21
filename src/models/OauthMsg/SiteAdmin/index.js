/**
 * @Author: sunshiqiang
 * @Date: 2018-04-09 15:35:43
 * @Title: 站点管理
 */

import React, { Component } from 'react'
import api from 'Src/contants/api'
import { Table, Button, Row, Modal, Form, Input, Popconfirm } from 'antd'
import tooler from 'Contants/tooler'

const FormItem = Form.Item

class SiteAdmin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tableList: {}, // 表格信息
      visible: false, // 对话框默认隐藏
      confirmLoading: false, // 对话框按钮加载状态
      siteData: null, // 角色信息
    }
  }

  componentWillMount() {
    this._loadList()
  }

  // 搜索查询
  handelSearch = (roleName) => {
    this.setState({ roleName })
    this._loadList({ roleName })
  }

  // 对话框显示
  showModal = (e, siteData) => {
    e.preventDefault()
    this.props.form.resetFields()
    this.setState({
      visible: true,
      siteData
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
        const { siteData } = this.state
        let data = false
        if (siteData) {
          data = await api.oauthMsg.SiteAdmin.update({ ...values, siteId: siteData.siteId })
        } else {
          data = await api.oauthMsg.SiteAdmin.add(values)
        }
        this.setState({
          confirmLoading: false,
        })
        data && this.setState({
          visible: false,
        })
        this._loadList()
      }
    })
  }
  // 对话框取消
  handleCancel = (e) => {
    e.preventDefault()
    this.setState({
      visible: false,
    })
  }

  // 删除
  handleDel = async (e, siteId) => {
    e.preventDefault()
    await api.oauthMsg.SiteAdmin.del({ siteIds: [siteId] })
    this._loadList()
  }
  // 加载列表
  _loadList = async (currentPage = 1) => {
    const tableList = await api.oauthMsg.SiteAdmin.lists({
      pageSize: '10',
      currentPage
    }) || {}
    this.setState({ tableList })
  }
// 过滤所有空格
  _filterTrim = (key) => {
    const { setFieldsValue } = this.props.form
    return (value = '') => {
      const oldValue = value
      const newValue = tooler.trim(value)
      console.log(oldValue, newValue, newValue.length !== oldValue.length)
      if (newValue.length !== oldValue.length) {
        setFieldsValue({ [key]: newValue })
      }
      return newValue
    }
  }

  render() {
    const { tableList, visible, confirmLoading, siteData } = this.state
    const { getFieldDecorator } = this.props.form
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
    const columns = [{
      title: <span style={{ marginLeft: '10px' }}>操作</span>,
      dataIndex: 'active',
      key: 'active',
      width: 130,
      fixed: 'left',
      render: (text, record) => <span>
        <Button type='primary'
                style={{ marginLeft: '10px' }}
                size='small'
                onClick={e => this.showModal(e, record)}>编辑</Button>
            <Popconfirm placement='topLeft' title={'是否确认删除站点'}
                    onConfirm={e => this.handleDel(e, record.siteId)} okText='确认' cancelText='取消'>
              <Button type='primary'
                      size='small'
                      style={{ marginLeft: '10px' }}
              >删除</Button>
            </Popconfirm>
      </span>
    }, {
      title: '站点名称',
      dataIndex: 'siteName',
      key: 'siteName',
    }, {
      title: '站点ID',
      dataIndex: 'siteId',
      key: 'siteId',
    }, {
      title: '站点KEY',
      dataIndex: 'siteKey',
      key: 'siteKey',
    }, {
      title: '前端域名',
      dataIndex: 'jumpUrl',
      key: 'jumpUrl',
      render: (text, record) => <span title={text}>{tooler.replaceChar(text, 20, '...')}</span>
    }, {
      title: '站点地址',
      dataIndex: 'siteUrl',
      key: 'siteUrl',
      render: (text, record) => <span title={text}>{tooler.replaceChar(text, 20, '...')}</span>
    }, {
      title: '创建人',
      dataIndex: 'createUserName',
      key: 'createUserName',
    }, {
      title: '创建时间',
      dataIndex: 'gmtCreated',
      key: 'gmtCreated',
    }, {
      title: '最后修改人',
      dataIndex: 'modifyUserName',
      key: 'modifyUserName',
    }, {
      title: '修改时间',
      dataIndex: 'gmtModified',
      key: 'gmtModified',
    }]
    return (
      <div>
        <Modal title={siteData ? '编辑站点' : '新增站点'}
               visible={visible}
               confirmLoading={confirmLoading}
               onOk={this.handleOk}
               onCancel={this.handleCancel}>
          <Form style={{ marginBottom: '10px' }}>
            <FormItem
              label='站点名称'
              {...formItemLayout}>
              {getFieldDecorator('siteName', {
                initialValue: siteData ? siteData.siteName : '',
                rules: [{
                  required: true,
                  message: '请输入站点名称',
                  transform: this._filterTrim('siteName'),
                }],
              })(
                <Input
                  style={{ width: 280 }}
                  placeholder='请输入站点名称'
                  maxLength={20}
                  type={'text'}
                  disabled={!!siteData}
                />
              )}
            </FormItem>
            <FormItem
              label='前端域名'
              {...formItemLayout}>
              {getFieldDecorator('jumpUrl', {
                initialValue: siteData ? siteData.jumpUrl : '',
                rules: [{
                  required: true,
                  message: '请输入前端域名',
                  transform: this._filterTrim('jumpUrl'),
                }],
              })(
                <Input
                  style={{ width: 280 }}
                  placeholder='请输入前端域名'
                  maxLength={149}
                  type={'text'}
                />
              )}
            </FormItem>
            <FormItem
              label='站点地址'
              {...formItemLayout}>
              {getFieldDecorator('siteUrl', {
                initialValue: siteData ? siteData.siteUrl : '',
                rules: [{
                  required: true,
                  message: '请输入站点地址',
                  transform: this._filterTrim('siteUrl'),
                }],
              })(
                <Input
                  style={{ width: 280 }}
                  placeholder='请输入站点地址'
                  maxLength={149}
                  type={'text'}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
        <Row style={{ marginBottom: '10px' }}>
          <div style={{ float: 'left' }}>
            <Button type='primary'
                    style={{ marginRight: '10px' }}
                    onClick={e => this.showModal(e, '')}
                    size={'default'}>新增</Button>
          </div>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <Table
            scroll={{ x: 1500 }}
            columns={columns}
            rowKey='siteId'
            dataSource={tableList.siteInfoVo}
            pagination={{
              showQuickJumper: true,
              total: tableList.page ? tableList.page.totalRowsAmount : '',
              onChange: this._loadList,
              pageSize: 10,
              current: tableList.page ? tableList.page.currentPage : ''
            }}/>
        </Row>
      </div>
    )
  }
}

export default Form.create()(SiteAdmin)
