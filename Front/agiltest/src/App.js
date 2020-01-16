import React from 'react';
import './App.css';
import {Switch, Route} from "react-router-dom"
// import axios from 'axios'
import Tests from './Components/Tests';

import Login from './Components/Login';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/quizz" component={Tests} />
      </Switch>
    </div>
  );
}

export default App;
