import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
import Computers from './Computer/Computers'
import ComputerDetails from './Computer/ComputerDetails'
import ComputerAdd from './Computer/ComputerAdd'
import ComputersByOwner from './Computer/ComputersByOwner'
import Users from './User/Users'
import UsersOfComputer from './User/UsersOfComputer'
import UserDetails from './User/UserDetails'
import UserAdd from './User/UserAdd'
import Switches from './Switch/Switches'
import SwitchDetails from './Switch/SwitchDetails'
import SwitchAdd from './Switch/SwitchAdd'
import Routers from './Router/Routers'
import RouterDetails from './Router/RouterDetails'
import RouterAdd from './Router/RouterAdd'
import Sites from './Site/Sites'
import SiteDetails from './Site/SiteDetails'
import SiteAdd from './Site/SiteAdd'
import Buildings from './Building/Buildings'
import BuildingDetails from './Building/BuildingDetails'
import BuildingAdd from './Building/BuildingAdd'
import Floors from './Floor/Floors'
import FloorDetails from './Floor/FloorDetails'
import FloorAdd from './Floor/FloorAdd'
import Rooms from './Room/Rooms'
import RoomAdd from './Room/RoomAdd'
import Devices from './Device/Devices'
import DevicesByOwner from './Device/DevicesByOwner'
import SignIn from './Login/SignIn'
import Login from './Login/Login'
import Home from './Home'
import Modal from './Modal'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: localStorage.getItem("username"),
      authentication: localStorage.getItem("Authentication")
    };
  }

  logout(){
    localStorage.removeItem("username");
    localStorage.removeItem("Authorization");
    $('#modalLogout').modal('show');
  }

  render() {
    return (
      <Router>
        <div id="content" class="container p-0">
          <header>
            <div id="header-container">
              <div id="menu-bar" class="d-flex flex-row">
                <div id="logo" class="d-flex align-items-center">
                  <svg class="bi bi-laptop" width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M13.5 3h-11a.5.5 0 00-.5.5V11h12V3.5a.5.5 0 00-.5-.5zm-11-1A1.5 1.5 0 001 3.5V12h14V3.5A1.5 1.5 0 0013.5 2h-11z" clip-rule="evenodd" />
                    <path d="M0 12h16v.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 010 12.5V12z" />
                  </svg>
                  GWTManager!
                </div>
                <div class="flex-grow-1 ">
                  <ul className="nav nav-pills nav-fill d-flex align-items-end">
                    <li className="nav-item">
                      <a className="nav-link" href="/home">Strona główna</a>
                    </li>
                    {this.state.username != null &&
                      <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" onMouseOver={()=>$('#devicesMenu').addClass('show')} onMouseOut ={()=>$('#devicesMenu').removeClass('show')} >Sprzęt</a>
                        <div className="dropdown-menu" id="devicesMenu"onMouseOver={()=>$('#devicesMenu').addClass('show')} onMouseOut ={()=>$('#devicesMenu').removeClass('show')}>
                          <a className="dropdown-item" href="/devices">Wszystkie</a>
                          <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="/computers">Komputery</a>
                            <a className="dropdown-item" href="/switches">Switche</a>
                            <a className="dropdown-item" href="/routers">Routery</a>
                        </div>
                      </li>
                    }
                    {this.state.username != null &&
                      <li className="nav-item">
                        <a href="/users" className="nav-link">Użytkownicy</a>
                      </li>
                    }
                    {this.state.username != null &&
                      <li className="dropdown nav-item">
                        <a className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" onMouseOver={()=>$('#locationsMenu').addClass('show')} onMouseOut ={()=>$('#locationsMenu').removeClass('show')}>Lokalizacje</a>
                        <div className="dropdown-menu" id="locationsMenu" onMouseOver={()=>$('#locationsMenu').addClass('show')} onMouseOut ={()=>$('#locationsMenu').removeClass('show')}>
                          <a className="dropdown-item" href="/sites">Kompleks</a>
                          <a className="dropdown-item" href="/buildings">Budynek</a>
                          <a className="dropdown-item" href="/floors">Piętro</a>
                          <a className="dropdown-item" href="/rooms">Pomieszczenie</a>
                        </div>
                      </li>
                    }
                    {this.state.username != null &&
                  <li className="nav-item">
                      <a href="#" className="nav-link" onClick={this.logout}>Wyloguj {/*this.state.username*/}</a>
                    </li>
                    }
                    {this.state.username == null &&
                    <li className="nav-item">
                      <a href="/login" className="nav-link">Zaloguj się</a>
                    </li>
                    }
                    {this.state.username == null &&
                    <li className="nav-item">
                      <a href="/register" className="nav-link">Zarejestruj się</a>
                    </li>
                    }
                  </ul>
                </div>
              </div>
            </div>
          </header>
          <main>
            <Switch>
              <Route exact path="/"><Home /></Route>
              <Route exact path="/home"><Home /></Route>
              <Route exact path="/computers"><Computers /></Route>
              <Route path="/computers/add"><ComputerAdd /></Route>
              <Route path="/computers/:id/users" component={UsersOfComputer}></Route>
              <Route path="/computers/:id" component={ComputerDetails}></Route>
              <Route exact path="/users"><Users /></Route>
              <Route path="/users/add"><UserAdd /></Route>
              <Route path="/users/:id/devices" component={DevicesByOwner}></Route>
              <Route path="/users/:id/computers" component={ComputersByOwner}></Route>
              <Route path="/users/:id" component={UserDetails}></Route>
              <Route exact path="/switches"><Switches /></Route>
              <Route path="/switches/add"><SwitchAdd /></Route>
              <Route path="/switches/:id" component={SwitchDetails}></Route>
              <Route path="/switchs/:id" component={SwitchDetails}></Route>
              <Route exact path="/routers"><Routers /></Route>
              <Route path="/routers/add"><RouterAdd /></Route>
              <Route path="/routers/:id" component={RouterDetails}></Route>
              <Route exact path="/sites"><Sites /></Route>
              <Route path="/sites/add"><SiteAdd /></Route>
              <Route path="/sites/:id" component={SiteDetails}></Route>
              <Route exact path="/buildings"><Buildings /></Route>
              <Route path="/buildings/add"><BuildingAdd /></Route>
              <Route path="/buildings/:id" component={BuildingDetails}></Route>
              <Route exact path="/floors"><Floors /></Route>
              <Route path="/floors/add"><FloorAdd /></Route>
              <Route path="/floors/:id"component={FloorDetails}></Route>
              <Route exact path="/rooms"><Rooms /></Route>
              <Route path="/rooms/add"><RoomAdd /></Route>
              <Route exact path="/devices"><Devices /></Route>
              <Route exact path="/login"><Login /></Route>
              <Route exact path="/register"><SignIn /></Route>
            </Switch>
          </main>
          <footer>
            <a href="mailto:adam.nowak.it@gmail.com" class="text-white">GWTManager! v1.0 &copy; Adam Nowak 2020</a>
          </footer>
          <Modal header="Wylogowano" body={"Poprawnie wylogowano z aplikacji"} id="modalLogout" onCloseClicked={()=>window.location.href='/home'} />
        </div>
      </Router>
    )
  }

}

export default App