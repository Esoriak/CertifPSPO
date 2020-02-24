import React, { Component } from 'react';
import './App.css'
import { Switch, Route, Redirect } from "react-router-dom"

import Tests from './Components/Tests';
import Login from './Components/Login';
import Footer from './Components/Footer';
import ListCandidats from "./Components/Candidats.json"

class App extends Component {
  state ={
    log : '',
    accessdenied : false,
  }

  render() {

    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Login} />
          {/* Mettre en place la protection des routes après authentification, en attendant une redirection est faite à chaque fois qu'un utilisateur arrive sur la route /test sans s'être connecté au préalable */}
         <Route path="/test" component={Tests} /> 
        </Switch>
        <Footer />
      </div>
    );
  }
}



export default App;
