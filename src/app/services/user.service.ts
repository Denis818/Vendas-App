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
        this.getUserEmail();
      })
    );
  }

  public login(dados: any): Observable<any> {
    return this.SendHttpRequest('POST', this.url + '/login', dados).pipe(
      tap(response => {
        this.guardarToken(response)
        this.getUserEmail();
      })
    );
  }

  public logout(): Observable<any> {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    return this.SendHttpRequest('GET', this.url + '/logout');
  }

  public getUserEmail(): void {
    this.SendHttpRequest('GET', this.url + '/name-user')
      .subscribe(email => localStorage.setItem('userEmail', email));
  }

  private guardarToken(response: any) {
    if (response && response.token) {
      localStorage.setItem('token', response.token);
    }
  }
}
