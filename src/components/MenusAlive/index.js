/**
 * @Author: sunshiqiang
 * @Date: 2017-09-20 16:57:58
 */

import React, { Component } from 'react'
import { message, Cascader } from 'antd'
import { Fetch } from 'Contants/api'
import Style from './style.css'

class MenusAlive extends Component {
  handleChange = async (value, selectedOptions) => {
    const key = selectedOptions && selectedOptions[selectedOptions.length - 1].url
    if (key && key.length > 10) {
      const newWin = window.open('about:blank')
      const data = await Fetch(key, {})
      if (data) {
        newWin.location.href = data
      }
    } else {
      message.error('该系统还未接入！')
    }
  }

  render() {
    let { data } = this.props
    return data[0] ? <div style={{ height: '47px', lineHeight: '47px' }}>
      <Cascader
        options={data[0].children}
        expandTrigger='hover'
        style={{ color: 'red' }}
        popupClassName={Style.lists}
        onChange={this.handleChange}>
        <a href='javascript:;' style={{ display: 'block', paddingLeft: '15px', textDecoration: 'none' }}>{data[0].label}</a>
      </Cascader>
    </div> : null
  }
}

export default MenusAlive
