import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() { }

  public formataReais(numero) {
    var numero = numero.toFixed(2).split('.');
    let moeda = "R$ ";
    let parteInteira = numero[0];
    let parteDecimal = numero[1];

    parteInteira = numero[0].split(/(?=(?:...)*$)/);
    if(parteInteira[0] === "-"){
      parteInteira = parteInteira[0] + parteInteira.slice(1).join('.');
    } else{
      parteInteira = parteInteira.join('.');
    }

    return moeda + parteInteira + ',' + parteDecimal;
  }

  public toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  public strToDate(data) {
    const [day, month, year] = data.split("/");
    return new Date(year, month - 1, day);
  }

  public calculaIdade(dataNascimento) {
    var date = this.strToDate(dataNascimento);
    var ageDifMs = Date.now() - date.getTime();
    var ageDate = new Date(ageDifMs);
    
    return Math.abs(ageDate.getUTCFullYear() - 1970); 
  }

  public abreviaPatrimonio(textoPatrimonio){
    let patrimonio = textoPatrimonio.slice(3);

    let parteInteira = patrimonio.split(',')[0];
    let ordens = parteInteira.split('.');

    let abreviatura;

    if(ordens.length == 1){
      return textoPatrimonio;
    }
    else if(ordens.length == 2){
      abreviatura = "mil"
    }else if(ordens.length == 3){
      if(ordens[0] == "1"){
        abreviatura = "milhão";
      }else{
        abreviatura = "milhões";
      }
    }else if(ordens.length == 4){
      if(ordens[0] == "1"){
        abreviatura = "bilhão";
      }else{
        abreviatura = "bilhões";
      }
    }

    let patrimonioAbreviado = "R$ " + ordens[0] + " " + abreviatura;

    return patrimonioAbreviado;


  }

}
