import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
//import { Https, Responses, Headerss, RequestOptionss } from '@angular/https';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: Http, 
              private processHTTPMsgService: ProcessHTTPMsgService) { }

  createCompany(CompanyName): Observable <any>  {

    console.log("CompanyService : "+CompanyName);

    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'gameid':'m'
    }

    const requestOptions = {                                                                                                                                                                                 
      headers: new Headers(headerDict), 
    };

    return this.http.post(baseURL + 'companies' ,{name:CompanyName}, requestOptions)
            .map(res => { return this.processHTTPMsgService.extractData(res); });    
  }
}
