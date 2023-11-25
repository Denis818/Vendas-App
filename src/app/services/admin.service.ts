import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base/BaseService.service';
import { Observable } from 'rxjs';
import { LogAcesso } from '../models/LogAcesso';
import { Venda } from '../models/Venda';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseService {

  private readonly Url = 'https://192.168.18.52:7109/api/LogAcesso';
  private readonly urlUser: string = 'https://192.168.18.52:7109/User';

  constructor(http: HttpClient) { super(http); }

  public getSaleById(id: number): Observable<Venda> {
    return this.SendHttpRequest('GET', 'https://192.168.18.52:7109/api/Venda' + `/${id}`);
  }

  public filterUserName(name: string): Observable<LogAcesso[]> {
    return this.SendHttpRequest('GET', this.Url + `/filter?name=${name}`);
  }

  public getLogAcessos(paginaAtual: number, itensPorPagina: number): Observable<LogAcesso[]> {
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
