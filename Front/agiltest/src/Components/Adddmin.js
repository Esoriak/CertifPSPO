import React, { Component } from 'react'
import axios from 'axios';

import BackofficeNavbar from '../Screens/Backoffice';

import MaterialTable from "material-table";

class AddAdmin extends Component {
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
       .then((res) => {
          localStorage.setItem("token", res.headers["x-access-token"])
          this.setState({ register: true , success : true}, () => {
            setTimeout(() => this.setState({ register: false }), 1400)
            setTimeout(() => this.setState({ admin_connect: true }), 1400)
            setTimeout(() => this.protectedRoute(), 1400)
          })
        })
    }

    GetAdminData = async() => {
      let pathApi = process.env.REACT_APP_PATH_API_DEV + '/bco/admin'
      if (process.env.NODE_ENV === 'production') {
        pathApi = process.env.REACT_APP_PATH_API_PROD + '/bco/admin'
      }
      const adminsdata = await axios.get(pathApi)
      this.setState({
        admins : adminsdata.data
      })
      console.log("luluetcastagnette", this.state.admins)
    }

    protectedRoute = () => {
      // Storage for token //
      const token = localStorage.getItem("token")
      let pathApi = process.env.REACT_APP_PATH_API_DEV + '/auth/protected/'
      if (process.env.NODE_ENV === 'production') {
        pathApi = process.env.REACT_APP_PATH_API_PROD + '/auth/protected/'
      }
      axios({
        method: 'POST',
        url: pathApi,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        // Verified if a token is correct //
        .then(res => {
          this.setState({
            verified: res.data.auth,
          })
        })
    }

    componentDidMount=()=> {
      this.GetAdminData()
      this.protectedRoute()
    }

  render() {

    return (
      <>
      <BackofficeNavbar />
        <div className="main_container">
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
                  this.delete(oldData.idAdmin)
                    setTimeout(() => {
                        {
                            /* let data = this.state.data;
                            const index = data.indexOf(oldData);
                            data.splice(index, 1);
                            this.setState({ data }, () => resolve()); */
                        }
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

export default AddAdmin
