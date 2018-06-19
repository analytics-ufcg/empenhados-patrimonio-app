import { Component, OnInit } from '@angular/core';
import { FilterService } from '../services/filter.service';

@Component({
  selector: 'app-fact-sheet',
  templateUrl: './fact-sheet.component.html',
  styleUrls: ['./fact-sheet.component.css']
})
export class FactSheetComponent implements OnInit {

  public isCandidatoSelecionado = false; 
  private candidato : any;

  constructor(private filterService: FilterService) { }

  ngOnInit() {
  }

  texto(){
     this.filterService.candidatoSelecionado.subscribe(
      data => {
        this.candidato = data;
        this.isCandidatoSelecionado = true;     
      }, err => {
        console.log(err);
      }
    );     
   }
}
