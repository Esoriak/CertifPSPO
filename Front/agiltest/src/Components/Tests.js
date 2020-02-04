import React, { Component } from 'react'
import axios from 'axios'


const Questionnaire = []
let questions =[]
let choix = []
let score =0
let choixselection = []
const nbquestion = 5
const nbminichoix = 1


 class Tests extends Component {
  state ={
    welcome : true,
    tests : [],
    pointQuestions : 2000,
    questions: [],
    choices: [],
    right_answers : 0,
    questionnaire : [],
    ready : false,
    finish: false,
    displayQuestion : 1,
    previousQuestion : 0,
    multiple_answer : false,
    score : [],
  }


/////////////////////////// RECUPERATION DES INFORMATIONS DE LA DATABASE ///////////////////////////////////////


 GetDataTests = async() => {
  let PathApi = process.env.REACT_APP_PATH_API_DEV + '/quizz/tests'
  if (process.env.NODE_ENV === 'production') {
      PathApi = process.env.REACT_APP_PATH_API_PROD + '/quizz/tests'
   }
   const tests =  await axios.get(PathApi)
    console.log('voilà les tests',tests.data)
     this.setState({
       tests : tests.data, 
      //  pointQuestions: tests.data[5].PointsQuestion
     })
 }

 GetDataQuestions = async() => {
   let PathApi = process.env.REACT_APP_PATH_API_DEV + '/quizzquestions/questions'
   if (process.env.NODE_ENV === 'production') {
     PathApi = process.env.REACT_APP_PATH_API_PROD + '/quizzquestions/questions'
   }
   const questions = await axios.get(PathApi)
    console.log('ici les questions', questions.data)
    this.setState({
      questions : questions.data
    })
 }

 GetDataChoices = async() => {
   let PathApi = process.env.REACT_APP_PATH_API_DEV + '/quizzchoices/choices'
   if (process.env.NODE_ENV === 'production') {
    PathApi = process.env.REACT_APP_PATH_API_PROD + '/quizzchoices/choices'
   }
   const choices = await axios.get(PathApi)
   console.log('là les choix', choices.data)
   this.setState({
     choices : choices.data
   })
 }



/////////////// CREATION D'UN QUESTIONNAIRE UNIQUE , RANDOM, SANS DOUBLONS, STOCKER EN STATE //////////////////////////



RandomQuestionnaire = () => {
    // Tant que le tableau n'a pas 80 nombres uniques on lance la requête
   while (questions.length < nbquestion) {
      // On récupère un nombre aléatoire compris entre 0 et 150 ( le nombre de questions exploitables pour le moment)
      const random = Math.floor(Math.random() * 150)
      // On copie le nombre dans le tableau des questions - on rajoute 1 au chiffre random pour éviter l'index 0
      questions.push(random+1)
    }   
    // Si le tableau de nombre est egal à 80 on vérifie que toutes les valeurs sont uniques
   if (questions.length == nbquestion) {
      questions = [...new Set(questions)]
      // Si le tableau de nombre uniques est égal à 80, on lance une boucle qui va remplir le questionnaire
      if (questions.length == nbquestion) {
          for (let i=0; i< questions.length; i++) {
              // On cherche l'id de la question correspondant au chiffre random dans notre base de données et on la copie dans le tableau du questionnaire
              Questionnaire.push(this.state.questions.filter(res => res.idQuestions === questions[i]))
              // En restant dans le meme index que la question, on recherche dans notre base de données les choix ayant pour clés étrangères d'idQuestions
              // le chiffre random et on copie le choix dans le tableau du questionnaire
              Questionnaire[i].push(this.state.choices.filter(res => res.idQuestions === questions[i] ))
          }
          // J'affiche le questionnaire pour vérifier la structure de celui-ci et je le copie dans sa state
          this.setState({  questionnaire : Questionnaire, welcome : false, ready : true })
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
    const quest = Questionnaire.slice(this.state.previousQuestion+1,this.state.displayQuestion+1)
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
      multiple_answer : true
    })
  }

  UniqueAnswer = () => {
    this.setState({
      multiple_answer : false
    })
  }



////////////////////////////////////////  STOCKAGE DU CHOIX DU CANDIDAT POUR LE CALCUL DU SCORE ET L'AFFICHAGE FINAL ///////////////////////////////


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
      leschoix.push(this.state.choices.filter(choices => choices.idChoice == choix[i]))
      console.log("totoro", leschoix)
      // on récupère l'id de la question associé au choix fait - le premier suffit -
      let idquest = leschoix[0][0].idQuestions
      // on récupère tous les choix associés à la question posée
      Allanswers = this.state.choices.filter(choices => choices.idQuestions == idquest)
      // Si la valeur d'un choix est egale a 1 c'est que la réponse est juste, on parcours à nouveau le tableau pour finir la boucle et stocker le nombre de réponses justes attendues
      reponsesattendues = Allanswers.filter(res => res.value === 1)
    }
    // Quoi qu'il arrive, on stocke le résultat du candidat dans un tableau de façon différente selon si c'était un choix unique ou multiple
       if( leschoix.length > nbminichoix ) {
          choixselection.push(leschoix)
       }
       else {
         choixselection.push(leschoix[0][0])
       }
    // On créer une variable comportant le nombre de bonnes réponses séléctionnées par le candidat
    bonnesreponses = leschoix.filter(choix => choix[0].value === 1)
    // Si ce nombre est  strictement égal au nombre de réponses attendues alors on lui ajoute le nombre de points / question + 1 bonne réponse supplémentaire 
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
    // on vide le tableau de choix pour la sélection de la prochaine question
    choix =[]
    // Si la question affichée est la dernière du questionnaire on lance la fonction finish test
    if(this.state.displayQuestion === nbquestion) {
      this.FinishTest()
    }
    // Sinon on continue d'avancer dans l'affichage du questionnaire et la vérification des choix multiples ou unique
    else {
      this.setState({  displayQuestion : this.state.displayQuestion+1 , previousQuestion: this.state.previousQuestion+1 ,  checked : false, })
      this.StyleButtonChoices()
    }
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
    console.log("les choix pour l'affichage final", choixselection)
  }

  //////////////////////// VERIFICATION POUR QUE LE CANDIDAT CHOISISSE UNE REPONSE POUR PASSER A LA QUESTION SUIVANTE //////////////////////////

  

  ActiveNext = () => {

    if (choix.length >= 1 ) {
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

  GoodChoices = (response) => {
    const goodchoices = response.filter(choices => choices.value === 1 )
    return <div>{goodchoices.map(goodchoices => <p>{goodchoices.answer}</p>)}</div>
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
      finish,
      welcome
  
    } = this.state

    return (
      <div>

        {welcome ?
        <div className="main_container">
          <div className="card start_card">
          <h1>Vous êtes connecté !</h1>
          <p>Vous pouvez dès maintenant accéder à notre test d'entrainement à la certification PSPO</p>
        
       {/* <div className="quizz_choices">
           <p>Sélectionnez la durée du test :</p>
           <div className="quizz_choice quiz_short" id="quizz_choice_20" onClick="chooseQuizz(20)" >15 min <br/><span className="minor_txt">(20 Questions)</span></div>
           <div className="quizz_choice quiz_medium" id="quizz_choice_40" onClick="chooseQuizz(40)" >30 min <br/><span className="minor_txt">(40 Questions)</span></div>
           <div className="quizz_choice quizlong"  id="quizz_choice_80" onClick="chooseQuizz(80)" >60 min <br/><span className="minor_txt">(80 Questions)</span></div>
       </div> */}
       
          <div className="input_button input_button__active start_button" type="button" onClick={this.RandomQuestionnaire}>Commencer le test</div>
          </div>
        </div>
     : 

     null
        
      }

        {ready ? 
            <div className="main_container questions_container">
            <div className="card question_card question_current">
            <h1>Question {displayQuestion}</h1>
       
            {ready ? questionnaire.slice(previousQuestion, displayQuestion).map(obj =>
            
            <div key={obj[0].idQuestions }>
              <p className="question"> {obj[0].Question} </p>
              <div className="checkbox_question">
              
              {multiple_answer ? 
              
              questionnaire.slice(previousQuestion, displayQuestion).map(obj =>
              
              obj[1].map(choices =>
              <ul className="answer_list">
                  <li className="answer answer_checkbox" key={obj[1].idChoice} >
                    <input type="checkbox" className="input input_checkbox" id={choices.idChoice} value={choices.value} name={obj[0].idQuestions} onChange={this.handleCheck} />
                    <label htmlFor={choices.idChoice} className="answer_label">{choices.answer}</label>
                  </li >
              </ul>
                ))
                :

                questionnaire.slice(previousQuestion, displayQuestion).map(obj =>
                
                obj[1].map(choices =>
                <ul className="answer_list">
                  <li className="answer answer_radio" key={obj[1].idChoice} >
                    <input type="radio" className="input input_radio" id={choices.idChoice} value={choices.value} name={obj[0].idQuestions}  onChange={this.handleCheck} />
                    <label htmlFor={choices.idChoice} className="answer_label">{choices.answer}</label>
                    <div className="radio_check"></div>
                  </li >
                </ul>))
              }
              </div>
            </div>)
              : null}

                {displayQuestion < nbquestion ? this.state.checked ? <div onClick={this.StockChoice} className="input_button input_button__active connect_button"> Suivant</div> : <div className="input_button input_button__inactive connect_button"> Suivant </div>  :  null }
                {displayQuestion === nbquestion ? this.state.checked ? <div onClick={this.StockChoice} className="input_button input_button__active connect_button"> Terminer</div> : <div className="input_button input_button__inactive connect_button"> Terminer </div> : null }

          </div>
          <h2> {displayQuestion} / 80</h2>
        </div>
      : null} 


{/* ////////// LE TEST EST FINI ON PROPOSE L'AFFICHAGE DU SCORE / NB DE BONNES REPONSES ET LES REPONSES ATTENDUES DU QUIZZ ///// */}


    {finish ? 
      <div className="main_container results_container">
        <div className="quizzScore">
            <span>Résultat:</span>
            <span className="score">{score}% ({this.state.right_answers}/{nbquestion})</span>
        </div>


{/* //////// AFFICHAGE DES QUESTIONS POSEES LORS DU QUIZZ ///////// */}


          {questionnaire.map(obj => 
                <div className="card result_card">
                <h1>Question </h1>
                <div key={obj[0].idQuestions } >
                  <p className="question"> {obj[0].Question} </p>
                  <div className="checkbox_question">
                  </div>
                </div>
                  


                {/* /////////////// AFFICHAGE DES CHOIX EN FONCION D'UN CHOIX MULTIPLE OU D'UN CHOIX UNIQUE  ////////////////*/}

                {/* // Si la question affichée est à choix multiple ( 1 veut dire true ) alors on affichera les choix associés à côtés de checkbox, sinon ce sera des boutons radio. Ils sont en disabled pour ne pas modifier l'état. */}
                  {obj[0].Multiple === 1 ? 
                  
          
                  
                  obj[1].map(choices =>
                    <ul className="answer_list">
                        <li className="answer answer_checkbox"  key={obj[1].idChoice} >
                          <input type="checkbox" className="input input_checkbox" id={choices.idChoice} value={choices.value} name={obj[0].idQuestions} disabled />
                          <label htmlFor={choices.idChoice} className="answer_label">{choices.answer}</label>
                        </li >
                    </ul>)

                    :

                  obj[1].map(choices =>
                    
                        <ul className="answer_list">
                          <li className="answer answer_radio"  key={obj[1].idChoice}>
                            <input type="radio" className="input input_radio" id={choices.idChoice} value={choices.value} name={obj[0].idQuestions}  disabled />
                            <label htmlFor={choices.idChoice} className="answer_label">{choices.answer}</label>
                            <div className="radio_check"></div>
                          </li >
                        </ul>)
                    }

                    {/* {choixselection.map(i => <p>{i.answer}</p>)} */}


                    {/* //J'éxécute la fonction qui permet de vérifier quels choix auraient dus être séléctionnés pour avoir la totalité des points. Je lui donne en paramètre tout l'objet comportant les choix. La fonction éxécéute un filtre et ne retourne à cet endroit que les choix ayant une value égale a 1 soit " True" */}
                    <div>{this.GoodChoices(obj[1])} </div>
                </div>            
                )
                }
                </div>
      : null } 



{/* -----------------------    AFFICHAGE DES CHOIX SELECTIONNES    ------------------------- */}

            {/* {finish ? 
                  <div className="main_container results_container">
                    <div className="quizzScore">
                        <span>Résultat:</span>
                        <span className="score">{score}% ({this.state.right_answers}/80)</span>
                    </div>
                    {finish ?

                      questionnaire.map(i => 
                        <div className="card result_card">
                          <h1> Question </h1>
                          <p className="question"> {i[0].Question} </p>
                        
 
                          {finish ? this.state.choices_selected.map(i =>
                           <p>{i.answer}</p>)

                             : null
                          }
                          </div>
                        )
                 
                  : null}
                   </div>
          : null} */}

          {/* <div class="card result_card result_true">
                <h1>Question 1</h1>
                <p class="question">Sprint burndown charts are an efficient tracking tool because they show : </p>
                <div class="radio_question">
                    <ul class="answer_list">
                        <li class="answer answer_radio" onclick="activeNext()">
                            <input type="radio" class="input input_radio" id="ID_answer-1" name="ID_question_1" value="ID_answer" disabled="true" checked="true" />
                            <label for="ID_answer-1" class="answer_label">An estimate of the total work remaining for the Sprint</label>
                            <div class="radio_check"></div>
                        </li >
                        <li class="answer answer_radio" onclick="activeNext()">
                            <input type="radio" class="input input_radio" id="ID_answer-2" name="ID_question_1" value="ID_answer" disabled="true"/>
                            <label for="ID_answer-2" class="answer_label">How many hours have been worked by each Development Team member</label>
                            <div class="radio_check"></div>
                        </li>
                        <li class="answer answer_radio" onclick="activeNext()">
                            <input type="radio" class="input input_radio" id="ID_answer-3" name="ID_question_1" value="ID_answer" disabled="true"/>
                            <label for="ID_answer-3" class="answer_label">How many Product Backlog items remain</label>
                            <div class="radio_check"></div>
                        </li>
                        <li class="answer answer_radio" onclick="activeNext()">
                            <input type="radio" class="input input_radio" id="ID_answer-4" name="ID_question_1" value="ID_answer" disabled="true"/>
                            <label for="ID_answer-4" class="answer_label">How much effort has gone into a Sprint</label>
                            <div class="radio_check"></div>
                        </li>
                    </ul>  
                    <ul class="correct_answer_list">
                        <li class="answer answer_radio correct_answer" onclick="activeNext()">
                            <input type="radio" class="input input_radio" id="ID_answer-1" name="ID_question_1" value="ID_answer" disabled="true"/>
                            <label for="ID_answer-1" class="answer_label">An estimate of the total work remaining for the Sprint</label>
                            <div class="radio_check"></div>
                        </li >
                    </ul> 
                    <ul class="solution_list">
                        <li class="answer answer_radio" onclick="activeNext()">
                            <input type="radio" class="input input_radio" id="ID_answer-1" name="ID_solution_2" value="ID_answer" disabled="true" checked="true"/>
                            <label for="ID_answer-1" class="answer_label">An estimate of the total work remaining for the Sprint</label>
                            <div class="radio_check"></div>
                        </li >
                    </ul> 
               </div>
            </div> */}
          

    </div>
    )
  }
}

export default Tests
