
import React, { Component } from 'react';
import Config from '../Config';
import validateInput from '../functions/validateInput';
export class UserAdd extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      computer: null,
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      pesel: '',
      role: '',
      phone: '',
      mobilePhone: '',
      voip: '',
    };
    this.validateInput = validateInput;
  }

  handleSubmit = async event => {
    event.preventDefault();
    const item = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      pesel: this.state.pesel,
      role: this.state.role,
      phone: this.state.phone,
      mobilePhone: this.state.mobilePhone,
      voip: this.state.voip
    }
    console.log("Body" + JSON.stringify(item));

    await fetch(Config.serverAddress + '/api/v1/users/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
      },
      body: JSON.stringify(item),
    }
    );
    alert("Zapisano");
    this.forceUpdate();
  }
  componentDidMount(){
    this.forceUpdate();//inaczej przycisk zapisz nie działa poprawnie
  }
  render() {
    return (
      <div>
        <span class="d-block p-2 bg-primary text-white">Wpisz dane użytkownika</span>
        <form class={document.getElementsByClassName("is-invalid").length == 0 ? "was-validated" : ""}>
          <div class="form-group">
            <label for="imie">Imię</label>
            <input type="text" class="form-control is-invalid" id="imie" required
              onChange={(event) => {
                if (this.validateInput(event.target, new RegExp('^[A-Z]{1}[a-ząćężźłóń]{1,16}$'))) this.setState({ firstName: event.target.value });
              }}>
            </input>
            <div class="invalid-feedback">
              Co najmniej 2 litery, pierwsza wielka
              </div>
            <label for="nazwisko">Nazwisko</label>
            <input type="text" class="form-control is-invalid" id="nazwisko" required
              onChange={(event) => {
                if (this.validateInput(event.target, new RegExp('^[A-Z]{1}[a-ząćężźłóń]{1,16}$'))) this.setState({ lastName: event.target.value });
              }}>
            </input>
            <div class="invalid-feedback">
              Co najmniej 2 litery, pierwsza wielka
              </div>
            <label for="pesel">Pesel</label>
            <input type="text" class="form-control is-invalid" id="pesel" required
              onChange={(event) => {
                if (this.validateInput(event.target, new RegExp('^[0-9]{11}$'))) this.setState({ pesel: event.target.value });
              }}>
            </input>
            <div class="invalid-feedback">
              11 cyfr
            </div>
            <label for="role">Rola</label>
            <input type="text" class="form-control" id="role" required></input>
            <label for="mail">Mail</label>
            <input type="email" class="form-control is-invalid" id="email" required
              onChange={(event) => {
                if (this.validateInput(event.target, new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$'))) this.setState({ email: event.target.value });
              }}>
            </input>
            <div class="invalid-feedback">
              Niepoprawny email
              </div>
            <label for="phone">Nr telefonu</label>
            <input type="telephone" class="form-control is-valid" id="phone"
              onChange={(event) => {
                if (this.validateInput(event.target, new RegExp('^[0-9]{8,11}$'))) this.setState({ phone: event.target.value });
              }}>
            </input>
            <div class="invalid-feedback">
              Od 8 do 11 cyfr
              </div>
            <label for="mobilePhone">Nr telefonu (komórkowy)</label>
            <input type="telephone" class="form-control is-valid" id="mobilePhone"
              onChange={(event) => {
                if (this.validateInput(event.target, new RegExp('^[0-9]{8,11}$'))) this.setState({ mobilePhone: event.target.value });
              }}>
            </input>
            <div class="invalid-feedback">
              Od 8 do 11 cyfr
              </div>
            <label for="voip">Nr telefonu (VoIP)</label>
            <input type="telephone" class="form-control is-valid" id="voip"
              onChange={(event) => {
                if (this.validateInput(event.target, new RegExp('^[0-9]{8,11}$'))) this.setState({ voip: event.target.value });
              }}>
            </input>
            <div class="invalid-feedback">
              Od 8 do 11 cyfr
              </div>
          </div>
          <button class="btn btn-success" value="Zapisz" disabled={document.getElementsByClassName("is-invalid").length > 0} onClick={this.handleSubmit} >Zapisz</button>
        </form>
        
      </div>
    )
  }
}
export default UserAdd