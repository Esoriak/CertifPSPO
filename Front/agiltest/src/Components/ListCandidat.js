import React, { Component } from 'react'
import axios from 'axios'

class ListCandidat extends Component {
  state ={
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
    console.log(users_data.data)
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
      <div>

      </div>
    )
  }
}

export default ListCandidat
