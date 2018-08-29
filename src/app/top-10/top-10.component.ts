import { Component, ViewChild } from "@angular/core";
import { MatTableDataSource, MatSort, MatPaginator } from "@angular/material";
import { ViewEncapsulation } from "@angular/core";

import { DataService } from "../services/data.service";
import { UtilsService } from "../services/utils.service";

@Component({
  selector: "app-top-10",
  templateUrl: "./top-10.component.html",
  styleUrls: ["./top-10.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class Top10Component {
  public displayedColumns: string[] = [
    "nome_urna",
    "unidade_eleitoral",
    "dif-abs"
  ];
  public dataSource: any;

  @ViewChild(MatSort)
  sort: MatSort;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(
    private dataService: DataService,
    private utilsService: UtilsService
  ) {}

  ranking() {
    this.dataService.dadosPatrimonio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.translatePaginator(this.paginator);

      this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
      this.dataSource.sortData = this.sortData;

      this.dataSource.sort = this.sort;
    });
  }

  translatePaginator(p: MatPaginator) {
    p._intl.firstPageLabel = "Primeira página";
    p._intl.lastPageLabel = "Última página";
    p._intl.nextPageLabel = "Próxima";
    p._intl.previousPageLabel = "Anterior";

    return p;
  }

  // Sobrescrevendo método de acesso aos dados do angular-material
  sortingDataAccessor = (item, property) => {
    switch (property) {
      case "dif-abs":
        return item.patrimonio_eleicao_2 - item.patrimonio_eleicao_1; // retorna a diferença de patrimônios
      case "nome_urna":
        return item[property].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove acentos
      case "unidade_eleitoral":
        return item[property].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove acentos
      default:
        return item[property];
    }
  };

  // Sobrescrevendo função de ordenação do angular material.
  // TODO: ao atualizar a versão do angular-material esta sobrescrita de função não será mais necessária.
  sortData = (data: any[], sort: MatSort): any[] => {
    const active = sort.active;
    const direction = sort.direction;
    if (!active || direction == "") {
      return data;
    }

    return data.sort((a, b) => {
      let valueA = this.sortingDataAccessor(a, active);
      let valueB = this.sortingDataAccessor(b, active);

      // If both valueA and valueB exist (truthy), then compare the two. Otherwise, check if
      // one value exists while the other doesn't. In this case, existing value should come first.
      // This avoids inconsistent results when comparing values to undefined/null.
      // If neither value exists, return 0 (equal).
      let comparatorResult = 0;
      if (valueA != null && valueB != null) {
        // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
        if (valueA > valueB) {
          comparatorResult = 1;
        } else if (valueA < valueB) {
          comparatorResult = -1;
        }
      } else if (valueA != null) {
        comparatorResult = 1;
      } else if (valueB != null) {
        comparatorResult = -1;
      }

      return comparatorResult * (direction == "asc" ? 1 : -1);
    });
  };

  calculaRazao(numero1, numero2) {
    return (Math.max(numero1, numero2) / Math.min(numero1, numero2))
      .toFixed(2)
      .split(".");
  }
}
