import { HttpClient, HttpParams } from "@angular/common/http";
import { BaseService } from "./base/BaseService.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Venda } from "../models/Venda";

@Injectable()
export class VendaService extends BaseService {

  private readonly Url = 'https://localhost:7109/api/Venda';

  constructor(http: HttpClient) {
    super(http);
  }

  public getAllVendas(paginaAtual: number, itensPorPagina: number): Observable<Venda[]> {
    const params = new HttpParams()
      .set('paginaAtual', paginaAtual.toString())
      .set('itensPorPagina', itensPorPagina.toString());

    return this.SendHttpRequest('GET', this.Url, null, null, params);
  }

  public getSalesCurrentDay(): Observable<Venda[]> {
    return this.SendHttpRequest('GET', this.Url + '/dia-atual');
  }

  public getSalesSummary(): Observable<any> {
    return this.SendHttpRequest('GET', this.Url + '/resumo-vendas');
  }

  public filterSalesByName(name: string): Observable<Venda> {
    return this.SendHttpRequest('GET', this.Url + `/filter?name=${name}`);
  }

  public getSaleById(id: number): Observable<Venda> {
    return this.SendHttpRequest('GET', this.Url + `/${id}`);
  }

  public getGroupSalesDay(): Observable<any> {
    return this.SendHttpRequest('GET', this.Url + "/vendas-por-dia")
  }

  public getSalesByDate(startDate?: Date, endDate?: Date): Observable<Venda[]> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', this.formatDateForAPI(startDate));
    }
    if (endDate) {
      params = params.set('endDate', this.formatDateForAPI(endDate));
    }

    return this.SendHttpRequest('GET', this.Url + '/por-periodo', null, null, params);
  }

  public insertSale(venda: Venda) {
    return this.SendHttpRequest('POST', this.Url, venda)
  }

  public updateSale(id: number, venda: any): Observable<Venda> {
    return this.SendHttpRequest('PUT', this.Url + `?id=${id}`, venda);
  }

  public deleteSale(id: number) {
    return this.SendHttpRequest('DELETE', this.Url + `?id=${id}`)
  }

  public deleteAllSale(ids: number[]) {
    return this.SendHttpRequest('DELETE', this.Url + '/DeleteRange', ids)
  }

  private formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
  }
}
