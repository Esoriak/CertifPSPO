import React, { Component } from 'react'
import BackofficeNavbar from '../Screens/Backoffice';
import axios from 'axios'

import MaterialTable from "material-table";

class ListCandidat extends Component {
  state ={
    columns: [
      { title: 'Id', field: 'idCandidat'},
      { title: 'Prénom', field: 'Firstname' },
      { title: 'Nom', field: 'Lastname'},
      { title: 'Mail', field: 'Mail' },
      { title: 'Entreprise', field: 'Company'}
    ],
    users : [],
    listready : false,
  }

  GetUsers = async() => {
    let PathApi = process.env.REACT_APP_PATH_API_DEV + '/infos/candidat'
    if (process.env.NODE_ENV === 'production') {
      PathApi = process.env.REACT_APP_PATH_API_PROD + '/infos/candidat'
    }
    const users_data = await axios.get(PathApi)
    this.setState({
      users : users_data.data, listready: true
    })
    console.log("users",users_data.data)
  }

  // update = async(id) => {

  // }


  delete = (id) => {
    console.log("lulu l'id", id)
    let pathApi = process.env.REACT_APP_PATH_API_DEV + `/infos/candidat/${id}`
    if (process.env.NODE_ENV === 'production') {
      pathApi = process.env.REACT_APP_PATH_API_PROD + `/infos/candidat/${id}`
    }
    const token = localStorage.getItem("token")
      axios.delete(pathApi, 
  //   {headers: {
  //     'x-access-token': `${token}`
  //     }
  // }
  )
  }


  componentDidMount = () => {
    this.GetUsers()
  }


  render() {
   const  {
    users,
    listready }
    = this.state

    return (
      <>
        <BackofficeNavbar />
        <div className="list-admin">
        <MaterialTable
          title="Liste des utilisateurs"
          columns={this.state.columns}
          data={this.state.users}
          id={this.state.users.idCandidat}
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                  setTimeout(() => {
                      {
                          /* const data = this.state.data;
                          data.push(newData);
                          this.setState({ data }, () => resolve()); */
                      }
                      resolve();
                  }, 1000);
              }),
              onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                  setTimeout(() => {
                      {
                          /* const data = this.state.data;
                          const index = data.indexOf(oldData);
                          data[index] = newData;                
                          this.setState({ data }, () => resolve()); */
                      }
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
        </div>
      </>
    )
  }
}

export default ListCandidat
