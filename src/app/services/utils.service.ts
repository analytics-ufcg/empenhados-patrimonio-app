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

  public recuperaCargos() {
    return this.http.get(this.serverHost + '/patrimonio/busca/cargos', {
      headers: this.headers
    });
  }

  public recuperaMunicipios(estado) {
    return this.http.get(this.serverHost + '/patrimonio/municipios/' + estado, {
      headers: this.headers
    });
  }

  public recuperaPatrimonios(estado, ano, cargo){
    return this.http.get(this.serverHost + '/patrimonio/' + estado + "/" + ano + "/" + cargo, {
      headers: this.headers
    });
  }

  public recuperaPatrimoniosEstado(estado){
    return this.http.get(this.serverHost + '/patrimonio/' + estado, {
      headers: this.headers
    });
  }

}
