import { Component, OnInit } from '@angular/core';
import { FilterService } from '../services/filter.service';


@Component({
  selector: 'app-resumo-candidato',
  templateUrl: './resumo-candidato.component.html',
  styleUrls: ['./resumo-candidato.component.css']
})
export class ResumoCandidatoComponent implements OnInit {
  private candidato : any;
  public isCandidatoSelecionado = false; 

  constructor(private filterService: FilterService) { }

  ngOnInit() {
  }

  texto(){
   this.filterService.candidatoSelecionado.subscribe(data =>  this.candidato = data);
    this.isCandidatoSelecionado = true;
    console.log("Resumo atualizado");
  }

  numberToReal(numero) {
    var numero = numero.toFixed(2).split('.');
    numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
}


}
