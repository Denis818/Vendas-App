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
  public userEmail: string = '';


  constructor(http: HttpClient) {
    super(http);
  }

  //Metodo Tap permite que você "faça algo" com os valores emitidos pelo Observable sem realmente modificá-los ou consumi-los.

  public register(dados: any): Observable<any> {
    return this.SendHttpRequest('POST', this.url + '/register', dados).pipe(
      tap(response => {

        this.guardarToken(response)
        this.updateUserEmail()

      })
    );
  }

  public login(dados: any): Observable<any> {
    return this.SendHttpRequest('POST', this.url + '/login', dados).pipe(
      tap(response => {

        this.guardarToken(response)
        this.updateUserEmail()

      })
    );
  }

  public logout(): Observable<any> {
    localStorage.removeItem('token');
    return this.SendHttpRequest('GET', this.url + '/logout');
  }

  public updateUserEmail(): void{
    this.SendHttpRequest('GET', this.url + '/name-user').subscribe(email => this.userEmail = email);
  }

  public getUserEmail(): string {
    return this.userEmail;
  }

  private guardarToken(response: any) {
    if (response && response.token) {
      localStorage.setItem('token', response.token);
    }
  }
}
