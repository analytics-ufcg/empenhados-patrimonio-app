import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { FilterService } from '../services/filter.service';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  
  public listaEstados: any;
  public listaCargos: any;
  public listaMunicipios: any;
  public estadoSelecionado = '';

  public controlMunicipio: FormControl = new FormControl();
  public filteredOptions: Observable<string[]>;

  constructor(private utilsService: UtilsService, 
              private filterService: FilterService) {
    this.listaMunicipios = [];
  }

  ngOnInit() {

    this.filteredOptions = this.controlMunicipio.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );

    this.recuperaEstados();
    this.recuperaCargos();
  }
  
  // Altera a lista de municipios a partir de um estado selecionado
  onChange(novoEstado) {
    this.estadoSelecionado = novoEstado;
    this.filterService.mudaEstado(novoEstado);
    
    this.utilsService.recuperaMunicipios(this.estadoSelecionado).subscribe(
      data => {
        let municipios = data;
        this.listaMunicipios = this.jsonToArray(municipios);
      }, err => {
        console.log(err);
      }
    );
  }

  filter(val: string): string[] {
    return this.listaMunicipios.filter(mun =>
    mun.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  private recuperaEstados(){
    // Recupera lista de estados
    this.utilsService.recuperaEstados().subscribe(
      data => {
        this.listaEstados = data;
      }, err => {
        console.log(err);
      }
    );
  }

  private recuperaCargos(){
    // Recupera lista de cargos
    this.utilsService.recuperaCargos().subscribe(
      data => {
        this.listaCargos = data;
      }, err => {
        console.log(err);
      }
    );
  }

  private jsonToArray(data){
    let result = [];
    let i;
    for (i in data) {
      result.push(data[i].unidade_eleitoral);
    }
    return result;
  }

}
