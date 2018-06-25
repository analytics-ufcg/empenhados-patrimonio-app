import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-resumo-candidato',
  templateUrl: './resumo-candidato.component.html',
  styleUrls: ['./resumo-candidato.component.css']
})
export class ResumoCandidatoComponent implements OnInit {
  private candidato : any;
  public situacaoCrescimento: String;
  public isCandidatoSelecionado = false; 

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  texto(){
   this.dataService.candidatoSelecionado.subscribe(data =>  this.candidato = data);
    this.isCandidatoSelecionado = true;
    this.determinaCrescimento(this.candidato.patrimonio_eleicao_1, this.candidato.patrimonio_eleicao_2);
  }

  numberToReal(numero) {
    var numero = numero.toFixed(2).split('.');
    numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
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
    let razao = this.calculaRazao(numero1, numero2);
    if (numero1 > numero2) {
      this.situacaoCrescimento = "é "+ razao + " vezes menor";
    } else if (numero1 < numero2) {
      this.situacaoCrescimento = "é "+ razao + " vezes maior";
    } else {
      this.situacaoCrescimento = "permaneceu o mesmo"
    }
  }

}
