import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { FilterService } from '../services/filter.service';

const ELEICOES_FEDERAIS = 1;
const ELEICOES_MUNICIPAIS = 2;


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Output() visualizaClique = new EventEmitter<any>();
  
  public listaEstados: any;
  public listaCargos: any;
  public listaMunicipios: any;
  public listaSituacoes: any;

  public listaAnos = [
    {ano: 2008},
    {ano: 2010},
    {ano: 2012}
  ];  
  public listaSituacao = [
    {situacao: 'foi eleito'},
    {situacao: 'concorreu'}
  ];

  public estadoSelecionado: String;
  public cargoSelecionado: String;
  public municipioSelecionado: String;
  public anoSelecionado: number;
  public situacaoSelecionada: String;
  public isVereador;
  public tipoEleicao;

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

  emiteEventoVisualizacao() {
    this.visualizaClique.next();
  }
  
  /* Atualiza dados de patrimônio e o estado atual==
  Altera a lista de municipios a partir de um estado selecionado */
  onChangeEstado(novoEstado) {
    this.estadoSelecionado = novoEstado;
    this.filterService.mudaEstado(novoEstado);
    this.mudaDados();
        
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
    this.mudaDados();
    
    if (novoCargo === 'VEREADOR') {
      this.isVereador = true;
    } else {
      this.isVereador = false;
    }
  }

  onChangeMunicipio(novoMunicipio) {
    this.municipioSelecionado = novoMunicipio;
    this.mudaDados();

  }

  onChangeAno(novoAno) {
    this.anoSelecionado = novoAno;    
    this.filterService.mudaAno(novoAno);
    this.mudaDados();

    if (this.anoSelecionado % 4) {
      this.tipoEleicao = ELEICOES_FEDERAIS;
    } else {
      this.tipoEleicao = ELEICOES_MUNICIPAIS;
    }
    this.recuperaCargos();
  }

  onChangeSituacao(novaSituacao) {
    this.situacaoSelecionada = novaSituacao;
    this.filterService.mudaSituacao(novaSituacao);
    this.mudaDados();
  }

  // filtro para a pesquisa por muninicipio
  filter(val: string): string[] {
    return this.listaMunicipios.filter(mun =>
    mun.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  // Recupera lista de estados
  private recuperaEstados() {
    this.utilsService.recuperaEstados().subscribe(
      data => {
        this.listaEstados = data;
      }, err => {
        console.log(err);
      }
    );
  }

  private mudaDados(){
    this.filterService.mudaDados(this.estadoSelecionado, this.anoSelecionado, this.cargoSelecionado, this.situacaoSelecionada, this.municipioSelecionado);
  }

  // Recupera lista de cargos
  private recuperaCargos() {    
    this.utilsService.recuperaCargos().subscribe(
      data => {
        let todosCargos
        todosCargos = data;
        this.listaCargos = todosCargos.filter(element => this.cargosEleicao(element.cargo_pleiteado_2));              
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
  
  private cargosEleicao(cargo) {
    let cargos_municipais = ["PREFEITO", "VEREADOR", "VICE-PREFEITO"];

    if (this.tipoEleicao === ELEICOES_MUNICIPAIS) {
      return cargos_municipais.indexOf(cargo) !== -1;
    } else {
      return cargos_municipais.indexOf(cargo) === -1;
    }    
  }

  // Converte formato de dados que vem do banco para um formato que possibilite usar o autocomplete do Angular Material
  private jsonToArray(data) {
    let result = [];
    let i;
    for (i in data) {
      result.push(data[i].unidade_eleitoral);
    }
    return result;
  }

}
