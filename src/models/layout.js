import React, { Component } from 'react'
import { Layout, Icon, Menu, Dropdown, Spin } from 'antd'
import * as urls from 'Src/contants/url'
import storage from 'Util/storage'

const Item = Menu.Item
// const MenuItemGroup = Menu.ItemGroup
import {
  Link,
  Route,
} from 'react-router-dom'
import AppMenu from '../components/Menus'
import MenusAlive from 'Components/MenusAlive'
import YXBreadcrunb from 'Components/Breadcrumb'
import style from './style.css'
import api from 'Src/contants/api'

const { Sider } = Layout

export let showSpin = null
export let loadUrlTree = null

class MainLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      showSpin: null,
      oauthList: [],
      urlTreeData: [],
      data: [
        { key: 'mams_home', url: urls.HOME, value: '首页', icon: 'home' }
      ],
    }
    showSpin = this.setSpin
    loadUrlTree = this._loadUrlTree
  }

  componentWillMount() {
    this.onSelect()
  }

  onSelect = () => {
    this._loadAllTree()
    this._loadUrlTree()
    this._getMenuData()
  }
  async _loadAllTree() {
    const oauthList = await api.oauthMsg.oauthList.getList({ isneedfunction: 1 }) || {}
    this.setState({ oauthList: [oauthList] })
  }
  _loadUrlTree = async () => {
    const urlTreeData = await api.oauthMsg.getList() || {}
    this.setState({ urlTreeData: [urlTreeData] })
  }
  // 设置是否可收起
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }
// 设置全局加载
  setSpin = (showSpin) => {
    this.setState({ showSpin })
  }

  getMenuName(pathName) {
    if (!pathName || pathName === '/') return ''
    let reg = new RegExp(/\/(\b\w*\b)/)
    let matchName = pathName.match(reg)[1]
    let name = matchName.split('')
    name = name[0].toUpperCase() + name.slice(1).join('')
    return name
  }

  showUserName() {
    const userInfoMenu = (
      <Menu>
        <Item>
          <Link to={urls.USERINFO}>基本资料</Link>
        </Item>
        <Item>
          <a href='/loginout'>退出</a>
        </Item>
      </Menu>
    )
    if (storage.get('userInfo')) {
      return (
      <Dropdown overlay={userInfoMenu}>
        <a className='ant-dropdown-link' href='javascript:void(0)'>
        <Icon type='user'/> {storage.get('userInfo')['userName']} <Icon type='down'/>
        </a>
      </Dropdown>
      )
    } else {
      return (
        <a href='/login'>登录</a>
      )
    }
  }
  async _getMenuData() {
    const res = await api.oauthMsg.userMsg.checkIfAdmin({ timestamp: (new Date()).getTime() }) || false
    let menuAry = []
    if (res) {
      storage.set('userInfo', {
        ...storage.get('userInfo'),
        ...{ adminType: res }
      })
      if (res === 2) { // 站点管理员
        menuAry = [
              { key: 'mams_user_msg', value: '用户管理', icon: 'user', url: urls.USERMSG },
              { key: 'mams_role_msg', value: '角色管理', icon: 'team', url: urls.ROLEMSG },
              { key: 'mams_oauth_list', value: '权限列表', icon: 'video-camera', url: urls.OAUTHLIST },
              { key: 'mams_log_watch', value: '操作日志监控', icon: 'file-text', url: urls.LOGWATCH }
        ]
      } else { // 超级管理员
        menuAry = [
              { key: 'mams_operat_sys', value: '业务系统管理', icon: 'dot-chart', url: urls.OPERATSYS },
              { key: 'mams_log_watch', value: '操作日志监控', icon: 'file-text', url: urls.LOGWATCH },
              { key: 'mams_Site_Admin', value: '站点管理', icon: 'switcher', url: urls.SITEADMIN }
        ]
      }
      this.setState({
        data: [
          { key: 'mams_home', url: urls.HOME, value: '首页', icon: 'home' },
          {
            key: 'mams_oauth_msg', value: '权限管理', icon: 'line-chart',
            children: menuAry
          },
        ]
      })
    }
  }
  render() {
    const { routes } = this.props
    const { showSpin, oauthList, urlTreeData } = this.state
    return (
      <Layout className={style.layout}>
        <Sider className={style.sidebar}
               trigger={null}
               collapsible
               collapsed={this.state.collapsed}>
          <div className={style.logo}>
            <Link className={style['to-home']} to='/'>
              <img src={require('../assets/logo.png')} alt='logo'/>
              <span>控制台</span>
            </Link>
          </div>
          <div className={style.menu}>
            <AppMenu match={this.props.match} onSelect={this.onSelect} data={this.state.data} mode={this.state.collapsed}/>
          </div>
        </Sider>
        <Layout className={this.state.collapsed ? style['main-content-collapsed'] : style['main-content']}>
          <div className={style['header']}>
            <div className={style['header-button']} onClick={this.toggle}>
              <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}/>
            </div>
            <div className={style['left-warpper']}>
              <MenusAlive data={urlTreeData}/>
            </div>
            <div className={style['right-warpper']} style={{ marginTop: 13 }}>
            {
              this.showUserName()
            }
            </div>
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            {
              routes.map((route, index) => {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    render={({ match, location }) => {
                      return <div>
                        <YXBreadcrunb location={location} match={match} routes={routes}/>
                        <div style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                          <route.component match={match} oauthList={oauthList} />
                        </div>
                      </div>
                    }}
                  />
                )
              })
            }
          </div>
        </Layout>
        {
          showSpin && showSpin.bool ? (
            <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '2000' }}>
              <Spin tip={showSpin.content}
                    style={{ position: 'absolute', top: '50%', width: '100%' }}
                    size='large'/>
            </div>) : null
        }
      </Layout>
    )
  }
}

export default MainLayout

