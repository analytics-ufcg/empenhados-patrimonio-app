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
    this.filterService.infoCandidatoSelecionado.subscribe(
      data => {
        this.infoCandidato = data[0];
        this.isCandidatoSelecionado = true;
      }, err => {
        console.log(err);
      }
    );
  }
}
