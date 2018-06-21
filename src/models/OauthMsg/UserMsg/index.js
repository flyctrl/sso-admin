import React, { Component } from 'react'
import { Table, Button, Row, Modal, Form, Input, Select, Popconfirm } from 'antd'
import tooler from 'Src/contants/tooler'
import api from 'Src/contants/api'
import Search from './search'
import storage from 'Util/storage'

const FormItem = Form.Item
const Option = Select.Option

// const { TextArea } = Input
class UserMsg extends Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [], // 角色列表
      searchParams: {},
      unstartIds: [], // 选中的禁用的IDS
      startIds: [], // 选中的启用的IDS
      selectedRowKeys: [], // 选中的全部数据
      tableList: {
        page: {},
        userInfoVos: []
      }, // 表格信息
      // checkOptions: [], // 角色数据
      visible: false, // 对话框默认隐藏
      editId: '', // 编辑表格时候的Id
      srcType: '', // 用户的类型
      editData: {
        userName: '',
        lastName: '',
        roleIds: [],
        phone: '',
        memo: ''
      }, // 编辑时候的数据
    }
  }

  componentWillMount() {
    // this._loadRoleList()
    this._loadList()
  }

  // 对话框显示
  showModal = () => {
    this.props.form.resetFields()
    this.setState({
      visible: true
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
  // 查询信息
  handleSearch = (searchParams) => {
    searchParams = {
      id: searchParams.id,
      lastName: searchParams.lastName2
    }
    this.setState({ searchParams })
    this._loadList(searchParams)
  }

  // 查询角色
  handleSearchRole = (roleName) => {
    roleName && this._loadData(roleName)
  }

  async _loadData(roleName) {
    const dataAddress = await api.oauthMsg.roleMsg.lists({
      roleName,
      page: 1,
      pagesize: 50
    }) || {}
    let options = []
    dataAddress.datas && dataAddress.datas.forEach((item) => {
      if (parseInt(item['status']) !== 0) {
        options.push(<Option key={item.roleId}>{item.roleName}</Option>)
      }
    })
    console.log(options)
    this.setState({ options })
  }

  // 对话框确认 提交事件
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      console.log(values)
      if (!err) {
        if (this.state.editId !== '') { // 修改
          const postEditData = {
            id: this.state.editId,
            lastName: tooler.lrtrim(values.lastName),
            roleIds: values.roleIds.map(item => parseInt(item.key)),
            phone: tooler.lrtrim(values.phone),
            memo: tooler.lrtrim(values.memo),
            srcType: this.state.srcType
          }
          const res = await api.oauthMsg.userMsg.modifyUser({ ...postEditData }) || false
          if (res) {
            this._loadList()
            this.setState({
              visible: false,
              options: []
            }, () => {
              this.setState({
                editId: ''
              })
            })
          }
        } else { // 新增
          const res = await api.oauthMsg.userMsg.addUser({ ...tooler.jsonTrim(values), ...{ roleIds: values.roleIds.map(item => parseInt(item.key)) }}) || false
          if (res) {
            this._loadList()
            this.setState({
              visible: false,
              options: []
            }, () => {
              this.setState({
                editId: ''
              })
            })
          }
        }
      }
    })
  }
  // 对话框取消
  handleFormCancel = () => {
    this.setState({
      visible: false,
      options: []
    }, () => {
      this.setState({
        editId: ''
      })
    })
  }
  // 分页切换
  handlePaginationChange = (currentPage) => {
    this._loadList({ currentPage })
  }

  // 表格选择
  handleSelectChange = (selectedRowKeys, selectedRows) => {
    const [startIds, unstartIds] = [[], []]
    selectedRows.forEach((item) => {
      if (parseInt(item.userStatus) === 2) {
        unstartIds.push(parseInt(item.id))
      }
      if (parseInt(item.userStatus) === 1) {
        startIds.push(parseInt(item.id))
      }
    })
    this.setState({ startIds, unstartIds, selectedRowKeys })
  }

  async handleEidt(id, type) {
    this.props.form.resetFields()
    const res = await api.oauthMsg.userMsg.queryUserByKey({ id: id }) || {}
    let editData = res
    editData.roleInfos = []
    editData.roleInfos = editData.roleInfoVos && editData.roleInfoVos.map(item => {
      return {
        key: item.roleId.toString(),
        label: item.roleName
      }
    })
    this.setState({
      visible: true,
      editId: id,
      srcType: type,
      editData
    })
  }

  async handleDelete(id) {
    await api.oauthMsg.userMsg.deleteUser({ ids: [id] })
    this._loadList({}, this.state.selectedRowKeys)
  }

  // 修改状态事件
  // 批量启用
  async handleStartStu() {
    await api.oauthMsg.userMsg.startUser({ ids: this.state.unstartIds })
    this._loadList({}, this.state.startIds)
    this.setState({ unstartIds: [] })
  }

  // 批量禁用
  async handleDisableStu() {
    await api.oauthMsg.userMsg.forbiddenUser({ ids: this.state.startIds })
    this._loadList({}, this.state.unstartIds)
    this.setState({ startIds: [] })
  }

  // 单个启用/禁用
  // async handleChangeStu(statu, record, e) {
  //   console.log(e)
  //   console.log(record.id)
  //   console.log(record)
  //   let { startIds, unstartIds, selectedRowKeys, tableList } = this.state
  //   if (parseInt(record.userStatus) === 1) { // 改成禁用
  //     await api.oauthMsg.userMsg.forbiddenUser({ ids: [record.id] })
  //     if (tooler.isContainAry(startIds, parseInt(record.id))) { // 已经选中的
  //       tooler.removeAryEle(startIds, parseInt(record.id))
  //       this.setState({ startIds })
  //     }
  //   } else { // 改成启用
  //     await api.oauthMsg.userMsg.startUser({ ids: [record.id] })
  //     if (tooler.isContainAry(unstartIds, parseInt(record.id))) { // 已经选中的
  //       tooler.removeAryEle(unstartIds, parseInt(record.id))
  //       this.setState({ unstartIds })
  //     }
  //   }
  //   // 更新dom状态
  //   let userInfoVos = []
  //   tableList.userInfoVos.forEach((value, index, arry) => {
  //     if (value['id'] === parseInt(record.id)) {
  //       value['userStatus'] = [2, 1][parseInt(value['userStatus']) - 1]
  //     }
  //     userInfoVos.push(value)
  //   })
  //   tableList['userInfoVos'] = userInfoVos
  //   this.setState({ tableList })
  //   if (tooler.isContainAry(selectedRowKeys, parseInt(record.id))) { // 取消选中
  //     tooler.removeAryEle(selectedRowKeys, parseInt(record.id))
  //     this.setState({ selectedRowKeys })
  //   }
  // }

  // 加载列表
  async _loadList(params = {}, selectedRowKeys = this.state.selectedRowKeys) {
    const tableList = await api.oauthMsg.userMsg.queryPageUsers({
      pageSize: '10',
      currentPage: params.currentPage || '1',
      ...this.state.searchParams,
      ...params
    }) || []
    this.setState({ tableList, selectedRowKeys })
  }

  _getResult(obj) {
    const type = typeof obj
    if (type === 'undefined' || obj === null) {
      return ''
    } else {
      if (type !== 'string') {
        return obj.toString()
      } else {
        return obj
      }
    }
  }

  render() {
    const { tableList, startIds, unstartIds, selectedRowKeys, options } = this.state
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
      title: '操作',
      width: 125,
      fixed: 'left',
      dataIndex: 'active',
      key: 'active',
      render: (text, record) => {
        if (parseInt(record.id) === 1) { // 超级管理员
          return null
        } else {
          if (record.srcType !== 2 && storage.get('userInfo')['adminType'] === 1) { //  srcType!=2 非OA账号， adminType=1 超级管理员权限
            return (
              <div>
                <Button type='primary'
                        style={{ marginRight: '10px' }}
                        size={'small'}
                        onClick={this.handleEidt.bind(this, record.id, record.srcType)}>编辑</Button>
                <Popconfirm placement='topLeft' title={'是否确认删除用户：' + record.userName}
                            onConfirm={this.handleDelete.bind(this, record.id)} okText='确认' cancelText='取消'>
                  <Button type='primary'
                          size={'small'}>删除</Button>
                </Popconfirm>
              </div>
            )
          } else {
            return (
              <div><Button type='primary'
                           style={{ marginRight: '10px' }}
                           size={'small'}
                           onClick={this.handleEidt.bind(this, record.id, record.srcType)}>编辑</Button></div>
            )
          }
        }
      }
    }, {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
    }, {
      title: '姓名',
      dataIndex: 'lastName',
      key: 'lastName',
    }, {
      title: '部门',
      dataIndex: 'dptName',
      key: 'dptName',
    }, {
      title: '状态',
      dataIndex: 'userStatus',
      key: 'userStatus',
      render: (text) => {
        return ['启用', '禁用'][parseInt(text) - 1]
      }
    }, {
      title: '角色',
      dataIndex: 'roleInfoVos',
      key: 'roleInfoVos',
      render: (text, record) => {
        if (text.length > 0) {
          let [rolestr, label] = ['', '']
          text.forEach((value, index) => {
            if (index) {
              rolestr += `，${value['roleName']}`
            } else {
              rolestr = value['roleName']
            }
            if (index < 3) {
              label = rolestr
            }
            if (index === 3) {
              label += '...'
            }
          })
          return <span title={rolestr}>{label}</span>
        } else {
          return ''
        }
      }
    }, {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      render: (text, record) => <span title={text}>{tooler.replaceChar(text, 20, '...')}</span>
    }, {
      title: '创建时间',
      dataIndex: 'gmtCreated',
      key: 'gmtCreated',
      render: (text) => {
        return text.replace(' ', '\r\n')
      }
    }, {
      title: '更新时间',
      dataIndex: 'gmtModified',
      key: 'gmtModified',
    }, {
      title: '创建者',
      dataIndex: 'createUserName',
      key: 'createUserName',
    }]
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectChange,
    }
    return (
      <div>
        <Modal title={this.state.editId !== '' ? '编辑用户' : '新增用户'} visible={this.state.visible}
               onOk={this.handleSubmit} onCancel={this.handleFormCancel}
        >
          <Form style={{ marginBottom: '10px' }}
                onSubmit={this.handleSubmit}>
            <FormItem
              style={{ display: this.state.editId !== '' ? 'none' : 'block' }}
              label='用户名'
              {...formItemLayout}>
              {getFieldDecorator('userName', {
                initialValue: this.state.editId !== '' ? this._getResult(this.state.editData.userName) : '',
                rules: [
                  { required: true, message: '请输入用户名' },
                  { pattern: /^[A-Za-z0-9]{2,20}$/, message: '仅支持2~20位英文、数字' }
                ]
              })(
                <Input
                  style={{ width: 300 }}
                  type={'text'}
                />
              )}
            </FormItem>
            <FormItem
              style={{ display: (this.state.editId !== '' && parseInt(this.state.srcType) === 2) ? 'none' : 'block' }}
              label='姓名'
              {...formItemLayout}>
              {getFieldDecorator('lastName', {
                initialValue: this.state.editId !== '' ? this._getResult(this.state.editData.lastName) : '',
                rules: [{ required: true, message: '请输入姓名' }],
              })(
                <Input
                  style={{ width: 300 }}
                  type={'text'}
                  disabled={this.state.editId !== '' && parseInt(this.state.srcType) === 2}
                />
              )}
            </FormItem>
            <FormItem
              style={{ display: this.state.editId !== '' ? 'none' : 'block' }}
              label='密码'
              {...formItemLayout}>
              {getFieldDecorator('password', {
                initialValue: '',
                rules: [
                  { required: this.state.editId === '', message: '请输入密码' },
                  { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/, message: '密码为6~20位数字和字母' }
                ],
              })(
                <Input
                  style={{ width: 300 }}
                  type={'password'}
                />
              )}
            </FormItem>
            <FormItem
              style={{ display: this.state.editId !== '' ? 'none' : 'block' }}
              label=' 确认密码'
              {...formItemLayout}>
              {getFieldDecorator('passwordConform', {
                initialValue: '',
                rules: [
                  { required: this.state.editId === '', message: '请输入确认密码' },
                  { validator: this.checkPassword }
                ]
              })(
                <Input
                  style={{ width: 300 }}
                  type={'password'}
                />
              )}
            </FormItem>
            <FormItem
              label='角色'
              {...formItemLayout}>
              {getFieldDecorator('roleIds', {
                initialValue: this.state.editId !== '' ? this.state.editData.roleInfos : [],
                rules: [{
                  type: 'array', required: true, message: '请输入角色名'
                }]
              })(
                <Select
                  mode={'multiple'}
                  style={{ width: 300 }}
                  labelInValue
                  filterOption={false}
                  onSearch={this.handleSearchRole}
                  defaultActiveFirstOption={true}
                  allowClear={true}
                >
                  {options}
                </Select>
              )}
            </FormItem>
            <FormItem
              style={{ display: (this.state.editId !== '' && parseInt(this.state.srcType) === 2) ? 'none' : 'block' }}
              label='电话'
              {...formItemLayout}>
              {getFieldDecorator('phone', {
                initialValue: this.state.editId !== '' ? this._getResult(this.state.editData.phone) : '',
                rules: [
                  { required: this.state.editId === '', message: '请输入电话' }
                ],
              })(
                <Input
                  style={{ width: 300 }}
                  type={'text'}
                  disabled={this.state.editId !== '' && parseInt(this.state.srcType) === 2}
                />
              )}
            </FormItem>
            <FormItem
              style={{ display: (this.state.editId !== '' && parseInt(this.state.srcType) === 2) ? 'none' : 'block' }}
              label='备注'
              {...formItemLayout}>
              {getFieldDecorator('memo', {
                initialValue: this.state.editId !== '' ? this._getResult(this.state.editData.memo) : '',
                rules: [{ required: this.state.editId === '', message: '请输入备注' }],
              })(
                <Input
                  style={{ width: 300, resize: 'none' }}
                  type='textarea'
                  maxLength={50}
                  placeholder={'最大输入50个字'}
                  disabled={this.state.editId !== '' && parseInt(this.state.srcType) === 2}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
        <Row style={{ marginBottom: '10px' }}>
          <div style={{ float: 'left' }}>
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
                    disabled={startIds.length === 0 || storage.get('userInfo')['adminType'] !== 1}
                    onClick={this.handleDisableStu.bind(this)}
                    size={'default'}>禁用</Button>
          </div>
          <div style={{ float: 'right' }}>
            <Search handleSearch={this.handleSearch}/>
          </div>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            rowKey='id'
            dataSource={tableList.userInfoVos}
            scroll={{ x: 1700 }}
            pagination={{
              showQuickJumper: true,
              total: tableList.page ? tableList.page.totalRowsAmount : [],
              onChange: this.handlePaginationChange,
              pageSize: 10,
              current: tableList.page ? tableList.page.currentPage || 1 : 1
            }}/>
        </Row>
      </div>
    )
  }
}

export default Form.create()(UserMsg)
