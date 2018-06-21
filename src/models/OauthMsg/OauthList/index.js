import React, { Component } from 'react'
import { Modal, Form, Input, Tree, Row, Col, Switch, Icon } from 'antd'
import api from 'Contants/api'
import style from './style.css'
import { loadUrlTree } from 'Models/layout'

const FormItem = Form.Item
// const Option = Select.Option
const TreeNode = Tree.TreeNode

class OauthList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      addingTop: false,
      powerParentId: 0,
      currentAddingId: 0,
      onOff: false,
      list: {},
      rightData: {}
    }
    this.getList = this.getList.bind(this)
  }
  componentWillMount() {
    this.getList()
    this.handleRight(['0'])
  }
  handleSwitch = (value) => {
    this.setState({
      onOff: value
    })
  }
  handleRight = async (value) => {
    const oauthList = await api.oauthMsg.oauthList.getList({ isneedfunction: 1 })
    this._filter([oauthList], value[0], (rightData) => {
      this.setState({
        rightData
      })
    })
  }
  _filter = (arr, target, callBack) => {
    for (let i = 0, l = arr.length; i < l; i++) {
      if (arr[i].key === target) {
        console.log(arr[i])
        callBack(arr[i])
      }
      if (arr[i].children && arr[i].children.length > 0) {
        this._filter(arr[i].children, target, callBack)
      }
    }
  }

  showModal = (e, data, isTop = false) => {
    e.stopPropagation()
    e.preventDefault()
    this.props.form.resetFields()
    this.setState({
      currentAddingId: data,
      addingTop: isTop,
      modalVisible: true,
      powerParentId: data
    })
  }

  handleOk = async (e) => {
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) return
      const res = await api.oauthMsg.oauthList.addPlatform({
        powerParentId: this.state.currentAddingId,
        ...values
      })
      if (res) {
        this.getList()
        loadUrlTree()
        this.setState({
          modalVisible: false
        })
      }
    })
  }

  handleCancel = (e) => {
    this.setState({
      modalVisible: false,
    })
  }

  getList = async () => {
    const oauthList = await api.oauthMsg.oauthList.getList({})
    this.setState({
      list: oauthList
    })
  }
  // 加载树状态图
  _loopTree = (data) => {
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode key={item.key} title={<span>{item.label} {this.state.onOff ? <Icon type='plus-circle'
                                                                                       onClick={e => this.showModal(e, item.value, true)}/> : ''}</span>}>
             {item.children && item.children.length > 0 ? item.children.map((item) => <TreeNode key={item.key} title={item.label} />) : null}
            {/* {this._loopTree(item.children)} */}
          </TreeNode>
        )
      }
      return <TreeNode key={item.key} title={<span>{item.label} {this.state.onOff ? <Icon type='plus-circle'
                                                                                          onClick={e => this.showModal(e, item.value, true)}/> : ''}</span>}/>
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { rightData } = this.state
    return (
      <div>
        增加节点：<Switch checkedChildren={'开'} unCheckedChildren={'关'} onChange={this.handleSwitch}/>
        <Row>
          <Col span={6} className={style['left-warpper']}>
            {this.state.list.children && this.state.list.children.length > 0 ? <Tree
              style={{
                maxHeight: 400,
                overflow: 'auto'
              }}
              defaultExpandAll={true}
              onSelect={this.handleRight}
              defaultSelectedKeys={['0']}
            >
              <TreeNode key={this.state.list.key} title={<span>{this.state.list.label} {this.state.onOff ? <Icon type='plus-circle' onClick={e => this.showModal(e, this.state.list.value, false)}/> : ''}</span>}>
                {this._loopTree(this.state.list.children)}
              </TreeNode>
            </Tree> : null}
          </Col>
          <Col span={18} className={style['right-warpper']}>
            <Col span={6} className={style['left']}>
              {rightData.label}
            </Col>
            {rightData.children ? <Col span={18} className={style['right']}>
              {rightData.children.map(item => <div key={item.key} style={{ borderBottom: '1px dashed #EEE' }}><h5>{item.label}</h5>
                <p>{item.children ? item.children.map(item =>
                  <span key={item.key}>{item.label} / </span>) : null}</p>
              </div>)}
            </Col> : null}
          </Col>
        </Row>
        <Modal
          title='新增'
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form style={{ marginBottom: '10px' }} onSubmit={this.handleOk}>
            <FormItem
              label='名称'
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
            >
              {getFieldDecorator('showName', {
                rules: [{ required: true, message: '请输入名称' }],
              })(
                <Input
                  maxLength='20'
                  placeholder={'最大输入20个字'}
                />
              )}
            </FormItem>
            {this.state.addingTop ? (
              <FormItem
                label='Site ID'
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              >
                {getFieldDecorator('siteId', {
                  rules: [{ required: true, message: '请输入Site ID' }],
                })(
                  <Input/>
                )}
              </FormItem>
            ) : ''}
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(OauthList)
