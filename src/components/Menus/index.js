/**
 * Created by yiming on 2017/6/20.
 */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import * as urls from '../../contants/url'
import classNames from 'classnames'
import Style from './style.css'
// import api from 'Src/contants/api'
// import storage from 'Util/storage'

const SubMenu = Menu.SubMenu
const MenuItem = Menu.Item

class MamsMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'inline',
      data: [
        { key: 'mams_home', url: urls.HOME, value: '首页', icon: 'home' }
      ],
      openKeys: JSON.parse(sessionStorage.getItem('openKeys')) || []
    }
  }

  getMenuItemClass(str) {
    const pathName = decodeURI(location.pathname)
    if (str !== urls.HOME) {
      return classNames({
        'ant-menu-item-selected': pathName.indexOf(str) > -1
      })
    }
    return classNames({
      'ant-menu-item-selected': pathName === str
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      mode: nextProps.mode ? 'vertical' : 'inline',
      data: nextProps.data
    })
  }

  handleOpenChange = (openKeys) => {
    this.setState({ openKeys }, () => {
      sessionStorage.setItem('openKeys', JSON.stringify(openKeys))
    })
  }

  render() {
    let { data } = this.state
    const loop = (data = []) => data.map((item) => {
      if (item.children) {
        return <SubMenu key={item.key} title={<p className={Style.ellip}><Icon type={item.icon}/><span>{item.value}</span></p>}>
          {loop(item.children)}</SubMenu>
      }
      return <MenuItem key={item.key} className={this.getMenuItemClass(item.url)}>
        <Link className={Style.ellip} to={item.url}><Icon type={item.icon}/>{item.value}</Link>
      </MenuItem>
    })
    const menusData = loop(data)
    return menusData.length > 0 ? <Menu
      mode={this.state.mode}
      selectedKeys={[this.props.selectedMenu]}
      onSelect={this.props.onSelect}
      style={{ border: 'none' }}
      openKeys={this.state.openKeys}
      onOpenChange={this.handleOpenChange}>
      {menusData}
    </Menu> : null
  }
}

export default MamsMenu
