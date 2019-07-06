import React from 'react'
import { render } from 'react-dom'
import {
  HashRouter as Router,
  Redirect,
  Switch,
  Route, Link,
  withRouter
} from 'react-router-dom'

import style from './styles/style.sass'

import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/dist/themes/light.css'

import Shell from './containers/App'
import Login from './containers/Login'

tippy.setDefaults({
  theme: "light",
  delay: [500, null]
})

var key = localStorage.getItem('key') || '';

const setKey = (k) => {
  key = k;
}

const Init = () =>
  <Router>
    <div>

      <Switch>

        <Route exact path="/" render={(props) => <Shell {...props} keyValue={key} />} />
        <Route exact path="/login" render={(props) => <Login {...props} setKey={setKey} />} />

      </Switch>

    </div>
  </Router>

render(<Init />, document.getElementById('main'))
