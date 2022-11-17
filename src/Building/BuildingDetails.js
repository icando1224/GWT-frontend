
import React, { Component } from 'react';
import Config from '../Config';
import validateInput from '../functions/validateInput';
import Modal from '../Modal';
import $ from 'jquery';
export class BuildingDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      id: this.props.match.params.id,
      number:'',
      isLoadedSites:false,
      site:'',
      sites:[],
      siteSelected:'',
      formDisabled: true
    };
    this.validateInput = validateInput;
  }

  handleSubmit = async event => {
    event.preventDefault();
    const item = {
     number:this.state.number,
     //site:this.state.sites.find(element=>element.id==this.state.siteSelected)
     site:this.state.sites.find(element=>element.id==this.state.siteSelected)
    }
    console.log("Body" + JSON.stringify(item));

    await fetch(Config.serverAddress + '/api/v1/buildings/'+this.props.match.params.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
      },
      body: JSON.stringify(item),
    }
    );
    $('#modalSuccess').modal('show');
  }

  handleClickEdit = (Event) => {
    Event.preventDefault();
    if (this.state.formDisabled) {
      this.setState({ formDisabled: false })
      Event.target.classList.remove("btn-danger");
      Event.target.classList.add("btn-primary");
      Event.target.innerText = "Zablokuj edycję";
    }
    else {
      this.setState({ formDisabled: true })
      Event.target.classList.remove("btn-primary");
      Event.target.classList.add("btn-danger");
      Event.target.innerText = "Odblokuj edycję";
    }
  }

  componentDidMount(){
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
        }
      }
          fetch(Config.serverAddress + "/api/v1/buildings/"+this.props.match.params.id, requestOptions)
            .then(res => res.json())
            .then(
              (result) => {
                this.setState({
                  isLoaded: true,
                  number: result.number,
                  site:result.site,
                  siteSelected:result.site.id
                });
                console.log(this.state.number)
              },
              // Uwaga: to ważne, żeby obsłużyć błędy tutaj, a
              // nie w bloku catch(), aby nie przetwarzać błędów
              // mających swoje źródło w komponencie.
              (error) => {
                this.setState({
                  isLoaded: false,
                  error
                });
              }
            )

                fetch(Config.serverAddress + "/api/v1/sites", requestOptions)
                  .then(res => res.json())
                  .then(
                    (result) => {
                      this.setState({
                        isLoadedSites: true,
                        sites: result
                      });
                      console.log(this.state.sites)
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
    let { sites } = this.state;
    return (
      <div>
        <span class="d-block p-2 bg-primary text-white">Wpisz dane budynku</span>
        <form class={document.getElementsByClassName("is-invalid").length == 0 ? "was-validated" : ""}>
          <div class="form-group">
          <label for="selectSite">Wybierz kompleks</label>
          <select class="form-control is-valid" id="selectSite" required disabled={this.state.formDisabled} defaultValue={this.state.site.id} onChange={(event) => {
            console.log(event.target.value)
            this.setState({ 'siteSelected': event.target.value });
          }}>
            <option selected disabled>Wybierz...</option>
            {Array.isArray(this.state.sites) && sites.map(site => (
              <option value={site.id} selected={this.state.site.id == site.id}>{"Identyfikator: "+site.siteId + " Nazwa: " + site.name}</option>
            ))}
          </select>

              <label for="numer">Numer budynku</label>
              <input type="text" class="form-control is-valid" id="identyfikator" required disabled={this.state.formDisabled}  defaultValue={this.state.number}
              onChange={(event) => {
                if (this.validateInput(event.target, new RegExp('^[0-9]*$'))) this.setState({ number: event.target.value });
              }}>
            </input>
            <div class="invalid-feedback">
              </div>    
          </div>
          <button class="btn btn-danger m-2" onClick={this.handleClickEdit}>Odblokuj edycję</button>
        <button type="submit" class="btn btn-success m-2" hidden={this.state.formDisabled} disabled={document.getElementsByClassName("is-invalid").length > 0} onClick={this.handleSubmit}>Zapisz</button>
        </form>
        <Modal header="Sukces" body={"Zaktualizowano budynek nr: "+ this.state.number+" w kompleksie: "+this.state.site.siteId+" "+this.state.site.name} id="modalSuccess" onCloseClicked={()=>window.location.href='/buildings'} />
        <Modal header="Błąd" body={"Aktualizowanie nie powiodło się."} id="modalError" />
      </div>
    )
  }
}
export default BuildingDetails