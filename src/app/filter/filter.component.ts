import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { FilterService } from '../services/filter.service';
import { ConsoleReporter } from 'jasmine';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  
  public listaEstados: any;
  public listaCargos: any;
  public listaMunicipios: any;
  public listaSituacoes: any;

  public listaAnos = [
    {ano: '2016'},
    {ano: '2014'},
    {ano: '2012'}
  ];

  public estadoSelecionado = '';
  public cargoSelecionado = '';
  public municipioSelecionado = '';
  public anoSelecionado = '';
  public situacaoSelecionada = '';
  public isVereador;

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
    this.recuperaSituacoes();
  }
  
  /* Atualiza dados de patrimônio e o estado atual
  Altera a lista de municipios a partir de um estado selecionado */
  onChangeEstado(novoEstado) {
    this.estadoSelecionado = novoEstado;
    this.filterService.mudaEstado(novoEstado);
    this.filterService.mudaDadosEstado(novoEstado);
    this.utilsService.recuperaMunicipios(this.estadoSelecionado).subscribe(
      data => {
        let municipios = data;
        this.listaMunicipios = this.jsonToArray(municipios);
      }, err => {
        console.log(err);
      }
    );
  }

  // Atualiza cargo atual selecionado
  onChangeCargo(novoCargo) {
    this.cargoSelecionado = novoCargo;    
    this.filterService.mudaCargo(novoCargo);

    if (novoCargo === 'VEREADOR') {
      this.isVereador = true;
    } else {
      this.isVereador = false;
    }

  }

  onChangeMunicipio(novoMunicipio){
    this.municipioSelecionado = novoMunicipio;
  }

  onChangeAno(novoAno){
    this.anoSelecionado = novoAno;
    this.filterService.mudaAno(novoAno);
  }

  onChangeSituacao(novaSituacao){
    this.situacaoSelecionada = novaSituacao;
    this.filterService.mudaSituacao(novaSituacao);
  }

  // filtro para a pesquisa por muninicipio
  filter(val: string): string[] {
    return this.listaMunicipios.filter(mun =>
    mun.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  // Recupera lista de estados
  private recuperaEstados(){
    this.utilsService.recuperaEstados().subscribe(
      data => {
        this.listaEstados = data;
      }, err => {
        console.log(err);
      }
    );
  }

  // Recupera lista de cargos
  private recuperaCargos(){    
    this.utilsService.recuperaCargos().subscribe(
      data => {
        this.listaCargos = data;
      }, err => {
        console.log(err);
      }
    );
  }

  private recuperaSituacoes(){
    this.utilsService.recuperaSituacoes().subscribe(
      data => {
        this.listaSituacoes = data;
      }, err => {
        console.log(err);
      }
    )
  }

  // Converte formato de dados que vem do banco para um formato que possibilite usar o autocomplete do Angular Material
  private jsonToArray(data){
    let result = [];
    let i;
    for (i in data) {
      result.push(data[i].unidade_eleitoral);
    }
    return result;
  }

}
