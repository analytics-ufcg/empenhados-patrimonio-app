import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() { }

  public formataReais(numero) {
    var numero = numero.toFixed(2).split('.');
    numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
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

}
