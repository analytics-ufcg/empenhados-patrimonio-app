import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { UtilsService } from '../services/utils.service';
import { CandidatoService } from '../services/candidato.service';

@Component({
  selector: 'app-resumo-candidato',
  templateUrl: './resumo-candidato.component.html',
  styleUrls: ['./resumo-candidato.component.css']
})
export class ResumoCandidatoComponent implements OnInit {
  private candidato : any;
  public situacaoCrescimento: String;
  public isCandidatoSelecionado = false;
  public razao : any;
  public crescimentoPatrimonio = false;
  public reducaoPatrimonio = false;
  public patrimonioEstavel = false;
  public urlBens1;
  public urlBens2;

  constructor(private dataService: DataService,
              private utilsService: UtilsService,
              private candidatoService: CandidatoService) { }

  ngOnInit() {
  }

  texto(){
    this.dataService.candidatoSelecionado.subscribe(data =>  this.candidato = data);
    this.isCandidatoSelecionado = true;
    this.determinaCrescimento(this.candidato.patrimonio_eleicao_1, this.candidato.patrimonio_eleicao_2);    
    this.urlBens1 = this.candidatoService.getListaBensURL(2012, 19810, 150000011795);
    this.urlBens2 = this.candidatoService.getListaBensURL(2016, 19810, 150000003052);
  }

  numberToReal(numero) {
    return this.utilsService.formataReais(numero);
  }

  formataSituacao(cargo) {
    if (cargo === "ELEITO") {
      return "elegeu";
    } else {
      return "candidatou";
    }
  }

  calculaRazao(numero1, numero2) {    
    return (Math.max(numero1, numero2)/Math.min(numero1, numero2)).toFixed(2).split('.');
  }

  determinaCrescimento(numero1, numero2) {
     this.razao = this.calculaRazao(numero1, numero2);
     this.patrimonioEstavel = numero1 == numero2;
     this.crescimentoPatrimonio = numero1 < numero2;
     this.reducaoPatrimonio = numero1 > numero2;

    if (this.crescimentoPatrimonio) {
      this.situacaoCrescimento = "é "+ this.razao + " vezes maior";
    } else if (this.reducaoPatrimonio) {
      this.situacaoCrescimento = "é "+ this.razao + " vezes menor";
    } else {
      this.situacaoCrescimento = "permaneceu o mesmo"
    }
  }

  formataCargo(cargo) {
    if (cargo == this.dataService.getTodosCargos()) {
      return cargo;
    }

    return this.utilsService.toTitleCase(cargo);

  }

}
