import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

import { GET_ERRORS, SET_CURRENT_USER }    from './types';
import jwt_decode from 'jwt-decode';
//Register User

export const RegisterUser = (userData,history) => dispatch => {
   

    axios.post('/api/users/register', userData)
    .then(res => 
        
        history.push('/login')
        
        )
    .catch(err => 
        
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
        
        );


};

//Login get user token

export const LoginUser = userData => dispatch => {
axios.post('/api/users/login', userData)
.then(res => {
    //save to local storage
    const { token } = res.data;
    //set token to localstorage
    localStorage.setItem('jwtToken', token);

    //set token to auth header
    setAuthToken(token);
    //Decode Token to get user data
    const decoded =jwt_decode(token);

    //set current user
    dispatch(setCurrentUser(decoded));
})
.catch(err => 
    dispatch({
        type: GET_ERRORS,
        payload: err.response.data
    })
);
};

//set logged in user 
export const setCurrentUser=(decoded) => {
    return {
    type: SET_CURRENT_USER,
    payload: decoded
};
};


//Log user out

export const logoutUser = () => dispatch => {
    //Remove token from localstorage
    localStorage.removeItem('jwtToken');
    //Remove auth header for future requests
    setAuthToken(false);
    //set current user to { } which will set authenticated to false
    dispatch(setCurrentUser({}))
}