import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import Header from './Components/Header';
import Tests from './Components/Tests';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Entraînement certif PSPO
        </p>
      </header>
      <Header />
      <Tests />
    </div>
  );
}

export default App;
