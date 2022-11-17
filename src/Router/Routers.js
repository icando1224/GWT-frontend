import React, { Component } from 'react';
import Config from '../Config'
import Loading from '../Loading';
import ModalConfirmDelete from '../ModalConfirmDelete';
export class Routers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      routers: [],
      tempRouters: [], //kopia, na której nie wykonujemy żadnych zmian
      sortedBy: 'IDAsc',
      filterBy: 'ID',
      filterInputValue: '',
      itemToDelete:''
    };
    this.handleSortByID = this.handleSortByID.bind(this);
    this.handleSortByOwner = this.handleSortByOwner.bind(this);
    this.handleSortByIP = this.handleSortByIP.bind(this);
    this.handleSortByMAC = this.handleSortByMAC.bind(this);
    this.handleFilterData = this.handleFilterData.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }
  handleDeleteClick = ()=> {
      const requestOptions = {
        method: 'DELETE',
        headers: { 
          'Authorization': 'Bearer '+localStorage.getItem('Authorization')
        }
      };
      fetch(Config.serverAddress + "/api/v1/routers/" + this.state.itemToDelete.id, requestOptions).then((response) => {
        return response.json();
      }).then((result) => {
      })
        .then(() => {
          window.location.reload();//trzeba poprawić tak, aby nie przeładowywało całej strony
        });
  }
  handleSortByID() {
    if (this.state.sortedBy !== 'IDAsc') {
      this.state.routers.sort((a, b) => a.deviceId > b.deviceId ? 1 : -1)
      this.setState({ sortedBy: 'IDAsc' })
    }
    else {
      this.state.routers.sort((a, b) => a.deviceId < b.deviceId ? 1 : -1)
      this.setState({ sortedBy: 'IDDesc' })
    }
    this.forceUpdate();
  }
  handleSortByOwner() {
    if (this.state.sortedBy !== 'OwnerAsc') {
      this.state.routers.sort((a, b) => {
        if (a.owner === null || a.owner.lastName === null) return -1;
        if (b.owner === null || b.owner.lastName === null) return 1;
        return a.owner.lastName > b.owner.lastName ? 1 : -1
      })
      this.setState({ sortedBy: 'OwnerAsc' })
    }
    else {
      this.state.routers.sort((a, b) => {
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
      this.state.routers.sort((a, b) => a.ipAddress > b.ipAddress ? 1 : -1)
      this.setState({ sortedBy: 'IPAsc' })
    }
    else {
      this.state.routers.sort((a, b) => a.ipAddress < b.ipAddress ? 1 : -1)
      this.setState({ sortedBy: 'IPDesc' })
    }
    this.forceUpdate();
  }
  handleSortByMAC() {
    if (this.state.sortedBy !== 'MACAsc') {
      this.state.routers.sort((a, b) => a.macAddress > b.macAddress ? 1 : -1)
      this.setState({ sortedBy: 'MACAsc' })
    }
    else {
      this.state.routers.sort((a, b) => a.macAddress < b.macAddress ? 1 : -1)
      this.setState({ sortedBy: 'MACDesc' })
    }
    this.forceUpdate();
  }
  handleFilterChange=(Event)=> {
    this.setState({ filterBy: Event.target.value })
    this.setState({ filterInputValue: '' })
    this.setState({ devices: this.state.tempRouters.slice() })
    this.forceUpdate();
  }
  handleFilterData=(Event) =>{
    let routers = this.state.tempRouters.slice();
    this.setState({ filterInputValue: Event.target.value })
    let pattern = "^" + Event.target.value;
    let result = [];
    if (this.state.filterBy === 'ID') { result = routers.filter((element) => new RegExp(pattern).test(element.deviceId)) }
    else if (this.state.filterBy === 'Owner') { result = routers.filter((element) => new RegExp(pattern).test(element.owner.lastName)) }
    else if (this.state.filterBy === 'IP') { result = routers.filter((element) => new RegExp(pattern).test(element.ipAddress)) }
    else if (this.state.filterBy === 'MAC') { result = routers.filter((element) => new RegExp(pattern).test(element.macAddress)) }
    this.setState({ routers: result })
  }
  componentDidMount() {
    const requestOptions = {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+localStorage.getItem('Authorization')
      }
    }
    fetch(Config.serverAddress + "/api/v1/routers",requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            routers: result,
            tempRouters: result
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
    const { error, isLoaded, routers } = this.state;
    if (error) {
      return <div>Błąd: {error.message}</div>;
    } else if (!isLoaded) {
      return <Loading />;
    } else {
      return (
        <div>
          <h1>Lista routerów</h1>
          <a href={Config.pageAddress + "/routers/add"} class="btn btn-success m-2">Dodaj nowy</a>
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
                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByIP} >IP</button></th>
                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByMAC} >MAC</button></th>
                <th scope="col" colspan="2"><button type="button" class="btn btn-dark btn-block" disabled>Operacje</button></th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(this.state.routers) && routers.map(device => (

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
                  <td><a class="btn btn-info b-2 btn-block" href={Config.pageAddress + "/routers/" + device.identifier}>Szczegóły</a></td>
                  <td><button class="btn btn-danger b-2 btn-block " data-toggle="modal" data-target="#modalConfirmDelete" onClick={() => {
                    this.setState({ itemToDelete: device })
                  }}>Usuń</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <ModalConfirmDelete handleConfirmClick={this.handleDeleteClick} toDelete={"router o ID: "+this.state.itemToDelete.deviceId} />
        </div >
      );
    }
  }
}
export default Routers