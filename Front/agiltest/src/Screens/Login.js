import React, { Component } from 'react'
import { Redirect } from 'react-router'
import axios from 'axios'

 class Login extends Component {
  state ={
    home: true,
    redirection: false,
    accessdenied : false,
    mail : "",
    auth : null,
  }

// //******* CONNEXION *********//
emailCheck = () => {
  // On récupère la donnée fournie par l'utilisateur
    const inputvalue = document.getElementsByClassName('input_email')
    const mail = inputvalue[0].value
    this.setState({
      mail : mail
    })

    let pathApi = process.env.REACT_APP_PATH_API_DEV + '/auth/log/user'
      if (process.env.NODE_ENV === 'production') {
        pathApi = process.env.REACT_APP_PATH_API_PROD + '/auth/log/user'
      }
      axios.post(pathApi, {
        Mail: mail,
    })
    .then((res) => {
      localStorage.setItem("tokenmail", res.headers["x-access-token"])
      localStorage.setItem("login", this.state.mail)
      this.setState({
        auth: res.data.auth, accessdenied : false,
      }, () => {
        // setTimeout(() => this.setState({ auth: false }), 1400)
        setTimeout(() => this.setState({ redirection: true }), 1400)
      })
    })
    this.verify()
  }


  verify = () => {
    const log = localStorage.getItem("login")
    if (log === null) {
      this.setState({
        auth : false
      })
    }
  }

  render() {
    return (
      <div>

{this.state.home &&
                <div className="main_container">
                <div className="card welcome_card">
                <h1>Bienvenue sur notre plateforme d’entrainement à la certification PSPO !</h1>
                <p>Veuillez entrer <b>votre adresse email</b> pour pouvoir accéder à notre questionnaire qui permettra de tester les connaissances requises afin d’obtenir la certification PSPO.</p>
                {this.state.auth === false && <small className="access_denied_message">Aucun compte ne correspond à cette adresse email.</small> }
                <div className="login-email">
                    <input type="email" className="input_email" placeholder="mail@mail.com"/>
                </div>
                
              <div className="input_button connect_button input_button__active" onClick={this.emailCheck}>Accéder à la plateforme</div>
            </div>
            </div>
        }  

      {this.state.auth && <Redirect to="/test" /> }    
        </div>
    )
  }
}

export default Login
