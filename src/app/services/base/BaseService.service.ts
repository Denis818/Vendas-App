import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export abstract class BaseService {

  constructor(private http: HttpClient) { }

  protected SendHttpRequest(metodo: string, url: string, dados?: any,
    contentType?: any, params?: HttpParams): Observable<any> {

    let request = this.http.request(metodo, url, {
      body: dados,
      headers: contentType ?? 'application/json',
      params: params
    });

    const response = request.pipe(map((response: any) => response?.dados),
      catchError((error: any) => {
        console.error('Ocorreu um erro:', error);
        this.ApiErrorMessage(error.error.mensagens);

        return throwError(() => error);
      })
    );

    return response;
  }

  private ApiErrorMessage(mensagens: any): void {
    mensagens.forEach((mensagem: any) => {
      if (mensagem.tipo == 400) {
        console.error('API error: ' + mensagem.descricao);
      }
    });
  }
}
