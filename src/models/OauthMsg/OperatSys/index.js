/*
* @Author: chengbs
* @Date:   2018-01-03 16:11:12
* @Last Modified by:   chengbs
* @Last Modified time: 2018-04-24 14:09:12
*/

import React, { Component } from 'react'
import { Table, Button, Row, Col, Form, Input, Select, Popconfirm } from 'antd'
import EditOperatForm from './editOperatForm'
import api from 'Src/contants/api'

const FormItem = Form.Item
const Option = Select.Option
class OperatSys extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      unstartIds: [], // 选中的禁用的IDS
      startIds: [], // 选中的启用的IDS
      selectedRowKeys: [], // 选中的全部数据
      tableList: {
        page: {},
        datas: []
      }, // 表格信息
      editId: '', // 编辑表格时候的Id
      srcType: '', // 用户的类型
      editData: { isEdit: false }, // 需要编辑的数据
      searchData: {} // 搜索的数据
    }
  }

  componentWillMount() {
    this._loadList()
  }

  // 对话框显示
  showModal = () => {
    this.setState({
      visible: true,
      editData: { isEdit: false }
    })
  }
  // 对话框关闭
  handleCancel = () => {
    this.setState({
      visible: false,
      searchData: {}
    })
    this._loadList()
  }

  // 分页切换
  handlePaginationChange = (currentPage) => {
    this._loadList({ ...this.state.searchData, ...{ currentPage: currentPage }})
  }

  // 表格选择
  handleSelectChange = (selectedRowKeys, selectedRows) => {
    const [startIds, unstartIds] = [[], []]
    selectedRows.forEach((item) => {
      if (parseInt(item.status) === 0) {
        unstartIds.push(parseInt(item.id))
      }
      if (parseInt(item.status) === 1) {
        startIds.push(parseInt(item.id))
      }
    })
    this.setState({ startIds, unstartIds, selectedRowKeys })
  }

  handleEidt(editData) {
    this.setState({
      visible: true,
      editData: editData
    })
  }

  async handleDelete(uid, siteId) {
    await api.oauthMsg.operatSys.del({ uid: uid, siteId: siteId })
    this._loadList({}, this.state.selectedRowKeys)
  }

  // 修改状态事件
  // 批量启用
  async handleStartStu() {
    await api.oauthMsg.operatSys.status({ ids: this.state.unstartIds, status: 1 })
    this._loadList({}, this.state.startIds)
    this.setState({ unstartIds: [] })
  }
  // 批量禁用
  async handleDisableStu() {
    await api.oauthMsg.operatSys.status({ ids: this.state.startIds, status: 0 })
    this._loadList({}, this.state.unstartIds)
    this.setState({ startIds: [] })
  }

  // 加载列表
  async _loadList(params = {}, selectedRowKeys = this.state.selectedRowKeys) {
    const tableList = await api.oauthMsg.operatSys.lists({
      ...params,
      ...{ pageSize: '10', currentPage: params.currentPage || '1' }
    }) || []
    this.setState({ tableList, selectedRowKeys })
  }

  // 搜索列表
  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let searchData = values
        this.setState({ searchData })
        this._loadList({
          ...values
        }, this.state.selectedRowKeys)
      }
    })
  }

  render() {
    const { tableList, startIds, unstartIds, selectedRowKeys } = this.state
    const { getFieldDecorator } = this.props.form
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
    const columns = [{
      title: '操作',
      widt: 100,
      fixed: 'left',
      dataIndex: 'active',
      key: 'active',
      render: (text, record) => {
        return (
          <div>
            <Button type='primary'
                    style={{ marginRight: '10px' }}
                    size={'small'}
                    onClick={this.handleEidt.bind(this, { id: record.id, lastName: record.lastName, dptName: record.dptName, uid: record.uid, siteName: record.siteName, siteId: record.siteId, desc: record.desc, isEdit: true })}>编辑</Button>
            <Popconfirm placement='topLeft' title={'是否确认删除管理员：' + record.lastName} onConfirm={this.handleDelete.bind(this, record.uid, record.siteId)} okText='确认' cancelText='取消'>
              <Button type='primary'
                    size={'small'}>删除</Button>
            </Popconfirm>
          </div>
        )
      }
    }, {
      title: '业务系统名称',
      dataIndex: 'siteName',
      key: 'siteName',
    }, {
      title: '子系统管理员',
      dataIndex: 'lastName',
      key: 'lastName',
    }, {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '所在部门',
      dataIndex: 'dptName',
      key: 'dptName',
    }, {
      title: '创建时间',
      dataIndex: 'gmtCreated',
      key: 'gmtCreated'
    }, {
      title: '最后修改时间',
      dataIndex: 'gmtModified',
      key: 'gmtModified',
    }, {
      title: '修改人',
      dataIndex: 'createUserName',
      key: 'createUserName',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        return ['禁用', '启用'][parseInt(text)]
      }
    }, {
      title: '备注',
      dataIndex: 'desc',
      key: 'desc',
    }]
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectChange,
    }
    return (
      <div>
        <Form onSubmit={this.handleSearch.bind(this)}>
          <Row>
            <Col span={7}>
              <FormItem { ...formItemLayout } label={'业务系统名称'}>
                {getFieldDecorator('siteName')(
                  <Input placeholder='请输入业务系统名称' />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem { ...formItemLayout } label={'子系统管理员'}>
                {getFieldDecorator('userName')(
                  <Input placeholder='请输入子系统管理员' />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                {...formItemLayout}
                label='启用状态'
              >
                {getFieldDecorator('status')(
                  <Select placeholder='请选择状态'>
                    <Option value=''>全部</Option>
                    <Option value='1'>启用</Option>
                    <Option value='0'>禁用</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col>
              <Button type='primary' htmlType='submit' style={{ display: 'none' }} />
            </Col>
          </Row>
        </Form>
        <Row style={{ marginBottom: '10px' }}>
          <Button type='primary'
                  style={{ marginRight: '10px' }}
                  onClick={this.showModal}
                  size={'default'}>新增</Button>
          <Button type='primary'
                  style={{ marginRight: '10px' }}
                  disabled={unstartIds.length === 0}
                  onClick={this.handleStartStu.bind(this)}
                  size={'default'}>启用</Button>
          <Button type='primary'
                  style={{ marginRight: '10px' }}
                  disabled={startIds.length === 0}
                  onClick={this.handleDisableStu.bind(this)}
                  size={'default'}>禁用</Button>
          <Button type='primary'
                  style={{ marginRight: '10px' }}
                  onClick={this.handleSearch.bind(this)}
                  size={'default'}>查询</Button>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            rowKey='id'
            dataSource={tableList.datas}
            scroll={{ x: 1300 }}
            pagination={{
              showQuickJumper: true,
              total: tableList.total,
              onChange: this.handlePaginationChange,
              pageSize: 10,
              current: tableList.currPageNo || 1
            }}/>
        </Row>
        { !this.state.visible ? null : (<EditOperatForm handleCancel={this.handleCancel.bind(this)} visible={this.state.visible} editData={this.state.editData} />) }
      </div>
    )
  }
}

export default Form.create()(OperatSys)
