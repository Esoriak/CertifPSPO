import React, { Component } from 'react'
import axios from 'axios';

import BackofficeNavbar from '../Screens/BackofficeNavbar';

import MaterialTable from "material-table";

class ListAdmin extends Component {
  state={
    columns: [
      { title: 'Id', field: 'idAdmin'},
      { title: 'Prénom', field: 'Firstname' },
      { title: 'Nom', field: 'Lastname'},
      { title: 'Mail', field: 'Mail' },
    ],
    verified: false,
    register : false,
    mail : "",
    password : "",
    firstname : "",
    lastname : "",
    success : false,
    admins : [],
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value 
    })
  }

// Permet d'ajouter un administrateur à la base de données
    handleSubmit = (event) => {
      event.preventDefault()
      let pathApi = process.env.REACT_APP_PATH_API_DEV + '/auth/register'
      if (process.env.NODE_ENV === 'production') {
        pathApi = process.env.REACT_APP_PATH_API_PROD + '/auth/register'
      }
        axios.post(pathApi, {
          Mail: event.target.mail.value,
          Password: event.target.password.value,
          Firstname : event.target.firstname.value,
          Lastname : event.target.lastname.value
      })
      alert("Le nouvel administrateur a bien été ajouté à la base de données.")
      this.GetAdminData()
    }


// Permet de récupérer les données des administrateurs
    GetAdminData = async() => {
      let pathApi = process.env.REACT_APP_PATH_API_DEV + '/bco/admin'
      if (process.env.NODE_ENV === 'production') {
        pathApi = process.env.REACT_APP_PATH_API_PROD + '/bco/admin'
      }
      const adminsdata = await axios.get(pathApi)
      this.setState({
        admins : adminsdata.data
      })
    }


//Permet de modifier des informations sur la fiche d'un administrateur
update = async(id, Firstname, Lastname, Mail) => {
  let pathApi = process.env.REACT_APP_PATH_API_DEV + `/bco/admin/${id}`
  if (process.env.NODE_ENV === 'production') {
    pathApi = process.env.REACT_APP_PATH_API_PROD + `/bco/admin/${id}`
  }
  await axios.put(pathApi, {
    Firstname : Firstname,
    Lastname: Lastname,
    Mail : Mail,
  })
  alert("Les modifications ont bien été prises en compte.")
}

// Permet de supprimer un administrateur
  delete = async(id) => {
    let pathApi = process.env.REACT_APP_PATH_API_DEV + `/bco/admin/${id}`
    if (process.env.NODE_ENV === 'production') {
      pathApi = process.env.REACT_APP_PATH_API_PROD + `/bco/admin/${id}`
    }
    const token = localStorage.getItem("token")
      await axios.delete(pathApi, 
    {headers: {
      'x-access-token': `${token}`
      }
  })
  alert("L'administrateur a bien été supprimé de la base de données.")
}

    componentDidMount=()=> {
      this.GetAdminData()
    }

  render() {

    return (
      <>
      <BackofficeNavbar />
        <div className="main_container-bo">
          <div className="card-tall start_card">
          <h1> Ajouter un administrateur</h1>
            <form onSubmit={this.handleSubmit}>
              <fieldset>

                <div className="input-connect">
                  <input  type="email"    
                          className="input_connect" 
                          placeholder="email@toudoum.fr" 
                          label="Email"
                          onChange={this.handleChange}
                          name="mail"
                          value={this.state.mail}
                  />
                </div>

                <div className="input-connect">
                  <input
                          className="input_connect"
                          label="Password"
                          name="password"
                          type="password"
                          value={this.state.password}
                          onChange={this.handleChange}
                  />
                </div>

                <div className="input-connect">
                  <input  type="text"    
                          className="input_connect" 
                          placeholder="Emilie" 
                          label="Firstname"
                          onChange={this.handleChange}
                          name="firstname"
                          value={this.state.firstname}
                  />
                </div>

                <div className="input-connect">
                  <input  type="text"    
                          className="input_connect" 
                          placeholder="Dupont" 
                          label="Lastname"
                          onChange={this.handleChange}
                          name="lastname"
                          value={this.state.lastname}
                  />
                </div>

                 <button className="input_button connect_button input_button__active" type="submit">Ajouter un administrateur</button>
              </fieldset>
            </form>
          <br/>

          <div className="list-admin">
            <MaterialTable
            title="Liste des administrateurs"
            columns={this.state.columns}
            data={this.state.admins}
            editable={{
                onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  this.update(newData.idAdmin, newData.Firstname, newData.Lastname, newData.Mail)
                    setTimeout(() => {
                        {this.GetAdminData()}
                        resolve();
                    }, 1000);
                }),
                onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                  this.delete(oldData.idAdmin)
                    setTimeout(() => {
                        {this.GetAdminData()}
                        resolve();
                    }, 1000);
                })
        }}                                                                                         
          />
          </div>
        </div>
      </div>


      </>
    )
  }
}

export default ListAdmin
