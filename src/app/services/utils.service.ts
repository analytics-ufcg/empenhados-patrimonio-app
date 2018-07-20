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
    let removeZerosIniciais = (num) => num[0] != "0" ? num.slice(0): removeZerosIniciais(num.slice(1));

    let abreviaOrdens = (ord) => 
      (ord[1][0] != "0") ? removeZerosIniciais(ord[0]) + "," + ord[1][0]: removeZerosIniciais(ord[0]);

    let patrimonio = textoPatrimonio.slice(3);

    let parteInteira = patrimonio.split(',')[0];
    let ordens = parteInteira.split('.');

    let abreviatura;

    if (ordens.length == 1){
      abreviatura = textoPatrimonio.slice(2);
    }else{
      abreviatura = abreviaOrdens(ordens);

      if(ordens.length == 2){
        abreviatura += " mil";
      }else if(ordens.length == 3){
        abreviatura += " milhões";
      }else if(ordens.length == 4){
        abreviatura += " bilhões";
      }
    }

    return "R$ " + abreviatura;
  }

}
