
import React, { Component } from 'react';
import Config from '../Config'
import Loading from '../Loading';
import ModalConfirmDelete from '../ModalConfirmDelete';
export class ComputersByOwner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      computers: [],
      tempComputers: [], //kopia, na której nie wykonujemy żadnych zmian
      sortedBy: 'IDAsc',
      filterBy: 'ID',
      filterInputValue: '',
      itemToDelete:''
    };
  }
  handleDeleteClick = () => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
      }
    };

if (this.state.itemToDelete){
  fetch(Config.serverAddress + "/api/v1/computers/" + this.state.itemToDelete.id, requestOptions).then((response) => {
    if (response.status===200){
    this.state.computers.splice(this.state.computers.findIndex(a=>a.id===this.state.itemToDelete.id),1);
    this.forceUpdate();
    return response.json()
    }
    else {
      alert ("Wystąpił błąd!")
    }
  })
}
console.log(this.state.itemToDelete);
}
  handleSortByID=()=> {
    if (this.state.sortedBy !== 'IDAsc') {
      this.state.computers.sort((a, b) => a.deviceId > b.deviceId ? 1 : -1)
      this.setState({ sortedBy: 'IDAsc' })
    }
    else {
      this.state.computers.sort((a, b) => a.deviceId < b.deviceId ? 1 : -1)
      this.setState({ sortedBy: 'IDDesc' })
    }
    this.forceUpdate();
  }
  handleSortByOwner=()=> {
    if (this.state.sortedBy !== 'OwnerAsc') {
      this.state.computers.sort((a, b) => {
        if (a.owner === null || a.owner.lastName === null) return -1;
        if (b.owner === null || b.owner.lastName === null) return 1;
        return a.owner.lastName > b.owner.lastName ? 1 : -1
      })
      this.setState({ sortedBy: 'OwnerAsc' })
    }
    else {
      this.state.computers.sort((a, b) => {
        if (a.owner === null || a.owner.lastName === null) return -1;
        if (b.owner === null || b.owner.lastName === null) return 1;
        return a.owner.lastName < b.owner.lastName ? 1 : -1
      })
      this.setState({ sortedBy: 'OwnerDesc' })
    }
    this.forceUpdate();
  }
  handleSortByIP=()=> {
    if (this.state.sortedBy !== 'IPAsc') {
      this.state.computers.sort((a, b) => a.ipAddress > b.ipAddress ? 1 : -1)
      this.setState({ sortedBy: 'IPAsc' })
    }
    else {
      this.state.computers.sort((a, b) => a.ipAddress < b.ipAddress ? 1 : -1)
      this.setState({ sortedBy: 'IPDesc' })
    }
    this.forceUpdate();
  }
  handleSortByAdName=()=> {
    if (this.state.sortedBy !== 'AdNameAsc') {
      this.state.computers.sort((a, b) => 
       (a.adName > b.adName )|| b.adName==undefined ? 1 : -1
      )
      this.setState({ sortedBy: 'AdNameAsc' })
    }
    else {
      this.state.computers.sort((a, b) => (a.adName < b.adName)|| a.adName==undefined ? 1 : -1)
      this.setState({ sortedBy: 'AdNameDesc' })
    }
    this.forceUpdate();
  }
  handleFilterChange=(Event)=>{
    this.setState({ filterBy: Event.target.value })
    this.setState({ filterInputValue: "" })
    this.setState({ computers: this.state.tempComputers })
    //this.state.computers = this.state.tempComputers;
    this.forceUpdate();
  }
  handleFilterData=(Event)=> {
    if (Event.target.value === '') {
      this.setState({ computers: this.state.tempComputers })
      this.setState({ filterInputValue: "" })
      this.forceUpdate();
    }
    else {
      this.setState({ filterInputValue: Event.target.value })
      let pattern = Event.target.value;
      console.log(pattern);
      this.setState({ computers: this.state.tempComputers })
      let result = [];
      if (this.state.filterBy === 'ID') result = this.state.computers.filter((element) => (element.deviceId != null) ? new RegExp(pattern).test(element.deviceId) : false);
      if (this.state.filterBy === 'Owner') result = this.state.computers.filter((element) => (element.owner != null) ? new RegExp(pattern).test(element.owner.lastName) : false);
      if (this.state.filterBy === 'IP') result = this.state.computers.filter((element) => (element.ipAddress != null) ? new RegExp(pattern).test(element.ipAddress) : false);
      if (this.state.filterBy === 'AdName') result = this.state.computers.filter((element) => (element.adName != null) ? new RegExp(pattern).test(element.adName) : false);
      this.setState({ computers: result })
      this.forceUpdate();
    }
  }
  componentDidMount() {
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
      }
    };
    console.log(requestOptions);
    fetch(Config.serverAddress + "/api/v1/users/"+this.props.match.params.id+"/computers", requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            computers: result,
            tempComputers: result
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
    const { error, isLoaded, computers } = this.state;
    if (error) {
      return <div>Błąd: {error.message}</div>;
    } else if (!isLoaded) {
      return <Loading />;
    } else {
      return (
        <div>
          {console.log(computers)}
          <h1>Komputery użytkownika</h1>
          <a href={Config.pageAddress + "/computers/add"} class="btn btn-success m-2">Dodaj nowy</a>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">Filtruj</label>
            </div>
            <select class="custom-select col-2" id="inputGroupSelect01" onChange={this.handleFilterChange}>
              <option selected value="ID">ID</option>
              <option value="Owner">Właściciel (nazwisko)</option>
              <option value="IP">IP</option>
              <option value="AdName">Nazwa AD</option>
            </select>
            <input type="text" class="form-control" aria-label="Tu wpisz tekst wg którego chcesz filtrować dane" placeholder="Wpisz tekst wg którego chcesz filtrować dane" value={this.state.filterInputValue} onChange={this.handleFilterData}></input>
          </div>
          <table class="table table-light table-hover">
            <thead class="thead-dark">
              <tr>
                <th scope="col"><button type="button" class="btn btn-dark" onClick={this.handleSortByID} >ID</button></th>
                <th scope="col"><button type="button" class="btn btn-dark" onClick={this.handleSortByOwner} >Właściciel</button></th>
                <th scope="col"><button type="button" class="btn btn-dark" onClick={this.handleSortByIP} >IP</button></th>
                <th scope="col"><button type="button" class="btn btn-dark" onClick={this.handleSortByAdName} >Nazwa AD</button></th>
                <th scope="col">Użytkownicy</th>
                <th scope="col" colspan="2">Operacje</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(this.state.computers) && computers.map(computer => (
                <tr key={computer.identifier}>
                  {computer.deviceId
                    ? <td>{computer.deviceId}</td>
                    : <td>-</td>
                  }
                  {computer.owner != null
                    ? <td><a href={Config.pageAddress + "/users/" + computer.owner.id} class="btn btn-light">{computer.owner.firstName} {computer.owner.lastName}</a></td>
                    : <td>-</td>//Można dodać później przycisk, który pozwoli na późniejsze przypisywanie właściciela
                  }
                  {computer.ipAddress
                    ? <td>{computer.ipAddress}</td>
                    : <td>-</td>
                  }
                  {computer.adName
                    ? <td>{computer.adName}</td>
                    : <td>-</td>
                  }
                  <td><a class="btn btn-primary b-2" href={Config.pageAddress + "/computers/" + computer.identifier + "/users/"}>Wyświetl ({computer.usedBy != null ? computer.usedBy.length : 0})</a></td>
                  <td><a class="btn btn-info b-2" href={Config.pageAddress + "/computers/" + computer.identifier}>Szczegóły</a></td>
                  <td><button type="button" class="btn btn-danger b-2" data-toggle="modal" data-target="#modalConfirmDelete" onClick={() => {
                    this.setState({ itemToDelete: computer })
                  }}>Usuń</button></td>
                </tr>
              ))
              }

            </tbody>
          </table>
          <ModalConfirmDelete handleConfirmClick={this.handleDeleteClick} toDelete={"komputer o ID: "+this.state.itemToDelete.deviceId} />
        </div >
      );
    }
  }
}
export default ComputersByOwner