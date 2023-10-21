import { Injectable } from '@angular/core';
import { BaseService } from './base/BaseService.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {

  public url: string = 'https://localhost:7109/User';

  constructor(http: HttpClient) { super(http); }

  //Metodo Tap permite que você "faça algo" com os valores emitidos pelo Observable sem realmente modificá-los ou consumi-los.

  public register(dados: any): Observable<any> {
    return this.SendHttpRequest('POST', this.url + '/register', dados).pipe(
      tap(response => {
        this.guardarToken(response)
        this.getUserInfo();
      })
    );
  }

  public login(dados: any): Observable<any> {
    return this.SendHttpRequest('POST', this.url + '/login', dados).pipe(
      tap(response => {
        this.guardarToken(response)
        this.getUserInfo();
      })
    );
  }

  public logout(): Observable<any> {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('expirationToken');
    return this.SendHttpRequest('GET', this.url + '/logout');
  }

  public getUserInfo(): void {
    this.SendHttpRequest('GET', this.url + '/info')
      .subscribe({
        next: obj => {
          localStorage.setItem('userEmail', obj.userEmail)
          console.log('Adm:', obj.isAdmin)
          localStorage.setItem('isAdmin', obj.isAdmin)
        },
        error: error =>{
          throw new Error(error);
        }
      });
  }

  private guardarToken(response: any) {
    if (response && response.token && response.expiration) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('expirationToken', response.expiration);
    }
  }

  public isAdmin(): Observable<any> {
    return this.SendHttpRequest('GET', this.url + '/admin');
  }
}
