import { authenticationService } from '../Services/authenticationService';
import $ from 'jquery';

export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                authenticationService.logout();
            }
        $('#modalError').modal('show');
        }
        else {
            $('#modalSuccess').modal('show');
        }
        return data;
    });
}