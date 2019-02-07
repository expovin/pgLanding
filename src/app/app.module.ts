import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { baseURL } from './shared/baseurl';
import { ProcessHTTPMsgService} from './services/process-httpmsg.service'
import { AuthService } from './services/auth.service';
//import { CookieService } from 'ngx-cookie-service';
import { CookieService } from 'angular2-cookie/core';
import { AppRoutingModule } from './app-routing/app-routing.module';
//import { CookieService } from 'angular2-cookie/services/cookies.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    RouterModule.forRoot([]),
  ],
  providers: [  {provide: 'BaseURL', useValue: baseURL},
                { provide: 'LOCATION', useValue: window.location },              
                ProcessHTTPMsgService,
                CookieService,
                AuthService
            ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
