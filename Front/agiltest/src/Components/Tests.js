import React, { Component } from 'react'
import axios from 'axios'

import './Tests.css'

const Questionnaire = []
let questions =[]
let choix = []
let score =0


 class Tests extends Component {
  state ={
    tests : [],
    pointQuestions : 1000,
    questions: [],
    choices: [],
    choices_selected : [],
    right_answers : 0,
    questionnaire : [],
    ready : false,
    finish: false,
    checked : false,
    displayQuestion : 1,
    previousQuestion : 0,
    multiple_answer : false,
    score : [],
  }


/////////////////////////// RECUPERATION DES INFORMATIONS DE LA DATABASE ///////////////////////////////////////





 GetDataTests = async() => {
   const tests =  await axios.get('http://localhost:4000/quizz/tests')
    console.log('voilà les tests',tests.data)
     this.setState({
       tests : tests.data, pointQuestions: tests.data[5].PointsQuestion
     })
 }

 GetDataQuestions = async() => {
   const questions = await axios.get('http://localhost:4000/quizzquestions/questions')
    // console.log('ici les questions', questions.data)
    this.setState({
      questions : questions.data
    })
 }

 GetDataChoices = async() => {
   const choices = await axios.get('http://localhost:4000/quizzchoices/choices')
   console.log('là les choix', choices.data)
   this.setState({
     choices : choices.data
   })
 }






/////////////// CREATION D'UN QUESTIONNAIRE UNIQUE , RANDOM, SANS DOUBLONS, STOCKER EN STATE //////////////////////////






RandomQuestionnaire = () => {
    // Tant que le tableau n'a pas 80 nombres uniques on lance la requête
   while (questions.length < 10) {
      // On récupère un nombre aléatoire compris entre 0 et 150 ( le nombre de questions exploitables pour le moment)
      const random = Math.floor(Math.random() * 150)
      // On copie le nombre dans le tableau des questions
      questions.push(random+1)
    }   
    // Si le tableau de nombre est egal à 80 on vérifie que toutes les valeurs sont uniques
   if (questions.length == 10) {
      questions = [... new Set(questions)]
      // Si le tableau de nombre uniques est égal à 80, on lance une boucle qui va remplir le questionnaire
      if (questions.length == 10) {
          for (let i=0; i< questions.length; i++) {
              // On cherche l'id de la question correspondant au chiffre random dans notre base de données et on la copie dans le tableau du questionnaire
              Questionnaire.push(this.state.questions.filter(res => res.idQuestions === questions[i]))
              // En restant dans le meme index que la question, on recherche dans notre base de données les choix ayant pour clés étrangères d'idQuestions
              // le chiffre random et on copie le choix dans le tableau du questionnaire
              Questionnaire[i].push(this.state.choices.filter(res => res.idQuestions === questions[i] ))
          }
          // J'affiche le questionnaire pour vérifier la structure de celui-ci et je le copie dans sa state
          this.setState({  questionnaire : Questionnaire, ready : true })
          this.FirstStyleButtonChoices()
      }
      else {
          // Si le tableau de nombre unique n'atteint pas les 80 on relance le random pour le completer
          this.RandomQuestionnaire()
      }
    } 
}





/////////////////////////////////////////// VERIFICATION DU STYLE DE BOUTONS ATTENDUS - CHOIX UNIQUE OU CHOIX MULTIPLE ///////////////////////////////







  StyleButtonChoices = () => {
    const quest = Questionnaire.slice(this.state.previousQuestion+1,this.state.displayQuestion+1)
   console.log("la question", quest)
  //  console.log("nb points / question", this.state.pointQuestions)
    if (quest[0][0].Multiple === 0) {
      this.UniqueAnswer()
      //  console.log("choix unique")
    }
    else if (quest[0][0].Multiple === 1) {
      this.MultipleAnswer()
      // console.log("choix multiple")
    }
  }

  FirstStyleButtonChoices = () => {
    const quest = Questionnaire[0]
  //  console.log("la première question", quest[0].Multiple)
    if (quest[0].Multiple === 0) {
      this.UniqueAnswer()
    }
    else if (quest[0].Multiple === 1) {
      this.MultipleAnswer()
    }
  }
  

  MultipleAnswer = () => {
    this.setState({
      multiple_answer : true
    })
  }

  UniqueAnswer = () => {
    this.setState({
      multiple_answer : false
    })
  }





////////////////////////////////////////  STOCKAGE DU CHOIX DU CANDIDAT POUR LE CALCUL DU SCORE ET L'AFFICHAGE FINAL ///////////////////////////////


//         bonnesreponses = leschoix.filter(choix => choix[0].value === 1)
//         console.log("nb de bonnes reponses", bonnesreponses.length)
//         // // on va filtrer les choix a valeur true, et si le nombre est le même que le nombre de réponses attendues, on ajoute le nombre de points de la question
//         // console.log("mon score est de :", score)
//       }

//     }
// if (reponsesattendues !=0) {
//       if ( bonnesreponses.length === reponsesattendues) {
//       score = score + this.state.pointQuestions
//       this.setState({
//         right_answers : this.state.right_answers +1
//       })
//       console.log("mon score est de :", score)
//     }
//     else if ( bonnesreponses < reponsesattendues) {
//       score = score
//       console.log("mon score reste de :", score)
//     }


  StockChoice = () => {
    const leschoix = []
    let reponsesattendues =0
    let bonnesreponses =[]
    let Allanswers = []
     // on initie un tableau vide qui recevra l'objet entier des choix séléctionnés ; le nombre de réponses justes attendues; et un tableau comportant tous les choix
     // possibles associés à la question
     // Pour la  longueur du tableau des choix
     // On filtre dans la liste des choix ceux qui ont été séléctionnés pour stocker l'objet entier
    for (let i =0; i < choix.length; i++) {
      console.log("la data", choix)
      leschoix.push(this.state.choices.filter(choices => choices.idChoice == choix[i]))
      console.log("totoro", leschoix)
      // on récupère l'id de la question associé au choix fait - le premier suffit -
      let idquest = leschoix[0][0].idQuestions
      // on récupère tous les choix associés à la question posée
      Allanswers = this.state.choices.filter(choices => choices.idQuestions == idquest)
      // Si la valeur d'un choix est egale a 1 c'est que la réponse est juste, on parcours à nouveau le tableau pour finir la boucle et stocker le nombre de réponses justes attendues
     
      reponsesattendues = Allanswers.filter(res => res.value === 1)
      // console.log("ALL ANSWERS",reponsesattendues)
      // console.log("je veux", reponsesattendues.length, " bonnes réponses")
    }
    if(leschoix.length > 1) {
        this.setState({
          choices_selected : [...this.state.choices_selected, leschoix]
        })
        // console.log("yaviat plsrs choix", this.state.choices_selected) 
    }
    else {
      this.setState({
        choices_selected : [...this.state.choices_selected, leschoix[0][0]]
      })
      // console.log("choix simple ixi ", this.state.choices_selected)
    }
    bonnesreponses = leschoix.filter(choix => choix[0].value === 1)
    console.log("nb de bonnes reponses", bonnesreponses.length)
    if (leschoix.length === reponsesattendues.length) {
       if ( bonnesreponses.length === reponsesattendues.length) {
      score = score + this.state.pointQuestions
      this.setState({ right_answers : this.state.right_answers +1 })
        }
        else {
          console.log("tu as une mauvaise réponse")
        }
    }
    else {
      console.log("tu n'as pas coché le nombre de réponses attendues.")
    }
    choix =[]
    this.setState({ displayQuestion : this.state.displayQuestion+1 , previousQuestion: this.state.previousQuestion+1 ,  checked : false, })
    this.StyleButtonChoices()
    console.log("la state",this.state.choices_selected)
    console.log("ton score", score)
     }




  
  handleCheck = (e) => {
    let select = e.target.id
    let selecttype = e.target.type
    let selectvalue = e.target.value
    console.log("et c'est",selectvalue)
      if( selecttype === 'checkbox') {
        if (choix.includes(select)) {
          let indexOfChoice = choix.indexOf(select)
          choix.splice(indexOfChoice, 1)
        }
        else {choix.push(select)}
        console.log("les choix sont :", choix)
      }
      else if ( selecttype === 'radio') {
        choix = []
        choix.push(select)
        console.log("le choix est :", choix)
      }
      this.ActiveNext()
  }


  FinishTest = () => {
    this.setState({ finish : true, ready : false })
    score = score / 100
  }

  //////////////////////// VERIFICATION POUR QUE LE CANDIDAT CHOISSISSE UNE REPONSE POUR PASSER A LA QUESTION SUIVANTE //////////////////////////





  

  ActiveNext = () => {

    if (choix.length >=1 ) {
      this.setState({
        checked : true
      })
    }
    else if ( choix.length === 0) {
      this.setState({ 
        checked : false
      })
    }
  }

componentDidMount =() => {
  this.GetDataTests()
  this.GetDataQuestions()
  this.GetDataChoices()
}


  render() {

    const {
      ready, 
      questionnaire,
      previousQuestion,
      displayQuestion,
      multiple_answer,
      checked,
      finish,
  
    } = this.state

    return (
      <div>
        {ready === false ? <button onClick={this.RandomQuestionnaire}> Lancer le quizz </button> : <h3> Quizz Product Owner</h3> }
        {
          
          ready ? 
                <div className="main_container questions_container">
            <div className="card question_card question_current">
            <h1>Question {displayQuestion}</h1>
            {/* {ready ? this.GetAllChoices() : null } */}
            {ready ? questionnaire.slice(previousQuestion, displayQuestion).map(i =>
            
            <div key={i[0].idQuestions }>
              <p className="question"> {i[0].Question} </p>
              <div className="checkbox_question">
                <ul className="answer_list">
              
              {multiple_answer ? 
              
              questionnaire.slice(previousQuestion, displayQuestion).map(i =>
              
              i[1].map(choices =>
                <li className="answer answer_checkbox"  >
                  <input type="checkbox" className="input input_checkbox" id={choices.idChoice} value={choices.value} name={i[0].idQuestions} onChange={this.handleCheck} />
                  <label for={choices.idChoice} className="answer_label">{choices.answer}</label>
                </li >))
                :

                questionnaire.slice(previousQuestion, displayQuestion).map(i =>
                
                i[1].map(choices =>
                  <li className="answer answer_radio" >
                    <input type="radio" className="input input_radio" id={choices.idChoice} value={choices.value} name={i[0].idQuestions}  onChange={this.handleCheck} />
                    <label for={choices.idChoice} className="answer_label">{choices.answer}</label>
                    <div className="radio_check"></div>
                </li >))
              }
                </ul>
              </div>
            </div>)
              : null}

                {displayQuestion < 10 ? this.state.checked ? <button onClick={this.StockChoice} className="input_button input_button__active connect_button"> Suivant</button> : <button className="input_button connect_button"> Suivant </button>  :  <button onClick={this.FinishTest} className="input_button input_button__active connect_button"> Terminer </button>}

          </div>
          <h2> {displayQuestion} / 80</h2>
        </div>
      : null}
            {finish ? 
            <div>
            <h1> Tu as {score} % de réponses justes.</h1>
            <h3>{this.state.right_answers}/10</h3>
            </div>
          : null}
              <footer>
              <a href="www.monsieurguiz.fr" className="footer__byMG_link">
                  <img src="imgs/byMG.svg" alt="by Monsieur Guiz" />
              </a>
          </footer>
    </div>
    )
  }
}

export default Tests
