import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import { UtilsService } from './utils.service';

interface Patrimonio {
  patrimonio_eleicao_1: Number;
  patrimonio_eleicao_2: Number;
  nome_urna: String;
  unidade_eleitoral: String;
  cargo_pleiteado_1: String;
  cargo_pleiteado_2: String;
  ano_um: Number;
  resultado_1: String;
  resultado_2: String;
}

const TODOS_CONSULTA = "todos";
const TODOS_CARGOS = "qualquer cargo";
const TODOS_ESTADOS = "qualquer estado";

@Injectable()
export class FilterService {

  private estadoSelecionado: String;
  private cargoSelecionado: String;
  private anoUm: Number;
  private situacao: String;

  private _dadosPatrimonio = new BehaviorSubject<Patrimonio[]>(undefined);
  public dadosPatrimonio = this._dadosPatrimonio.asObservable();

  constructor(private utilsService: UtilsService) { }

  mudaEstado(novoEstado: string) {
    this.estadoSelecionado = novoEstado;
  }

  mudaCargo(novoCargo: String){
    this.cargoSelecionado = novoCargo;
  }

  mudaAno(novoAno: Number){    
    this.anoUm = Number(novoAno);    
  }

  mudaSituacao(novaSituacao: String){
    this.situacao = novaSituacao;
  }

  async mudaDados(estado: String, ano: Number, cargo: String, situacao: String, municipio: String){
    let dadosBD;
    
    if (cargo === TODOS_CARGOS) {
      cargo = TODOS_CONSULTA;
    }

    if (estado === TODOS_ESTADOS) {
      estado = TODOS_CONSULTA;
    }
         
    return new Promise((resolve, reject) =>
      this.utilsService.recuperaPatrimonios(estado, ano, cargo, situacao, municipio).subscribe(
        data => {
          dadosBD = data;
          this._dadosPatrimonio.next(this.parseData(dadosBD));
          return resolve("Dados alterados");
        }, err => {
          console.log(err);
          return reject(err);
        }
      )
    );
  }

  private parseData(data: any[]): Patrimonio[] {
    return data.map(v => <Patrimonio>{patrimonio_eleicao_1: v.patrimonio_eleicao_1, patrimonio_eleicao_2: v.patrimonio_eleicao_2, 
      nome_urna: v.nome_urna, unidade_eleitoral: v.unidade_eleitoral, cargo_pleiteado_1: v.cargo_pleiteado_1, 
      cargo_pleiteado_2: v.cargo_pleiteado_2, ano_um: v.ano_um, resultado_1: v.resultado_1, resultado_2: v.resultado_2});
  }

  public getTodos (){
    return TODOS_CONSULTA;
  }

  public getTodosCargos() {
    return TODOS_CARGOS;
  }

  public getTodosEstados() {
    return TODOS_ESTADOS;
  }

  public getEstado() {
    return this.estadoSelecionado;
  }

  public getAno() {
    return this.anoUm;
  }

  public getSituacao() {
    return this.situacao;
  }

  public getCargo() {
    return this.cargoSelecionado;
  }

}
