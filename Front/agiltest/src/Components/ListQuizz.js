import React, { Component } from 'react'
import BackofficeNavbar from '../Screens/BackofficeNavbar';
import axios from 'axios'
import '../Screens/Backoffice.css'

import MaterialTable from "material-table";

class ListQuizz extends Component {
  state ={
    columnsQuestions: [
      { title: 'Id', field: 'idQuestions'},
      { title: 'Question', field: 'Question' },
      { title : 'Commentaire', field : 'Comment'},
      { title: 'Choix multiple', field: 'Multiple'},
      { title: 'Catégorie', field: 'Categorie' },
      { title: 'Langue', field: 'Langue'}
    ],
    columnsChoices : [
      { title : 'Id', field: 'idChoice'},
      { title : 'Réponse', field: 'answer'},
      { title : 'idQuestion', field: 'idQuestions'},
      { title : 'Valeur', field : 'value'}
    ],
    questions: [],
    choices : [],
    selectedRow : null,
  }

//Récupère la liste des questions
  GetQuestiondata = async() => {
    let PathApi = process.env.REACT_APP_PATH_API_DEV + '/quizzquestions/questions'
    if (process.env.NODE_ENV === 'production') {
      PathApi = process.env.REACT_APP_PATH_API_PROD + '/quizzquestions/questions'
    }
    const questions_data = await axios.get(PathApi)
    this.setState({
      questions : questions_data.data,
    })
  }

  GetChoiceData = async() => {
    let PathApi = process.env.REACT_APP_PATH_API_DEV + '/quizzchoices/choices'
    if (process.env.NODE_ENV === 'production') {
      PathApi = process.env.REACT_APP_PATH_API_PROD + '/quizzchoices/choices'
    }
    const choices_data = await axios.get(PathApi)
    this.setState({
      choices : choices_data.data
    })
  }

// Permet d'ajouter une question à la plateforme de test
  addquestion = async(Question, Comment, Multiple, Categorie, Langue) => {
    let pathApi = process.env.REACT_APP_PATH_API_DEV + '/quizzquestions/questions'
    if (process.env.NODE_ENV === 'production') {
      pathApi = process.env.REACT_APP_PATH_API_PROD + '/quizzquestions/questions'
    }
    const token = localStorage.getItem("token")
    await axios.post(pathApi, {
        Question : Question,
        Comment : Comment,
        Multiple : Multiple,
        Categorie : Categorie,
        Langue : Langue,
    },
    {headers: {
      'x-access-token': `${token}`
      }
  }
  )
  alert('La question a bien été ajoutée à la base de données.')
}

//Permet de modifier les infos d'une question
  update = async(id, Question, Comment, Multiple, Categorie, Langue) => {
    let pathApi = process.env.REACT_APP_PATH_API_DEV + `/quizzquestions/question/${id}`
    if (process.env.NODE_ENV === 'production') {
      pathApi = process.env.REACT_APP_PATH_API_PROD + `/quizzquestions/question/${id}`
    }
    const token = localStorage.getItem("token")
    await axios.put(pathApi, {
      Question : Question, 
      Comment: Comment,
      Multiple : Multiple,
      Categorie : Categorie,
      Langue : Langue,
    },
  {headers: {
    'x-access-token': `${token}`
    }
})
alert('Les modifications de la question ont bien étés prises en compte.')
}

// Permet de supprimer une question de la base de données
  delete = async(id) => {
    let pathApi = process.env.REACT_APP_PATH_API_DEV + `/quizzquestions/question/${id}`
    if (process.env.NODE_ENV === 'production') {
      pathApi = process.env.REACT_APP_PATH_API_PROD + `/quizzquestions/question/${id}`
    }
    const token = localStorage.getItem("token")
      await axios.delete(pathApi, 
    {headers: {
      'x-access-token': `${token}`
      }
  })
  alert('La question a bien été supprimée de la base de données.')
}


// Permet d'ajouter un choix à la plateforme de test
addchoice = async(answer, idQuestions, value) => {
  let pathApi = process.env.REACT_APP_PATH_API_DEV + '/quizzchoices/choices'
  if (process.env.NODE_ENV === 'production') {
    pathApi = process.env.REACT_APP_PATH_API_PROD + '/quizzchoices/choices'
  }
  const token = localStorage.getItem("token")
  await axios.post(pathApi, {
      answer : answer,
      idQuestions : idQuestions,
      value : value,
  },
  {headers: {
    'x-access-token': `${token}`
    }
}
)
alert('Le choix a bien été ajouté à la base de données.')
}



//Permet de modifier les infos d'un choix
updatechoice = async(id, answer, idQuestions, value) => {
  let pathApi = process.env.REACT_APP_PATH_API_DEV + `/quizzchoices/choice/${id}`
  if (process.env.NODE_ENV === 'production') {
    pathApi = process.env.REACT_APP_PATH_API_PROD + `/quizzchoices/choice/${id}`
  }
  const token = localStorage.getItem("token")
  await axios.put(pathApi, {
    idChoice : id,
    answer : answer, 
    idQuestions : idQuestions,
    value : value,
  },
{headers: {
  'x-access-token': `${token}`
  }
})
alert('Les modifications du choix ont bien étés prises en compte.')
}

// Permet de supprimer un choix de la base de données
deletechoice = async(id) => {
  let pathApi = process.env.REACT_APP_PATH_API_DEV + `/quizzchoices/choice/${id}`
  if (process.env.NODE_ENV === 'production') {
    pathApi = process.env.REACT_APP_PATH_API_PROD + `/quizzchoices/choice/${id}`
  }
  const token = localStorage.getItem("token")
    await axios.delete(pathApi, 
  {headers: {
    'x-access-token': `${token}`
    }
})
alert('Le choix a bien été supprimé de la base de données.')
}


  componentDidMount = () => {
    this.GetQuestiondata()
    this.GetChoiceData()
  }


  render() {

    return (
      <>
        <BackofficeNavbar />
        <div className="main-container-bo">
          <div className="list-quizz">
            <MaterialTable
                title="Liste des questions"
                columns={this.state.columnsQuestions}
                data={this.state.questions}
                id={this.state.questions.idQuestions}
                onRowClick={((evt, selectedRow) => this.setState({ selectedRow }))}
                options={{
                  rowStyle: rowData => ({
                    backgroundColor: (this.state.selectedRow && this.state.selectedRow.tableData.id === rowData.tableData.id) ? '#EEE' : '#FFF'
                  }),
                  headerStyle :{
                    backgroundColor : '#20acad', color: '#fff',
                  },
                  cellStyle : {
                    width: '600px;'
                  }
                }}
                editable={{
                  onRowAdd: newData =>
                    new Promise((resolve, reject) => {
                      this.addquestion(newData.Question, newData.Comment, newData.Multiple, newData.Categorie, newData.Langue)
                        setTimeout(() => {
                            { this.GetQuestiondata()}
                            resolve();
                        }, 1000);
                    }),
                    onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                      this.update(newData.idQuestions, newData.Question, newData.Comment, newData.Multiple, newData.Categorie, newData.Langue)
                        setTimeout(() => {
                            {this.GetQuestiondata()}
                            resolve();
                        }, 1000);
                    }),
                    onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                      this.delete(oldData.idQuestions)
                        setTimeout(() => {
                            { this.GetQuestiondata() }
                            resolve();
                        }, 1000);
                    })
            }}                                                                                        
            />
        </div>
          <div className="list-quizz">
            <MaterialTable
              title="Liste des choix"
              columns={this.state.columnsChoices}
              data={this.state.choices}
              id={this.state.choices.idChoice}
              onRowClick={((evt, selectedRow) => this.setState({ selectedRow }))}
              options={{
                rowStyle: rowData => ({
                  backgroundColor: (this.state.selectedRow && this.state.selectedRow.tableData.id === rowData.tableData.id) ? '#EEE' : '#FFF'
                }),
                
                headerStyle :{
                  backgroundColor : '#20acad', color: '#fff',
                },
                cellStyle : {
                  width: '300px;'
                }
              }}
              editable={{
                onRowAdd: newData =>
                  new Promise((resolve, reject) => {
                    this.addchoice(newData.answer, newData.idQuestions, newData.value)
                      setTimeout(() => {
                          { this.GetChoiceData()}
                          resolve();
                      }, 1000);
                  }),
                  onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    this.updatechoice(newData.idChoice, newData.answer, newData.idQuestions, newData.value)
                      setTimeout(() => {
                          {this.GetChoiceData()}
                          resolve();
                      }, 1000);
                  }),
                  onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    this.deletechoice(oldData.idChoice)
                      setTimeout(() => {
                          { this.GetChoiceData() }
                          resolve();
                      }, 1000);
                  })
          }}                                                                                        
            />
          </div>
        </div>
      </>
    )
  }
}

export default ListQuizz
 