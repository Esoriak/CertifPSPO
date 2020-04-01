import React, { Component } from 'react'
import {Link, Redirect} from 'react-router-dom'
import LogoAdmin from '../imgs/login-admin.png'
import Logout from '../imgs/logout2.png'

import './Backoffice.css'
import axios from 'axios'


class BackofficeNavbar extends Component {
  state = {
    log : '',
    verified: true,
  }

  Getlog =() => {
    const mailvalue = sessionStorage.getItem("login")
    this.setState({
      log : mailvalue
    })
  }

  LogOut = () => {
    let pathApi = process.env.REACT_APP_PATH_API_DEV + '/auth/logout'
    if (process.env.NODE_ENV === 'production') {
      pathApi = process.env.REACT_APP_PATH_API_PROD + '/auth/logout'
    }
    axios.get(pathApi)
    .then((res) => {
      this.setState({
        verified : res.data.auth
      })
      sessionStorage.clear()
    })
  }

  componentDidMount =() => {
    this.Getlog()
  }


  render() {
    return (
      <>
      {this.state.verified === false && <Redirect to='/login' />}
      <div className="navbar">
        <div className="admin-space">
          <div className="Log-section">
            <Link to="/me-admin"><img src={LogoAdmin} className="logo-admin" alt="logo admin connect" /></Link>
            <p>{this.state.log}</p>
          </div>
          <div onClick={this.LogOut}><img src={Logout} className="logout" alt="logo de deconnexion" /></div>
        </div>
        
        <Link to="/admin" className="link-navbar">Gérer les administrateurs</Link>
        <Link to="/backoffice" className="link-navbar">Gérer les utilisateurs</Link>
        <Link to="/dataquizz" className="link-navbar">Base de données des tests</Link>
      </div>
      </>
    )
  }
}

export default BackofficeNavbar
