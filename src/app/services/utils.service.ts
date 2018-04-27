import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './global.service';

@Injectable()
export class UtilsService {
  
  private headers : HttpHeaders;
  private serverHost : String;

  constructor(private http: HttpClient,    
              private globalService: GlobalService) { 
    
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.serverHost = globalService.getServerHost();
  }

  public recuperaEstados() {
    return this.http.get(this.serverHost + '/patrimonio/busca/estados', {
      headers: this.headers
    });
  }

}
