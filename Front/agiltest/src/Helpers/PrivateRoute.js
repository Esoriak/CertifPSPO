import React, { Component } from 'react'
import {Route, Redirect} from "react-router-dom"

import ListCandidats from "../Components/Candidats.json"

const lengthminilog = 1

class PrivateRoute extends Component {
  state = {
    verified : false,
    access : '',
  }


  VerifiedLog = async() => {
    const log = localStorage.getItem('mail')
    for ( let i=0; i< ListCandidats.length ; i++) {
      console.log("mon log", log)
      if ( log === ListCandidats[i].mail){
      this.setState({
        access : log,
        verified : true,
      })
      console.log("access true", this.state.access)
      return
    }
    else {
      this.setState({
        verified :true,
        access :'',
      })
    }
    console.log("access false", this.state.access)
  }
}

componentDidMount = () => {
  this.VerifiedLog()
}


  render() {

    const { verified, access} = this.state
      return (
        <>
        {verified &&
          access.length > lengthminilog ? 
            // <Route {...rest} render={props => <Component {...props} />} />
            <Route to="/test" />
            :
        <Redirect to='/' />}
      {/* {!access && <Redirect to='/' />} */}
      </>
      )
  }
}

export default PrivateRoute
