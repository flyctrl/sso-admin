/**
 * @Author: sunshiqiang
 * @Date: 2017-09-19 18:05:19
 */

import fetch from 'Util/fetch'
import { message } from 'antd'
import { showSpin } from 'Models/layout'

// 获取数据类接口
export const Fetch = (url, params) => {
  showSpin({ bool: true, content: '正在加载数据....' })
  return fetch(url, params).then((res) => {
    if (res.code === 0) {
      showSpin()
      return res.data
    } else {
      showSpin()
      message.error(res.errmsg, 2)
    }
  }, (err) => {
    showSpin()
    message.error(err.errmsg, 2)
  })
}

// 保存类接口
export const FetchSave = (url, params) => {
  showSpin({ bool: true, content: '正在加载数据....' })
  return fetch(url, params).then((res) => {
    if (res.code === 0) {
      showSpin()
      message.success(res.errmsg, 2)
      return res.data
    } else {
      showSpin()
      message.error(res.errmsg, 2)
    }
  }, (err) => {
    showSpin()
    message.error(err.errmsg, 2)
  })
}

export default {
  oauthMsg: { // 权限管理
    getList() { // 权限树受控带urlt跳转
      return Fetch('/single-sign-on/url/getList.json', {})
    },
    oauthList: { // 权限列表
      getList(params) { // 权限树
        return Fetch('/single-sign-on/power/getList.json', params)
      },
      addPlatform(params) {
        return FetchSave('/single-sign-on/power/add.json', params)
      }
    },
    roleMsg: { // 角色管理
      lists(params) { // 列表
        return Fetch('/single-sign-on/role/lists.json', params)
      },
      add(params) { // 新增
        return FetchSave('/single-sign-on/role/add.json', params)
      },
      update(params) { // 修改
        return FetchSave('/single-sign-on/role/update.json', params)
      },
      del(params) { // 删除
        return FetchSave('/single-sign-on/role/del.json', params)
      },
      updateStatus(params) { // 批量更新
        return FetchSave('/single-sign-on/role/updateStatusBatch.json', params)
      },
      searchUser(params) { // 用户名列表
        return Fetch('/single-sign-on/sys/searchUser.json', params)
      },
      bindUsers(params) { // 分配用户名
        return FetchSave('/single-sign-on/role/bindUsers.json', params)
      },
    },
    userMsg: { // 用户管理
      queryPageUsers(params) { // 查询用户列表
        return Fetch('/single-sign-on/sys/queryPageUsers.json', params)
      },
      queryUserByKey(params) { // 根据主键查询用户
        return Fetch('/single-sign-on/sys/queryUserByKey.json', params)
      },
      addUser(params) { // 增加用户
        return FetchSave('/single-sign-on/sys/addUser.json', params)
      },
      deleteUser(params) { // 删除用户
        return FetchSave('/single-sign-on/sys/deleteUser.json', params)
      },
      forbiddenUser(params) { // 禁用用户
        return FetchSave('/single-sign-on/sys/forbiddenUser.json', params)
      },
      startUser(params) { // 启用用户
        return FetchSave('/single-sign-on/sys/startUser.json', params)
      },
      modifyUser(params) { // 修改用户
        return FetchSave('/single-sign-on/sys/modifyUser.json', params)
      },
      modifyUserPassword(params) { // 修改密码
        return FetchSave('/single-sign-on/sys/modifyUserPassword.json', params)
      },
      getAllSites() { // 所有站点
        return Fetch('/single-sign-on/siteAdmin/getAllSites.json', {})
      },
      logout: '/single-sign-on/sys/logout.json',
      checkIfAdmin(params) {
        return Fetch('/single-sign-on/user/checkIfAdmin.json', params)
      }
    },
    operatSys: { // 业务系统管理
      lists(params) {
        return Fetch('/single-sign-on/siteAdmin/lists.json', params)
      },
      searchUser(params) { // 搜索用户
        return Fetch('/single-sign-on/sys/searchUser.json', params)
      },
      add(params) { // 创建系统管理员
        return FetchSave('/single-sign-on/siteAdmin/add.json', params)
      },
      update(params) { // 修改系统管理员
        return FetchSave('/single-sign-on/siteAdmin/update.json', params)
      },
      getAllSites(params) { // 获取所有站点
        return Fetch('/single-sign-on/siteAdmin/getAllSites.json', params)
      },
      del(params) { // 删除管理员
        return FetchSave('/single-sign-on/siteAdmin/del.json', params)
      },
      status(params) { // 批量启用禁用
        return FetchSave('/single-sign-on/siteAdmin/status.json', params)
      }
    },
    OauthMsg: { // 监控日志
      query(params) {
        return Fetch('/single-sign-on/log/query.json', params)
      }
    },
    SiteAdmin: { // 站点管理
      lists(params) {
        return Fetch('/single-sign-on/site/lists.json', params)
      },
      add(params) {
        return FetchSave('/single-sign-on/site/add.json', params)
      },
      update(params) {
        return FetchSave('/single-sign-on/site/update.json', params)
      },
      del(params) {
        return FetchSave('/single-sign-on/site/delete.json', params)
      }
    }
  }
}
