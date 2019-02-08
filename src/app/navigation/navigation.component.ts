import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
//import { CookieService } from 'ngx-cookie-service';
import {CookieService} from 'angular2-cookie/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap'

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  private isLoggedIn=false;
  private loginUrl:string;
  private pbgToken;
  private trigram:string;
  

  constructor(private authService : AuthService,
              private cookieService: CookieService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      if(params['token'] !== undefined){
        this.pbgToken = params['token'];
        var qsToken = params['qsToken'];
        this.trigram=params['trigram']

        this.cookieService.put('pbgToken',this.pbgToken);
        this.cookieService.put('qsToken',qsToken);
        this.cookieService.put('trigram',this.trigram);


        var userId;
        this.authService.getUserId(this.trigram,"QT")
        .mergeMap( trigram => {
          userId=trigram.data;
          return this.authService.delCustomProp('m',userId,'MAB')
        })
        .mergeMap( trigram => this.authService.delCustomProp('m',userId,'POT'))
        .subscribe(() =>  this.cookieService.put('qsUserId',userId ))

        /*
        this.authService.getUserId(this.trigram,"QT")
        .subscribe( trigram =>{
          this.cookieService.put('qsUserId',trigram.data );
          this.authService.delCustomProp('m',trigram.data,'MAB')
          .subscribe( u=> console.log(u), error => console.log(error));
          this.authService.delCustomProp('m',trigram.data, 'POT')
          .subscribe( u=> console.log(u), error => console.log(error));
        })
        */
      }
    });

    if(this.cookieService.get('qsUserId')){
      this.isLoggedIn=true;
    }

    this.authService.login()
    .subscribe( url =>{
      console.log(url);
      this.loginUrl=url;
    })

  }

  logout(){
    this.cookieService.remove('pbgToken');
  }
}
