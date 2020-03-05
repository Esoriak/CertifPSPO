import React, { Component } from 'react'
import axios from 'axios';

class AddAdmin extends Component {
  state={
    login : false,
    mail : "",
    password : "",
    firstname : "",
    lastname : "",
    // admin_connect : false,
    // showPass: false,
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value 
    })
  }


    handleSubmit = (event) => {
      event.preventDefault()
      let pathApi = process.env.REACT_APP_PATH_API_DEV + '/auth/register'
      if (process.env.NODE_ENV === 'production') {
        pathApi = process.env.REACT_APP_PATH_API_PROD + '/auth/register'
      }
        axios.post(pathApi, {
          Mail: event.target.mail.value,
          Password: event.target.password.value,
          Firstname : event.target.firstname.value,
          Lastname : event.target.lastname.value
      })
       .then((res) => {
          localStorage.setItem("token", res.headers["x-access-token"])
          this.setState({ login: true }, () => {
            setTimeout(() => this.setState({ login: false }), 1400)
            setTimeout(() => this.setState({ admin_connect: true }), 1400)
            // setTimeout(() => this.protectedRoute(), 1400)
          })
        })
    }


  render() {

    return (
        <div className="main_container">
          <div className="card start_card">
            <form onSubmit={this.handleSubmit}>
              <fieldset>
                <legend> Ajouter un administrateur</legend><br/>

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

                <div className="input-connect">
                  <input  type="text"    
                          className="input_connect" 
                          placeholder="Emilie" 
                          label="Firstname"
                          onChange={this.handleChange}
                          name="firstname"
                          value={this.state.firstname}
                  />
                </div>

                <div className="input-connect">
                  <input  type="text"    
                          className="input_connect" 
                          placeholder="Dupont" 
                          label="Lastname"
                          onChange={this.handleChange}
                          name="lastname"
                          value={this.state.lastname}
                  />
                </div>

                 <button className="input_button connect_button input_button__active" type="submit">Ajouter un administrateur</button>
              </fieldset>
            </form>
            
          </div>
      </div>
    )
  }
}

export default AddAdmin
