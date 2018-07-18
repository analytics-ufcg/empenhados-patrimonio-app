import { Injectable } from '@angular/core';

@Injectable()
export class CandidatoService {

  private codigosEleicoesTse = [
    {ano: 2008, codigo: 14422},
    {ano: 2010, codigo: 14417},
    {ano: 2012, codigo: 1699},
    {ano: 2014, codigo: 680},
    {ano: 2016, codigo: 2}
  ]

  private TseUrl:String

  constructor() { 
    this.TseUrl = "http://divulgacandcontas.tse.jus.br/divulga/#/candidato/"
  }

  findCodigoTSE = (ano) => {
    let codigoTse = this.codigosEleicoesTse.filter(
      (codigoTse) => {
        if(codigoTse.ano === ano){
          return codigoTse.codigo;
        }
      }
    )[0];

    if(codigoTse) return codigoTse.codigo;
    return "";
  }

  public getListaBensURL(ano, codUnidadeEleitoral, sequencialCandidato) {
    let listaBensURL;
    let codEleicao = this.findCodigoTSE(ano)

    listaBensURL = this.TseUrl + ano + "/" + codEleicao + "/" + codUnidadeEleitoral + "/" + sequencialCandidato + "/bens"; 
    
    return listaBensURL;
  }

}