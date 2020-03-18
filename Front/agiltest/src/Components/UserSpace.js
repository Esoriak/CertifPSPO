import React, { Component } from 'react'
import axios from 'axios'

export class UserSpace extends Component {
  state ={
    Name : "",
    Mail : "",
    Company : "",
    login : "",
    user : [],
  }


  GetUserInfo = async() => {
    const id = localStorage.getItem("id")
    console.log("login", id)
  let PathApi = process.env.REACT_APP_PATH_API_DEV + `/infos/candidat/${id}`
  if (process.env.NODE_ENV === 'production') {
    PathApi = process.env.REACT_APP_PATH_API_PROD + `/infos/candidat/${id}`
  }
  const user = await axios.get(PathApi)
  this.setState({
    // user : user.data[0]
    Name : user.data[0].Firstname + " " + user.data[0].Lastname , Mail : user.data[0].Mail, Company : user.data[0].Company
  })
  console.log("users",this.state.user)
}

  componentDidMount =() => {
    this.GetUserInfo()
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
      <div className="card" key={Login}>
        <h1>Vos informations personnelles :</h1>
        <p> Nom : {Name}</p>
        <p> Email : {Mail} </p>
        <p> Entreprise : {Company} </p>
      </div>
      </>
    )
  }
}

export default UserSpace
