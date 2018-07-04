import { Component, ViewChild } from '@angular/core';
import { ScatterplotPatrimonioComponent }  from './scatterplot-patrimonio/scatterplot-patrimonio.component';
import { ResumoCandidatoComponent }  from './resumo-candidato/resumo-candidato.component';
import { FactSheetComponent }  from './fact-sheet/fact-sheet.component';
import { JoyplotEstadosComponent } from './joyplot-estados/joyplot-estados.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(ScatterplotPatrimonioComponent) private scatterplotPatrimonio: ScatterplotPatrimonioComponent;
  @ViewChild(ResumoCandidatoComponent) private resumoCandidato: ResumoCandidatoComponent;
  @ViewChild(FactSheetComponent) private factSheet: FactSheetComponent;
  
  novaVisualizacao : boolean;
  title = 'Patrimônios app';


  onRecebeEventoFiltro($event) {
    this.scatterplotPatrimonio.plotPatrimonio();
    this.novaVisualizacao = false;
  }

  onRecebeEventoApagaPlot($event){
    this.scatterplotPatrimonio.apagaPlot();
  }

  onRecebeCliquePlot($event) {
    this.novaVisualizacao = true;
    this.resumoCandidato.texto();
    // this.factSheet.texto();
  }
}

export class matToolbarRow {}
