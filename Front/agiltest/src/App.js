import React from 'react';
import './App.css'
import {Switch, Route} from "react-router-dom"

import Tests from './Components/Tests';
import Login from './Components/Login';
import Footer from './Components/Footer';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/test" component={Tests} />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
