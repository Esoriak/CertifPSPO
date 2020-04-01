import React, { Component } from 'react'
import MaterialTable from "material-table";
import MenuUser from './MenuUser'

import axios from 'axios'



export class UserSpace extends Component {
  state = {
    Name: "",
    Mail: "",
    Company: "",
    login: "",
    Resultats : [],
    selectedRow: null,
    columns: [
      { title : 'Test', field : 'Name'},
      { title: 'Score', field: 'Score'},
    ],
  }

  

  GetUserInfo = async () => {
    const id = sessionStorage.getItem("id")
    let PathApi = process.env.REACT_APP_PATH_API_DEV + `/infos/candidat/${id}`
    if (process.env.NODE_ENV === 'production') {
      PathApi = process.env.REACT_APP_PATH_API_PROD + `/infos/candidat/${id}`
    }
    const user = await axios.get(PathApi)
    this.setState({
      Name: user.data[0].Firstname + " " + user.data[0].Lastname, Mail: user.data[0].Mail, Company: user.data[0].Company, login: id
    })
  }


  GetResultsUser = async() => {
    const id = sessionStorage.getItem("id")
    let PathApi = process.env.REACT_APP_PATH_API_DEV + `/infosres/resultats/${id}`
    if (process.env.NODE_ENV === 'production') {
      PathApi = process.env.REACT_APP_PATH_API_PROD + `/infosres/resultats/${id}`
    }
  const results = await axios.get(PathApi)
    this.setState({
      Resultats : results.data
    })
  }


  componentDidMount = () => {
    this.GetUserInfo()
    this.GetResultsUser()
  }

  render() {

    const {
      Name,
      Mail,
      Company,
      Login
    } = this.state


    return (
      <>
        <MenuUser />
        <div className="container-global">
          <div className="card-profil" key={Login}>
            <h1>Vos informations personnelles </h1>
            <br/>
            <p> Nom : {Name}</p>
            <p> Email : {Mail} </p>
            <p> Entreprise : {Company} </p>
          </div>

        <div className="main_container-bo">
          <div className="card-tall">
            <p>Les scores sont affichés en pourcentages.</p>
          <MaterialTable
              title="Résultats"
              columns={this.state.columns}
              data={this.state.Resultats}
              id={this.state.login}
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
      </>
    )
  }
}

export default UserSpace
