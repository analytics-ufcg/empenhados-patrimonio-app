import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class FilterService {

  private estado_selecionado = new BehaviorSubject<string>("default message");
  estado_atual = this.estado_selecionado.asObservable();

  constructor() { }

  mudaEstado(novoEstado: string) {
    this.estado_selecionado.next(novoEstado)
  }

}
