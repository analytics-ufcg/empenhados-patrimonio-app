import { Component, ViewChild } from '@angular/core';
import { ScatterplotPatrimonioComponent }  from './scatterplot-patrimonio/scatterplot-patrimonio.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(ScatterplotPatrimonioComponent) private scatterplotPatrimonio: ScatterplotPatrimonioComponent;
  
  title = 'Patrimônios app'; 

  onRecebeEventoFiltro($event) {
    this.scatterplotPatrimonio.plotPatrimonio();
  }
}

export class matToolbarRow {}
