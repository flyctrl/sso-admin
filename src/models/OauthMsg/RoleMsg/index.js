import React, { Component } from 'react'
import BindUsers from './bindUsers'
import api from 'Src/contants/api'
import { Table, Button, Row, Modal, Form, Input, Select, TreeSelect, Tree, Dropdown, Menu, Popconfirm } from 'antd'
import tooler from 'Contants/tooler'
import styles from './style.css'

const FormItem = Form.Item
const Option = Select.Option
const SHOW_PARENT = TreeSelect.SHOW_PARENT
const TreeNode = Tree.TreeNode
const Search = Input.Search

class RoleMsg extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stopIds: [], // 选中的禁用的IDS
      startIds: [], // 选中的启用的IDS
      selectedRowKeys: [], // 选中的全部数据
      tableList: {}, // 表格信息
      visible: false, // 对话框默认隐藏
      bindUsersVisible: false, // 分配用户对话框默认隐藏
      confirmLoading: false, // 对话框按钮加载状态
      roleData: null, // 角色信息
      roleName: '' // 搜索信息
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
  showModal = (e, roleData) => {
    e.preventDefault()
    this.props.form.resetFields()
    this.setState({
      visible: true,
      roleData
    })
  }

  hideBindUsersModal = () => {
    this.setState({ bindUsersVisible: false })
  }
  showBindUsersModal = (e, roleData) => {
    e.preventDefault()
    this.setState({
      bindUsersVisible: true,
      roleData
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
        const { roleData } = this.state
        let data = false
        if (roleData) {
          data = await api.oauthMsg.roleMsg.update({ ...values, roleId: roleData.roleId })
        } else {
          data = await api.oauthMsg.roleMsg.add(values)
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
  // 分页切换
  handlePaginationChange = (currentPage) => {
    this._loadList({ currentPage })
  }

  // 表格选择
  handleSelectChange = (selectedRowKeys, selectedRows) => {
    const [startIds, stopIds] = [[], []]
    selectedRows.forEach((item) => {
      if (item.status === '0') {
        stopIds.push(item.roleId)
      }
      if (item.status === '1') {
        startIds.push(item.roleId)
      }
    })
    this.setState({ startIds, stopIds, selectedRowKeys })
  }

  // 状态变化
  handleStatus = async (e, status) => {
    e.preventDefault()
    let { stopIds, startIds, selectedRowKeys } = this.state
    const ids = [startIds, stopIds][status]
    const data = await api.oauthMsg.roleMsg.updateStatus({ status, ids })
    if (data) {
      if (status === '1') {
        stopIds = []
        selectedRowKeys = startIds
      }
      if (status === '0') {
        startIds = []
        selectedRowKeys = stopIds
      }
      this.setState({ stopIds, startIds, selectedRowKeys })
      this._loadList()
    }
  }

  // 删除
  handleDel = async (e, roleId) => {
    e.preventDefault()
    await api.oauthMsg.roleMsg.del({ roleId })
    this._loadList()
  }
  // 加载列表
  _loadList = async (params = {}) => {
    const tableList = await api.oauthMsg.roleMsg.lists({
      roleName: params.roleName !== undefined ? params.roleName : this.state.roleName,
      pagesize: params.pagesize || '10',
      page: params.currentPage || '1',
    }) || {}
    this.setState({ tableList })
  }
  // 过滤左边空格
  _filterLtrim = (key) => {
    const { setFieldsValue } = this.props.form
    return (value) => {
      const oldValue = value
      const newValue = tooler.ltrim(value)
      if (newValue.length !== oldValue.length) {
        setFieldsValue({ [key]: newValue })
      }
      return newValue
    }
  }

  // 过滤所有空格
  _filterTrim = (key) => {
    const { setFieldsValue } = this.props.form
    return (value) => {
      const oldValue = value
      const newValue = tooler.trim(value)
      console.log(oldValue, newValue, newValue.length !== oldValue.length)
      if (newValue.length !== oldValue.length) {
        setFieldsValue({ [key]: newValue })
      }
      return newValue
    }
  }
  // 筛选选择的树节点
  _selectTree = (data, text) => {
    const loop = (data) => {
      return data.map((item, index, arr) => {
        if (item.children && item.children.length > 0) {
          if (text.indexOf(item.value) > -1) {
            return true
          }
          return loop(item.children).indexOf(true) > -1
        } else {
          return text.indexOf(item.value) > -1
        }
      })
    }
    const dataMap = loop(data)
    const result = []
    dataMap.forEach((item, index) => {
      item && result.push(data[index])
    })
    return result
  }
// 加载树状态图
  _loopTree = (data, text) => {
    const loop = (data) => {
      return data.map((item) => {
        if (item.children && item.children.length > 0) {
          return <TreeNode title={item.label} key={item.value}
                           disableCheckbox>{loop(item.children)}</TreeNode>
        }
        return <TreeNode title={item.label} key={item.value} disableCheckbox/>
      })
    }
    return loop(this._selectTree(data, text))
  }

  render() {
    const { tableList, startIds, stopIds, visible, bindUsersVisible, confirmLoading, roleData, selectedRowKeys } = this.state
    const { getFieldDecorator } = this.props.form
    let { oauthList } = this.props
    oauthList = oauthList[0] && oauthList[0].children || []
    const tProps = {
      treeData: oauthList,
      multiple: true,
      placeholder: '请选择',
      treeCheckable: true,
      readonly: true,
      showCheckedStrategy: SHOW_PARENT,
      dropdownMatchSelectWidth: false,
      treeNodeFilterProp: 'label',
      style: {
        width: 280,
        height: 32,
        overflow: 'auto'
      },
      dropdownStyle: {
        maxHeight: 400,
        overflow: 'auto'
      }
    }
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
      title: '操作',
      dataIndex: 'active',
      key: 'active',
      width: 170,
      fixed: 'left',
      render: (text, record) => [1, 2].indexOf(record.roleId) === -1 ? <span>
        <Button type='primary'
                style={{ marginRight: '10px' }}
                size='small'
                onClick={e => this.showModal(e, record)}>编辑</Button>
        <Popconfirm placement='topLeft' title={'是否确认删除角色：' + record.roleName}
                    onConfirm={e => this.handleDel(e, record.roleId)} okText='确认' cancelText='取消'>
        <Button type='primary'
                style={{ marginRight: '10px' }}
                size='small'>删除</Button>
        </Popconfirm>
        <Button type='primary'
                size='small'
                onClick={e => this.showBindUsersModal(e, record)}>分配</Button>
      </span> : null
    }, {
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => <span>{['禁用', '启用'][text]}</span>
    }, {
      title: '  权限',
      dataIndex: 'powerIds',
      key: 'powerIds',
      render: (text, record) => {
        const len = this._loopTree(oauthList, text).length
        return <Dropdown
          overlay={len ? (<Menu
            style={{ maxHeight: '400px', overflow: 'auto' }}><Tree
            style={{
              maxHeight: 400,
              overflow: 'auto'
            }}
            expandedKeys={text}
            selectedKeys={text}
            checkedKeys={text}
            checkable={true}>{this._loopTree(oauthList, text)}</Tree></Menu>) : (
            <Menu><Menu.Item>没有</Menu.Item></Menu>)}>
          <span style={{ color: '#108ee9', cursor: 'pointer' }}>
            查看
          </span>
        </Dropdown>
      }
    }, {
      title: '备注',
      dataIndex: 'roleDesc',
      key: 'roleDesc',
      render: (text, record) => <span title={text}>{tooler.replaceChar(text, 20, '...')}</span>
    }, {
      title: '创建时间',
      dataIndex: 'gmtCreated',
      key: 'gmtCreated',
    }, {
      title: '更新时间',
      dataIndex: 'gmtModified',
      key: 'gmtModified',
    }, {
      title: '创建者',
      dataIndex: 'userName',
      key: 'userName',
    }]
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectChange,
    }
    return (
      <div>
        <BindUsers roleData={roleData} bindUsersVisible={bindUsersVisible}
                   hideBindUsersModal={this.hideBindUsersModal}/>
        <Modal title={roleData ? '编辑角色' : '新增角色'}
               visible={visible}
               confirmLoading={confirmLoading}
               onOk={this.handleOk}
               onCancel={this.handleCancel}>
          <Form style={{ marginBottom: '10px' }}>
            <FormItem
              label='角色'
              {...formItemLayout}>
              {getFieldDecorator('roleName', {
                initialValue: roleData ? roleData.roleName : '',
                rules: [{
                  required: true,
                  pattern: /^[\u4e00-\u9fa5A-Za-z0-9]{1,20}$/,
                  message: '角色信息仅支持中文、英文、数字，不支持字符小于20个字',
                  transform: this._filterTrim('roleName'),
                }],
              })(
                <Input
                  style={{ width: 280 }}
                  placeholder='请输入角色名称'
                  type={'text'}
                />
              )}
            </FormItem>
            {roleData ? <FormItem
              label='状态'
              {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: roleData ? roleData.status : '1',
              })(
                <Select style={{ width: 280 }}>
                  <Option value='1'>启用</Option>
                  <Option value='0'>禁用</Option>
                </Select>
              )}
            </FormItem> : null}
            <FormItem
              label='权限'
              {...formItemLayout}>
              {getFieldDecorator('powerIds', {
                initialValue: roleData ? roleData.powerIds : [],
                rules: [{
                  required: true,
                  message: '不能为空',
                  type: 'array'
                }],
              })(
                <TreeSelect
                  className={styles.roleSelect}
                  {...tProps}
                />
              )}
            </FormItem>
            <FormItem
              label='备注'
              {...formItemLayout}>
              {getFieldDecorator('roleDesc', {
                initialValue: roleData ? roleData.roleDesc : '',
                rules: [{
                  required: true,
                  message: '不能为空',
                  transform: this._filterLtrim('roleDesc'),
                }],
              })(
                <Input
                  style={{ width: 280 }}
                  type='textarea'
                  maxLength={50}
                  placeholder={'最大输入50个字'}
                  rows={4}
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
            <Button type='primary'
                    style={{ marginRight: '10px' }}
                    disabled={stopIds.length === 0}
                    onClick={e => this.handleStatus(e, '1')}
                    size={'default'}>启用</Button>
            <Button type='primary'
                    style={{ marginRight: '10px' }}
                    disabled={startIds.length === 0}
                    size={'default'}
                    onClick={e => this.handleStatus(e, '0')}>禁用</Button>
          </div>
          <div style={{ float: 'right' }}>
            <label htmlFor='search'>角色名称：</label>
            <Search
              id={'search'}
              style={{ width: 200 }}
              onSearch={this.handelSearch}
            />
          </div>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <Table
            scroll={{ x: 1100 }}
            rowSelection={rowSelection}
            columns={columns}
            rowKey='roleId'
            dataSource={tableList.datas}
            pagination={{
              showQuickJumper: true,
              total: tableList.total,
              onChange: this.handlePaginationChange,
              pageSize: tableList.pageSize || 10,
              current: tableList.currPageNo
            }}/>
        </Row>
      </div>
    )
  }
}

export default Form.create()(RoleMsg)

