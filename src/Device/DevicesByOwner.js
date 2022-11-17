import React, { Component } from 'react';
import Config from '../Config';
import ModalConfirmDelete from '../ModalConfirmDelete';
import { Modal } from '../Modal';
import $ from 'jquery';
export class DevicesByOwner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      devices: [],
      tempDevices: [], //kopia, na której nie wykonujemy żadnych zmian
      sortedBy: 'IDAsc',
      filterBy: 'ID',
      filterInputValue: '',
      itemToDelete:''
    };
    this.handleSortByID = this.handleSortByID.bind(this);
    this.handleSortByIP = this.handleSortByIP.bind(this);
    this.handleFilterData = this.handleFilterData.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleDeleteClick = deviceId => {

      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
        }
      };

      fetch(Config.serverAddress + "/api/v1/devices/" + this.state.itemToDelete.id, requestOptions).then((response) => {
        if (response.status===200){
          this.state.devices.splice(this.state.devices.findIndex(a=>a.id===this.state.itemToDelete.id),1);
          this.forceUpdate();
          $('#modalSuccess').modal('show');
          return response.json()
          }
          else {
            $('#modalError').modal('show');
          }
        });
      }
    
  handleSortByID() {
    if (this.state.sortedBy !== 'IDAsc') {
      this.state.devices.sort((a, b) => a.deviceId > b.deviceId ? 1 : -1)
      this.setState({ sortedBy: 'IDAsc' })
    }
    else {
      this.state.devices.sort((a, b) => a.deviceId < b.deviceId ? 1 : -1)
      this.setState({ sortedBy: 'IDDesc' })
    }
    this.forceUpdate();
  }


  handleSortByIP() {
    if (this.state.sortedBy !== 'IPAsc') {
      this.state.devices.sort((a, b) => a.ipAddress > b.ipAddress ? 1 : -1)
      this.setState({ sortedBy: 'IPAsc' })
    }
    else {
      this.state.devices.sort((a, b) => a.ipAddress < b.ipAddress ? 1 : -1)
      this.setState({ sortedBy: 'IPDesc' })
    }
    this.forceUpdate();
  }
  handleFilterChange(Event) {
    this.setState({ filterBy: Event.target.value })
    this.setState({ filterInputValue: "" })
    this.setState({ devices: this.state.tempDevices })
    this.forceUpdate();
  }
  handleFilterData(Event) {
    if (Event.target.value === '') {
      this.setState({ devices: this.state.tempDevices })
      this.setState({ filterInputValue: "" })
      this.forceUpdate();
    }
    else {
      this.setState({ filterInputValue: Event.target.value })
      let pattern = Event.target.value;
      this.setState({ devices: this.state.tempDevices })
      let result = [];
      if (this.state.filterBy === 'ID') result = this.state.devices.filter((element) => (element.deviceId != null) ? new RegExp(pattern).test(element.deviceId) : false);
      if (this.state.filterBy === 'IP') result = this.state.devices.filter((element) => (element.ipAddress != null) ? new RegExp(pattern).test(element.ipAddress) : false);
      if (this.state.filterBy === 'AdName') result = this.state.devices.filter((element) => (element.adName != null) ? new RegExp(pattern).test(element.adName) : false);
      this.setState({ devices: result })
      this.forceUpdate();
    }
  }
  componentDidMount() {
    const requestOptions = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
      }
    };
    fetch(Config.serverAddress + "/api/v1/users/"+this.props.match.params.id+"/devices", requestOptions)
    //fetch(Config.serverAddress + "/api/v1/devices", requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            devices: result,
            tempDevices: result
          });
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
    const { error, isLoaded, devices } = this.state;
    if (error) {
      return <div>Błąd: {error.message}</div>;
    } else if (!isLoaded) {
      return <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>;
    } else {
      return (
        <div>
          <h1>Lista urządzeń użytkownika {(this.state.devices[0]!=undefined) &&(this.state.devices[0].owner.firstName+" "+this.state.devices[0].owner.lastName)} </h1>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">Filtruj</label>
            </div>
            <select class="custom-select col-2" id="inputGroupSelect01" onChange={this.handleFilterChange}>
              <option selected value="ID">ID</option>
              <option value="IP">IP</option>
            </select>
            <input type="text" class="form-control" aria-label="Tu wpisz tekst wg którego chcesz filtrować dane" placeholder="Wpisz tekst wg którego chcesz filtrować dane" value={this.state.filterInputValue} onChange={this.handleFilterData}></input>
          </div>
          <table class="table table-light table-hover text-center">
            <thead class="thead-dark">
              <tr>
                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByID} >ID</button></th>
                <th scope="col"><button type="button" class="btn btn-dark btn-block">Typ</button></th>
                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByIP} >IP</button></th>
                <th scope="col" colspan="2"><button type="button" class="btn btn-dark btn-block"disabled>Operacje</button></th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(this.state.devices) && devices.map(device => (
                <tr key={device.identifier}>
                  {device.deviceId
                    ? <td>{device.deviceId}</td>
                    : <td>-</td>
                  }
                  {device.deviceType
                    ? <td>{device.deviceType}</td>
                    : <td>-</td>
                  }
                  {device.ipAddress
                    ? <td>{device.ipAddress}</td>
                    : <td>-</td>
                  }
                  <td><a class="btn btn-info b-2 btn-block" href={Config.pageAddress + "/"+device.deviceType.toLowerCase()+"s/" + device.identifier}>Szczegóły</a></td>
                  <td><button class="btn btn-danger b-2 btn-block" data-toggle="modal" data-target="#modalConfirmDelete" onClick={() => {this.setState({ itemToDelete: device})
                  }}>Usuń</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal header="Sukces" body={"Usunięto urządzenie"} id="modalSuccess" />
          <Modal header="Błąd" body={"Usuwanie urządzenia numer: "+this.state.itemToDelete.level +" nie powiodło się. Sprawdź czy urządzenie nie jest powiązane z innym obiektem."} 
          id="modalError" />
          <ModalConfirmDelete handleConfirmClick={this.handleDeleteClick} toDelete={"urządzenie: "+this.state.itemToDelete.deviceId} />
        </div >
      );
    }
  }
}
export default DevicesByOwner