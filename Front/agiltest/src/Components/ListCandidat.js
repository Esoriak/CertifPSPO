import React, { Component } from 'react'
import BackofficeNavbar from '../Screens/BackofficeNavbar';
import axios from 'axios'

import MaterialTable from "material-table";

class ListCandidat extends Component {
  state ={
    columns: [
      { title: 'Id', field: 'idCandidat'},
      { title: 'Prénom', field: 'Firstname' },
      { title: 'Nom', field: 'Lastname'},
      { title: 'Mail', field: 'Mail' },
      { title: 'Date d\'ajout', field : 'Ajout'},
      { title: 'Entreprise', field: 'Company'}
    ],
    users : [],
    selectedRow : null,
  }

//Récupère la liste des utilisateurs ayant accés à la plateforme
  GetUsers = async() => {
    let PathApi = process.env.REACT_APP_PATH_API_DEV + '/infos/candidat'
    if (process.env.NODE_ENV === 'production') {
      PathApi = process.env.REACT_APP_PATH_API_PROD + '/infos/candidat'
    }
    const users_data = await axios.get(PathApi)
    this.setState({
      users : users_data.data, listready: true
    })
  }


// Permet d'ajouter un candidat à la plateforme de test
  addcandidat = async(Firstname, Lastname, Mail, Ajout, Company) => {
    let pathApi = process.env.REACT_APP_PATH_API_DEV + '/infos/candidat'
    if (process.env.NODE_ENV === 'production') {
      pathApi = process.env.REACT_APP_PATH_API_PROD + '/infos/candidat'
    }
    const token = sessionStorage.getItem("token")
    await axios.post(pathApi, {
        Firstname : Firstname,
        Lastname: Lastname,
        Mail: Mail,
        Ajout : Ajout,
        Company: Company,
    },
    {headers: {
      'x-access-token': `${token}`
      }
  }
  )
  alert('Le candidat à bien été ajouté à la base de données.')
}

//Permet de modifier des informations sur la fiche d'un candidat
  update = async(id, Firstname, Lastname, Mail, Ajout, Company) => {
    let pathApi = process.env.REACT_APP_PATH_API_DEV + `/infos/candidat/${id}`
    if (process.env.NODE_ENV === 'production') {
      pathApi = process.env.REACT_APP_PATH_API_PROD + `/infos/candidat/${id}`
    }
    const token = sessionStorage.getItem("token")
    await axios.put(pathApi, {
      Firstname : Firstname,
      Lastname: Lastname,
      Mail : Mail,
      Ajout : Ajout,
      Company : Company,
    },
  {headers: {
    'x-access-token': `${token}`
    }
})
alert('Les modifications ont bien étés prises en compte.')
}

// Permet de supprimer l'accès d'un candidat à la plateforme
  delete = async(id) => {
    let pathApi = process.env.REACT_APP_PATH_API_DEV + `/infos/candidat/${id}`
    if (process.env.NODE_ENV === 'production') {
      pathApi = process.env.REACT_APP_PATH_API_PROD + `/infos/candidat/${id}`
    }
    const token = sessionStorage.getItem("token")
      await axios.delete(pathApi, 
    {headers: {
      'x-access-token': `${token}`
      }
  })
  alert('Le candidat a bien été supprimé de la base de données.')
}


  componentDidMount = () => {
    this.GetUsers()
  }


  render() {


    return (
      <>
        <BackofficeNavbar />
        <div className="main_container-bo">
          {/* <div className="card-tall start_card list-users"> */}
          <MaterialTable
            title="Liste des utilisateurs"
            columns={this.state.columns}
            data={this.state.users}
            id={this.state.users.idCandidat}
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
            editable={{
              onRowAdd: newData =>
                new Promise((resolve, reject) => {
                  this.addcandidat(newData.Firstname, newData.Lastname, newData.Mail, newData.Ajout, newData.Company)
                    setTimeout(() => {
                        { this.GetUsers()}
                        resolve();
                    }, 1000);
                }),
                onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  this.update(newData.idCandidat, newData.Firstname, newData.Lastname, newData.Mail,newData.Ajout, newData.Company)
                    setTimeout(() => {
                        {this.GetUsers()}
                        resolve();
                    }, 1000);
                }),
                onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                  this.delete(oldData.idCandidat)
                    setTimeout(() => {
                        { this.GetUsers() }
                        resolve();
                    }, 1000);
                })
        }}                                                                                         
          />
        {/* </div> */}
      </div>
      </>
    )
  }
}

export default ListCandidat
 