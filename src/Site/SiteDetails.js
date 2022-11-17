import React, { Component } from 'react';
import Config from '../Config';
import validateInput from '../functions/validateInput';
import Modal from '../Modal';
import $ from 'jquery';
export class SiteDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      id: '',
      name:'',
      siteId:'',
      sites:[],
      formDisabled:true
    };
    this.validateInput = validateInput;
  }
  handleClickEdit = (Event) => {
    Event.preventDefault();
    if (this.state.formDisabled) {
      this.setState({ formDisabled: false })
      Event.target.classList.remove("btn-danger");
      Event.target.classList.add("btn-primary");
      Event.target.innerText = "Zablokuj edycję";
    }
    else {
      this.setState({ formDisabled: true })
      Event.target.classList.remove("btn-primary");
      Event.target.classList.add("btn-danger");
      Event.target.innerText = "Odblokuj edycję";
    }
  }

  handleSubmit = async event => {
    event.preventDefault();
    const item = {
        name:this.state.name,
        siteId:this.state.siteId
    }
    console.log("Body" + JSON.stringify(item));

    await fetch(Config.serverAddress + '/api/v1/sites/'+this.state.id, {
      method: 'PUT',
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
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
      }
    }
    let url = Config.serverAddress + "/api/v1/sites/" + this.props.match.params.id;
    fetch(url, requestOptions)
      .then(res => {
        console.log(res);
        if (res.status == 200) {
          return res.json()
        }
        if (res.status == 401 || res.status == 403) //zmienić tylko na 401? 403 to brak autoryzacji
        {
          window.location.replace(Config.pageAddress + "/login");
        }
      })
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            id: result.id,
            name:result.name,
            siteId: result.siteId,
            sites: result.sites
          });
          console.log(this.state.router)
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
    return (
      <div>
        <span class="d-block p-2 bg-primary text-white">Wpisz dane kompleksu</span>
        <form class={document.getElementsByClassName("is-invalid").length == 0 ? "was-validated" : ""}>
          <div class="form-group">
            <label for="nazwa">Nazwa</label>
            <input type="text" class="form-control is-valid" id="nazwa" required disabled={this.state.formDisabled} defaultValue={this.state.name}
              onChange={(event) => {
                if (this.validateInput(event.target, new RegExp('^[A-Z]{1}[a-ząćężźłóń]{1,16}$'))) this.setState({ name: event.target.value });
              }}>
            </input>
            <div class="invalid-feedback">
              Co najmniej 2 litery, pierwsza wielka
              </div>
              <label for="nazwa">Numer kompleksu</label>
              <input type="number" class="form-control is-valid" id="identyfikator" required disabled={this.state.formDisabled} defaultValue={this.state.siteId}
              onChange={(event) => {
                if (this.validateInput(event.target, new RegExp('^[0-9]{4}$'))) this.setState({ siteId: event.target.value });
              }}>
            </input>
            <div class="invalid-feedback">
              4 cyfry
              </div>    
          </div>
        </form>
        <button class="btn btn-danger m-2" onClick={this.handleClickEdit}>Odblokuj edycję</button>
        <button type="submit" class="btn btn-success m-2" hidden={this.state.formDisabled} disabled={document.getElementsByClassName("is-invalid").length > 0} onClick={this.handleSubmit}>Zapisz</button>
        <Modal header="Sukces" body={"Zaktualizowano kompleks: "+ this.state.siteId+" "+this.state.name} id="modalSuccess" onCloseClicked={()=>window.location.href='/sites'} />
        <Modal header="Błąd" body={"Aktualizowanie nie powiodło się."} id="modalError" />
      </div>
    )
  }
}
export default SiteDetails