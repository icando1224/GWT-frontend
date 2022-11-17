import React, { Component } from 'react';
import Config from '../Config';
import Loading from '../Loading';
import ModalConfirmDelete from '../ModalConfirmDelete';
import { Modal } from '../Modal';
import $ from 'jquery';
export class Buildings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      buildings: [],
      tempBuildings: [], //kopia, na której nie wykonujemy żadnych zmian
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
    fetch(Config.serverAddress + "/api/v1/buildings/" + this.state.itemToDelete.id, requestOptions).then((response) => {
      if (response.status===200){
        this.state.buildings.splice(this.state.buildings.findIndex(a=>a.id===this.state.itemToDelete.id),1);
        this.forceUpdate();
        $('#modalSuccess').modal('show');
        return response.json()
        }
        else {
          $('#modalError').modal('show');
        }
      });
}

  handleSortByNumber = () => {
    if (this.state.sortedBy !== 'NumberAsc') {
      this.state.buildings.sort((a, b) => {
        return parseInt(a.number) > parseInt(b.number) ? 1 : -1
      })
      this.setState({ sortedBy: 'NumberAsc' })
    }
    else {
      this.state.buildings.sort((a, b) => {
        return parseInt(a.number) < parseInt(b.number) ? 1 : -1
      })
      this.setState({ sortedBy: 'NumberDesc' })
    }
    this.forceUpdate();
  }
  handleSortBySiteId = () => {
    if (this.state.sortedBy !== 'NumberAsc') {
      this.state.buildings.sort((a, b) => {
        return parseInt(a.site.siteId) > parseInt(b.site.siteId) ? 1 : -1
      })
      this.setState({ sortedBy: 'NumberAsc' })
    }
    else {
      this.state.buildings.sort((a, b) => {
        return parseInt(a.site.siteId) < parseInt(b.site.siteId) ? 1 : -1
      })
      this.setState({ sortedBy: 'NumberDesc' })
    }
    this.forceUpdate();
  }
  handleSortBySiteName = () => {
    if (this.state.sortedBy !== 'NumberAsc') {
      this.state.buildings.sort((a, b) => {
        return a.site.name > b.site.name ? 1 : -1
      })
      this.setState({ sortedBy: 'NumberAsc' })
    }
    else {
      this.state.buildings.sort((a, b) => {
        return a.site.name < b.site.name ? 1 : -1
      })
      this.setState({ sortedBy: 'NumberDesc' })
    }
    this.forceUpdate();
  }

  handleFilterChange=(Event)=> {
    this.setState({ filterBy: Event.target.value })
    this.setState({ filterInputValue: '' })
    this.setState({ devices: this.state.tempBuildings.slice() })
    this.forceUpdate();
  }
  handleFilterData=(Event) =>{
    let buildings = this.state.tempBuildings.slice();
    this.setState({ filterInputValue: Event.target.value })
    let pattern = "^" + Event.target.value;
    let result = [];
    if (this.state.filterBy === 'ID') { result = buildings.filter((element) => new RegExp(pattern).test(element.number)) }
    else if (this.state.filterBy === 'siteName') { result = buildings.filter((element) => new RegExp(pattern).test(element.site.site.name)) }
    else if (this.state.filterBy === 'siteId') { result = buildings.filter((element) => new RegExp(pattern).test(element.site.siteId)) }
    this.setState({ buildings: result })
  }
  
  componentDidMount() {
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
      }
    };
    fetch(Config.serverAddress + "/api/v1/buildings", requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            buildings: result,
            tempBuildings: result
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
    const { error, isLoaded, buildings } = this.state;
    if (error) {
      return <div>Błąd: {error.message}</div>;
    } else if (!isLoaded) {
      return <Loading />;
    } else {
      return (
        <div>
          <h1>Lista budynków</h1>
          <a href={Config.pageAddress + "/buildings/add"} class="btn btn-success m-2">Dodaj nowy</a>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">Filtruj</label>
            </div>
            <select class="custom-select col-2" id="inputGroupSelect01" onChange={this.handleFilterChange}>
            <option selected disabled>Wybierz filtr</option>
              <option value="ID">Numer budynku</option>
              <option value="siteId">Numer kompleksu</option>
              <option value="siteName">Nazwa kompleksu</option>
            </select>
            <input type="text" class="form-control" aria-label="Tu wpisz tekst wg którego chcesz filtrować dane" placeholder="Wpisz tekst wg którego chcesz filtrować dane" value={this.state.filterInputValue} onChange={this.handleFilterData}></input>
          </div>
          <table class="table table-light table-hover text-center">
            <thead class="thead-dark">
              <tr>
                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByNumber}>Numer</button></th>
                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortBySiteId}>Numer kompleksu</button></th>
                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortBySiteName}>Nazwa kompleksu</button></th>
                <th scope="col" colspan="2"><button type="button" class="btn btn-dark btn-block" disabled>Operacje</button></th>
              </tr>
            </thead>
            <tbody>
              {console.log(this.state.buildings)}
              {Array.isArray(this.state.buildings) &&
                buildings.map(building => (
                  <tr key={building.id}>
                    {building.number
                      ? <td>{building.number}</td>
                      : <td>-</td>
                    }
                    {building.site.siteId
                      ?<td><a href={Config.pageAddress + "/sites/" + building.site.id} class="btn btn-light btn-block">{building.site.siteId}</a></td>
                      : <td>-</td>
                    }
                    {building.site.name
                      ?<td><a href={Config.pageAddress + "/sites/" + building.site.id} class="btn btn-light btn-block">{building.site.name}</a></td>
                      : <td>-</td>
                    }
                    <td><a class="btn btn-info b-2 btn-block" href={Config.pageAddress + "/buildings/" + building.id}>Szczegóły</a></td>
                    <td><button class="btn btn-danger b-2 btn-block" data-toggle="modal" data-target="#modalConfirmDelete" onClick={() => {this.setState({ itemToDelete: building})
                    }}>Usuń</button></td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Modal header="Sukces" body={"Usunięto budynek"} id="modalSuccess" />
          <Modal header="Błąd" body={"Usuwanie budynku numer: "+this.state.itemToDelete.number +" nie powiodło się. Sprawdź czy budynek nie jest powiązany z innym obiektem."} 
          id="modalError" />
          <ModalConfirmDelete handleConfirmClick={this.handleDeleteClick} toDelete={"budynek o numerze: "+this.state.itemToDelete.number} />
        </div >
      );
    }
  }
}
export default Buildings