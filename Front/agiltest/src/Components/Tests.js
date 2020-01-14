import React, { Component } from 'react'
import axios from 'axios'

import './Tests.css'
import Buttontest from './Buttontest'

const Questionnaire = []
let questions =[]

 class Tests extends Component {
  state ={
    tests : [],
    questions: [],
    choices: [],
    questionnaire : [],
    ready : false,
    displayQuestion : 1,
    previousQuestion : 0,
  }


 GetDataTests = async() => {
   const tests =  await axios.get('http://localhost:4000/quizz/tests')
  //  console.log('voilà les tests',tests.data)
     this.setState({
       tests : tests.data
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
    }
    else {
      // Si le tableau de nombre unique n'atteint pas les 80 on relance le random pour le completer
      // console.log("on relance")
      this.RandomQuestionnaire()
    }
  }
}

  NextQuestion = () => {
    this.setState({ displayQuestion : this.state.displayQuestion+1 , previousQuestion: this.state.previousQuestion+1})
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
      displayQuestion
  
    } = this.state

    return (
      <div>
        {ready == false ? <button onClick={this.RandomQuestionnaire}> Lancer le quizz </button> : null }

          <div className="Card-question">
             <h2 className="number-question"> Question {displayQuestion}</h2>
            {ready ? questionnaire.slice(previousQuestion, displayQuestion).map(i =>
            <div key={i[0].idQuestions}>
              <p className="question">
                {i[0].Question}
              </p>
                {i[1].map(choice =>
                 <p><input type="checkbox"></input> {choice.answer} </p>)
                }
            </div>
            )
  
            : null
              }


              <button onClick={this.NextQuestion} className="Next"> Suivant</button>
          </div>
    
      </div>
    )
  }
}

export default Tests
