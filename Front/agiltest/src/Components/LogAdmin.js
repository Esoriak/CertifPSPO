import React, { Component } from 'react'
import { Redirect } from 'react-router'
import axios from 'axios';

class LogAdmin extends Component {
  state={
    login : false,
    mail : "",
    password : "",
    admin_connect : false,
    showPass: false,
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value 
    })
  }

    handleSubmit = async(event) => {
      event.preventDefault()
      let pathApi = process.env.REACT_APP_PATH_API_DEV + '/auth/login'
      if (process.env.NODE_ENV === 'production') {
        pathApi = process.env.REACT_APP_PATH_API_PROD + '/auth/login'
      }
       await axios.({
        method: 'POST',
        url: pathApi,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body : {
          Mail: event.target.mail.value,
          Password: event.target.password.value,
      }})
       .then((res) => {
          sessionStorage.setItem("token", res.headers["x-access-token"])
          sessionStorage.setItem("login", this.state.mail) 
          this.setState({ login: true }, () => {
            setTimeout(() => this.setState({ login: false }), 1400)
            setTimeout(() => this.setState({ admin_connect: true }), 1400)
            setTimeout(() => this.protectedRoute(), 1400)
          })
        })
    }

    protectedRoute = async() => {
      // Storage for token //
      const token = sessionStorage.getItem("token")
      let pathApi = process.env.REACT_APP_PATH_API_DEV + '/auth/protected/'
      if (process.env.NODE_ENV === 'production') {
        pathApi = process.env.REACT_APP_PATH_API_PROD + '/auth/protected/'
      }
      await axios({
        method: 'POST',
        url: pathApi,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
        },
      })
        // Verified if a token is correct //
        .then(res => {
          this.setState({
            verified: res.data.auth,
          })
        })
    }

  render() {

    return (
      <>
      {/* Si vous êtes connecté en tant qu'admin vous accéder à la partie back office */}
      {this.state.admin_connect && <Redirect to="/backoffice" />}
      {/* Espace de connexion administrateur */}
        <div className="main_container">
          <div className="card start_card">
            <form onSubmit={this.handleSubmit}>
              <fieldset>
                <legend> Connexion Administrateur</legend><br/>

                <div className="input-connect">
                  <input  type="email"    
                          className="input_connect" 
                          placeholder="email@toudoum.fr" 
                          label="Email"
                          onChange={this.handleChange}
                          name="mail"
                          value={this.state.mail}
                  />
                </div>

                <div className="input-connect">
                  <input
                          className="input_connect"
                          label="Password"
                          name="password"
                          type="password"
                          value={this.state.password}
                          onChange={this.handleChange}
                  />
                </div>

                 <button className="input_button connect_button input_button__active" type="submit">Accéder au Back-Office</button>
              </fieldset>
            </form>
            
          </div>
      </div>
      </>
      
    )
  }
}

export default LogAdmin
