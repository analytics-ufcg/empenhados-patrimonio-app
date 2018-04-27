import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  
  estados = [
    {value: 'PB', viewValue: 'Paraíba'},
    {value: 'PE', viewValue: 'Pernambuco'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
