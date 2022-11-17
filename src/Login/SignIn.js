
import React, { Component } from 'react';
import {authenticationService} from '../Services/authenticationService'
import { Redirect, useHistory } from 'react-router-dom';
import { Modal } from '../Modal';
import Config from '../Config';
import $ from 'jquery';

export class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            passwordConfirm: "",
            arePasswordsEquals: false
        };
    
    }
    
    handleSubmit = async event => {
        event.preventDefault();
        const item = {
         username:this.state.username,
         password:this.state.password
        }
        console.log("Body" + JSON.stringify(item));
    
        await fetch(Config.serverAddress + '/sign-up', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item)
        }).then(res => {
        console.log(res);
            if (res.status == 200) {
              $('#modalSuccess').modal('show');
            }
            else {
              $('#modalError').modal('show');
            }
          },        (error) => {
            this.setState({
              isLoaded: true,
              error
            }
            );
            $('#modalError').modal('show');
          });
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
                            <label for="staticEmail" class="col-form-label col-sm-1">Email</label>
                            <input type="email" class="form-control col-sm-11" id="email" placeholder="email@example.com" onChange={(Event)=>this.state.username = Event.target.value} />
                        </div>
                        <div class="form-group col-12 row">
                            <label for="inputPassword1" class="col-form-label col-sm-1">Hasło</label>
                            <input type="password" class="form-control col-sm-11" id="password" placeholder="Hasło" onChange={
                                (Event)=>
                                    {
                                    this.state.password = Event.target.value;
                                    this.setState({'disabled': Event.target.value.localeCompare(this.state.passwordConfirm)});
                                    }
                                }
                            />
                        </div>
                        <div class="form-group col-12 row">
                            <label for="inputPassword2" class="col-form-label col-sm-1">Powtórz hasło</label>
                            <input type="password" class="form-control col-sm-11" id="password" placeholder="Hasło" onChange={
                                (Event)=>
                                    {
                                    this.state.passwordConfirm = Event.target.value;
                                    this.setState({'disabled': Event.target.value.localeCompare(this.state.password)});
                                    }
                                }
                            />
                        </div>
                        <div class="form-group col-12 row">
                            <button type="submit" class="btn btn-primary btn-block" disabled={this.state.password.localeCompare(this.state.passwordConfirm)!=0} onClick={this.handleSubmit} >Zarejestruj</button>
                        </div>
                        {authenticationService.currentUserValue!=null &&
                        <Redirect to="/login"/>}
                         
                    </form>
                </div >
                <Modal header="Sukces!" body={"Zarejestrowano: "+this.state.username} id="modalSuccess" onCloseClicked={()=>window.location.reload()} />
                <Modal header="Błąd!" body={"Nie zarejestrowano nowego użytkownika."} id="modalError" />
            </div>
        );
    }
}

export default SignIn