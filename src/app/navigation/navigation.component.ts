import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
//import { CookieService } from 'ngx-cookie-service';
import {CookieService} from 'angular2-cookie/core';
import { Router } from '@angular/router';

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
        
        this.authService.getUserId(this.trigram,"QT")
        .subscribe( trigram =>{
          this.cookieService.put('qsUserId',trigram.data );
          this.authService.delCustomProp('m',trigram.data,'MAB');
          this.authService.delCustomProp('m',trigram.data, 'POT'); 
        })
        
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
