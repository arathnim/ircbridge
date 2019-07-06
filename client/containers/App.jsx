import React, { useState } from 'react'
import style from '../styles/style.sass'

import { useSpring, animated } from 'react-spring'

import { useQuery } from 'urql';

import Tippy from '@tippy.js/react'

import { faBug } from "@fortawesome/free-solid-svg-icons/faBug"
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes"
import { faCaretRight } from "@fortawesome/free-solid-svg-icons/faCaretRight"
import FontAwesomeIcon from "./FontAwesomeIcon"

import { Redirect } from 'react-router-dom'

import { Provider, createClient } from 'urql';

class Shell extends React.Component {
  constructor(props) {
    super(props);
    this.state =
    {
      status: "loading",
      error: undefined,
      client: undefined,
    };
    fetch('http://localhost:4000/testkey', {cache: 'no-store', headers: {authorization: this.props.keyValue}})
    .then(r => r.json())
    .then(x => {
      if (x.status) {
        this.setState({status: 'success',
          client:
          createClient({
            url: 'http://localhost:4000/graphql',
            fetchOptions: { headers: { authorization: this.props.keyValue }}
          })
        });
      } else {
        this.setState({status: 'failure'});
      }
      return Promise.resolve(true);
    })
    .catch(x => {this.setState({status: 'error', error: x})});
  }

  render() {
    switch (this.state.status) {
      case 'loading':
        return (
          <div className={style.screen}>
          </div>
        )
      case 'success':
        return (
          <Provider value={this.state.client}>
            <App />
          </Provider>
        )
      case 'failure':
        return (
          <Redirect to='/login' />
        )
      case 'error':
        return (
          <div className={style.screen}>
            <Message text="connection to server failed"/>
          </div>
        )
    }
  }
}

const App = () => {
   const [result] = useQuery({
    query: `{ ping }`,
  });

  const { fetching, data } = result;
  return fetching ? <div /> :
    <div className={style.screen}>
      <Message text={data.ping}/>
    </div>;
}


const Message = ({text}) => {
  const [show, set] = useState(true)
  const props = useSpring({
    from: {opacity: show ? 0 : 1},
    to: {opacity: show ? 1 : 0},
    config: {
      duration: 150
    }
  })

  return (
    <animated.div style={props}>
      <div className={style.message}>
        <div className={style.messagetext}>
          <div style={{paddingBottom: '15px'}}>{text}</div>
          <div className={style.messageactions}>
            <div className={style.messageaction} onClick={(e => set(false))}>close</div>
          </div>
        </div>
      </div>
    </animated.div>
  )
}


export default Shell
