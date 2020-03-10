import React, { Component } from 'react'
import {Link} from 'react-router-dom'

import './Backoffice.css'


class BackofficeNavbar extends Component {
  render() {
    return (
      <>
      <div className="navbar">
        
        <Link to="/admin" className="link-navbar">Gérer les administrateurs</Link>
        <Link to="/users" className="link-Navbar">Gérer les utilisateurs</Link>
        <Link to="/" className="link-navbar">Base de données des tests</Link>
      </div>
      </>
    )
  }
}

export default BackofficeNavbar
