import jwt_decode from 'jwt-decode';
import request from 'reqwest';
import when from 'when';

class Auth {

    logout() {
        localStorage.removeItem('user');
    }

    login(login, password) {

        return this.handleAuth(when(request({
            url: 'http://37.187.196.21:3011/api/authenticate',
            method: 'POST',
            crossOrigin: true,
            type: 'json',
            data: {
                login: login, password: password
            }
        })));
    }

    handleAuth(loginPromise) {

        return loginPromise
            .then(function(response) {
                if(response.success) {
                    localStorage.setItem('user', JSON.stringify(jwt_decode(response.token)));
                    return true;
                }
                else { return false }
            });
    }


}

export default new Auth();
