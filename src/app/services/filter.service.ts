import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UtilsService } from './utils.service';

interface Patrimonio {
  patrimonio_eleicao_1: Number;
  patrimonio_eleicao_2: Number;
  nome_urna: String;
  unidade_eleitoral: String;
  cargo_pleiteado_1: String;
  cargo_pleiteado_2: String;
  ano_dois: Number;
  resultado_1: String;
}

@Injectable()
export class FilterService {

  private estadoSelecionado = new BehaviorSubject<string>("default message");
  estadoAtual = this.estadoSelecionado.asObservable();

  cargoSelecionado: String;
  anoDois: Number;
  situacao: String;
  dadosEstado: any;

  constructor(private utilsService: UtilsService) { }

  mudaEstado(novoEstado: string) {
    this.estadoSelecionado.next(novoEstado);
  }

  mudaCargo(novoCargo: String){
    this.cargoSelecionado = novoCargo;
  }

  mudaAno(novoAno: Number){    
    this.anoDois = Number(novoAno);    
  }

  mudaSituacao(novaSituacao: String){
    this.situacao = novaSituacao;
  }

  mudaDadosEstado(estado: String){
    let dadosBD;        
    this.utilsService.recuperaPatrimoniosEstado(estado).subscribe(
      data => {
        dadosBD = data;
        this.dadosEstado = this.parseData(dadosBD);
      }, err => {
        console.log(err);
      }
    );
  }

  private parseData(data: any[]): Patrimonio[] {
    return data.map(v => <Patrimonio>{patrimonio_eleicao_1: v.patrimonio_eleicao_1, patrimonio_eleicao_2: v.patrimonio_eleicao_2, 
      nome_urna: v.nome_urna, unidade_eleitoral: v.unidade_eleitoral, cargo_pleiteado_1: v.cargo_pleiteado_1, 
      cargo_pleiteado_2: v.cargo_pleiteado_2, ano_dois: v.ano_dois, resultado_1: v.resultado_1});
  }

}
