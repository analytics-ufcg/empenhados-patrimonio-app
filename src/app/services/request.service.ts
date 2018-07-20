import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './global.service';

@Injectable()
export class RequestService {

  private headers: HttpHeaders;
  private serverHost: String;

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

  public recuperaPatrimonios(estado, ano, cargo, situacao, municipio) {

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

  public recuperaSituacoes() {
    return this.http.get(this.serverHost + '/patrimonio/busca/situacao', {
      headers: this.headers
    });
  }

  public recuperaInfoCandidato(ano, cpfCandidato) {
    return this.http.get(this.serverHost + '/candidato/' + ano + '/' + cpfCandidato, {
      headers: this.headers
    });
  }

  public recuperaInfoEleicao(ano, unidadeEleitoral, cargo, cpfCandidato) {
    return this.http.get(this.serverHost + '/eleicao/' + ano + '/' + unidadeEleitoral + '/' + cargo + '/' + cpfCandidato, {
      headers: this.headers
    });
  }

  public recuperaAnos(cargo) {
    return this.http.get(this.serverHost + '/patrimonio/busca/ano/' + cargo, {
      headers: this.headers
    });
  }

  public recuperaIDH(cdUnidadeEleitoral) {
    return this.http.get(this.serverHost + '/unidadeEleitoral/' + cdUnidadeEleitoral, {
      headers: this.headers
    });
  }

}
