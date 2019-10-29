import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {setCurrentUser, logoutUser} from './actions/authActions';
import {clearCurrentProfile} from './actions/profileActions';
import Register from './components/auth/Register';
import { Provider } from 'react-redux';
import store from './store'
import './App.css';
import Dashboard from './components/dashboard/Dashboard';

//check for token

if(localStorage.jwtToken){
  //set auth token header auth
  setAuthToken(localStorage.jwtToken);
  //decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  //set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  //check for expire token
  const currentTime = Date.now()/1000;
  if(decoded.exp < currentTime){
    //logout user
    store.dispatch(clearCurrentProfile());
    //clear current profile
    store.dispatch(logoutUser());
    //redirect to login
    window.location.href= '/login';
  }
}
function App() {
  return (
    <Provider store= { store }>
      <Router>
      <div className="App">
        <Navbar />

        <Route exact path="/"component={Landing} />
        <div className="container">

          <Route exact path="/register" component={Register}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/dashboard" component={Dashboard}/>
        </div>

        <Footer />
      </div>
      </Router>
    </Provider>
  );
}

export default App;
