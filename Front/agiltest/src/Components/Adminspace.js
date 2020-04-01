import React, { Component } from 'react'
import BackofficeNavbar from '../Screens/BackofficeNavbar'
import MaterialTable from "material-table";
import axios from 'axios'

import '../Screens/Backoffice.css'

class Adminspace extends Component {
  state = {
      Resultats : [],
      Users : [],
      selectedRow : null,
      columns: [
        { title: 'Id', field: 'idCandidat'},
        { title: 'Test', field: 'idTests'},
        { title: 'Score', field: 'Score' },
      ],
  }

  //Récupère la liste des utilisateurs ayant accés à la plateforme
  GetUsers = async() => {
    let PathApi = process.env.REACT_APP_PATH_API_DEV + '/infos/candidat'
    if (process.env.NODE_ENV === 'production') {
      PathApi = process.env.REACT_APP_PATH_API_PROD + '/infos/candidat'
    }
    const users_data = await axios.get(PathApi)
    this.setState({
      Users : users_data.data
    })
  }

GetResultsUsers = async() => {
  let PathApi = process.env.REACT_APP_PATH_API_DEV + '/infosres/resultats'
  if (process.env.NODE_ENV === 'production') {
    PathApi = process.env.REACT_APP_PATH_API_PROD + '/infosres/resultats'
  }
const results = await axios.get(PathApi)
  this.setState({
    Resultats : results.data
  })
}

componentDidMount=() => {
  this.GetResultsUsers()
}

  render() {
    return (
      <div>
        <BackofficeNavbar />
        {/* Permettre la modification de l'adresse mail, du mot de passe */}
        {/* <div className="card-tall">
          <p>Vous pourrez bientôt modifier votre adresse email ainsi que votre mot de passe.</p>
        </div> */}
      <div className="main_container-bo">
        <div className="table-res">
          {/* <p>Ici vous aurez accès aux statistiques/ résultats des utilisateurs</p> */}
          <MaterialTable
            title="Résultats des utilisateurs"
            columns={this.state.columns}
            data={this.state.Resultats}
            onRowClick={((evt, selectedRow) => this.setState({ selectedRow }))}
            options={{
              rowStyle: rowData => ({
                backgroundColor: (this.state.selectedRow && this.state.selectedRow.tableData.id === rowData.tableData.id) ? '#EEE' : '#FFF'
              }),
              headerStyle :{
                backgroundColor : '#20acad',
                color: '#fff',
              }
            }}
            />
        </div>
      </div>
    </div>
    )
  }
}

export default Adminspace
