import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base/BaseService.service';
import { Observable } from 'rxjs';
import { Venda } from '../models/Venda';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {

  private readonly Url = 'https://192.168.18.52:7109/api/Dashboard';

  constructor(http: HttpClient) {
    super(http);
  }

  public GetTodaysSalesDate(paginaAtual: number, itensPorPagina: number): Observable<Venda[]> {
    const params = new HttpParams()
      .set('paginaAtual', paginaAtual.toString())
      .set('itensPorPagina', itensPorPagina.toString());

    return this.SendHttpRequest('GET', this.Url + '/dia-atual', null, null, params);
  }

  public getSalesSummary(): Observable<any> {
    return this.SendHttpRequest('GET', this.Url + '/resumo-vendas');
  }

  public getGroupSalesDay(): Observable<any> {
    return this.SendHttpRequest('GET', this.Url + "/vendas-por-dia")
  }
}
