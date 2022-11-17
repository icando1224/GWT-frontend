import React, { Component } from 'react';
import Config from '../Config';
import Modal from '../Modal';
import ModalConfirmDelete from '../ModalConfirmDelete'
import $ from 'jquery';
export class UsersOfComputer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      computer: null,
      users: [],
      userSelected: null,
      submitButton: 'disabled',
      userToDelete:''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  async handleDeleteClick() {
      const requestOptions={
        method: 'DELETE',
        params: {
          'userId': this.state.userToDelete.id
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
        }
      }
      await fetch(Config.serverAddress + '/api/v1/computers/' + this.state.computer.id + '/removeUser/?userId=' + this.state.userToDelete.id, requestOptions);
      let userToRemove = this.state.computer.usedBy.find((a) => a.id === this.state.userToDelete.id);
      let usersOfComputer = this.state.computer.usedBy;
      let computerCopy = this.state.computer;
      usersOfComputer.splice(usersOfComputer.indexOf(userToRemove), 1);
      computerCopy.usedBy = usersOfComputer;
      this.setState({ computer: computerCopy });
  }
  async handleSubmit(event) {
    event.preventDefault();
    if (this.state.userSelected !== null) {
      const requestOptions={
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
        }
      };
      await fetch(Config.serverAddress + '/api/v1/computers/' + this.state.computer.id + '/addUser/?userId=' + this.state.userSelected, requestOptions);
      let userToAdd = this.state.users.find((a) => a.id == this.state.userSelected);//celowo ==, nie zmieniać na ===
      let usersOfComputer = this.state.computer.usedBy;
      let computerCopy = this.state.computer;
      let contains=false;

       for (let user of usersOfComputer){
        if (user.id==userToAdd.id)
        contains=true;
      }
      if (!contains){
        usersOfComputer.push(userToAdd);
        computerCopy.usedBy = usersOfComputer;
        this.setState({ computer: computerCopy });
      }
      else $("#modalErrorUserAlreadyAssigned").modal('show');

      
    }
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
        return res.json()
      })
      .then(
        (result) => {
          this.setState({
            isLoadedComputers: true,
            computer: result
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
      ).then(
        fetch(Config.serverAddress + "/api/v1/users", requestOptions)
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoadedUsers: true,
                users: result
              });
              console.log(this.state.users)
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
      )
  }

  render() {
    let { error, isLoadedComputers, isLoadedUsers, computer, users } = this.state;
    if (error) {
      return <div>Błąd: {error.message}</div>;
    } else if (!(isLoadedComputers && isLoadedUsers)) {
      return <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>;
    } else {
      return (<div>
        <h1>Lista użytkowników komputera DU: {computer.deviceId}</h1>
        <div class="form-group">
          <label for="exampleFormControlSelect1">Wybierz użytkownika</label>
          <select class="form-control" id="exampleFormControlSelect1" onChange={(event) => {
            this.setState({ 'userSelected': event.target.value });
          }}>
            <option selected disabled>Wybierz...</option>
            {Array.isArray(this.state.users) && users.map(user => (
              <option value={user.id}>{user.firstName + " " + user.lastName + " Pesel: " + user.pesel}</option>
            ))}

          </select>
          <a href={window.location.href} class="btn btn-success m-2" onClick={this.handleSubmit}>Przypisz do komputera</a>
        </div>
        <table class="table table-light table-hover">
          <thead class="thead-dark">
            <th scope="col">Imię</th>
            <th scope="col">Nazwisko</th>
            <th scope="col">E-mail</th>
            <th scope="col">Szczegóły</th>
            <th scope="col">Usuń przypisanie</th>
          </thead>
          <tbody>
            {
              Array.isArray(computer.usedBy) && computer.usedBy.map((user, i) => {
                return <tr>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td><a class="btn btn-info b-2 btn-block" href={Config.pageAddress + "/users/" + user.id}>Szczegóły</a></td>
                  <td><button class="btn btn-danger b-2 btn-block" data-toggle="modal" data-target="#modalConfirmDelete" onClick={(event) => {
                    this.setState({userToDelete:user});
                  }

                  
                  }>Usuń przypisanie</button></td>
                </tr>;
              })
            }
          </tbody>
        </table>
        <ModalConfirmDelete  id="modalConfirmDelete" handleConfirmClick={this.handleDeleteClick}/>
        <Modal header="Błąd!" body={"Nie wybrano użytkownika z listy!"} id="modalErrorNoUserSelected" />
        <Modal header="Błąd!" body={"Użytkownik jest już przypisany do komputera"} id="modalErrorUserAlreadyAssigned" />
      </div>
      )
    }
  }

}
export default UsersOfComputer