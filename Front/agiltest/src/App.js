import React, { Component } from 'react';

import './App.css'
import { Switch, Route} from "react-router-dom"
import axios from 'axios';
import PrivateRoute from './Components/PrivateRoute'
import Tests from './Screens/Tests';
import Login from './Screens/Login';
import Footer from './Components/Footer';
import LogAdmin from './Components/LogAdmin';
import ListAdmin from './Components/ListAdmin';
import ListCandidat from './Components/ListCandidat';
import ListQuizz from './Components/ListQuizz';
import Adminspace from './Components/Adminspace';
import UserSpace from './Components/UserSpace';


class App extends Component {
  state = {
    verified : false,
  }



  // protectedRoute = () => {
  //   // Storage for token //
  //   const token = sessionStorage.getItem("token")
  //   let pathApi = process.env.REACT_APP_PATH_API_DEV + '/auth/protected/'
  //   if (process.env.NODE_ENV === 'production') {
  //     pathApi = process.env.REACT_APP_PATH_API_PROD + '/auth/protected/'
  //   }
  //   axios({
  //     method: 'POST',
  //     url: pathApi,
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //     },
  //   })
  //     // Verified if a token is correct //
  //     .then(res => {
  //       this.setState({
  //         verified: res.data.auth,
  //       })
  //     })
  // }

  // componentDidMount = () => {
  //   this.protectedRoute()
  // }



  render() {

    return (
      <div className="App">
        <Switch>
           {/* Section ADMIN */}
           <Route path="/login"  component={LogAdmin} />
           <Route path="/backoffice" component={ListCandidat} />
           <Route path="/admin" component={ListAdmin} />
           <Route path="/dataquizz" component={ListQuizz} />
           <Route path="/me-admin" component={Adminspace} />


            {/* Section Candidats */}
          <Route exact path="/" component={Login} />
          {/* Mettre en place la protection des routes après authentification, en attendant une redirection est faite à chaque fois qu'un utilisateur arrive sur la route /test sans s'être connecté au préalable */}
          <Route path="/test" component={Tests} /> 
         {/*  Pour le moment l'espace des candidats n'est pas utilisable en l'état */}
          <Route path="/me" component={UserSpace} />
        </Switch>

        <Footer />
      </div>
    );
  }
}



export default App;
