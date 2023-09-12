import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export abstract class BaseService {

  constructor(private http: HttpClient) { }

  protected SendHttpRequest(metodo: string, url: string, dados?: any,
    contentType?: any, params?: HttpParams): Observable<any> {

      return this.http.request(metodo, url, {
      body: dados,
      headers: contentType ?? 'application/json',
      params: params
    });
  }
}
