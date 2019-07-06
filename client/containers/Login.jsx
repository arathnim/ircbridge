import React from 'react'
import style from '../styles/style.sass'

import { Transition, Spring } from 'react-spring'

import Tippy from '@tippy.js/react'

import { faUser } from "@fortawesome/free-solid-svg-icons/faUser"
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock"
import FontAwesomeIcon from "./FontAwesomeIcon"

const postData = (url = '', data = {}) =>
  fetch(url, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    status: "idle",
  }

  handleSubmit = (event) => {
    event.preventDefault();
    postData('http://localhost:4000/login', {user: this.state.username, password: this.state.password})
    .then(x => {
      if (x.status == true) {
        localStorage.setItem('key', x.value);
        this.props.setKey(x.value);
        this.props.history.push('/');
      } else {
        this.setState({status: "failure"})
      }
    })
    .catch(e => {console.log(e);this.setState({status: 'error'});} )
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
      <div className={style.screen + " " + style.center}>

        <div className={style.login}>

          <div className={style.loginDetails}>
            welcome to ircbridge
          </div>

          <div className={style.logintitle}>
            Login  /  <span style={{color: '#fff4'}}> Register </span>
          </div>

          <div className={style.loginInput}>
            <input
              name="username"
              type="text"
              placeholder="username"
              value={this.state.username}
              onChange={this.handleInputChange} />
              <div className={style.loginInputIcon}>
                <FontAwesomeIcon icon={faUser} style={{}}/>
              </div>
          </div>

          <div className={style.loginInput}>
            <input
              name="password"
              type="Password"
              placeholder="password"
              value={this.state.password}
              onChange={this.handleInputChange} />
              <div className={style.loginInputIcon}>
                <FontAwesomeIcon icon={faLock} style={{}}/>
              </div>
          </div>

          <input type="submit" style={{display: 'none'}} />

          <div onClick={(e => this.handleSubmit(e))} className={style.loginButton}>
            Login
          </div>

          <div className={style.forgotButton}>
            forgot your password?
          </div>

        </div>

      </div>
      </form>
    )
  }

}

export default Login
