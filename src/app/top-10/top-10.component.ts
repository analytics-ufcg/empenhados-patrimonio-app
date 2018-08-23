import { Component, ViewChild } from "@angular/core";
import { MatTableDataSource, MatSort, MatPaginator } from "@angular/material";

import { DataService } from "../services/data.service";
import { UtilsService } from "../services/utils.service";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: "app-top-10",
  templateUrl: "./top-10.component.html",
  styleUrls: ["./top-10.component.css"]
})
export class Top10Component {
  public displayedColumns: string[] = ["nome", "unid-eleitoral", "dif-abs"];
  public dataSource: any;

  public data;

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(
    private dataService: DataService,
    private utilsService: UtilsService
  ) {}

  ngAfterViewInit() {
    this.ranking();
  }

  ranking() {
    this.dataService.dadosPatrimonio.subscribe(data => (this.data = data));
    this.dataSource = new MatTableDataSource(this.data);

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  calculaRazao(numero1, numero2) {
    return (Math.max(numero1, numero2) / Math.min(numero1, numero2))
      .toFixed(2)
      .split(".");
  }
}
