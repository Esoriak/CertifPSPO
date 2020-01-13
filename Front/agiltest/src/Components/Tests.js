import React, { Component } from 'react'
import axios from 'axios'
import Buttontest from './Buttontest'

const Questionnaire = []
const questions =[]

export class Tests extends Component {
  state ={
    tests : [],
    questions: [],
    choices: [],
  }


 GetDataTests = async() => {
   const tests =  await axios.get('http://localhost:4000/quizz/tests')
   console.log('voilà les tests',tests.data)
     this.setState({
       tests : tests.data
     })
 }

 GetDataQuestions = async() => {
   const questions = await axios.get('http://localhost:4000/quizzquestions/questions')
    console.log('ici les questions', questions.data)
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


Verif = (random) => {
  if (questions.find( el => el === random)) {
    console.log("t'as deja eu un gateau toi", questions)
    questions.pop()  
    console.log("rends moi le gateau", questions)
  } 
}

RandomQuestionnaire = () => {
  // On éxécute la requête 80 fois
   for (let i=0 ; i <80 ; i++) {
     // On récupère un nombre aléatoire compris entre 0 et 150
    const random = Math.floor(Math.random() * 150)
    // On copie le nombre dans le tableau des questions
    questions.push(random)
    // On lance une fonction de vérification pour éviter les doublons
    this.Verif(random)
    // On cherche l'id de la question correspondant au chiffre random dans notre base de données et on la copie dans le tableau du questionnaire
    Questionnaire.push(this.state.questions.filter(res => res.idQuestions === random))
    // En restant dans le meme index que la question, on recherche dans notre base de données les choix ayant pour clés étranngères d'idQuestions
    // le chiffre random et on copie le choix dans le tableau du questionnaire
    Questionnaire[i].push(this.state.choices.filter(res => res.idQuestions === random ))
    console.log("le questionnaire", Questionnaire)
    // console.log("le tableau des id de questions", questions)
 } console.log("le tableau des id de questions", Questionnaire.map(res => res[0].idQuestions))
}

componentDidMount =() => {
  this.GetDataTests()
  this.GetDataQuestions()
  this.GetDataChoices()
}

  render() {

    const {
      tests,
      questions,
      choices
    } = this.state

    return (
      <div>
        {/* {tests.map(res => <Buttontest {...res} onClick={this.GoQuizz(res.idTests)} />)} */}
        {/* {questions.map(result => <p key={result.idQuestions}>  {result.Question}</p>)} */}
        <button onClick={this.RandomQuestionnaire}> Random</button>
      </div>
    )
  }
}

export default Tests
