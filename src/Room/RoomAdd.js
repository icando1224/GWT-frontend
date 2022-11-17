import React, { Component } from 'react';
import Config from '../Config';
import validateInput from '../functions/validateInput';
import Modal from '../Modal';
import $ from 'jquery';
export class RoomAdd extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      id: '',
      number:'',
      isLoadedFloors:false,
      sites:[],
      siteSelected:'',
      buildings:[],
      buildingSelected:'',
      floors:[],
      floorSelected:''
    };
    this.validateInput = validateInput;
  }

  handleSubmit = async event => {
    event.preventDefault();
    const item = {
     number:this.state.number,
     floor:this.state.floors.find(element=>element.id==this.state.floorSelected)
    }
    console.log("Body" + JSON.stringify(item));

    await fetch(Config.serverAddress + '/api/v1/rooms/', {
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
      fetch(Config.serverAddress + "/api/v1/buildings", requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoadedBuildings: true,
            buildings: result
          });
          console.log(this.state.buildings)
        },
        // Uwaga: to ważne, żeby obsłużyć błędy tutaj, a
        // nie w bloku catch(), aby nie przetwarzać błędów
        // mających swoje źródło w komponencie.
        (error) => {
          this.setState({
            isLoadedBuildings: false,
            error
          });
        }
      )
        fetch(Config.serverAddress + "/api/v1/floors", requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
            this.setState({
                isLoadedFloors: true,
                floors: result
                });
                console.log(this.state.floors)
              },
              // Uwaga: to ważne, żeby obsłużyć błędy tutaj, a
              // nie w bloku catch(), aby nie przetwarzać błędów
              // mających swoje źródło w komponencie.
              (error) => {
                this.setState({
                  isLoadedFloors: true,
                  error
                });
              }
            )
  }
  render() {
    let { sites, buildings, floors } = this.state;
    return (
      <div>
        <span class="d-block p-2 bg-primary text-white">Wpisz dane pomieszczenia</span>
        <form class={document.getElementsByClassName("is-invalid").length == 0 ? "was-validated" : ""}>
          <div class="form-group">
          <label for="selectSite">Wybierz kompleks</label>
          <select class="form-control is-invalid" id="selectSite" required onChange={(event) => {
            document.getElementById("selectBuilding").options[0].selected=true;
            document.getElementById("selectBuilding").classList.add('is-invalid');
            document.getElementById("selectFloor").options[0].selected=true;
            document.getElementById("selectFloor").classList.add('is-invalid');
            if (this.validateInput(event.target, new RegExp('^[0-9]*$'))) this.setState({ 'siteSelected': event.target.value });
          }}>
            <option selected disabled>Wybierz...</option>
            {Array.isArray(this.state.sites) && sites.map(site => (
              <option value={site.id}>{"Identyfikator: "+site.siteId + " Nazwa: " + site.name}</option>
            ))}
          </select>
          <label for="selectBuilding">Wybierz budynek</label>
          <select class="form-control is-invalid" id="selectBuilding" required onChange={(event) => {
            document.getElementById("selectFloor").options[0].selected=true;
            document.getElementById("selectFloor").classList.add('is-invalid');
            if (this.validateInput(event.target, new RegExp('^[0-9]*$'))) this.setState({ 'buildingSelected': event.target.value,'building':buildings.find(building=>building.id==event.target.value)
           });
          }}>
            <option selected disabled>Wybierz...</option>
            {Array.isArray(this.state.buildings) && buildings.filter(building=>building.site.id==this.state.siteSelected).map(building => (
              <option value={building.id}>{"Numer: "+building.number}</option>
            ))}
          </select>
          <label for="selectFloor">Wybierz piętro</label>
          <select class="form-control is-invalid" id="selectFloor" required onChange={(event) => {
            if (this.validateInput(event.target, new RegExp('^[0-9]*$'))) this.setState({ 'floorSelected': event.target.value,'floor':floors.find(floor=>floor.id==event.target.value)
           });
          }}>
            <option selected disabled>Wybierz...</option>
            {Array.isArray(this.state.floors) && floors.filter(floor=>floor.building.id==this.state.buildingSelected).map(floor => (
              <option value={floor.id}>{"Numer: "+floor.level}</option>
            ))}
          </select>

              <label for="numer">Numer pomieszczenia</label>
              <input type="text" class="form-control is-invalid" id="identyfikator" required
              onChange={(event) => {
                if (this.validateInput(event.target, new RegExp('^[0-9]*$'))) this.setState({ number: event.target.value });
              }}>
            </input>
            <div class="invalid-feedback">
              </div>    
          </div>
          <button class="btn btn-success m-2" value="Zapisz" disabled={document.getElementsByClassName("is-invalid").length > 0} onClick={this.handleSubmit} >Zapisz</button>
        </form>
        <Modal header="Sukces" body={"Dodano pomieszczenie: "+ this.state.number} id="modalSuccess" onCloseClicked={()=>window.location.href='/rooms'} />
        <Modal header="Błąd" body={"Dodawanie nie powiodło się."} id="modalError" />
      </div>
    )
  }
}
export default RoomAdd