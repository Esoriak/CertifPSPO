import React, { Component } from 'react'
import { Redirect } from 'react-router'
import ListCandidats from "../Components/Candidats.json"


 class Login extends Component {
  state ={
    home: true,
    redirection: false,
    accessdenied : false,
  }

// //******* CONNECTION *********//

 emailCheck = () => {
   // On récupère la donnée fournie par l'utilisateur
   const inputvalue = document.getElementsByClassName('input_email')
   const mail = inputvalue[0].value
  
   // EMAIL CHECKER
    for ( let i=0; i< ListCandidats.length ; i++) {
      if ( mail === ListCandidats[i].mail){
        // Si le mail entré est présent dans la base de candidats connus alors on valide l'accès à la plateforme
          this.setState({
            redirection: true, accessdenied: false,
          })
          localStorage.setItem("mail",mail)
          return
      }
      else if ( mail !== ListCandidats[i].mail) {
        this.setState({
          accessdenied : true
        })
      }
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
                {this.state.accessdenied && <small className="access_denied_message">Aucun compte ne correspond à cette adresse email.</small> }
                <div className="login-email">
                    <input type="email" className="input_email" placeholder="mail@mail.com"/>
                </div>
                
              <div className="input_button connect_button input_button__active" onClick={this.emailCheck}>Accéder à la plateforme</div>
            </div>
            </div>
        }  

      {this.state.redirection && <Redirect to="/test" /> }    
        </div>
    )
  }
}

export default Login
