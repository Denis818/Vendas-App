import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base/BaseService.service';
import { Observable } from 'rxjs';
import { Venda } from '../models/Venda';
import { LogVenda } from '../models/LogVenda';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseService {

  private readonly Url = 'https://192.168.18.52:7109/api/LogSales';
  private readonly urlUser: string = 'https://192.168.18.52:7109/Users';

  constructor(http: HttpClient) { super(http); }

  public getSaleById(id: number): Observable<Venda> {
    return this.SendHttpRequest('GET', 'https://192.168.18.52:7109/api/Sales' + `/${id}`);
  }

  public filterUserEmail(email: string): Observable<LogVenda[]> {
    return this.SendHttpRequest('GET', this.Url + `/by-email?email=${email}`);
  }

  public getLogVendas(paginaAtual: number, itensPorPagina: number): Observable<LogVenda[]> {
    const params = new HttpParams()
      .set('paginaAtual', paginaAtual.toString())
      .set('itensPorPagina', itensPorPagina.toString());

    return this.SendHttpRequest('GET', this.Url, null, null, params);
  }

  public addPermissionToUser(userEmail: string, permisson: string) {
    const params = new HttpParams()
      .set('userEmail', userEmail)
      .set('permisson', permisson);

    return this.SendHttpRequest('GET', this.urlUser + "addPermission", null, null, params);

  }

  public removePermissionFromUser(userEmail: string, permisson: string) {
    const params = new HttpParams()
      .set('userEmail', userEmail)
      .set('permisson', permisson);

    return this.SendHttpRequest('GET', this.urlUser + "removePermission", null, null, params);
  }

  public getUsers(paginaAtual: number, itensPorPagina: number) {
    const params = new HttpParams()
      .set('paginaAtual', paginaAtual.toString())
      .set('itensPorPagina', itensPorPagina.toString());

    return this.SendHttpRequest('GET', this.urlUser + "users", null, null, params);
  }
}
