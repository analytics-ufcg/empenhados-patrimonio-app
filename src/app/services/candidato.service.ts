import { Injectable } from "@angular/core";

const CARGOS_MUNICIPAIS = ["PREFEITO", "VEREADOR", "VICE-PREFEITO"];

@Injectable()
export class CandidatoService {
  private codigosEleicoesTse = [
    { ano: 2008, codigo: "14422" },
    { ano: 2010, codigo: "14417" },
    { ano: 2012, codigo: "1699" },
    { ano: 2014, codigo: "680" },
    { ano: 2016, codigo: "2" },
    { ano: 2018, codigo: "2022802018"}
  ];

  private TseUrl: String;
  private TseFotoURL: String;

  constructor() {
    this.TseUrl = "http://divulgacandcontas.tse.jus.br/divulga/#/candidato/";
    this.TseFotoURL =
      "http://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/buscar/foto/";
  }

  findCodigoTSE = ano => {
    let codigoTse = this.codigosEleicoesTse.filter(codigoTse => {
      if (codigoTse.ano === ano) {
        return codigoTse.codigo;
      }
    })[0];

    if (codigoTse) return codigoTse.codigo;
    return "";
  };

  public getListaBensURL(ano, codUnidadeEleitoral, sequencialCandidato) {
    let listaBensURL;
    let codEleicao = this.findCodigoTSE(ano);

    listaBensURL =
      this.TseUrl +
      ano +
      "/" +
      codEleicao +
      "/" +
      codUnidadeEleitoral +
      "/" +
      sequencialCandidato +
      "/bens";

    return listaBensURL;
  }
  public getFotoCandidatoURL(ano, codUnidadeEleitoral, sequencialCandidato) {
    let fotoURL;
    let codEleicao = this.findCodigoTSE(ano);    

    fotoURL =
      this.TseFotoURL +
      codEleicao +
      "/" +
      sequencialCandidato +
      "/" +
      codUnidadeEleitoral;    

    return fotoURL;
  }
}
