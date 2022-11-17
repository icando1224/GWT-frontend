import React, { Component } from 'react';
import Config from '../Config';
import Loading from '../Loading';
import ModalConfirmDelete from '../ModalConfirmDelete';
import { Modal } from '../Modal';
import $ from 'jquery';
export class Users extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoadedDevices: false,
      isLoadedUsers:false,
      users: [],
      tempUsers: [],
      sortedBy: 'FirstNameAsc',
      filterBy: 'LastName',
      filterInputValue: '',
      paginationSelected: '1',
      itemsPerPage: 20,
      itemToDelete: ''
      
    };
    this.handleSortByFirstName = this.handleSortByFirstName.bind(this);
    this.handleSortByLastName = this.handleSortByLastName.bind(this);
    this.handleSortByEMail = this.handleSortByEMail.bind(this);
    this.handleFilterData = this.handleFilterData.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSortByDevicesCount = this.handleSortByDevicesCount.bind(this);
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

    // Note: I'm using arrow functions inside the `.fetch()` method.
    // This makes it so you don't have to bind component functions like `setState`
    // to the component.
if (this.state.itemToDelete){
  fetch(Config.serverAddress + "/api/v1/users/" + this.state.itemToDelete.id, requestOptions).then((response) => {
    if (response.status===200){
    this.state.users.splice(this.state.users.findIndex(a=>a.id===this.state.itemToDelete.id),1);
    this.forceUpdate();
    $('#modalSuccess').modal('show');
    return response.json()
    }
    else {
      $('#modalError').modal('show');
    }
  })
}
}

  handleSortByFirstName() {
    if (this.state.sortedBy !== 'FirstNameAsc') {
      this.state.users.sort((a, b) => a.firstName.localeCompare(b.firstName))
      this.setState({ sortedBy: 'FirstNameAsc' });
    }
    else {
      this.state.users.sort((a, b) => b.firstName.localeCompare(a.firstName))
      this.setState({ sortedBy: 'FirstNameDesc' });
    }
    this.forceUpdate();
  }
  handleSortByLastName() {
    if (this.state.sortedBy !== 'LastNameAsc') {
      this.state.users.sort((a, b) => a.lastName.localeCompare(b.lastName))
      this.setState({ sortedBy: 'LastNameAsc' })
    }
    else {
      this.state.users.sort((a, b) => b.lastName.localeCompare(a.lastName))
      this.setState({ sortedBy: 'LastNameDesc' })
    }
    this.forceUpdate();
  }
  handleSortByEMail() {
    if (this.state.sortedBy !== 'EMailAsc') {
      this.state.users.sort((a, b) => a.email.localeCompare(b.email))
      this.setState({ sortedBy: "EMailAsc" })
    }
    else {
      this.state.users.sort((a, b) => b.email.localeCompare(a.email))
      this.setState({ sortedBy: "EMailDesc" })
    }
    this.forceUpdate();
  }
  handleSortByDevicesCount() {
    if (this.state.sortedBy !== 'DevicesCountAsc') {
     // (a.adName > b.adName )|| b.adName==undefined ? 1 : -1
      this.state.users.sort((a, b) => (this.devicesOfUserCount(a.id)>(this.devicesOfUserCount(b.id))?1:-1))
      this.setState({ sortedBy: 'DevicesCountAsc' });
    }
    else {
      this.state.users.sort((a, b) => (this.devicesOfUserCount(a.id)>(this.devicesOfUserCount(b.id))?-1:1))
      this.setState({ sortedBy: 'DevicesCountDesc' });
    }
    this.forceUpdate();
  }
  handleFilterChange(Event) {
    this.setState({ filterBy: Event.target.value })
    this.setState({ filterInputValue: '' })
    this.setState({ users: this.state.tempUsers.slice() })
    this.forceUpdate();
  }
  handleFilterData(Event) {
    let users = this.state.tempUsers.slice();
    this.setState({ filterInputValue: Event.target.value })
    let pattern = "^" + Event.target.value;
    let result = [];
    if (this.state.filterBy === 'firstName') { result = users.filter((element) => new RegExp(pattern).test(element.firstName)) }
    else if (this.state.filterBy === 'lastName') { result = users.filter((element) => new RegExp(pattern).test(element.lastName)) }
    else if (this.state.filterBy === 'eMail') { result = users.filter((element) => new RegExp(pattern).test(element.email)) };
    this.setState({ users: result })
  }
  
  devicesOfUserCount(userId){
    let result=this.state.devices.filter((element)=>userId==element.owner.id).length;
    return result;
  }

  componentDidMount() {
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
      }
    };
    console.log(requestOptions.headers);
    console.log(localStorage.getItem('username'));
    fetch(Config.serverAddress + "/api/v1/users", requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoadedUsers: true,
            users: result.slice(),
            tempUsers: result.slice()
          });
          this.handleSortByLastName();
        },
        // Uwaga: to ważne, żeby obsłużyć błędy tutaj, a
        // nie w bloku catch(), aby nie przetwarzać błędów
        // mających swoje źródło w komponencie.
        (error) => {
          this.setState({
            isLoadedDevices: false,
            error
          });
        }
      ).then(
      fetch(Config.serverAddress + "/api/v1/devices", requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoadedDevices: true,
            devices: result
          });
        },
        // Uwaga: to ważne, żeby obsłużyć błędy tutaj, a
        // nie w bloku catch(), aby nie przetwarzać błędów
        // mających swoje źródło w komponencie.
        (error) => {
          this.setState({
            isLoadedDevices: false,
            error
          });
        }
      )
      )
  }
  render() {
    const { error, isLoadedDevices, isLoadedUsers, users } = this.state;
    if (error) {
      return <div>Błąd: {error.message}</div>;
    } else if (!isLoadedUsers) {
      return <Loading />;
    } else {
      return (
        <div>
          <h1>Lista użytkowników</h1>
          <a href={Config.pageAddress + "/users/add"} class="btn btn-success m-2">Dodaj nowego</a>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">Filtruj</label>
            </div>
            <select class="custom-select col-2" id="inputGroupSelect01" onChange={this.handleFilterChange}>
              <option selected disabled>Wybierz filtr</option>
              <option value="firstName">Imię</option>
              <option value="lastName">Nazwisko</option>
              <option value="eMail">E-mail</option>
              <option value="role">Rola</option>
            </select>
            <input type="text" class="form-control" aria-label="Tu wpisz tekst wg którego chcesz filtrować dane" placeholder="Wpisz tekst wg którego chcesz filtrować dane" value={this.state.filterInputValue} onChange={this.handleFilterData}></input>
          </div>

          <table class="table table-light table-hover text-center">
            <thead class="thead-dark">
              <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByFirstName} >Imię</button></th>
              <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByLastName} >Nazwisko</button></th>
              <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByEMail} >Email</button></th>
              <th scope="col"><button type="button" class="btn btn-dark btn-block" >Rola</button></th>
              <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByDevicesCount} >Urządzenia</button></th>
              <th scope="col" colspan="2"><button type="button" class="btn btn-dark btn-block" disabled>Operacje</button></th>
            </thead>
            <tbody>
              {Array.isArray(this.state.users) && users.map(user => (
                <tr key={user.id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button class="btn btn-dark b-2 btn-block" disabled={this.devicesOfUserCount(user.id)<1} onClick={()=>
                    window.location.href= "/users/" + user.id+"/devices"}>Wyświetl ({this.devicesOfUserCount(user.id)})
                    </button>
                  </td>
                  <td><a class="btn btn-info b-2 btn-block" href={Config.pageAddress + "/users/" + user.id}>Szczegóły</a></td>
                  <td><button type="button" class="btn btn-danger b-2 btn-block" data-toggle="modal" data-target="#modalConfirmDelete" onClick={() => {
                    this.setState({ itemToDelete: user })
                  }}>Usuń</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <ModalConfirmDelete handleConfirmClick={this.handleDeleteClick} toDelete={this.state.itemToDelete.firstName+" "+this.state.itemToDelete.lastName} />
          <Modal header="Sukces" body={"Usunięto użytkownika: "+this.state.itemToDelete.firstName +" "+this.state.itemToDelete.lastName} id="modalSuccess" />
          <Modal header="Błąd" body={"Usuwanie "+this.state.itemToDelete.firstName +" "+this.state.itemToDelete.lastName+ " nie powiodło się. Sprawdź czy użytkownik nie jest właścicielem lub nie jest przypisany do żadnego urządzenia."} 
          id="modalError" />
        </div>
      );
    }
  }
}
export default Users