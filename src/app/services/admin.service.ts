import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base/BaseService.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseService {

  private readonly Url = 'https://localhost:7109/api/LogAcesso';

  constructor(http: HttpClient) { super(http); }

  public filterUserName(name: string): Observable<any> {
    return this.SendHttpRequest('GET', this.Url + `/filter?name=${name}`);
  }

  public getLogAcessos(paginaAtual: number, itensPorPagina: number): Observable<any[]> {
    const params = new HttpParams()
      .set('paginaAtual', paginaAtual.toString())
      .set('itensPorPagina', itensPorPagina.toString());

    return this.SendHttpRequest('GET', this.Url, null, null, params);
  }
}
