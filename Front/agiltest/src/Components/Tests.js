import React, { Component } from 'react'
import axios from 'axios'

import './Tests.css'

const Questionnaire = []
let questions =[]
let choixUnique =0
let choixMultiple =[]
let score =0

 class Tests extends Component {
  state ={
    tests : [],
    pointQuestions : 0,
    questions: [],
    choices: [],
    choices_selected : [],
    right_answers : 0,
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
   console.log('là les choix', choices.data)
   this.setState({
     choices : choices.data
   })
 }



RandomQuestionnaire = () => {
    // Tant que le tableau n'a pas 80 nombres uniques on lance la requête
   while (questions.length < 80) {
      // On récupère un nombre aléatoire compris entre 0 et 150 ( le nombre de questions exploitables pour le moment)
      const random = Math.floor(Math.random() * 150)
      // On copie le nombre dans le tableau des questions
      questions.push(random+1)
    }   
    // Si le tableau de nombre est egal à 80 on vérifie que toutes les valeurs sont uniques
   if (questions.length == 80) {
      questions = [... new Set(questions)]
      // Si le tableau de nombre uniques est égal à 80, on lance une boucle qui va remplir le questionnaire
      if (questions.length == 80) {
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


  StockChoice = () => {
    if (choixUnique !=0 ) {
      //  console.log("je cherche ca",choixUnique)
     let lechoix = this.state.choices.filter(choices => choices.idChoice == choixUnique.id)
    //  console.log("lechoix", lechoix)
       this.setState({
          choices_selected : [...this.state.choices_selected, lechoix[0] ] 
        })
        // console.log('et je trouve ça', this.state.choices_selected)
        // console.log("la value est ", lechoix[0].value)
         if (lechoix[0].value == 1) {
           score = score  + this.state.pointQuestions
           console.log("mon score", score)
           this.setState({
             right_answers : this.state.right_answers +1
           })
         }
         choixUnique=0
    }
    // Si le tableau des choix multiples à été rempli :
    else if ( choixMultiple.length != 0) {
      // on initie un tableau vide qui recevra l'objet entier des choix séléctionnés ; le nombre de réponses justes attendues; et un tableau comportant tous les choix
      // possibles associés à la question
      let leschoix = []
      let reponsesattendues =0
      let Allanswers = []
      // console.log("le tableau des choix multiples", choixMultiple)
      //Pour la  longueur du tableau des choix multiples
      for (let i =0; i < choixMultiple.length; i++) {
        // On filtre dans la liste des choix ceux qui ont été séléctionnés pour stocker l'objet entier
         let hischoice = this.state.choices.filter(choices => choices.idChoice == choixMultiple[i])
         leschoix.push(hischoice)
         // on récupère l'id de la question associé au choix fait - le premier suffit -
         let idquest = hischoice[0].idQuestions
         // on récupère tous les choix associés à la question posée
         Allanswers = this.state.choices.filter(choices => choices.idQuestions == idquest)
         console.log("tous les choix possibles", Allanswers)
         // Si la valeur d'un choix est egale a 1 c'est que la réponse est juste, on parcours à nouveau le tableau pour finir la boucle et stocker le nombre de réponses justes attendues
         if (Allanswers[i].value === 1) {
             reponsesattendues = reponsesattendues + 1
        }
         console.log("je veux", reponsesattendues, "réponses")
         //on stock quoi qu'il arrive les choix faits par le candidat dans un tableau ( lui même dans un tableau ), pour l'affichage final
        this.setState({
          choices_selected : [...this.state.choices_selected, leschoix]
        })
        // console.log(" les choix faits sont", this.state.choices_selected)
        let bonnesreponses = leschoix.filter(choix => choix[0].value == 1)
        console.log("bonnes reponses", bonnesreponses.length)
        // on va filtrer les choix a valeur true, et si le nombre est le même que le nombre de réponses attendues, on ajoute le nombre de points de la question
        if ( bonnesreponses.length === reponsesattendues) {
          score = score + this.state.pointQuestions
          this.setState({
            right_answers : this.state.right_answers +1
          })
        }
        console.log("mon score est de :", score)
      } choixMultiple =[]
    }
         this.setState({ displayQuestion : this.state.displayQuestion+1 , previousQuestion: this.state.previousQuestion+1})
         this.StyleButtonChoices()
  }

  handleCheck = (e) => {
    // choixUnique =0
     let unchoix = e.target
     console.log("c'est ok ou pas ?",unchoix)
    choixUnique = unchoix
  }

  handleCheckMultipleAnswer =(e) => {
    // console.log("les choix déjà là", choixMultiple)
    let rosis = e.target.id
    let rosarum = e.target.value
    console.log("et c'essssstttt ", rosarum)
    if (choixMultiple.includes(rosis)){
      // console.log("c'est deja la", rosis)
      let indexOfChoice = choixMultiple.indexOf(rosis)
      // console.log('il ets en position', indexOfChoice)
      choixMultiple.splice(indexOfChoice, 1)
      // console.log("ducoup il est parti")
    } else {
      choixMultiple.push(rosis)
      // console.log("ca y etait pas, on l'a mis !", rosis)
    }
    // console.log("la gueule du tableau", choixMultiple)
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
        <div class="main_container questions_container">
            <div class="card question_card question_current">
            <h1>Question {displayQuestion}</h1>
            {/* {ready ? this.GetAllChoices() : null } */}
            {ready ? questionnaire.slice(previousQuestion, displayQuestion).map(i =>
            
            <div key={i[0].idQuestions }>
              <p className="question"> {i[0].Question} </p>
              <div class="checkbox_question">
                <ul class="answer_list">
              
              {multiple_answer ? 
              
              questionnaire.slice(previousQuestion, displayQuestion).map(i =>
              
              i[1].map(choices =>
                 <div>
                 <input type="checkbox"  id={choices.idChoice} value={choices.value} name={i[0].idQuestions} onChange={this.handleCheckMultipleAnswer} /> {choices.answer}
              </div>))
                :

                questionnaire.slice(previousQuestion, displayQuestion).map(i =>
                  i[1].map(choices =>
                <div>
                <input type="radio" id={choices.idChoice} value={choices.value} name={i[0].idQuestions}  onChange={this.handleCheck} /> {choices.answer}
                
                </div>)
                )
               }
              </ul>
              </div>
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

              <button onClick={this.StockChoice} className="Next"> Suivant</button>
          </div>
          <h2> {displayQuestion} / 80</h2>
        </div>
      </div>
    )
  }
}

export default Tests
