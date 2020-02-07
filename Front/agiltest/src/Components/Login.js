import React, { Component } from 'react'
import {NavLink} from "react-router-dom"


 class Login extends Component {
  state ={
    home: true,
    validation : false,
  }

// //******* CONNECTION *********//

 emailCheck = (val) => {
   const mail =val.target.value
  //  console.log("email", val.target.value)
  
   // EMAIL EXTENSION CHECKER
   if(mail.indexOf("@ccomptes.fr") >=4){
    //  console.log("ok")
     this.setState({
       validation : true
     })
     const connect = document.getElementsByClassName('connect_button')
    //  console.log("ya quoi", connect)
   }
   else {
     this.setState({
       validation : false
     })
   }
 }




//   // HIDE WELCOME CARD
//   $('.welcome_card').animate({
//       opacity: 0,
//       left: "-=50",
//     }, 250, function() {
//       // Animation complete.
//        $('.welcome_card').css("display","none");
      
//        //SHOW START CARD
//       $('.start_card').css("display","flex");

//       $('.start_card').animate({
//           opacity: 1,
//           left: "0",
//         }, 250, function() {
//           // Animation complete.
//       });
//   });
  
// }
// //******* END-CONNECTION *********//



  render() {
    return (
      <div>

{this.state.home ? 
                <div className="main_container">
                <div className="card welcome_card">
                <h1>Bienvenue sur notre plateforme d’entrainement à la certification PSPO !</h1>
                <p>Veuillez entrer <b>votre adresse email</b> pour pouvoir accéder à notre questionnaire qui permettra de tester les connaissances requises afin d’obtenir la certificaiton PSPO.</p>
                <div className="login-email">
                    <input type="email" className="input_email" placeholder="mail@mail.com" onChange={this.emailCheck} />
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
