import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';

import { token } from '../shared/qsToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: Http,
              private processHTTPMsgService: ProcessHTTPMsgService) { }

  login(): Observable <any> {
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    const requestOptions = {                                                                                                                                                                                 
      headers: new Headers(headerDict), 
    };
    
    return this.http.get(baseURL + 'users/auth/o365' ,requestOptions)
            .map(res => { return this.processHTTPMsgService.extractData(res); });

  }

  getUserId(trigram, UserDir): Observable <any> {
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'userDir' : UserDir
    }

    const requestOptions = {                                                                                                                                                                                 
      headers: new Headers(headerDict), 
    };
    
    return this.http.get(baseURL + 'QIX/userId/'+trigram ,requestOptions)
            .map(res => { return this.processHTTPMsgService.extractData(res); });

  }  

  delCustomProp(gameId, userId, customProp) : Observable <any> {

    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'gameID' : gameId,
      'custProp':customProp
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new Headers(headerDict), 
    };

    return this.http.delete(baseURL + 'QIX/user/'+userId+'/custProp', requestOptions)
            .map(res => { return this.processHTTPMsgService.extractData(res); });
  }     
}
