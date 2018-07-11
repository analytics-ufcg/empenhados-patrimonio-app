import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
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
  private ano : any;

  constructor(private dataService: DataService,
              private utilsService: UtilsService) { }

  ngOnInit() {
  }

  async texto(){
    await this.dataService.candidatoSelecionado.subscribe(
      data => {
        this.candidato = data;        
      }, err => {
        console.log(err);
      }
    );     
    await this.dataService.mudaInfoCandidato(this.candidato.ano_um+4, this.candidato.cpf);
    await this.dataService.mudaDadosEleicao(this.candidato.ano_um+4, this.candidato.unidade_eleitoral, this.candidato.cargo_pleiteado_2, this.candidato.cpf);

    this.dataService.infoCandidatoSelecionado.subscribe(
      data => {
        this.infoCandidato = data[0];
        if (this.infoCandidato === undefined) {
          this.isCandidatoSelecionado = false;
        } else {
          this.isCandidatoSelecionado = true;
        }        
      }, err => {
        console.log(err);
      }
    );

    this.dataService.infoEleicao.subscribe(
      data => {
        this.dadosEleicao = data[0];                
      }, err => {
        console.log(err);
      }
    );

    this.ano = this.dataService.getAno();
  }

  numberToReal(numero) {
    return this.utilsService.formataReais(numero);    
  }

  defineIdade(dataNascimento) {    
    let idade = this.utilsService.calculaIdade(dataNascimento);    

    if (isNaN(idade)) return "";    
    return " - " + idade + " anos";
  }

  formataCargo(cargo) {
    if (cargo == this.dataService.getTodosCargos()) {
      return cargo;
    }

    return this.utilsService.toTitleCase(cargo);
  }

}
