import React, { Component } from 'react';
import Config from '../Config';
import validateInput from '../functions/validateInput';
import Modal from '../Modal';
import $ from 'jquery';
export class FloorDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      id: '',
      building: '',
      level:'',
      isLoadedSites:false,
      site:'',
      sites:[],
      siteSelected:'',
      buildingSelected:'',
      floor:'',
      formDisabled: true
    };
    this.validateInput = validateInput;
  }

  handleSubmit = async event => {
    event.preventDefault();
    const item = {
     level:this.state.level,
     building:this.state.building
    }
    console.log("Body" + JSON.stringify(item));

    await fetch(Config.serverAddress + '/api/v1/floors/'+this.props.match.params.id, {
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
    this.forceUpdate();//inaczej przycisk zapisz nie działa poprawnie
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
        }
      }
      fetch(Config.serverAddress + "/api/v1/floors/"+this.props.match.params.id, requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoadedFloor: true,
            floor: result,
            siteSelected: result.building.site.id,
            building: result.building,
            level:result.level
          });
          console.log(this.state.sites)
        },
        // Uwaga: to ważne, żeby obsłużyć błędy tutaj, a
        // nie w bloku catch(), aby nie przetwarzać błędów
        // mających swoje źródło w komponencie.
        (error) => {
          this.setState({
            isLoadedSite: false,
            error
          });
        }
      )
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
                  isLoadedSite: false,
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

  render() {
    let { sites, buildings } = this.state;
    return (
      <div>
        <span class="d-block p-2 bg-primary text-white">Wpisz dane piętra</span>
        <form class={document.getElementsByClassName("is-invalid").length == 0 ? "was-validated" : ""}>
          <div class="form-group">
          <label for="selectSite">Wybierz kompleks</label>
          <select class="form-control is-valid" id="selectSite" required defaultValue={this.state.floor.id} disabled={this.state.formDisabled} onChange={(event) => {
            if (this.validateInput(event.target, new RegExp('^[0-9]*$'))) this.setState({ 'siteSelected': event.target.value });
            document.getElementById("selectBuilding").options[0].selected=true;
          }}>
            <option selected disabled value={-1}>Wybierz...</option>
            {Array.isArray(this.state.sites) && sites.map(site => (
              <option selected={this.state.floor.building !=undefined && this.state.floor.building.site.id == site.id} value={site.id}>{"Identyfikator: "+site.siteId + " Nazwa: " + site.name}</option>
            ))}
          </select>
          <label for="selectBuilding">Wybierz budynek</label>
          <select class="form-control is-valid" id="selectBuilding" required defaultValue={this.state.building.id} disabled={this.state.formDisabled} onChange={(event) => {
            if (this.validateInput(event.target, new RegExp('^[0-9]*$'))) this.setState({ 'buildingSelected': event.target.value,'building':buildings.find(building=>building.id==event.target.value)
           });
          }}>
            <option selected disabled>Wybierz...</option>
            {Array.isArray(this.state.buildings) && buildings.filter(building=>building.site.id==this.state.siteSelected).map(building => (
              <option selected={this.state.floor.building !=undefined && this.state.floor.building.id == building.id} value={building.id}>{"Numer: "+building.number}</option>
            ))}
          </select>
              <label for="level">Piętro</label>
              <input type="text" class="form-control is-valid" id="level" required defaultValue={this.state.floor.level} disabled={this.state.formDisabled}
              onChange={(event) => {
                if (this.validateInput(event.target, new RegExp('^[0-9]*$'))) this.setState({level: event.target.value });
              }}>
            </input>
            <div class="invalid-feedback">
              </div>    
          </div>
          <button class="btn btn-danger m-2" onClick={this.handleClickEdit}>Odblokuj edycję</button>
        <button type="submit" class="btn btn-success m-2" hidden={this.state.formDisabled} disabled={document.getElementsByClassName("is-invalid").length > 0} onClick={this.handleSubmit}>Zapisz</button>
        </form>
        <Modal header="Sukces" body={"Zaktualizowano piętro: "+ this.state.level} id="modalSuccess" onCloseClicked={()=>window.location.href='/floors'} />
        <Modal header="Błąd" body={"Dodawanie nie powiodło się."} id="modalError" />
      </div>
    )
  }
}
export default FloorDetails