import { Component, ViewChild, Inject } from '@angular/core';
import { ScatterplotPatrimonioComponent } from './scatterplot-patrimonio/scatterplot-patrimonio.component';
import { ResumoCandidatoComponent } from './resumo-candidato/resumo-candidato.component';
import { FactSheetComponent } from './fact-sheet/fact-sheet.component';
import { JoyplotEstadosComponent } from './joyplot-estados/joyplot-estados.component';
import { AboutComponent } from './about/about.component';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(ScatterplotPatrimonioComponent) private scatterplotPatrimonio: ScatterplotPatrimonioComponent;
  @ViewChild(ResumoCandidatoComponent) private resumoCandidato: ResumoCandidatoComponent;
  @ViewChild(FactSheetComponent) private factSheet: FactSheetComponent;

  novaVisualizacao: boolean;
  title = 'Patrimônios app';

  constructor(public dialog: MatDialog) { }


  onRecebeEventoFiltro($event) {
    this.scatterplotPatrimonio.plotPatrimonio();
    this.novaVisualizacao = false;
  }

  onRecebeCliquePlot($event) {
    this.novaVisualizacao = true;
    this.resumoCandidato.texto();
    // this.factSheet.texto();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AboutComponent, {
      width: '80%',
      height: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

export class matToolbarRow { }

