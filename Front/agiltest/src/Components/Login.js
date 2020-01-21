import React, { Component } from 'react'
import {NavLink} from "react-router-dom"
import './Style.css'

 class Login extends Component {
  state ={
    validation : false,
  }

// //******* CONNECTION *********//

 emailCheck = (val) => {
   const mail =val.target.value
   console.log("email", val.target.value)
   
//   // EMAIL CHECKER
//  /* if(val.indexOf("@")<=0){
//      console.log("nope");
//      }else{
//          console.log("presque");
//          if(val.indexOf(".")>=0 && val.indexOf(".")>val.indexOf("@")+1 && val.indexOf(".")<val.length-2){
//              console.log ("GOOOOOOOOOOO");
//          }
//      }*/
  
   // EMAIL EXTENSION CHECKER
   if(mail.indexOf("cdc.com") >=4){
     console.log("ok")
     this.setState({
       validation : true
     })
     const connect = document.getElementsByClassName('connect_button')
     console.log("ya quoi", connect)


   }
//       $('.connect_button').addClass('input_button__active');
//       //CONNECT OK
//       $('.connect_button.input_button__active').click(function(){
//           connectOK();
//       })
//      }else{
//          $('.connect_button').removeClass('input_button__active');
//      }
 }

// connectOK(){
    
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
       <div className="main_container">
            <div className="card welcome_card">
            <h1>Bienvenue sur notre plateforme d’entrainement à la certification PSPO !</h1>
            <p>Veuillez entrer <b>votre adresse email</b> pour pouvoir accéder à notre questionnaire qui permettra de tester les connaissances requises afin d’obtenir la certificaiton PSPO.</p>
            <div className="login-email">
                <input type="email" className="input_email" placeholder="mail@mail.com" onKeyPress={this.emailCheck} />
            </div>
            
            <div className="input_button input_button__inactive connect_button">Accéder à la plateforme</div>
        </div>
       <div className="card start_card">
            <h1>Vous êtes connecté !</h1>
            <p>Vous pouvez dès maintenant accéder à notre test d'entrainement à la certification PSPO</p>
            
           <div className="quizz_choices">
               <p>Sélectionnez la durée du test :</p>
               <div className="quizz_choice quiz_short" id="quizz_choice_20" onClick="chooseQuizz(20)" >15 min <br/><span className="minor_txt">(20 Questions)</span></div>
               <div className="quizz_choice quiz_medium" id="quizz_choice_40" onClick="chooseQuizz(40)" >30 min <br/><span className="minor_txt">(40 Questions)</span></div>
               <div className="quizz_choice quizlong"  id="quizz_choice_80" onClick="chooseQuizz(80)" >60 min <br/><span className="minor_txt">(80 Questions)</span></div>
           </div>
           
           <NavLink path to="/quizz"><div className="input_button input_button__inactive start_button">Commencer le test</div></NavLink>
        </div>
        </div>
        <footer>
            <a href="www.monsieurguiz.fr" className="footer__byMG_link">
                <img src="./imgs/byMG.svg" alt="by Monsieur Guiz" />
            </a>
        </footer>
        </div>
    )
  }
}

export default Login
