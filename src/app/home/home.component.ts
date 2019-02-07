import { Component, OnInit, Inject } from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import { CompanyService } from '../services/company.service'
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private isLoggedIn=false;
  private trigram:string;
  private companyName:string;
  private expiredDate = new Date();

  constructor(private cookieService: CookieService,
              private companyService: CompanyService,
              private authService: AuthService,
              private router: Router,
              @Inject('LOCATION') private location) { }

  ngOnInit() {
    
    var pbgToken = this.cookieService.get('pbgToken');
    this.trigram=this.cookieService.get('trigram');

    if(this.trigram !== undefined || this.trigram !== ""){
      this.isLoggedIn=true;

    }
      

  }

  createCompany(){
    this.expiredDate.setDate( this.expiredDate.getDate() + 1 );

    console.log("Create a new Company : "+this.companyName);
    this.companyService.createCompany(this.companyName)
    .subscribe( result =>{
      console.log(result);
      var OptionCookie = {
        expires:this.expiredDate,
        domain : location.origin
      }

      this.cookieService.put('companyID',result.id );
      this.cookieService.put('gameID','m' );
      window.open(location.origin, '_self');
    })
  }

}
