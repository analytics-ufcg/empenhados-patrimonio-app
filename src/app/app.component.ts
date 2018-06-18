import { Component, ViewChild } from '@angular/core';
import { ScatterplotPatrimonioComponent }  from './scatterplot-patrimonio/scatterplot-patrimonio.component';
import { ResumoCandidatoComponent }  from './resumo-candidato/resumo-candidato.component';
import { JoyplotEstadosComponent} from './joyplot-estados/joyplot-estados.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(ScatterplotPatrimonioComponent) private scatterplotPatrimonio: ScatterplotPatrimonioComponent;
  @ViewChild(ResumoCandidatoComponent) private resumoCandidato: ResumoCandidatoComponent;
  @ViewChild(JoyplotEstadosComponent) private joyplotEstados: JoyplotEstadosComponent;
  
  title = 'Patrimônios app'; 

  onRecebeEventoFiltro($event) {
    this.scatterplotPatrimonio.plotPatrimonio();
    this.joyplotEstados.plotJoyplot();

  }

  onRecebeCliquePlot($event) {
    this.resumoCandidato.texto();
  }
}

export class matToolbarRow {}
