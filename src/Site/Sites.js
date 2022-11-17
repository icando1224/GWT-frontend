import React, { Component } from 'react';
import Config from '../Config'
import Loading from '../Loading';
import ModalConfirmDelete from'../ModalConfirmDelete';
import { Modal } from '../Modal';
import $ from 'jquery';
export class Sites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      sites: [],
      tempSites: [], //kopia, na której nie wykonujemy żadnych zmian
      sortedBy: 'IDAsc',
      filterBy: 'ID',
      filterInputValue: '',
      itemToDelete:''
    };

  }

  handleDeleteClick = ()=> {
    const requestOptions = {
      method: 'DELETE',
      headers: { 
        'Authorization': 'Bearer '+localStorage.getItem('Authorization')
      }
    };
    fetch(Config.serverAddress + "/api/v1/sites/" + this.state.itemToDelete.id, requestOptions).then((response) => {
      if (response.status===200){
        this.state.sites.splice(this.state.sites.findIndex(a=>a.id===this.state.itemToDelete.id),1);
        this.forceUpdate();
        $('#modalSuccess').modal('show');
        return response.json()
        }
        else {
          $('#modalError').modal('show');
        }
    })
  }



/*if (response.status===200){
  this.state.users.splice(this.state.users.findIndex(a=>a.id===this.state.itemToDelete.id),1);
  this.forceUpdate();
  $('#modalSuccess').modal('show');
  return response.json()
  }
  else {
    $('#modalError').modal('show');
  }*/





  handleSortByID= ()=>{
    if (this.state.sortedBy !== 'IDAsc') {
      this.state.sites.sort((a, b) => a.siteId > b.siteId ? 1 : -1)
      this.setState({ sortedBy: 'IDAsc' })
    }
    else {
      this.state.sites.sort((a, b) => a.siteId < b.siteId ? 1 : -1)
      this.setState({ sortedBy: 'IDDesc' })
    }
    this.forceUpdate();
  }
  handleSortByName=()=> {
    if (this.state.sortedBy !== 'NameAsc') {
      this.state.sites.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
      this.setState({ sortedBy: 'NameAsc' })
    }
    else {
      this.state.sites.sort((a, b) => {
        return a.name < b.name ? 1 : -1
      })
      this.setState({ sortedBy: 'NameDesc' })
    }
    this.forceUpdate();
  }
  handleFilterChange=(Event)=> {
    this.setState({ filterBy: Event.target.value })
    this.setState({ filterInputValue: '' })
    this.setState({ devices: this.state.tempSites.slice() })
    this.forceUpdate();
  }
  handleFilterData=(Event) =>{
    let sites = this.state.tempSites.slice();
    this.setState({ filterInputValue: Event.target.value })
    let pattern = "^" + Event.target.value;
    let result = [];
    if (this.state.filterBy === 'ID') { result = sites.filter((element) => new RegExp(pattern).test(element.siteId)) }
    else if (this.state.filterBy === 'Name') { result = sites.filter((element) => new RegExp(pattern).test(element.name)) }
    this.setState({ sites: result })
  }


  componentDidMount() {
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
      }
    };
    fetch(Config.serverAddress + "/api/v1/sites", requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            sites: result,
            tempSites: result
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
    const { error, isLoaded, sites } = this.state;
    if (error) {
      return <div>Błąd: {error.message}</div>;
    } else if (!isLoaded) {
      return <Loading />;
    } else {
      return (
        <div>
          <h1>Lista kompleksów</h1>
          <a href={Config.pageAddress + "/sites/add"} class="btn btn-success m-2">Dodaj nową</a>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">Filtruj</label>
            </div>
            <select class="custom-select col-2" id="inputGroupSelect01" onChange={this.handleFilterChange}>
            <option selected disabled>Wybierz filtr</option>
              <option value="ID">Numer</option>
              <option value="Name">Nazwa</option>
            </select>
            <input type="text" class="form-control" aria-label="Tu wpisz tekst wg którego chcesz filtrować dane" placeholder="Wpisz tekst wg którego chcesz filtrować dane" value={this.state.filterInputValue} onChange={this.handleFilterData}></input>
          </div>
          <table class="table table-light table-hover text-center">
            <thead class="thead-dark">
              <tr>
                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByID}>Numer</button></th>
                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByName}>Nazwa</button></th>
                <th scope="col" colspan="2"><button type="button" class="btn btn-dark btn-block" disabled>Operacje</button></th>
              </tr>
            </thead>
            <tbody>
              {console.log(this.state.sites)}
              {Array.isArray(this.state.sites) &&
                sites.map(site => (
                  <tr key={site.id}>
                    {site.siteId
                      ? <td>{site.siteId}</td>
                      : <td>-</td>
                    }
                    {site.name
                      ? <td>{site.name}</td>
                      : <td>-</td>
                    }
                  <td><a class="btn btn-info b-2 btn-block" href={Config.pageAddress + "/sites/" + site.id}>Szczegóły</a></td>
                  <td><button class="btn btn-danger b-2 btn-block " data-toggle="modal" data-target="#modalConfirmDelete" onClick={() => {
                    this.setState({ itemToDelete: site })
                  }}>Usuń</button></td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Modal header="Sukces" body={"Usunięto kompleks"} id="modalSuccess" />
          <Modal header="Błąd" body={"Usuwanie kompleksu numer: "+this.state.itemToDelete.siteId +" o nazwie: "+this.state.itemToDelete.name+ " nie powiodło się. Sprawdź czy kompleks nie jest powiązany z innym obiektem."} 
          id="modalError" />
          <ModalConfirmDelete handleConfirmClick={this.handleDeleteClick} toDelete={"kompleks o ID: "+this.state.itemToDelete.siteId} />
        </div >
      );
    }
  }
}
export default Sites