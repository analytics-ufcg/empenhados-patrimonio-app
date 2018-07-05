import { Component, OnInit, ViewChild } from '@angular/core';
import { ScatterplotPatrimonioComponent } from '../scatterplot-patrimonio/scatterplot-patrimonio.component';
import { ResumoCandidatoComponent } from '../resumo-candidato/resumo-candidato.component';
import { FactSheetComponent } from '../fact-sheet/fact-sheet.component';
import { JoyplotEstadosComponent } from '../joyplot-estados/joyplot-estados.component';
import { AboutComponent } from '../about/about.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild(ScatterplotPatrimonioComponent) private scatterplotPatrimonio: ScatterplotPatrimonioComponent;
  @ViewChild(ResumoCandidatoComponent) private resumoCandidato: ResumoCandidatoComponent;
  @ViewChild(FactSheetComponent) private factSheet: FactSheetComponent;

  novaVisualizacao: boolean;

  constructor() { }

  onRecebeEventoFiltro($event) {
    this.scatterplotPatrimonio.plotPatrimonio();
    this.novaVisualizacao = false;
  }

  onRecebeCliquePlot($event) {
    this.novaVisualizacao = true;
    this.resumoCandidato.texto();
    // this.factSheet.texto();
  }

}
