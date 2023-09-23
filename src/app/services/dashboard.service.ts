import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base/BaseService.service';
import { Observable } from 'rxjs';
import { Venda } from '../models/Venda';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {

  private readonly Url = 'https://localhost:7109/api/Dashboard';

  constructor(http: HttpClient) {
    super(http);
  }

  public getSalesCurrentDay(): Observable<Venda[]> {
    return this.SendHttpRequest('GET', this.Url + '/dia-atual');
  }

  public getSalesSummary(): Observable<any> {
    return this.SendHttpRequest('GET', this.Url + '/resumo-vendas');
  }

  public getGroupSalesDay(): Observable<any> {
    return this.SendHttpRequest('GET', this.Url + "/vendas-por-dia")
  }
}
