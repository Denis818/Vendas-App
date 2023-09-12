import { Injectable } from '@angular/core';
import { BaseService } from './base/BaseService.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CadastroUserService extends BaseService {

constructor(http: HttpClient) {
  super(http);
}

public registraUsuario(dados: string): void {
this.SendHttpRequest('POST', 'https://localhost:7109/User/register', dados)
}


}
