
import React, { Component } from 'react';
import {authenticationService} from '../Services/authenticationService'
import { Redirect, useHistory } from 'react-router-dom';
import { Modal } from '../Modal';
import $ from 'jquery';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        };
    
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }
    
    handleFormSubmit(event) {
        event.preventDefault();
        authenticationService.login(this.state.username, this.state.password);
    };

    handleLoginChange = Event => {
        this.state.username = Event.target.value;
    }
    handlePasswordChange = Event => {
        this.state.password = Event.target.value;
    }

    render() {
        return (
            <div>
                <div class="mx-auto p-5">
                    <form>
                        <div class="form-group row col-12 pt-3" >
                            <label for="staticEmail2" class="col-form-label col-sm-1">Email</label>
                            <input type="email" class="form-control col-sm-11" id="email" placeholder="email@example.com" onChange={this.handleLoginChange} />
                        </div>
                        <div class="form-group col-12 row">
                            <label for="inputPassword2" class="col-form-label col-sm-1">Hasło</label>
                            <input type="password" class="form-control col-sm-11" id="password" placeholder="Hasło" onChange={this.handlePasswordChange} />
                        </div>
                        <div class="form-group col-12 row">
                            <button type="submit" class="btn btn-primary btn-block" onClick={this.handleFormSubmit} >Zaloguj</button>
                        </div>
                        {authenticationService.currentUserValue!=null &&
                        <Redirect to="/home"/>}
                         
                    </form>
                </div >
                <Modal header="Sukces!" body={"Zalogowano"} id="modalSuccess" onCloseClicked={()=>window.location.reload()} />
                <Modal header="Błąd!" body={"Nie zalogowano. Niepoprawny login lub hasło."} id="modalError" />
            </div>
        );
    }
}

export default Login