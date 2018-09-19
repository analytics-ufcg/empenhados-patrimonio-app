import { Component, OnInit, ViewChild } from "@angular/core";
import { ScatterplotPatrimonioComponent } from "../scatterplot-patrimonio/scatterplot-patrimonio.component";
import { ResumoCandidatoComponent } from "../resumo-candidato/resumo-candidato.component";
import { FactSheetComponent } from "../fact-sheet/fact-sheet.component";
import { JoyplotEstadosComponent } from "../joyplot-estados/joyplot-estados.component";
import { AboutComponent } from "../about/about.component";
import { Top10Component } from "../top-10/top-10.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  @ViewChild(ScatterplotPatrimonioComponent)
  private scatterplotPatrimonio: ScatterplotPatrimonioComponent;
  @ViewChild(ResumoCandidatoComponent)
  private resumoCandidato: ResumoCandidatoComponent;
  @ViewChild(FactSheetComponent)
  private factSheet: FactSheetComponent;
  @ViewChild(Top10Component)
  private top10: Top10Component;

  novaVisualizacao: boolean;
  panelOpenState: boolean = true;

  constructor() {}

  ngOnInit() {}

  onRecebeEventoFiltro($event) {
    this.scatterplotPatrimonio.plotPatrimonio();
    this.novaVisualizacao = false;

    this.top10.ranking();
    this.panelOpenState = true;

    this.scatterplotPatrimonio.deleteCPFfromURL();
  }

  onRecebeCliquePlot($event) {
    this.novaVisualizacao = true;
    this.resumoCandidato.texto();
    this.factSheet.texto();

    this.panelOpenState = false;
  }

  onRecebeCliqueTop10($event){
    this.scatterplotPatrimonio.getCPFfromURL();
  }
}
