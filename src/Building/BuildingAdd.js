import React, { Component } from 'react';
import Config from '../Config';
import validateInput from '../functions/validateInput';
import Modal from '../Modal';
import $ from 'jquery';
export class BuildingAdd extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      id: '',
      number:'',
      isLoadedSites:false,
      sites:[],
      siteSelected:''
    };
    this.validateInput = validateInput;
  }

  handleSubmit = async event => {
    event.preventDefault();
    const item = {
     number:this.state.number,
     site:this.state.sites.find(element=>element.id==this.state.siteSelected)
    }
    console.log("Body" + JSON.stringify(item));

    await fetch(Config.serverAddress + '/api/v1/buildings/', {
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
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
        }
      }
          fetch(Config.serverAddress + "/api/v1/sites", requestOptions)
            .then(res => res.json())
            .then(
              (result) => {
                this.setState({
                  isLoadedSites: true,
                  sites: result
                });
                console.log(this.state.sites)
              },
              // Uwaga: to ważne, żeby obsłużyć błędy tutaj, a
              // nie w bloku catch(), aby nie przetwarzać błędów
              // mających swoje źródło w komponencie.
              (error) => {
                this.setState({
                  isLoaded: true,
                  error
                });
              }
            )
  }
  render() {
    let { sites } = this.state;
    return (
      <div>
        <span class="d-block p-2 bg-primary text-white">Wpisz dane budynku</span>
        <form class={document.getElementsByClassName("is-invalid").length == 0 ? "was-validated" : ""}>
          <div class="form-group">
          <label for="selectSite">Wybierz kompleks</label>
          <select class="form-control is-invalid" id="selectSite" required onChange={(event) => {
            if (this.validateInput(event.target, new RegExp('^[0-9]*$'))) this.setState({ 'siteSelected': event.target.value });
          }}>
            <option selected disabled>Wybierz...</option>
            {Array.isArray(this.state.sites) && sites.map(site => (
              <option value={site.id}>{"Identyfikator: "+site.siteId + " Nazwa: " + site.name}</option>
            ))}
          </select>

              <label for="numer">Numer budynku</label>
              <input type="text" class="form-control is-invalid" id="identyfikator" required
              onChange={(event) => {
                if (this.validateInput(event.target, new RegExp('^[0-9]{1,}$'))) this.setState({ number: event.target.value });
              }}>
            </input>
            <div class="invalid-feedback">
              </div>    
          </div>
          <button class="btn btn-success m-2" value="Zapisz" disabled={document.getElementsByClassName("is-invalid").length > 0} onClick={this.handleSubmit} >Zapisz</button>
        </form>
        <Modal header="Sukces" body={"Dodano budynek: "+ this.state.number} id="modalSuccess" onCloseClicked={()=>window.location.href='/buildings'} />
        <Modal header="Błąd" body={"Dodawanie nie powiodło się."} id="modalError" />
      </div>
    )
  }
}
export default BuildingAdd