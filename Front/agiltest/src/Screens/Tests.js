import React, { Component } from 'react'
import axios from 'axios'

import '../App.css'

let Questionnaire = []
let questions = []
let choix = []
let score = 0
let index= 0
let choixselection = []
let nbquestion = 20
let PointsQuestion = 500
const nbminichoix = 1
let idtest = 0



class Tests extends Component {
  state = {
    welcome: true,
    tests: [],
    idtest: idtest,
    pointQuestions: PointsQuestion,
    questions: [],
    checked: false,
    choices: [],
    right_answers: 0,
    questionnaire: [],
    ready: false,
    finish: false,
    displayQuestion: 1,
    previousQuestion: 0,
    multiple_answer: false,
    score: 0,
    log : false,
    minutes : 60,
    seconds : 0,
    timeout : false,
  }

  //////////////////////// VERIFICATION DU LOG ////////////////////////////////////////////////////////////

  VerifiedLog =() => {
    const logvalue = localStorage.getItem('tokenmail')
    if (logvalue === null) {
      return
    }
    else if (logvalue !== null) {
      this.setState({
        log : true
      })
    }
  }

  /////////////////////////// RECUPERATION DES INFORMATIONS DE LA DATABASE ///////////////////////////////////////


  GetDataTests = async () => {
    let PathApi = process.env.REACT_APP_PATH_API_DEV + '/quizz/tests'
    if (process.env.NODE_ENV === 'production') {
      PathApi = process.env.REACT_APP_PATH_API_PROD + '/quizz/tests'
    }
    const tests = await axios.get(PathApi)
    this.setState({
      tests: tests.data,
    })
  }

  GetDataQuestions = async () => {
    let PathApi = process.env.REACT_APP_PATH_API_DEV + '/quizzquestions/questions'
    if (process.env.NODE_ENV === 'production') {
      PathApi = process.env.REACT_APP_PATH_API_PROD + '/quizzquestions/questions'
    }
    const questions = await axios.get(PathApi)
    this.setState({
      questions: questions.data
    })
  }

  GetDataChoices = async () => {
    let PathApi = process.env.REACT_APP_PATH_API_DEV + '/quizzchoices/choices'
    if (process.env.NODE_ENV === 'production') {
      PathApi = process.env.REACT_APP_PATH_API_PROD + '/quizzchoices/choices'
    }
    const choices = await axios.get(PathApi)
    this.setState({
      choices: choices.data
    })
  }

  /////////////// MODIFICATION DES VARIABLES AU CHOIX DU QUIZZ //////////////////////////

 UpdateLengthQuizz20 = () => {
  const newNbQuestion = 20
  nbquestion = newNbQuestion
  PointsQuestion = 500
  idtest =4
  this.setState({
    pointQuestions : PointsQuestion, minutes : 1, seconds : 0, idtest : idtest,
  })
  const button_type_test = document.getElementById("quizz_choice_20")
  button_type_test.classList.toggle('quizz_active')
 }

 UpdateLengthQuizz40 = () => {
  const newNbQuestion = 40
  nbquestion = newNbQuestion
  PointsQuestion = 250
  idtest =5
  this.setState({
    pointQuestions : PointsQuestion, minutes: 2, seconds : 0, idtest :idtest,
  })
  const button_type_test = document.getElementById("quizz_choice_40")
  button_type_test.classList.toggle('quizz_active')
 }

 UpdateLengthQuizz80 = () => {
  const newNbQuestion = 80
  nbquestion = newNbQuestion
  PointsQuestion = 125
  idtest =6
  this.setState({
    pointQuestions : PointsQuestion, minutes : 60, seconds : 0, idtest :idtest,
  })
  const button_type_test = document.getElementById("quizz_choice_80")
  button_type_test.classList.toggle('quizz_active')
 }

  /////////////// CREATION D'UN QUESTIONNAIRE UNIQUE , RANDOM, SANS DOUBLONS, STOCKER EN STATE //////////////////////////

ReloadTest = async() => {
  window.location.reload();
}
  

  RandomQuestionnaire = () => {
    // Tant que le tableau n'a pas 80 ( ou nb utilisé ) questions uniques on lance la requête
    while (questions.length < nbquestion) {
      // On récupère un nombre aléatoire compris entre 0 et 160 ( le nombre de questions exploitables pour le moment)
      const random = Math.floor(Math.random() * 160)
      // On copie le nombre dans le tableau des questions - on rajoute 1 au chiffre random pour éviter l'index 0
      questions.push(random + 1)
    }
    // Si le tableau de nombre est egal à 80 on vérifie que toutes les valeurs sont uniques
    if (questions.length == nbquestion) {
      questions = [...new Set(questions)]
      // Si le tableau de nombre uniques est égal à 80, on lance une boucle qui va remplir le questionnaire
      if (questions.length == nbquestion) {
        for (let i = 0; i < questions.length; i++) {
          // On cherche l'id de la question correspondant au chiffre random dans notre base de données et on la copie dans le tableau du questionnaire
          Questionnaire.push(this.state.questions.filter(res => res.idQuestions === questions[i]))
          // En restant dans le meme index que la question, on recherche dans notre base de données les choix ayant pour clés étrangères d'idQuestions
          // le chiffre random et on copie le choix dans le tableau du questionnaire
          Questionnaire[i].push(this.state.choices.filter(res => res.idQuestions === questions[i]))
        }
        // J'affiche le questionnaire pour vérifier la structure de celui-ci et je le copie dans sa state
        this.setState({ questionnaire: Questionnaire, welcome: false, ready: true })
        this.FirstStyleButtonChoices()
      }
      else {
        // Si le tableau de nombre unique n'atteint pas les 80 on relance le random pour le completer
        this.RandomQuestionnaire()
      }
    }
  }




  /////////////////////////////////////// VERIFICATION DU STYLE DE BOUTONS ATTENDUS - CHOIX UNIQUE OU CHOIX MULTIPLE ///////////////////////////////



  StyleButtonChoices = () => {
    const quest = Questionnaire.slice(this.state.previousQuestion + 1, this.state.displayQuestion + 1)
    if (quest[0][0].Multiple === 0) {
      this.UniqueAnswer()
    }
    else if (quest[0][0].Multiple === 1) {
      this.MultipleAnswer()
    }
  }

  FirstStyleButtonChoices = () => {
    const quest = Questionnaire[0]
    if (quest[0].Multiple === 0) {
      this.UniqueAnswer()
    }
    else if (quest[0].Multiple === 1) {
      this.MultipleAnswer()
    }
  }


  MultipleAnswer = () => {
    this.setState({
      multiple_answer: true
    })
  }

  UniqueAnswer = () => {
    this.setState({
      multiple_answer: false
    })
  }



  ////////////////////////////////////////  STOCKAGE DU CHOIX DU CANDIDAT POUR LE CALCUL DU SCORE ET L'AFFICHAGE FINAL ///////////////////////////////


  StockChoice = () => {
    let leschoix = []
    let reponsesattendues = 0
    let bonnesreponses = []
    let Allanswers = []
    // on initie un tableau vide qui recevra l'objet entier des choix séléctionnés ; le nombre de réponses justes attendues; et un tableau comportant tous les choix
    // possibles associés à la question
    // Pour la  longueur du tableau des choix
    // On filtre dans la liste des choix ceux qui ont été séléctionnés pour stocker l'objet entier
    for (let i = 0; i < choix.length; i++) {
      leschoix.push(this.state.choices.filter(choices => choices.idChoice == choix[i]))
      // on récupère l'id de la question associé au choix fait - le premier suffit -
      let idquest = leschoix[0][0].idQuestions
      // on récupère tous les choix associés à la question posée
      Allanswers = this.state.choices.filter(choices => choices.idQuestions == idquest)
      // Si la valeur d'un choix est egale a 1 c'est que la réponse est juste, on parcours à nouveau le tableau pour finir la boucle et stocker le nombre de réponses justes attendues
      reponsesattendues = Allanswers.filter(res => res.value === 1)
    }
    // Quoi qu'il arrive, on stocke le résultat du candidat dans un tableau de façon différente selon si c'était un choix unique ou multiple
    if (leschoix.length > nbminichoix) {
      choixselection.push(leschoix)
    }
    else {
      choixselection.push(leschoix[0][0])
    }
    // On créer une variable comportant le nombre de bonnes réponses séléctionnées par le candidat
    bonnesreponses = leschoix.filter(choix => choix[0].value === 1)
    // Si ce nombre est  strictement égal au nombre de réponses attendues alors on lui ajoute le nombre de points / question + 1 bonne réponse supplémentaire 
    if (leschoix.length === reponsesattendues.length) {
      if (bonnesreponses.length === reponsesattendues.length) {
        score = score + this.state.pointQuestions
        this.setState({ right_answers: this.state.right_answers + 1 })
      }
    }
    // on vide le tableau de choix pour la sélection de la prochaine question
    choix = []
    // Si la question affichée est la dernière du questionnaire on lance la fonction finish test
    if (this.state.displayQuestion === nbquestion || this.state.timeout === true) {
      this.FinishTest()
    }
    // Sinon on continue d'avancer dans l'affichage du questionnaire et la vérification des choix multiples ou unique
    else {
      this.setState({ displayQuestion: this.state.displayQuestion + 1, previousQuestion: this.state.previousQuestion + 1, checked: false, })
      this.StyleButtonChoices()
    }
  }



  handleCheck = (e) => {
    let select = e.target.id
    let selecttype = e.target.type
    if (selecttype === 'checkbox') {
      if (choix.includes(select)) {
        let indexOfChoice = choix.indexOf(select)
        choix.splice(indexOfChoice, 1)
          this.ActiveNext_Checkbox()
      }
      else { 
        choix.push(select)
      }
      if(choix.length >= 2){
          this.ActiveNext_Checkbox()
      }
    }
    else if (selecttype === 'radio') {
      choix = []
      choix.push(select)
      if(choix.length ===1 ){
        this.ActiveNext_Radio()
      }
    }
  
  }


  FinishTest = () => {
    this.setState({ finish: true, ready: false })
    clearInterval(this.myInterval)
    this.setState({
      timeout : true,
    })
    score = score / 100
    this.StockResult(this.state.idtest, score)
  }

  //////////////////////// VERIFICATION POUR QUE LE CANDIDAT CHOISISSE UNE REPONSE POUR PASSER A LA QUESTION SUIVANTE //////////////////////////



  ActiveNext_Radio = () => {

    if (choix.length >= 1) {
      this.setState({
        checked: true
      })
    }
    else if (choix.length === 0) {
      this.setState({
        checked: false
      })
    }
  }

  ActiveNext_Checkbox = () =>{
    if (choix.length >1) {
      this.setState({
        checked : true
      })
    }
    else if (choix.length < 2) {
      this.setState({
        checked : false
      })
    }
  }






  GoodChoices = (response) => {
    const goodchoices = response.filter(choices => choices.value === 1)
    if(goodchoices.length < 2) {
          return goodchoices.map(goodchoices => <li className="answer answer_radio correct_answer" key={goodchoices.idChoice}  >
      <input type="radio" className="input input_radio" id={goodchoices.idChoice} value={goodchoices.value} name={goodchoices.idQuestions + 1} disabled={true} checked readOnly />
      <label htmlFor={goodchoices.idChoice} className="answer_label">{goodchoices.answer}</label>
      <div className="radio_check"></div>
    </li >
    )}
    else if ( goodchoices.length > 1) {
      return goodchoices.map(goodchoices => <li className="answer answer_checkbox correct_answer" key={goodchoices.idChoice}  >
      <input type="checkbox" className="input input_checkbox" id={goodchoices.idChoice} value={goodchoices.value} name={goodchoices.idQuestions + 1} disabled={true} checked readOnly />
      <label htmlFor={goodchoices.idChoice} className="answer_label">{goodchoices.answer}</label>
    </li >
      )}
  }







  ShowResultFinal = (obj) => {
          // on incrémente de 1 a chaque tour pour afficher le numéro de la question
    index = index +1
    /////// Si la question est à choix multiple :
    if (obj[0].Multiple === 1) {

   // on initie un compteur de bonnes réponses
   let count_good_response = 0
   // on stock les resultats attendus dans un tableau
   let array_expected = obj[1].filter(choices => choices.value === 1)
   // on stock toutes les réponses envoyées qui comportent plus d'un choix dans un tableau
   const array_send = choixselection.filter(choices => choices.length >1)
   let results_array = array_send.reduce((acc, val) => acc.concat(val), [])
   results_array = results_array.filter(choices => choices[0].idQuestions === obj[0].idQuestions)
       if (results_array.length > 1 ) {
           results_array = results_array.reduce((acc, val) => acc.concat(val) )
       }
    array_expected = array_expected.map(choice => choice.idChoice)
   // SI le nombre de réponses attendues est le même que le nombres de réponses envoyées on va vérifier le contenu
     if (array_expected.length === results_array.length) {
       // ON VERIFIE LE CONTENU
       for (let i =0 ; i < array_expected.length; i++){
         // si le tableau des choix attendus comporte un choix envoyé, ajouter 1 au nombre de bonne réponse
         if(array_expected.includes(results_array[i].idChoice)){
           count_good_response = count_good_response +1
         }
       }
       // Si le nb de bonnes réponses envoyées est de même longueur que le tableau des réponses attendues alors la carte affichée sera de couleur verte
       if(count_good_response === array_expected.length) {
         return <div className="card result_card result_true" key={obj[0].idQuestions}>
         <h1>Question {}</h1>
         <div key={obj[0].idQuestions} >
           <p className="question"> {obj[0].Question} </p>
           <div className="checkbox_question">
           </div>
         </div>
           <ul className="answer_list" key={obj[1].idChoice}>
           {obj[1].map(choices =>
 
           this.DisplayResultChoices(choices, obj[0])
             )}
           </ul>
           <div>
           <ul className="solution_list" key={questions.idChoice}>
             {this.GoodChoices(obj[1])}
           </ul>
         </div>
       </div>
       }
       // Si une des réponses attendues est manquante ou qu'il y a une réponse fausse dans le tableau des choix envoyés malgrès que le nb de choix faits soit le bon la carte sera de couleur rouge
       else {
         return <div className="card result_card result_false" key={obj[0].idQuestions} >
         <h1>Question {index}</h1>
         <div key={obj[0].idQuestions} >
           <p className="question"> {obj[0].Question} </p>
           <div className="checkbox_question">
           </div>
         </div>
           <ul className="answer_list" key={obj[1].idChoice}>
           {obj[1].map(choices =>
 
           this.DisplayResultChoices(choices, obj[0])
             )}
           </ul>
           <div>
           <ul className="solution_list" key={questions.idChoice}>
             {this.GoodChoices(obj[1])}
           </ul>
         </div>
       </div>
       }

     }
     // Si le nombre de bonnes reponses attendu est différent du nombre de réponses envoyées, le résultat est forcément faux
     else if ( array_expected.length !== results_array.length) {
       return <div className="card result_card result_false" key={obj[0].idQuestions}>
       <h1>Question {index}</h1>
       <div key={obj[0].idQuestions} >
         <p className="question"> {obj[0].Question} </p>
         <div className="checkbox_question">
         </div>
       </div>
         <ul className="answer_list" key={obj[1].idChoice}>
         {obj[1].map(choices =>

         this.DisplayResultChoices(choices, obj[0])
           )}
         </ul>
         <div>
         <ul className="solution_list" key={questions.idChoice}>
           {this.GoodChoices(obj[1])}
         </ul>
       </div>
     </div>
     }
   else {
     return <div className="card result_card result_false" key={obj[0].idQuestions}>
     <h1>Question {index}</h1>
     <div key={obj[0].idQuestions} >
       <p className="question"> {obj[0].Question} </p>
       <div className="checkbox_question">
       </div>
     </div>
       <ul className="answer_list" key={obj[1].idChoice}>
       {obj[1].map(choices =>

       this.DisplayResultChoices(choices, obj[0])
         )}
       </ul>
       <div>
       <ul className="solution_list" key={questions.idChoice}>
         {this.GoodChoices(obj[1])}
       </ul>
     </div>
   </div>
   }
   }

     /// Si la question est a choix unique : 
 else if (obj[0].Multiple === 0) {
   // On stock dans un tableau la réponse juste attendue
   const res_expected = obj[1].filter(choices => choices.value === 1)
   // On stock dans un tableau les choix faits pour l'id de la question que l'on est en train de traiter
   const res_send = choixselection.filter(choices => choices.idQuestions === obj[0].idQuestions)
   if (typeof(res_send[0]) === 'undefined') {
     return <div className="card result_card result_false" key={obj[0].idQuestions}>
     <h1>Question {index}</h1>
     <div key={obj[0].idQuestions} >
       <p className="question"> {obj[0].Question} </p>
       <div className="checkbox_question">
       </div>
     </div>
     <ul className="answer_list" key={questions.idChoice} >
       {obj[1].map(choices =>

         this.DisplayResultChoices(choices, obj[0])
       )}
     </ul>
     <div>
       <ul className="solution_list" key={questions.idChoice}>
         {this.GoodChoices(obj[1])}
       </ul>
     </div>
   </div>
   }
    else if (typeof(res_send[0]) !== 'undefined') {
     //test pour visualiser les resultats qui devraient s'afficher
   // console.log("on test 1: ", res_expected[0])
   // console.log("la suite 2: ", res_send[0])
   // Si l'id du choix attendu est le même que l'id du choix séléctionné on return une carte de couleur verte
   if(res_expected[0].idChoice === res_send[0].idChoice){
           return <div className="card result_card result_true" key={obj[0].idQuestions}>
     <h1>Question {index}</h1>
     <div key={obj[0].idQuestions} >
       <p className="question"> {obj[0].Question} </p>
       <div className="checkbox_question">
       </div>
     </div>
     <ul className="answer_list" key={questions.idChoice} >
       {obj[1].map(choices =>

         this.DisplayResultChoices(choices, obj[0])
       )}
     </ul>
     <div>
       <ul className="solution_list" key={questions.idChoice}>
         {this.GoodChoices(obj[1])}
       </ul>
     </div>
   </div>
   }
   // Sinon on return une carte de couleur rouge
   else if (res_expected[0].idChoice !== res_send[0].idChoice) {
     return <div className="card result_card result_false" key={obj[0].idQuestions}>
     <h1>Question {index}</h1>
     <div key={obj[0].idQuestions} >
       <p className="question"> {obj[0].Question} </p>
       <div className="checkbox_question">
       </div>
     </div>
     <ul className="answer_list" key={questions.idChoice} >
       {obj[1].map(choices =>

         this.DisplayResultChoices(choices, obj[0])
       )}
     </ul>
     <div>
       <ul className="solution_list" key={questions.idChoice}>
         {this.GoodChoices(obj[1])}
       </ul>
     </div>
   </div>
   }
   }
 } 
  }



///////////////////////////////////////// AFFICHAGE DES CHOIX SELECTIONNES OU NON PAR LE CANDIDAT    //////////////////////////////////////////

  DisplayResultChoices = (choices, questions) => {
    // Si la question est à choix unique
    if(questions.Multiple === 0) {
      // On stock dans un tableau l'id des choix faits par le candidat
       let selection = choixselection.map(choices => choices.idChoice)
       // Si l'id du choix à afficher est présent dans le tableau de la selection alors il doit apparaître coché sinon le bouton radio est disabled et non coché
      if (selection.includes(choices.idChoice)) {
        return <li className="answer answer_radio correct_answer " key={choices.idChoice}>
          <input type="radio" className="input input_radio" id={choices.idChoice} value={choices.value} name={questions.idQuestions} disabled={true} checked={true} readOnly/>
          <label htmlFor={choices.idChoice} className="answer_label">{choices.answer}</label>
          <div className="radio_check"></div>
        </li >
      }
      else {
        return <li className="answer answer_radio " key={choices.idChoice}>
          <input type="radio" className="input input_radio" id={choices.idChoice} value={choices.value} name={questions.idQuestions} disabled={true} readOnly/>
          <label htmlFor={choices.idChoice} className="answer_label">{choices.answer}</label>
          <div className="radio_check"></div>
        </li >

      }
    }
 // Si la question est à choix multiple 
    else if (questions.Multiple === 1) {
      let selection = choixselection.filter(choices => choices.length > 1)
      if (selection.length < 1) {
        return <li className="answer answer_checkbox" key={choices.idChoice}>
        <input type="checkbox" className="input input_checkbox" id={choices.idChoice} value={choices.value} name={questions.idQuestions} disabled={true} readOnly/>
        <label htmlFor={choices.idChoice} className="answer_label">{choices.answer}</label>
      </li >
      }
      selection = selection.reduce((acc, val) => acc.concat(val))
      // fonction flat n'est pas supporté sur microsoft edge ( navigateur du client )
      // selection = selection.flat()
      selection = selection.reduce((acc, val) => acc.concat(val))
      selection = selection.filter((selectchoices => selectchoices.idChoice === choices.idChoice))
      // selection = selection.flat().filter(selectchoices => selectchoices.idChoice === choices.idChoice)
      // console.log("selectionctionction", selection)
      const select_choice_id = selection.map(choice => choice.idChoice)
      if ( select_choice_id.includes(choices.idChoice)) {
        if ( choices.value !== 1) {
          return <li className="answer answer_checkbox" key={choices.idChoice}>
          <input type="checkbox" className="input input_checkbox" id={choices.idChoice} value={choices.value} name={questions.idQuestions} disabled={true} checked readOnly/>
          <label htmlFor={choices.idChoice} className="answer_label">{choices.answer}</label>
        </li >
        }
        else {
          return <li className="answer answer_checkbox correct_answer" key={choices.idChoice}>
        <input type="checkbox" className="input input_checkbox" id={choices.idChoice} value={choices.value} name={questions.idQuestions} disabled={true} checked readOnly/>
        <label htmlFor={choices.idChoice} className="answer_label">{choices.answer}</label>
      </li >
        }
      }
       else {
        return <li className="answer answer_checkbox" key={choices.idChoice}>
        <input type="checkbox" className="input input_checkbox" id={choices.idChoice} value={choices.value} name={questions.idQuestions} disabled={true} readOnly/>
        <label htmlFor={choices.idChoice} className="answer_label">{choices.answer}</label>
      </li >
       }
      
    }
   
  }

  Runtimer =() => {
    this.myInterval = setInterval(() => {
      const { seconds, minutes } = this.state

      if (seconds > 0) {
          this.setState(({ seconds }) => ({
              seconds: seconds - 1
          }))
      }
      if (seconds === 0) {
          if (minutes === 0) {
              clearInterval(this.myInterval)
              this.setState({
                timeout : true,
              })
          } else {
              this.setState(({ minutes }) => ({
                  minutes: minutes - 1,
                  seconds: 59
              }))
          }
      } 
  }, 1000)
  }


  StockResult =async (test, score ) => {
    const idcandidat = 3
    let pathApi = process.env.REACT_APP_PATH_API_DEV + '/infosres/resultats'
    if (process.env.NODE_ENV === 'production') {
      pathApi = process.env.REACT_APP_PATH_API_PROD + '/infosres/resultats'
    }
    const token = localStorage.getItem("token")
    await axios.post(pathApi, {
        idTests : test,
        Score: score,
        idcandidat: idcandidat,
    },
    {headers: {
      'x-access-token': `${token}`
      }
  }
  )
  // alert('Le résultat de votre test à bien été stocké dans votre espace personnel.')
}


  componentDidMount = () => {
    this.GetDataTests()
    this.GetDataQuestions()
    this.GetDataChoices()
    this.VerifiedLog()
    this.Runtimer()
  }



  componentWillUnmount() {
    clearInterval(this.myInterval)
}

  render() {

    const {
      ready,
      questionnaire,
      previousQuestion,
      displayQuestion,
      multiple_answer,
      finish,
      welcome,
      log,
      minutes,
      seconds,

    } = this.state

    return (
      <>
      {log &&
      <div>
        {welcome &&
          <div className="main_container">
            <div className="card start_card">
              <h1>Vous êtes connecté !</h1>
              <p>Vous pouvez dès maintenant accéder à notre test d'entrainement à la certification PSPO</p>

              <div className="quizz_choices">
           <p>Sélectionnez la durée du test :</p>
           <div className="quizz_choice" id="quizz_choice_20" onClick={this.UpdateLengthQuizz20} >15 min <br/><span className="minor_txt">(20 Questions)</span></div>
           <div className="quizz_choice" id="quizz_choice_40" onClick={this.UpdateLengthQuizz40} >30 min <br/><span className="minor_txt">(40 Questions)</span></div>
           <div className="quizz_choice" id="quizz_choice_80" onClick={this.UpdateLengthQuizz80} >60 min <br/><span className="minor_txt">(80 Questions)</span></div>
       </div>

              <div className="input_button input_button__active start_button" type="button" onClick={this.RandomQuestionnaire}>Commencer le test</div>
            </div>
          </div>
        }

        <>
        
            
          
        {ready && 
        questionnaire.slice(previousQuestion, displayQuestion).map((obj, index) =>
          <div className="main_container questions_container" key="container">
            { <h1>Time Remaining: { minutes }:{ seconds < 10 ? `0${ seconds }` : seconds }</h1> }
            <div className="card question_card question_current">
              <h1>Question {displayQuestion}</h1>
              

                <div id={index}>
                  <p className="question"> {obj[0].Question} </p>
                  <div className="checkbox_question" key={obj[0].idQuestions}>

                    {multiple_answer ?

                      questionnaire.slice(previousQuestion, displayQuestion).map(obj =>

                        obj[1].map(choices =>
                          <ul className="answer_list">
                            <li className="answer answer_checkbox" key={choices.idChoice} >
                              <input type="checkbox" className="input input_checkbox" id={choices.idChoice} value={choices.answer} name={obj[0].idQuestions} onChange={this.handleCheck} />
                              <label htmlFor={choices.idChoice} className="answer_label">{choices.answer}</label>
                            </li >
                          </ul>
                        ))
                      :

                      questionnaire.slice(previousQuestion, displayQuestion).map(obj =>

                        obj[1].map(choices =>
                          <ul className="answer_list">
                            <li className="answer answer_radio" key={obj[1].idChoice} >
                              <input type="radio" className="input input_radio" id={choices.idChoice} value={choices.answer} name={obj[0].idQuestions} onChange={this.handleCheck} />
                              <label htmlFor={choices.idChoice} className="answer_label">{choices.answer}</label>
                              <div className="radio_check"></div>
                            </li >
                          </ul>))
                    }
                  </div>
                 </div>
                
                

              {displayQuestion < nbquestion ? this.state.checked ? <div onClick={this.StockChoice} className="input_button input_button__active connect_button"> Suivant</div> : <div className="input_button input_button__inactive connect_button"> Suivant </div> : null}
              {displayQuestion == nbquestion ? this.state.checked ? <div onClick={this.StockChoice} className="input_button input_button__active connect_button"> Terminer</div> : <div className="input_button input_button__inactive connect_button"> Terminer </div> : null}

      
          </div>
          <h2 className="info-current-question"> {displayQuestion} / {nbquestion}</h2>
          </div>
          
        )}
          </>

        {/* ////////// LE TEST EST FINI ON PROPOSE L'AFFICHAGE DU SCORE / NB DE BONNES REPONSES ET LES REPONSES ATTENDUES DU QUIZZ ///// */}


        {finish &&
          <div className="main_container results_container">
            <div className="quizzScore">
              <span>Résultat:</span>
              <span className="score">{score}% ({this.state.right_answers}/{nbquestion})</span>
            </div>
            <div className="input_button input_button__active start_button reload" type="button" onClick={this.ReloadTest}>Relancer le test</div><br/>

            {/* //////// AFFICHAGE DES QUESTIONS POSEES LORS DU QUIZZ ///////// */}


            {Questionnaire.map(obj =>
              this.ShowResultFinal(obj)
              )}
             {/* <div> {this.ShowResultFinal(questionnaire) }</div> */}
          </div>
          }
          </div>
      }
      </>
    )
  }
}

export default Tests
