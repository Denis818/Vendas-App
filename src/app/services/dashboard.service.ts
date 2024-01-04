import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base/BaseService.service';
import { Observable } from 'rxjs';
import { Venda } from '../models/Venda';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {

  private readonly Url = 'https://192.168.18.52:7109/api/SalesSummary';

  constructor(http: HttpClient) {
    super(http);
  }

  public GetTodaysSalesDate(paginaAtual: number, itensPorPagina: number): Observable<Venda[]> {
    const params = new HttpParams()
      .set('paginaAtual', paginaAtual.toString())
      .set('itensPorPagina', itensPorPagina.toString());

    return this.SendHttpRequest('GET', this.Url + '/today', null, null, params);
  }

  public getGroupSalesDay(): Observable<any> {
    return this.SendHttpRequest('GET', this.Url + "/group-by-day")
  }

  public getSalesSummary(): Observable<any> {
    return this.SendHttpRequest('GET', this.Url + '/summary');
  }
}
