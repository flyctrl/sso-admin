import React from 'react'
// import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import * as urls from '../contants/url'
import XLayout from '../models/layout'
import Home from '../models/Home'
import UserMsg from 'Src/models/OauthMsg/UserMsg'
import UserInfo from 'Src/models/OauthMsg/UserMsg/userInfo'
import RoleMsg from 'Src/models/OauthMsg/RoleMsg'
import OauthList from 'Src/models/OauthMsg/OauthList'
import OperatSys from 'Src/models/OauthMsg/OperatSys'
import LogWatch from 'Src/models/OauthMsg/LogWatch'
import SiteAdmin from 'Src/models/OauthMsg/SiteAdmin'
import Login from '../models/Login'
import LoginOut from '../models/LoginOut'

const routes = [
  {
    path: '/',
    exact: true,
    component: Home,
    breadcrumbName: '首页'
  },
  {
    path: urls.HOME,
    exact: true,
    component: Home,
    breadcrumbName: '首页'
  },
  {
    path: urls.USERMSG,
    exact: true,
    component: UserMsg,
    breadcrumbName: '用户管理',
    parentPath: urls.HOME
  },
  {
    path: urls.USERINFO,
    exact: true,
    component: UserInfo,
    breadcrumbName: '基本资料',
    parentPath: urls.HOME
  },
  {
    path: urls.ROLEMSG,
    exact: true,
    component: RoleMsg,
    breadcrumbName: '角色管理',
    parentPath: urls.HOME
  },
  {
    path: urls.OAUTHLIST,
    exact: true,
    component: OauthList,
    breadcrumbName: '权限列表',
    parentPath: urls.HOME
  },
  {
    path: urls.OPERATSYS,
    exact: true,
    component: OperatSys,
    breadcrumbName: '业务系统管理',
    parentPath: urls.HOME
  },
  {
    path: urls.LOGWATCH,
    exact: true,
    component: LogWatch,
    breadcrumbName: '操作日志监控',
    parentPath: urls.HOME
  },
  {
    path: urls.SITEADMIN,
    exact: true,
    component: SiteAdmin,
    breadcrumbName: '站点管理',
    parentPath: urls.HOME
  }
]

const RouteConfig = () => (
  <Router>
    <Switch>
      <Route path='/login' exact component={Login}/>
      <Route path='/loginout' exact component={LoginOut}/>
      <XLayout routes={routes}>
      </XLayout>
    </Switch>
  </Router>
)

export default RouteConfig
