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

  public recuperaPatrimonios(estado, ano, cargo, situacao, municipio){

    if (municipio === undefined || municipio === '') {
      return this.http.get(this.serverHost + '/patrimonio/' + estado + "/" + ano + "/" + cargo + "/" + situacao, {
        headers: this.headers
      });
    } else {
      return this.http.get(this.serverHost + '/patrimonio/' + estado + "/" + ano + "/" + cargo + "/" + situacao + "/" + municipio, {
        headers: this.headers
      });
    }    
  }

  public recuperaSituacoes(){
    return this.http.get(this.serverHost + '/patrimonio/busca/situacao', {
      headers: this.headers
    });
  }

}
