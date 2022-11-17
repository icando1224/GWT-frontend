import React, { Component } from 'react';
import Config from '../Config';
import validateInput from '../functions/validateInput';
import validateID from '../functions/validateID';
import $ from 'jquery';
import Modal from '../Modal';
export class SwitchAdd extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      computer: null,
      users: [],
      switches: [],
      id: '',
      deviceId: '',
      adName:'',
      producer: '',
      model: '',
      ipAddress: '',
      macAddress: '',
      owner: '',
    };
    this.validateInput = validateInput;
    this.validateID = validateID;

  }

  componentDidMount() {
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
      }
    }
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
      ).then(
        fetch(Config.serverAddress + "/api/v1/switches", requestOptions)
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                switches: result,
              });
            },
            // Uwaga: to ważne, żeby obsłużyć błędy tutaj, a
            // nie w bloku catch(), aby nie przetwarzać błędów
            // mających swoje źródło w komponencie.
            (error) => {
              this.setState({
                isLoaded: false,//<-zmienic
                error
              });
            }
          )
      )
  }

  handleSubmit = async event => {
    event.preventDefault();
    const item = {
      deviceId: this.state.deviceId,
      producer: this.state.producer,
      model: this.state.model,
      ipAddress: this.state.ipAddress,
      macAddress: this.state.macAddress,
      owner: this.state.owner
    }
    console.log("Body" + JSON.stringify(item));

    await fetch(Config.serverAddress + '/api/v1/switches/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
      },
      body: JSON.stringify(item),
    }
    ).then(res => {
      if (res.status == 200) {
        $('#modalSuccess').modal('show');
      }
      else {
        $('#modalError').modal('show');
        //alert("Błąd: " + res.status + " " + res.statusText + " Nie zapisano.");
      }
    });

  }
  render() {
    let { error, isLoaded, users } = this.state;
    return (
      <div>
        <span class="d-block p-2 bg-primary text-white">Szczegółowe dane switcha</span>
        <form class={document.getElementsByClassName("is-invalid").length == 0 ? "was-validated" : ""}>
          <div class="form-group">
            <label for="deviceID" >ID urządzenia</label>
            <input type="number" placeholder="Wpisz ID switcha" class="form-control is-invalid " id="deviceID" required onChange={(event) => {

              if (this.validateInput(event.target, new RegExp('^[0-9]{4,6}$')) && this.validateID(event.target)) this.setState({ deviceId: event.target.value })
            }
            } />
            <div class="invalid-feedback">
              Od 4 do 6 cyfr, unikalna wartość
            </div>
            <label for="exampleFormControlSelect1">Wybierz właściciela</label>
            <select class="form-control is-invalid" id="exampleFormControlSelect1" required onChange={(event) => {
              console.log(event.target.value);
              if (this.validateInput(event.target, new RegExp('^[0-9]*$'))) this.setState({ 'owner': this.state.users.find(user => user.id == event.target.value) });
            }}>
              <option selected disabled>Wybierz...</option>
              {this.state.users.order}
              {Array.isArray(this.state.users) && users.map(user => (
                <option value={user.id}>{user.firstName + " " + user.lastName + " Pesel: " + user.pesel}</option>
              ))}
            </select>

            <div class="invalid-feedback">
              Wybierz użytkownika z listy
            </div>
            <label for="producer">Producent</label>
            <input type="text" placeholder="Wpisz producenta switcha" class="form-control is-invalid" id="producer" required onChange={(event) => {
              if (this.validateInput(event.target, new RegExp('[a-zA-Z0-9]{2,16}$'))) this.setState({ producer: event.target.value });
            }}></input>

            <div class="invalid-feedback">
              Od 2 do 16 znaków alfanumerycznych
            </div>
            <label for="model">Model</label>
            <input type="text" placeholder="Wpisz model switcha" class="form-control is-invalid" id="model"  required onChange={(event) => {
              if (this.validateInput(event.target, new RegExp('^[a-zA-Z0-9]{2,16}$'))) this.setState({ model: event.target.value });
            }}></input>

            <div class="invalid-feedback">
              Od 2 do 16 znaków alfanumerycznych
            </div>
            <label for="ip">IP</label>
            <input type="text" placeholder="Wpisz adres IP" class="form-control is-valid" id="ip" onChange={(event) => {
              if (this.validateInput(event.target, new RegExp("^($|(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$"))) this.setState({ ipAddress: event.target.value });
            }}></input>
            
            <div class="invalid-feedback">
              Adres IP w formacie x.x.x.x gdzie x jest liczbą 0-255
            </div>
            <label for="mac">MAC</label>
            <input type="text" placeholder="Wpisz adres MAC" class="form-control is-valid" id="mac" onChange={(event) => {
              if (this.validateInput(event.target, new RegExp('^($|(([0-9a-fA-F]){2})(\:([0-9a-fA-F]){2}){7}$)'))) this.setState({ macAddress: event.target.value.toUpperCase() });
            }}></input>
                        
            <div class="invalid-feedback">
              Adres MAC w formacie XX:XX:XX:XX:XX:XX:XX:XX gdzie X- wartość zapisana szesnastkowo (0-F)
            </div>
          </div>
        </form>
        <button href={Config.pageAddress + "/switches/add"} class="btn btn-success" disabled={document.getElementsByClassName("is-invalid").length > 0} onClick={this.handleSubmit}>Zapisz</button>
        <Modal header="Sukces" body={"Dodano switch ID: "+ this.state.deviceId} id="modalSuccess" onCloseClicked={()=>window.location.href='/switches'} />
        <Modal header="Błąd" body={"Dodawanie nie powiodło się."} id="modalError" />
      </div>
    )
  }
}
export default SwitchAdd