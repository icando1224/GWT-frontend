import Config from '../Config'
const requestOptions = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('Authorization')
    }
};
let devices = fetch(Config.serverAddress + "/api/v1/devices", requestOptions)
    .then(res => res.json())
    .then(
        (result) => {
            devices = {
                isLoaded: true,
                devices: result,
                // tempComputers: result
            };
        },
        // Uwaga: to ważne, żeby obsłużyć błędy tutaj, a
        // nie w bloku catch(), aby nie przetwarzać błędów
        // mających swoje źródło w komponencie.
        (error) => {
            devices = {
                isLoaded: false,
                error
            };
        }
    )
const validateID = function (input) {
    if (devices.devices.find(item => item.deviceId == input.value) == undefined) {
        input.classList.add("is-valid")
        input.classList.remove("is-invalid")
        return true;
    }
    else {
        input.classList.add("is-invalid")
        input.classList.remove("is-valid")
        return false;
    }
}
export default validateID;