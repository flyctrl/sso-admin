import React from 'react'
import ReactDOM from 'react-dom'
import MainRouter from './Router'
import registerServiceWorker from './registerServiceWorker'
import { AppContainer } from 'react-hot-loader'

ReactDOM.render(
  <AppContainer>
    <MainRouter/>
  </AppContainer>,
  document.getElementById('root')
)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./Router', () => {
    const NextApp = require('./Router').default
    ReactDOM.render(
      <AppContainer>
        <NextApp/>
      </AppContainer>,
      document.getElementById('root')
    )
  })
}

registerServiceWorker()
