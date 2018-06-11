import { Component, OnInit } from '@angular/core';
import { FilterService } from '../services/filter.service';


@Component({
  selector: 'app-resumo-candidato',
  templateUrl: './resumo-candidato.component.html',
  styleUrls: ['./resumo-candidato.component.css']
})
export class ResumoCandidatoComponent implements OnInit {
  private candidato : any;
  private isCandidatoSelecionado = false; 

  constructor(private filterService: FilterService) { }

  ngOnInit() {
  }

  texto(){
   this.filterService.candidatoSelecionado.subscribe(data =>  this.candidato = data);
    this.isCandidatoSelecionado = true;
    console.log("Resumo atualizado");
  }

}
