import React, { Component } from 'react';
import Config from '../Config';
import validateInput from '../functions/validateInput';
import Modal from '../Modal';
import $ from 'jquery';
export class SiteAdd extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      id: '',
      name:'',
      siteId:''
    };
    this.validateInput = validateInput;
  }

  handleSubmit = async event => {
    event.preventDefault();
    const item = {
        name:this.state.name,
        siteId:this.state.siteId
    }
    console.log("Body" + JSON.stringify(item));

    await fetch(Config.serverAddress + '/api/v1/sites/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
      },
      body: JSON.stringify(item),
    }
    );
    $('#modalSuccess').modal('show');
  }
  componentDidMount(){
    this.forceUpdate();//inaczej przycisk zapisz nie działa poprawnie
  }
  render() {
    return (
      <div>
        <span class="d-block p-2 bg-primary text-white">Wpisz dane kompleksu</span>
        <form class={document.getElementsByClassName("is-invalid").length == 0 ? "was-validated" : ""}>
          <div class="form-group">
            <label for="nazwa">Nazwa</label>
            <input type="text" class="form-control is-invalid" id="nazwa" required
              onChange={(event) => {
                if (this.validateInput(event.target, new RegExp('^[A-Z]{1}[a-ząćężźłóń]{1,16}$'))) this.setState({ name: event.target.value });
              }}>
            </input>
            <div class="invalid-feedback">
              Co najmniej 2 litery, pierwsza wielka
              </div>
              <label for="nazwa">Numer kompleksu</label>
              <input type="text" class="form-control is-invalid" id="identyfikator" required
              onChange={(event) => {
                if (this.validateInput(event.target, new RegExp('^[0-9]{4}$'))) this.setState({ siteId: event.target.value });
              }}>
            </input>
            <div class="invalid-feedback">
              4 cyfry
              </div>    
          </div>
          <button class="btn btn-success" value="Zapisz" disabled={document.getElementsByClassName("is-invalid").length > 0} onClick={this.handleSubmit} >Zapisz</button>
        </form>
        <Modal header="Sukces" body={"Dodano kompleks: "+ this.state.siteId+" "+this.state.name} id="modalSuccess" onCloseClicked={()=>window.location.href='/sites'} />
        <Modal header="Błąd" body={"Dodawanie nie powiodło się."} id="modalError" />
      </div>
    )
  }
}
export default SiteAdd