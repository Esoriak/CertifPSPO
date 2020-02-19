import React, { Component } from 'react';
import './App.css'
import { Switch, Route, Redirect } from "react-router-dom"

import Tests from './Components/Tests';
import Login from './Components/Login';
import Footer from './Components/Footer';

class App extends Component {
state = {
  log : '',
}


  VerifiedLog = () => {
    this.setState({
      log : localStorage.getItem('mail')
    })
}

componentDidMount = () => {
  this.VerifiedLog()
}
  render() {

    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Login} />
          {/* Mettre en place la protection des routes après authentification, en attendant une redirection est faite à chaque fois qu'un utilisateur arrive sur la route /test sans s'être connecté au préalable */}
          {this.state.log.length > 1 ? <Route path="/test" component={Tests} /> 
          : <Redirect to="/"/> }
        </Switch>
        <Footer />
      </div>
    );
  }
}



export default App;
