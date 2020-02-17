import React, { Component } from 'react'
import {NavLink} from "react-router-dom"

import ListCandidats from "./Candidats.json"


 class Login extends Component {
  state ={
    home: true,
    validation : false,
  }

// //******* CONNECTION *********//

 emailCheck = () => {
   // On récupère la donnée fournie par l'utilisateur
   const inputvalue = document.getElementsByClassName('input_email')
   const mail = inputvalue[0].value
  //  console.log("email", mail)
  
   // EMAIL CHECKER
    for ( let i=0; i< ListCandidats.length ; i++) {
      if ( mail === ListCandidats[i].mail){
        // Si le mail entré est présent dans la base de candidats connus alors on valide l'accès à la plateforme
          this.setState({
            validation: true
          })
      }
    }
}


  render() {
    return (
      <div>

{this.state.home ? 
                <div className="main_container">
                <div className="card welcome_card">
                <h1>Bienvenue sur notre plateforme d’entrainement à la certification PSPO !</h1>
                <p>Veuillez entrer <b>votre adresse email</b> pour pouvoir accéder à notre questionnaire qui permettra de tester les connaissances requises afin d’obtenir la certification PSPO.</p>
                <div className="login-email">
                    <input type="email" className="input_email" placeholder="mail@mail.com"/>
                    <button type="button" onClick={this.emailCheck}>Valider</button>
                </div>
                
               {this.state.validation ? <NavLink to="/test" className="link"><div className="input_button connect_button input_button__active" >Accéder à la plateforme</div></NavLink> : <div className="input_button input_button__inactive connect_button">Accéder à la plateforme</div> } 
            </div>
            </div>
        
      :
      null }      
        </div>
    )
  }
}

export default Login
