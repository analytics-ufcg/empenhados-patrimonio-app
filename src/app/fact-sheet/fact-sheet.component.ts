import { Component, OnInit } from '@angular/core';
import { FilterService } from '../services/filter.service';
import { UtilsService } from '../services/utils.service';


@Component({
  selector: 'app-fact-sheet',
  templateUrl: './fact-sheet.component.html',
  styleUrls: ['./fact-sheet.component.css']
})
export class FactSheetComponent implements OnInit {

  public isCandidatoSelecionado = false; 
  private candidato : any;
  private infoCandidato : any;
  private dadosEleicao : any;

  constructor(private filterService: FilterService,
              private utilsService: UtilsService) { }

  ngOnInit() {
  }

  async texto(){
    await this.filterService.candidatoSelecionado.subscribe(
      data => {
        this.candidato = data;        
      }, err => {
        console.log(err);
      }
    );     
    await this.filterService.mudaInfoCandidato(this.candidato.ano_um+4, this.candidato.cpf);
    await this.filterService.mudaDadosEleicao(this.candidato.ano_um+4, this.candidato.unidade_eleitoral, this.candidato.cargo_pleiteado_2);

    this.filterService.infoCandidatoSelecionado.subscribe(
      data => {
        this.infoCandidato = data[0];
        this.isCandidatoSelecionado = true;
      }, err => {
        console.log(err);
      }
    );

    this.filterService.infoEleicao.subscribe(
      data => {
        this.dadosEleicao = data[0];        
      }, err => {
        console.log(err);
      }
    );
  }

  numberToReal(numero) {
    var numero = numero.toFixed(2).split('.');
    numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
  }
}
