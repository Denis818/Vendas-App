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

  private readonly Url = 'https://localhost:7109/api/LogAcesso';

  constructor(http: HttpClient) { super(http); }

  public getSaleById(id: number): Observable<Venda> {
    return this.SendHttpRequest('GET', 'https://localhost:7109/api/Venda' + `/${id}`);
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
}
