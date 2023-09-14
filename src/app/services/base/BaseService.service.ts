import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

export abstract class BaseService {

  constructor(private http: HttpClient) { }

  protected SendHttpRequest(metodo: string, url: string, dados?: any,
    contentType?: any, params?: HttpParams): Observable<any> {

    const token = localStorage.getItem('token');
    let headers = new HttpHeaders().set('Content-Type', contentType ?? 'application/json');
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }

    let request = this.http.request(metodo, url, {
      body: dados,
      headers: headers,
      params: params
    });

    const response = request.pipe(map((response: any) => response?.dados),
      catchError((error: any) => {

        error?.error?.Mensagens?.forEach((mensagem: any) => {
          console.error(`API error, StatusCodes: ${mensagem.StatusCode}, Message: ${mensagem.Descricao}`);
        });

        return throwError(() => error);
      })
    );

    return response;
  }
}
