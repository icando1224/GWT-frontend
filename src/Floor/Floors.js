import React, { Component } from 'react';
import Config from '../Config';
import Loading from '../Loading';
import ModalConfirmDelete from '../ModalConfirmDelete';
import { Modal } from '../Modal';
import $ from 'jquery';
export class Floors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      floors: [],
      tempFloors: [], //kopia, na której nie wykonujemy żadnych zmian
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
    fetch(Config.serverAddress + "/api/v1/floors/" + this.state.itemToDelete.id, requestOptions).then((response) => {
      if (response.status===200){
        this.state.floors.splice(this.state.floors.findIndex(a=>a.id===this.state.itemToDelete.id),1);
        this.forceUpdate();
        $('#modalSuccess').modal('show');
        return response.json()
        }
        else {
          $('#modalError').modal('show');
        }
      });
    }

handleSortByLevel = () => {
  if (this.state.sortedBy !== 'LevelAsc') {
    this.state.floors.sort((a, b) => a.level > b.level ? 1 : -1)
    this.setState({ sortedBy: 'LevelAsc' })
  }
  else {
    this.state.floors.sort((a, b) => a.level < b.level ? 1 : -1)
    this.setState({ sortedBy: 'LevelDesc' })
  }
  this.forceUpdate();
}
handleSortByBuildingNumber=()=>{
  if (this.state.sortedBy !== 'BuildingNumberAsc') {
    this.state.floors.sort((a, b) => parseInt(a.building.number) > parseInt(b.building.number) ? 1 : -1)
    this.setState({ sortedBy: 'BuildingNumberAsc' })
  }
  else {
    this.state.floors.sort((a, b) =>parseInt(a.building.number) < parseInt(b.building.number) ? 1 : -1)
    this.setState({ sortedBy: 'BuildingNumberDesc' })
  }
  this.forceUpdate();
}
  handleSortBySiteNumber = () => {
    if (this.state.sortedBy !== 'SiteNumberAsc') {
      this.state.floors.sort((a, b) => a.building.site.siteId > b.building.site.siteId ? 1 : -1)
      this.setState({ sortedBy: 'SiteNumberAsc' })
    }
    else {
      this.state.floors.sort((a, b) => a.building.site.siteId < b.building.site.siteId ? 1 : -1)
      this.setState({ sortedBy: 'SiteNumberDesc' })
    }
    this.forceUpdate();
  }
  handleSortBySiteName = () => {
    if (this.state.sortedBy !== 'SiteNameAsc') {
      this.state.floors.sort((a, b) => a.building.site.name > b.building.site.name ? 1 : -1)
      this.setState({ sortedBy: 'SiteNameAsc' })
    }
    else {
      this.state.floors.sort((a, b) => a.building.site.name < b.building.site.name ? 1 : -1)
      this.setState({ sortedBy: 'SiteNameDesc' })
    }
    this.forceUpdate();
  }
  handleSortByNumber = () => {
    if (this.state.sortedBy !== 'NumberAsc') {
      this.state.floors.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
      this.setState({ sortedBy: 'NumberAsc' })
    }
    else {
      this.state.floors.sort((a, b) => {
        return a.name < b.name ? 1 : -1
      })
      this.setState({ sortedBy: 'NumberDesc' })
    }
    this.forceUpdate();
  }

  handleFilterChange = Event => {
    this.setState({ filterBy: Event.target.value })
    this.setState({ filterInputValue: "" })
    this.setState({ floors: this.state.tempFloors.slice() })
    this.forceUpdate();
  }
  handleFilterData = Event => {
    let floors = this.state.tempFloors.slice();
    this.setState({ filterInputValue: Event.target.value })
    let pattern ="^"+Event.target.value;
    let result = [];
    if (this.state.filterBy === 'level') { result = floors.filter((element) => new RegExp(pattern).test(element.level)) }
    else if (this.state.filterBy === 'building') { result = floors.filter((element) => new RegExp(pattern).test(element.building.number)) }
    else if (this.state.filterBy === 'siteNumber') { result = floors.filter((element) => new RegExp(pattern).test(element.building.site.siteId)) }
    else if (this.state.filterBy === 'siteName') { result = floors.filter((element) => new RegExp(pattern).test(element.building.site.name)) }
    this.setState({ floors: result })
  }
  componentDidMount() {
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
      }
    };
    fetch(Config.serverAddress + "/api/v1/floors", requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            floors: result,
            tempFloors: result
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
    const { error, isLoaded, floors } = this.state;
    if (error) {
      return <div>Błąd: {error.message}</div>;
    } else if (!isLoaded) {
      return <Loading />;
    } else {
      return (
        <div>
          <h1>Lista pięter</h1>
          <a href={Config.pageAddress + "/floors/add"} class="btn btn-success m-2">Dodaj nowe</a>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">Filtruj</label>
            </div>
            <select class="custom-select col-2" id="inputGroupSelect01" onChange={this.handleFilterChange}>
              <option selected disabled>Wybierz filtr</option>
              <option value="level">Poziom</option>
              <option value="building">Budynek</option>
              <option value="siteNumber">Numer kompleksu</option>
              <option value="siteName">Nazwa kompleksu</option>
            </select>
            <input type="text" class="form-control" aria-label="Tu wpisz tekst wg którego chcesz filtrować dane" placeholder="Wpisz tekst wg którego chcesz filtrować dane" value={this.state.filterInputValue} onChange={this.handleFilterData}></input>
          </div>
          <table class="table table-light table-hover text-center">
            <thead class="thead-dark">
              <tr>
                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByLevel}>Poziom</button></th>
                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByBuildingNumber}>Numer budynku</button></th>
                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortBySiteNumber}>Numer kompleksu</button></th>
                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortBySiteName}>Nazwa kompleksu</button></th>
                <th scope="col" colspan="2"><button type="button" class="btn btn-dark btn-block" disabled>Operacje</button></th>
              </tr>
            </thead>
            <tbody>
              {console.log(this.state.floors)}
              {Array.isArray(this.state.floors) &&
                floors.map(floor => (
                  <tr key={floor.identifier}>
                    {floor.level
                      ? <td>{floor.level}</td>
                      : <td>-</td>
                    }
                    {floor.building.number
                      ?<td><a href={Config.pageAddress + "/buildings/" + floor.building.id} class="btn btn-light btn-block">{floor.building.number}</a></td>
                      : <td>-</td>
                    }
                    {floor.building.site.siteId
                    ?<td><a href={Config.pageAddress + "/sites/" + floor.building.site.id} class="btn btn-light btn-block">{floor.building.site.siteId}</a></td>
                      : <td>-</td>
                    }
                    {floor.building.site.name
                    ?<td><a href={Config.pageAddress + "/sites/" + floor.building.site.id} class="btn btn-light btn-block">{floor.building.site.name}</a></td>
                      : <td>-</td>
                    }
                    <td><a class="btn btn-info b-2 btn-block" href={Config.pageAddress + "/floors/" + floor.id}>Szczegóły</a></td>
                    <td><button class="btn btn-danger b-2 btn-block" data-toggle="modal" data-target="#modalConfirmDelete" onClick={() => {this.setState({ itemToDelete: floor})
                    }}>Usuń</button></td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Modal header="Sukces" body={"Usunięto piętro"} id="modalSuccess" />
          <Modal header="Błąd" body={"Usuwanie piętra numer: "+this.state.itemToDelete.level +" nie powiodło się. Sprawdź czy piętro nie jest powiązane z innym obiektem."} 
          id="modalError" />
          <ModalConfirmDelete handleConfirmClick={this.handleDeleteClick} toDelete={"piętro: "+this.state.itemToDelete.level} />
        </div >
      );
    }
  }
}
export default Floors