import { Component, ViewChild } from "@angular/core";
import { MatTableDataSource, MatSort, MatPaginator } from "@angular/material";

import { DataService } from "../services/data.service";
import { UtilsService } from "../services/utils.service";

@Component({
  selector: "app-top-10",
  templateUrl: "./top-10.component.html",
  styleUrls: ["./top-10.component.css"]
})
export class Top10Component {
  public displayedColumns: string[] = ["nome_urna", "unidade_eleitoral", "dif-abs"];
  public dataSource: any;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(
    private dataService: DataService,
    private utilsService: UtilsService
  ) { }

  ranking() {
    this.dataService.dadosPatrimonio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);      
      this.dataSource.paginator = this.paginator;

      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'dif-abs': return (item.patrimonio_eleicao_2 - item.patrimonio_eleicao_1); // retorna a diferença de patrimônios
          case 'nome_urna': return (item[property].normalize('NFD').replace(/[\u0300-\u036f]/g, "")); // remove acentos
          case 'unidade_eleitoral': return (item[property].normalize('NFD').replace(/[\u0300-\u036f]/g, "")); // remove acentos
          default: return item[property];
        }
      };

      this.dataSource.sort = this.sort;
    });
  }

  calculaRazao(numero1, numero2) {
    return (Math.max(numero1, numero2) / Math.min(numero1, numero2))
      .toFixed(2)
      .split(".");
  }
}
