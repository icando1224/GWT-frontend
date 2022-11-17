import { BehaviorSubject } from 'rxjs';
import Config from '../Config';
import { handleResponse } from '../helpers/handleResponse';
import $ from 'jquery';


const currentUserSubject = new BehaviorSubject((localStorage.getItem('username')));

export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () {
        return currentUserSubject.value }
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };
    return fetch(`${Config.serverAddress}/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            if (user)
            {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("Authorization",user["Authorization"]);
            localStorage.setItem("username",user["username"]);
            //var now = new Date();
            //var time= now.getTime();
            //var expireTime=time+10*36000;
           // now.setTime(expireTime);
            //document.cookie="Authorization="+user["Authorization"]+";expires="+now.toGMTString();
            //document.cookie="username="+user["username"]+";expires="+now.toGMTString();
            currentUserSubject.next(user);
            }
        },
        (error) => {
            $('#modalError').modal('show');
          });
        
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('Authorization');
    localStorage.removeItem('username');
    currentUserSubject.next(null);
}