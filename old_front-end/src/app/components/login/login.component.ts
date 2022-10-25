import { Component, OnInit } from '@angular/core';
import { LoginApiService } from 'src/app/services/api/login.api.service';
import { RouteConfigLoadEnd, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login: string = "";
  password: string = "";

  constructor(
    private loginApiService: LoginApiService, 
    private router: Router,
    ) { }

  ngOnInit() {
  }

  async tryLogin(){
    await this.loginApiService.login(this.login, this.password).then( (response) => {
      if (response){
        this.router.navigate(['/home']);
      } else { 
        this.router.navigate(['/login']);
       }
    });
  }

}
