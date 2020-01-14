import React from 'react';
import logo from './logo.svg';
import './App.css';
// import axios from 'axios'
import Header from './Components/Header';
import Tests from './Components/Tests';
import Register from './Components/Register';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Header />
      <Tests />
    </div>
  );
}

export default App;
