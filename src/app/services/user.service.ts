import { Injectable } from '@angular/core';
import { BaseService } from './base/BaseService.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  public url: string = 'https://localhost:7109/User';

  constructor(http: HttpClient) {
    super(http);
  }



  public registraUsuario(dados: any): Observable<any> {
    return this.SendHttpRequest('POST', this.url + '/register', dados).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  public login(dados: any): Observable<any> {
    return this.SendHttpRequest('POST', this.url + '/login', dados).pipe(
      tap((response:any) =>{
        if(response && response.token){
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  public logout(): Observable<any>{
    localStorage.removeItem('token');
    return this.SendHttpRequest('GET', this.url + '/logout');
  }

  public getUserEmail(): Observable<any>{
    return this.SendHttpRequest('GET', this.url + '/name-user');
  }
}
