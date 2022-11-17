import React, { Component } from 'react';
import Config from '../Config'
import Loading from '../Loading';
import ModalConfirmDelete from '../ModalConfirmDelete';
import { Modal } from '../Modal';
import $ from 'jquery';
export class Rooms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            rooms: [],
            tempRooms: [], //kopia, na której nie wykonujemy żadnych zmian
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
        fetch(Config.serverAddress + "/api/v1/rooms/" + this.state.itemToDelete.id, requestOptions).then((response) => {
            if (response.status===200){
              this.state.rooms.splice(this.state.rooms.findIndex(a=>a.id===this.state.itemToDelete.id),1);
              this.forceUpdate();
              $('#modalSuccess').modal('show');
              return response.json()
              }
              else {
                $('#modalError').modal('show');
              }
            });
    }
    handleSortByID = () => {
        if (this.state.sortedBy !== 'IDAsc') {
            this.state.rooms.sort((a, b) => a.id > b.id ? 1 : -1)
            this.setState({ sortedBy: 'IDAsc' })
        }
        else {
            this.state.rooms.sort((a, b) => a.id < b.id ? 1 : -1)
            this.setState({ sortedBy: 'IDDesc' })
        }
        this.forceUpdate();
    }
    handleSortByNumber = () => {
        if (this.state.sortedBy !== 'NumberAsc') {
            this.state.rooms.sort((a, b) => {
                return parseInt(a.number) > parseInt(b.number) ? 1 : -1
            })
            this.setState({ sortedBy: 'NumberAsc' })
        }
        else {
            this.state.rooms.sort((a, b) => {
                return parseInt(a.number) < parseInt(b.number) ? 1 : -1
            })
            this.setState({ sortedBy: 'NumberDesc' })
        }
        this.forceUpdate();
    }
    handleSortByLevel = () => {
        if (this.state.sortedBy !== 'LevelAsc') {
            this.state.rooms.sort((a, b) => {
                return parseInt(a.floor.level) > parseInt(b.floor.level) ? 1 : -1
            })
            this.setState({ sortedBy: 'LevelAsc' })
        }
        else {
            this.state.rooms.sort((a, b) => {
                return parseInt(a.floor.level) < parseInt(b.floor.level) ? 1 : -1
            })
            this.setState({ sortedBy: 'LevelDesc' })
        }
        this.forceUpdate();
    }
    handleSortByBuilding = () => {
        if (this.state.sortedBy !== 'BuildingAsc') {
            this.state.rooms.sort((a, b) => {
                return parseInt(a.floor.building.number) > parseInt(b.floor.building.number) ? 1 : -1
            })
            this.setState({ sortedBy: 'BuildingAsc' })
        }
        else {
            this.state.rooms.sort((a, b) => {
                return parseInt(a.floor.building.number) < parseInt(b.floor.building.number) ? 1 : -1
            })
            this.setState({ sortedBy: 'BuildingDesc' })
        }
        this.forceUpdate();
    }
    handleSortBySiteNumber = () => {
        if (this.state.sortedBy !== 'SiteIDAsc') {
            this.state.rooms.sort((a, b) => {
                return parseInt(a.floor.building.site.siteId) > parseInt(b.floor.building.site.siteId) ? 1 : -1
            })
            this.setState({ sortedBy: 'SiteIDAsc' })
        }
        else {
            this.state.rooms.sort((a, b) => {
                return parseInt(a.floor.building.site.siteId) < parseInt(b.floor.building.site.siteId) ? 1 : -1
            })
            this.setState({ sortedBy: 'SiteIDDesc' })
        }
        this.forceUpdate();
    }
    handleSortBySiteName = () => {
        if (this.state.sortedBy !== 'SiteNameAsc') {
            this.state.rooms.sort((a, b) => {
                return a.floor.building.site.name> b.floor.building.site.name ? 1 : -1
            })
            this.setState({ sortedBy: 'SiteNameAsc' })
        }
        else {
            this.state.rooms.sort((a, b) => {
                return a.floor.building.site.name < b.floor.building.site.name ? 1 : -1
            })
            this.setState({ sortedBy: 'SiteNameDesc' })
        }
        this.forceUpdate();
    }

    handleFilterChange = Event => {
        this.setState({ filterBy: Event.target.value })
        this.setState({ filterInputValue: "" })
        this.setState({ rooms: this.state.tempRooms.slice() })
        this.forceUpdate();
      }
      handleFilterData = Event => {
        let rooms = this.state.tempRooms.slice();
        this.setState({ filterInputValue: Event.target.value })
        let pattern ="^"+Event.target.value;
        let result = [];
        if (this.state.filterBy === 'number') { result = rooms.filter((element) => new RegExp(pattern).test(element.number)) }
        else if (this.state.filterBy === 'level') { result = rooms.filter((element) => new RegExp(pattern).test(element.floor.level)) }
        else if (this.state.filterBy === 'building') { result = rooms.filter((element) => new RegExp(pattern).test(element.floor.building.number)) }
        else if (this.state.filterBy === 'siteID') { result = rooms.filter((element) => new RegExp(pattern).test(element.floor.building.site.siteId)) }
        else if (this.state.filterBy === 'siteName') { result = rooms.filter((element) => new RegExp(pattern).test(element.floor.building.site.name)) }
        this.setState({ rooms: result })
      }
    componentDidMount() {
        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
            }
        };
        fetch(Config.serverAddress + "/api/v1/rooms", requestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        rooms: result,
                        tempRooms: result
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
        const { error, isLoaded, rooms } = this.state;
        if (error) {
            return <div>Błąd: {error.message}</div>;
        } else if (!isLoaded) {
            return <Loading />;
        } else {
            return (
                <div>
                    <h1>Lista pomieszczeń</h1>
                    <a href={Config.pageAddress + "/rooms/add"} class="btn btn-success m-2">Dodaj nowe</a>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <label class="input-group-text" for="inputGroupSelect01">Filtruj</label>
                        </div>
                        <select class="custom-select col-2" id="inputGroupSelect01" onChange={this.handleFilterChange}>
                            <option selected disabled>Wybierz filtr</option>
                            <option value="number">Numer</option>
                            <option value="level">Piętro</option>
                            <option value="building">Budynek</option>
                            <option value="siteID">Numer kompleksu</option>
                            <option value="siteName">Nazwa kompleksu</option>
                        </select>
                        <input type="text" class="form-control" aria-label="Tu wpisz tekst wg którego chcesz filtrować dane" placeholder="Wpisz tekst wg którego chcesz filtrować dane" value={this.state.filterInputValue} onChange={this.handleFilterData}></input>
                    </div>
                    <table class="table table-light table-hover text-center">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByNumber}>Numer</button></th>
                                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByLevel}>Piętro</button></th>
                                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortByBuilding}>Budynek</button></th>
                                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortBySiteNumber}>Numer kompleksu</button></th>
                                <th scope="col"><button type="button" class="btn btn-dark btn-block" onClick={this.handleSortBySiteName}>Nazwa kompleksu</button></th>
                                <th scope="col" colspan="2"><button type="button" class="btn btn-dark btn-block" disabled>Operacje</button></th>
                            </tr>
                        </thead>
                        <tbody>
                            {console.log(this.state.rooms)}
                            {Array.isArray(this.state.rooms) &&
                                rooms.map(room => (
                                    <tr key={room.identifier}>
                                        {room.number 
                                            ? <td>{room.number}</td>
                                            
                                            : <td>-</td>
                                        }
                                        {room.floor.level
                                            ?<td><a href={Config.pageAddress + "/floors/" + room.floor.id} class="btn btn-light btn-block">{room.floor.level}</a></td>
                                            : <td>-</td>
                                        }
                                        {room.floor.building.number
                                            ?<td><a href={Config.pageAddress + "/buildings/" + room.floor.building.id} class="btn btn-light btn-block">{room.floor.building.number}</a></td>
                                            : <td>-</td>
                                        }
                                        {room.floor.building.site.siteId
                                            ?<td><a href={Config.pageAddress + "/sites/" + room.floor.building.site.id} class="btn btn-light btn-block">{room.floor.building.site.siteId}</a></td>
                                            : <td>-</td>
                                        }
                                        {room.floor.building.site.name
                                            ?<td><a href={Config.pageAddress + "/sites/" + room.floor.building.site.id} class="btn btn-light btn-block">{room.floor.building.site.name}</a></td>
                                            : <td>-</td>
                                        }
                                        <td><a class="btn btn-info b-2 btn-block" href={Config.pageAddress + "/rooms/" + room.identifier}>Szczegóły</a></td>
                                        <td><button class="btn btn-danger b-2 btn-block" data-toggle="modal" data-target="#modalConfirmDelete" 
                                        onClick={() => {this.setState({ itemToDelete: room})}}>Usuń</button></td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                    <Modal header="Sukces" body={"Usunięto pomieszczenie"} id="modalSuccess" />
                    <Modal header="Błąd" body={"Usuwanie pomieszczenie numer: "+this.state.itemToDelete.number +" nie powiodło się. Sprawdź czy pomieszczenie nie jest powiązane z innym obiektem."} 
                    id="modalError" />
                    <ModalConfirmDelete handleConfirmClick={this.handleDeleteClick} toDelete={"pomieszczenie: "+this.state.itemToDelete.number} />
                </div >
            );
        }
    }
}
export default Rooms