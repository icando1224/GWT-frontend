import React, { Component } from 'react';
import Config from '../Config'
import Loading from '../Loading';
export class Switches extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      switches: [],
      tempSwitches: [], //kopia, na której nie wykonujemy żadnych zmian
      sortedBy: 'IDAsc',
      filterBy: 'ID',
      filterInputValue: ''
    };
    this.handleSortByID = this.handleSortByID.bind(this);
    this.handleSortByOwner = this.handleSortByOwner.bind(this);
    this.handleSortByIP = this.handleSortByIP.bind(this);
    this.handleSortByMAC = this.handleSortByMAC.bind(this);
    this.handleFilterData = this.handleFilterData.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }
  handleDeleteClick = switchId => {
    let confirmDelete = window.confirm("Czy na pewno usunąć?");
    if (confirmDelete) {
      const requestOptions = {
        method: 'DELETE',
        headers: { 
            'Authorization': 'Bearer '+localStorage.getItem('Authorization')
          }
      };

      fetch(Config.serverAddress + "/api/v1/switches/" + switchId, requestOptions).then((response) => {
        return response.json();
      }).then((result) => {
        console.log("Usunięto");
        alert("Usunięto");
      })
        .then(() => {
          window.location.reload();//trzeba poprawić tak, aby nie przeładowywało całej strony
        });
    }
  }
  handleSortByID() {
    if (this.state.sortedBy !== 'IDAsc') {
      this.state.switches.sort((a, b) => a.deviceId > b.deviceId ? 1 : -1)
      this.setState({ sortedBy: 'IDAsc' })
    }
    else {
      this.state.switches.sort((a, b) => a.deviceId < b.deviceId ? 1 : -1)
      this.setState({ sortedBy: 'IDDesc' })
    }
    this.forceUpdate();
  }
  handleSortByOwner() {
    if (this.state.sortedBy !== 'OwnerAsc') {
      this.state.switches.sort((a, b) => {
        if (a.owner === null || a.owner.lastName === null) return -1;
        if (b.owner === null || b.owner.lastName === null) return 1;
        return a.owner.lastName > b.owner.lastName ? 1 : -1
      })
      this.setState({ sortedBy: 'OwnerAsc' })
    }
    else {
      this.state.switches.sort((a, b) => {
        if (a.owner === null || a.owner.lastName === null) return -1;
        if (b.owner === null || b.owner.lastName === null) return 1;
        return a.owner.lastName < b.owner.lastName ? 1 : -1
      })
      this.setState({ sortedBy: 'OwnerDesc' })
    }
    this.forceUpdate();
  }
  handleSortByIP() {
    if (this.state.sortedBy !== 'IPAsc') {
      this.state.switches.sort((a, b) => a.ipAddress > b.ipAddress ? 1 : -1)
      this.setState({ sortedBy: 'IPAsc' })
    }
    else {
      this.state.switches.sort((a, b) => a.ipAddress < b.ipAddress ? 1 : -1)
      this.setState({ sortedBy: 'IPDesc' })
    }
    this.forceUpdate();
  }
  handleSortByMAC() {
    if (this.state.sortedBy !== 'MACAsc') {
      this.state.switches.sort((a, b) => a.macAddress > b.macAddress ? 1 : -1)
      this.setState({ sortedBy: 'MACAsc' })
    }
    else {
      this.state.switches.sort((a, b) => a.macAddress < b.macAddress ? 1 : -1)
      this.setState({ sortedBy: 'MACDesc' })
    }
    this.forceUpdate();
  }
  handleFilterChange(Event) {
    this.setState({ filterBy: Event.target.value })
    this.setState({ filterInputValue: "" })
    this.setState({ switches: this.state.tempSwitches })
    this.forceUpdate();
  }
  handleFilterChange=(Event)=> {
    this.setState({ filterBy: Event.target.value })
    this.setState({ filterInputValue: '' })
    this.setState({ devices: this.state.tempSwitches.slice() })
    this.forceUpdate();
  }
  handleFilterData=(Event) =>{
    let switches = this.state.tempSwitches.slice();
    this.setState({ filterInputValue: Event.target.value })
    let pattern = "^" + Event.target.value;
    let result = [];
    if (this.state.filterBy === 'ID') { result = switches.filter((element) => new RegExp(pattern).test(element.deviceId)) }
    else if (this.state.filterBy === 'Owner') { result = switches.filter((element) => new RegExp(pattern).test(element.owner.lastName)) }
    else if (this.state.filterBy === 'IP') { result = switches.filter((element) => new RegExp(pattern).test(element.ipAddress)) }
    else if (this.state.filterBy === 'MAC') { result = switches.filter((element) => new RegExp(pattern).test(element.macAddress)) }
    this.setState({ switches: result })
  }
  componentDidMount() {
    const requestOptions = {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+localStorage.getItem('Authorization')
      }
  };
    fetch(Config.serverAddress + "/api/v1/switches", requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            switches: result,
            tempSwitches: result
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
    const { error, isLoaded, switches } = this.state;
    if (error) {
      return <div>Błąd: {error.message}</div>;
    } else if (!isLoaded) {
      return <Loading/>;
    } else {
      return (
        <div>
          <h1>Lista switchy</h1>
          <a href={Config.pageAddress + "/switches/add"} class="btn btn-success m-2">Dodaj nowy</a>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">Filtruj</label>
            </div>
            <select class="custom-select col-2" id="inputGroupSelect01" onChange={this.handleFilterChange}>
            <option selected disabled>Wybierz filtr</option>
              <option value="ID">ID</option>
              <option value="Owner">Właściciel (nazwisko)</option>
              <option value="IP">IP</option>
              <option value="MAC">MAC</option>
            </select>
            <input type="text" class="form-control" aria-label="Tu wpisz tekst wg którego chcesz filtrować dane" placeholder="Wpisz tekst wg którego chcesz filtrować dane" value={this.state.filterInputValue} onChange={this.handleFilterData}></input>
          </div>
          <table class="table table-light table-hover text-center">
            <thead class="thead-dark">
              <tr>
                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByID} >ID</button></th>
                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByOwner} >Właściciel</button></th>
                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByIP}>IP</button></th>
                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByMAC}>MAC</button></th>
                <th scope="col" colspan="2"><button type="button" class="btn btn-dark btn-block" disabled>Operacje</button></th>
              </tr>
            </thead>
            <tbody>
              {console.log(this.state.switches)}
              {Array.isArray(this.state.switches) &&
              switches.map(device => (
                <tr key={device.identifier}>
                  {device.deviceId
                    ? <td>{device.deviceId}</td>
                    : <td>-</td>
                  }
                  {device.owner != null
                    ? <td><a href={Config.pageAddress + "/users/" + device.owner.id} class="btn btn-light">{device.owner.firstName} {device.owner.lastName}</a></td>
                    : <td>-</td>//Można dodać później przycisk, który pozwoli na późniejsze przypisywanie właściciela
                  }
                  {device.ipAddress
                    ? <td>{device.ipAddress}</td>
                    : <td>-</td>
                  }
                  {device.macAddress
                    ? <td>{device.macAddress}</td>
                    : <td>-</td>
                  }
                  <td><a class="btn btn-info b-2 btn-block" href={Config.pageAddress + "/switches/" + device.identifier}>Szczegóły</a></td>
                  <td><button class="btn btn-danger b-2 btn-block" onClick={() => {
                    this.handleDeleteClick(device.identifier);
                  }}>Usuń</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div >
      );
    }
  }
}
export default Switches