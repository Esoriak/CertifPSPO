import React, { Component } from 'react'
import axios from 'axios'

import './Tests.css'
import Buttontest from './Buttontest'

const Questionnaire = []
let questions =[]
let choix = ''

 class Tests extends Component {
  state ={
    tests : [],
    pointQuestions : 0,
    questions: [],
    choices: [],
    choices_selected : [],
    questionnaire : [],
    ready : false,
    displayQuestion : 1,
    previousQuestion : 0,
    multiple_answer : false,
    score : [],
  }


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
  //  console.log('là les choix', choices.data)
   this.setState({
     choices : choices.data
   })
 }



RandomQuestionnaire = () => {
    // Tant que le tableau n'a pas 80 nombre uniques on lance la requête
   while (questions.length < 80) {
    // On récupère un nombre aléatoire compris entre 0 et 150 ( le nombre de questions exploitables pour le moment)
   const random = Math.floor(Math.random() * 150)
   // On copie le nombre dans le tableau des questions
   questions.push(random+1)
    }   
    // Si le tableau de nombre est egal a 80 on vérifie que toutes les valeurs sont uniques
   if (questions.length == 80) {
    questions = [... new Set(questions)]
   // Si le tableau de nombre uniques est égal à 80, on lance une boucle qui va remplir le questionnaire
    if (questions.length == 80) {
      console.log("la fin", questions)
      console.log("chuck norris gagne toujours")
      for (let i=0; i< questions.length; i++) {
        // On cherche l'id de la question correspondant au chiffre random dans notre base de données et on la copie dans le tableau du questionnaire
        Questionnaire.push(this.state.questions.filter(res => res.idQuestions === questions[i]))
        // En restant dans le meme index que la question, on recherche dans notre base de données les choix ayant pour clés étrangères d'idQuestions
        // le chiffre random et on copie le choix dans le tableau du questionnaire
        Questionnaire[i].push(this.state.choices.filter(res => res.idQuestions === questions[i] ))
      }
      // J'affiche le questionnaire pour vérifier la structure de celui-ci et je le copie dans sa state
      console.log(" le questionnaire : ", Questionnaire)
      this.setState({
        questionnaire : Questionnaire, ready : true
      })
       this.FirstStyleButtonChoices()
    }
    else {
      // Si le tableau de nombre unique n'atteint pas les 80 on relance le random pour le completer
      // console.log("on relance")
      this.RandomQuestionnaire()
    }
  } 
}

  StyleButtonChoices = () => {
    const quest = Questionnaire.slice(this.state.previousQuestion,this.state.displayQuestion)
   console.log("la question", quest)
   console.log("nb points / question", this.state.pointQuestions)
    if (quest[0][0].Multiple === 0) {
      this.UniqueAnswer()
       console.log("choix unique")
    }
    else if (quest[0][0].Multiple === 1) {
      this.MultipleAnswer()
      console.log("choix multiple")
    }
  }

  FirstStyleButtonChoices = () => {
    const quest = Questionnaire[0]
   console.log("la première question", quest[0].Multiple)
    if (quest[0].Multiple === 0) {
      this.UniqueAnswer()
      console.log("choix unique")
    }
    else if (quest[0].Multiple === 1) {
      this.MultipleAnswer()
       console.log("choix multiple")
    }
  }

  NextQuestion = () => {
    this.setState({ displayQuestion : this.state.displayQuestion+1 , previousQuestion: this.state.previousQuestion+1})
    this.StyleButtonChoices()

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


  StockChoice = () => {
    const tutu = this.state.choices.filter(choice => choice === choix)
    console.log("tutu", tutu)
    // this.setState({
    //   choices_selected : 
    // })
  }

  handleCheck = (e) => {
    choix = ''
     // const choix = document.getElementById(choices)
     let id = e.target.id
     let toto = e.target.value
    console.log("c'est :", id)
    console.log("la reponse est : ", toto) 
    choix = id
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
  
    } = this.state

    return (
      <div>
        {ready === false ? <button onClick={this.RandomQuestionnaire}> Lancer le quizz </button> : <h3> Quizz Product Owner</h3> }
        
          <div className="Card-question">
             <h2 className="number-question"> Question {displayQuestion}</h2>
            {/* {ready ? this.GetAllChoices() : null } */}
            {ready ? questionnaire.slice(previousQuestion, displayQuestion).map(i =>
            
            <div key={i[0].idQuestions }>
                 <p className="question">
                {i[0].Question}
              </p>
              {multiple_answer ? 
              
              questionnaire.slice(previousQuestion, displayQuestion).map(i =>
              
              i[1].map(choices =>
                 <div>
                 <input type="checkbox"  id={choices.idChoice} onChange={this.handleCheck} value={choices.answer} /> {choices.answer}
              </div>))
                :

                questionnaire.slice(previousQuestion, displayQuestion).map(i =>
                  i[1].map(choices =>
                <div>
                <input type="radio" id={choices.idChoice} value={choices.answer} name={i[0].idQuestions}  onChange={this.handleCheck} /> {choices.answer}
                
                </div>)
                )
               }

            </div>)
              : null}



            {/* {multiple_answer  ? makeachoice.map(choices => 
            <div>
              <input type="checkbox"  id={choices.idChoice} onChange={this.handleCheck} value={choices.answer} />{choices.answer}
            </div>)
                : 
                makeachoice.map(choices => 
                <div>
                <input type="radio" id={choices.idChoice} value={choices.answer} name={i[0].Question}  onChange={this.handleCheck} />{choices.answer}
                
                </div>) }  
 */}

              <button onClick={this.NextQuestion} className="Next"> Suivant</button>
          </div>
          <h2> {displayQuestion} / 80</h2>
    
      </div>
    )
  }
}

export default Tests
