import { Component, OnInit } from '@angular/core';
import { FilterService } from '../services/filter.service';


@Component({
  selector: 'app-resumo-candidato',
  templateUrl: './resumo-candidato.component.html',
  styleUrls: ['./resumo-candidato.component.css']
})
export class ResumoCandidatoComponent implements OnInit {
  private data : any;
  private candidato : any;
  private candidatoSelecionado = false; 

  constructor(private filterService: FilterService) { }

  ngOnInit() {
  }

  texto(){
    this.filterService.dadosPatrimonio.subscribe(data => this.data = data)
    this.candidato = this.data[0];
    this.candidatoSelecionado = true;
    console.log("Resumo atualizado");

  }

}
