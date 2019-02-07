import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class ProcessHTTPMsgService {

   public extractData(res: Response) {
    let body = res.json();
    return body || { };
  }
  constructor() { }

}