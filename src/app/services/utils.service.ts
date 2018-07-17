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

    let abreviaturaBilhões = (ord) => 
      (ord[0] == "000") ? "" : (ord[0] == "1") ? removeZerosIniciais(ord[0]) + " bilhão" : removeZerosIniciais(ord[0]) + " bilhões";
    let abreviaturaMilhoes = (ord) => 
      (ord[0] == "000") ? "" : (ord[0] == "1") ? removeZerosIniciais(ord[0]) + " milhão" : removeZerosIniciais(ord[0]) + " milhões";
    let abreviaturaMilhares = (ord) => 
      (ord[0] == "000") ? "" : removeZerosIniciais(ord[0]) + " mil";

    let patrimonio = textoPatrimonio.slice(3);

    let parteInteira = patrimonio.split(',')[0];
    let ordens = parteInteira.split('.');

    let abreviatura;

    if(ordens.length <= 2){
      abreviatura = abreviaturaMilhares(ordens);
    }else if(ordens.length == 3){
      const mi = abreviaturaMilhoes(ordens);
      const mil = abreviaturaMilhares(ordens.slice(1));

      abreviatura = (mi + (mi && mil? " e ": "") + mil);
    }else if(ordens.length == 4){
      const bi = abreviaturaBilhões(ordens);
      const mi = abreviaturaMilhoes(ordens.slice(1));
      const mil = abreviaturaMilhares(ordens.slice(2));

      abreviatura = (bi + (bi && mi? ", ": "") + mi + (mi || mil? " e ": "") + mil);
    }

    return "R$ " + abreviatura;
  }

}
