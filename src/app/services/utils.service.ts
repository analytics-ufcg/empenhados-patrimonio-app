import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() { }

  public formataReais(numero) {
    var numero = numero.toFixed(2).split('.');
    numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
  }

}
