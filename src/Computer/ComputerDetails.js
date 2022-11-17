import React, { Component } from 'react';

import Config from '../Config'
import validateInput from '../functions/validateInput';
import validateID from '../functions/validateID';
import Modal from '../Modal';
import $ from 'jquery';
export class ComputerDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      //computer: '',
      //tempComputer:'',
      computers: [],
      users: [],
      id: '',
      deviceId: '',
      adName:'',
      producer: '',
      model: '',
      cpu: '',
      ram: '',
      hdd: '',
      ipAddress: '',
      macAddress: '',
      owner: '',
      formDisabled: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateInput = validateInput;
    this.validateID = validateID;
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
      id: this.state.id,
      deviceId: this.state.deviceId,
      adName: this.state.adName,
      producer: this.state.producer,
      model: this.state.model,
      cpu: this.state.cpu,
      ram: this.state.ram,
      hdd: this.state.hdd,
      ipAddress: this.state.ipAddress,
      macAddress: this.state.macAddress,
      owner: this.state.owner
    }
    console.log("Body" + JSON.stringify(item));

    await fetch(Config.serverAddress + '/api/v1/computers/' + this.state.id, {
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

  componentDidMount() {
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
      }
    }
    let url = Config.serverAddress + "/api/v1/computers/" + this.props.match.params.id;
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
            deviceId: result.deviceId,
            adName: result.adName,
            producer: result.producer,
            model: result.model,
            cpu: result.cpu,
            ram: result.ram,
            hdd: result.hdd,
            ipAddress: result.ipAddress,
            macAddress: result.macAddress,
            owner: result.owner
          });
          console.log(this.state.computer)
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

    fetch(Config.serverAddress + "/api/v1/computers", requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            computers: result
          });
        },
        // Uwaga: to ważne, żeby obsłużyć błędy tutaj, a
        // nie w bloku catch(), aby nie przetwarzać błędów
        // mających swoje źródło w komponencie.
        (error) => {
          this.setState({
            isLoaded: false,
            error
          });
        }
      )
    fetch(Config.serverAddress + "/api/v1/users", requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          result.sort((a, b) => a.lastName.localeCompare(b.lastName));
          this.setState({
            isLoaded: true,
            users: result
          });
          console.log(this.state.users)
        },
        // Uwaga: to ważne, żeby obsłużyć błędy tutaj, a
        // nie w bloku catch(), aby nie przetwarzać błędów
        // mających swoje źródło w komponencie.
        (error) => {
          this.setState({
            isLoaded: false,
            error
          });
        }
      )
  }

  render() {
    let { error, isLoaded } = this.state;
    if (error) {
      return <div>Błąd: {error.message}</div>;
    } else if (!isLoaded) {
      return <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>;
    } else {
      return (
        <div>
          <span class="d-block p-2 bg-primary text-white">Szczegółowe dane komputera</span>
          <form class={document.getElementsByClassName("is-invalid").length == 0 ? "was-validated" : ""}>
            <div class="form-group">
              <label for="deviceID" >ID urządzenia</label>
              <input type="number" placeholder="Wpisz ID komputera" class="form-control is-valid " id="deviceID" defaultValue={this.state.deviceId} disabled={this.state.formDisabled} onChange={(event) => {
                if (this.validateInput(event.target, new RegExp('^[0-9]{4,6}$')) && this.validateID(event.target)) this.setState({ deviceId: event.target.value })
              }
              } />
              <div class="invalid-feedback">
                Od 4 do 6 cyfr, unikalna wartość
            </div>
              <label for="exampleFormControlSelect1">Wybierz właściciela</label>
              <select class="form-control is-valid" id="exampleFormControlSelect1" disabled={this.state.formDisabled} disabled={this.state.formDisabled} onChange={(event) => {
                if (this.validateInput(event.target, new RegExp('^[0-9]*$'))) this.setState({ 'owner': this.state.users.find(user => user.id == event.target.value) });
              }}>
                {this.state.users.order}
                {
                  Array.isArray(this.state.users)&&this.state.users!=null&&this.state.users.map(user => (
                    <option selected={this.state.owner.id == user.id} value={user.id}>{user.firstName + " " + user.lastName + " Pesel: " + user.pesel}</option>
                  ))}
              </select>
              <label for="adName">Nazwa AD</label>
            <input type="text" placeholder="Wpisz nazwę w Active Directory" class="form-control is-valid" id="adName" defaultValue={this.state.adName} disabled={this.state.formDisabled} onChange={(event) => {
              if (this.validateInput(event.target, new RegExp('^[a-zA-Z0-9]{2,16}$'))) this.setState({ adName: event.target.value.toLocaleUpperCase() });
            }}></input>
            <label for="producer">Producent</label>
            <input type="text" placeholder="Wpisz producenta komputera" class="form-control is-valid" id="producer" defaultValue={this.state.producer} required disabled={this.state.formDisabled} onChange={(event) => {
              if (this.validateInput(event.target, new RegExp('^[a-zA-Z0-9]{2,16}$'))) this.setState({ producer: event.target.value });
            }}></input>
            <label for="model">Model</label>
            <input type="text" placeholder="Wpisz model komputera" class="form-control is-valid" id="model" defaultValue={this.state.model} required disabled={this.state.formDisabled} onChange={(event) => {
              if (this.validateInput(event.target, new RegExp('^[a-zA-Z0-9]{2,16}$'))) this.setState({ model: event.target.value });
            }}></input>
              <label for="cpu">Procesor</label>
              <input type="text" class="form-control is-valid" id="cpu" defaultValue={this.state.cpu} disabled={this.state.formDisabled} required onChange={(event)=>{
                if (this.validateInput(event.target, new RegExp('^($|([a-zA-Z0-9]{2,16})$)'))) this.setState({ cpu: event.target.value });
              }}></input>
              <label for="ram">RAM</label>
              <input type="text" class="form-control is-valid" id="ram" defaultValue={this.state.ram} disabled={this.state.formDisabled} onChange={(event) => {
                            if (this.validateInput(event.target, new RegExp('^($|[1-9]{1}[0-9]{0,3}$)'))) this.setState({ ram: event.target.value });
                          }}
              />
              <label for="model">Dysk twardy</label>
              <input type="text" placeholder="Wpisz dane dysku twardego" class="form-control is-valid" id="hdd" value={this.state.hdd} disabled={this.state.formDisabled} onChange={(event) => {
              if (this.validateInput(event.target, new RegExp('^($|[0-9a-zA-Z]{5,50}$)'))) this.setState({ hdd: event.target.value });
            }}></input>
            <label for="ip">IP</label>
            <input type="text" placeholder="Wpisz adres IP" class="form-control is-valid" id="ip" defaultValue={this.state.ipAddress} disabled={this.state.formDisabled} onChange={(event) => {
              if (this.validateInput(event.target, new RegExp("^($|(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$"))) this.setState({ ipAddress: event.target.value });
              
            }}></input>
            <div class="invalid-feedback">
              Adres IP w formacie x.x.x.x gdzie x jest liczbą 0-255
            </div>
            <label for="mac">MAC</label>
            <input type="text" placeholder="Wpisz adres MAC" class="form-control is-valid" id="mac" defaultValue={this.state.macAddress} disabled={this.state.formDisabled} onChange={(event) => {
              if (this.validateInput(event.target, new RegExp('^($|(([0-9a-fA-F]){2})(:([0-9a-fA-F]){2}){7}$)'))) this.setState({ macAddress: event.target.value.toUpperCase() });
            }}></input>
            <div class="invalid-feedback">
              Adres MAC w formacie XX:XX:XX:XX:XX:XX:XX:XX gdzie X- wartość zapisana szesnastkowo (0-F)
            </div>
            </div>
          </form>
          <button class="btn btn-danger m-2" onClick={this.handleClickEdit}>Odblokuj edycję</button>
          <button type="submit" class="btn btn-success m-2" disabled={document.getElementsByClassName("is-invalid").length > 0} hidden={this.state.formDisabled} onClick={this.handleSubmit}>Zapisz</button>
          <Modal header="Sukces" body={"Zaktualizowano komputer ID: "+ this.state.deviceId} id="modalSuccess" onCloseClicked={()=>window.location.href='/computers'} />
          <Modal header="Błąd" body={"Aktualizowanie nie powiodło się."} id="modalError" />
        </div>
      )
    }
  }
}
export default ComputerDetails