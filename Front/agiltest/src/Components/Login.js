import React, { Component } from 'react'
import {NavLink} from "react-router-dom"

 class Login extends Component {
  render() {
    return (
      <div>
        <h2> Coucou connecte toi</h2>
        <NavLink path to="/quizz"><button > Se connecter</button></NavLink>
      </div>
    )
  }
}

export default Login
