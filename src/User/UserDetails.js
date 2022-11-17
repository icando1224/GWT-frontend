import React, { Component } from 'react';
import Config from '../Config';
import validateInput from '../functions/validateInput';
import Modal from '../Modal';
import $ from 'jquery';
export class UserDetails extends Component {
  //na pozniej zrobic tak aby przycisk edytuj odblokowywał formularze
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      id: '',
      firstName: '',
      lastName: '',
      pesel: '',
      role: '',
      email: '',
      phone: '',
      mobilePhone: '',
      voip: '',
      formDisabled: true
    };
    this.validateInput = validateInput;
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


  handleChangeFirstName = event => {
    this.setState({ firstName: event.target.value });
  }
  handleChangeLastName = event => {
    this.setState({ lastName: event.target.value });
  }
  handleChangePesel = event => {
    this.setState({ pesel: event.target.value });
  }
  handleChangeRole = event => {
    this.setState({ role: event.target.value });
  }
  handleChangeEmail = event => {
    this.setState({ email: event.target.value });
  }
  handleChangePhone = event => {
    console.log(event.target.value);
    this.setState({ phone: event.target.value });
  }
  handleChangeMobilePhone = event => {
    this.setState({ mobilePhone: event.target.value });
  }
  handleChangeVoip = event => {
    this.setState({ voip: event.target.value });
  }
  handleSubmit = async event => {
    event.preventDefault();
    const item = {
      id: this.state.id,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      pesel: this.state.pesel,
      role: this.state.role,
      email: this.state.email,
      phone: this.state.phone,
      mobilePhone: this.state.mobilePhone,
      voip: this.state.voip
    }
    console.log("Body" + JSON.stringify(item));

    await fetch(Config.serverAddress + '/api/v1/users/' + this.state.id, {
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
  componentDidMount() {
    const requestOptions = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
      },
    }
    fetch(Config.serverAddress + "/api/v1/users/" + this.props.match.params.id, requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            //user: result,
            id: result.id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            pesel: result.pesel,
            role: result.role,
            phone: result.phone,
            mobilePhone: result.mobilePhone,
            voip: result.voip
          });
          //console.log(this.state.user)
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
    let { error, isLoaded } = this.state;
    if (error) {
      return <div>Błąd: {error.message}</div>;
    } else if (!isLoaded) {
      return <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>;
    } else {
      return (
        <div>
          <span class="d-block p-2 bg-primary text-white">Szczegółowe dane użytkownika</span>
          <form class={document.getElementsByClassName("is-invalid").length == 0 ? "was-validated" : ""}>
            <div class="form-group">
              <label for="imie">Imię</label>
              <input type="text" class="form-control is-valid" id="imie" required defaultValue={this.state.firstName} disabled={this.state.formDisabled} 
                            onChange={(event) => {
                              if (this.validateInput(event.target, new RegExp('^[A-Z]{1}[a-ząćężźłóń]{1,16}$'))) this.setState({ firstName: event.target.value });
                            }}
               />
              <div class="invalid-feedback">Co najmniej 2 litery, pierwsza wielka</div>
              <label for="nazwisko">Nazwisko</label>
              <input type="text" class="form-control is-valid" id="nazwisko" required defaultValue={this.state.lastName} disabled={this.state.formDisabled} 
                onChange={(event) => {
                  if (this.validateInput(event.target, new RegExp('^[A-Z]{1}[a-ząćężźłóń]{1,16}$'))) this.setState({ lastName: event.target.value });
                }}/>
              <div class="invalid-feedback">Co najmniej 2 litery, pierwsza wielka</div>
              <label for="pesel">Pesel</label>
              <input type="text" class="form-control is-valid" id="pesel" required defaultValue={this.state.pesel} disabled={this.state.formDisabled} 
                            onChange={(event) => {
                              if (this.validateInput(event.target, new RegExp('^[0-9]{11}$'))) this.setState({ pesel: event.target.value });
                            }}
              />
              <div class="invalid-feedback">11 cyfr</div>
              <label for="role">Rola</label>
              <input type="text" class="form-control is-valid" id="role" value={this.state.role} disabled={this.state.formDisabled} onChange={this.handleChangeRole}></input>
              <label for="mail">Mail</label>
              <input type="text" class="form-control is-valid" id="email" defaultValue={this.state.email} disabled={this.state.formDisabled} onChange={this.handleChangeEmail} 
                            onChange={(event) => {
                              if (this.validateInput(event.target, new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$'))) this.setState({ email: event.target.value });
                            }}
              />
              <div class="invalid-feedback">Niepoprawny email</div>
              <label for="phone">Nr telefonu</label>
              <input type="telephone" class="form-control is-valid" id="phone" value={this.state.phone} disabled={this.state.formDisabled} 
                            onChange={(event) => {
                              if (this.validateInput(event.target, new RegExp('^[0-9]{8,11}$'))) this.setState({ phone: event.target.value });
                            }}
              />
              <div class="invalid-feedback">Od 8 do 11 cyfr</div>
              <label for="mobile">Nr telefonu (komórkowy)</label>
              <input type="telephone" class="form-control is-valid" id="mobilePhone" value={this.state.mobilePhone} disabled={this.state.formDisabled} 
                            onChange={(event) => {
                              if (this.validateInput(event.target, new RegExp('^[0-9]{8,11}$'))) this.setState({ mobilePhone: event.target.value });
                            }}
              />
              <div class="invalid-feedback">Od 8 do 11 cyfr</div>
              <label for="voip">Nr telefonu (VoIP)</label>
              <input type="telephone" class="form-control is-valid" id="voip" value={this.state.voip} disabled={this.state.formDisabled}
                            onChange={(event) => {
                              if (this.validateInput(event.target, new RegExp('^[0-9]{8,11}$'))) this.setState({ voip: event.target.value });
                            }}
              />
              <div class="invalid-feedback">Od 8 do 11 cyfr</div>

              <button class="btn btn-danger m-2" onClick={this.handleClickEdit}>Odblokuj edycję</button>
              <input type="submit" class="btn btn-success m-2" disabled={document.getElementsByClassName("is-invalid").length > 0} value="Zapisz" hidden={this.state.formDisabled} onClick={this.handleSubmit}/>
            </div>
          </form>
          <Modal header="Sukces" body={"Zaktualizowano użytkownika: "+ this.state.firstName + " "+this.state.lastName} id="modalSuccess" onCloseClicked={()=>window.location.href='/users'} />
          <Modal header="Błąd" body={"Aktualizowanie nie powiodło się."} id="modalError" />
        </div>
      )
    }
  }
}
export default UserDetails