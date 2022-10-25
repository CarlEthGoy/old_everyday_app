import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings'
import { User } from 'src/app/models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginApiService {
  // #region Constructors (1)

  constructor(
    private http: HttpClient) { }

  // #endregion Constructors (1)

  // #region Public Methods (1)

  login(email:string, password:string): Promise<any>{
      return new Promise( (resolve) => {
        if (email && password){
          this.http.post<any>(AppSettings.API_URL + "auth/", {email: email, password: password}).subscribe( (response) => {
            if (!response.error){
              localStorage.setItem("token", response.data);
            }
            resolve(!response.error);
          });
        } else {
          resolve(false);
        }
      });
    }

  // #endregion Public Methods (1)
}