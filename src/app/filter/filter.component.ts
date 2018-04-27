import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  
  public lista_estados: any;

  constructor(private utilsService: UtilsService) { }

  ngOnInit() {

    this.utilsService.recuperaEstados().subscribe(
      data => {
        this.lista_estados = data;
      }, err => {
        console.log(err);
      }
    );
  }
}
