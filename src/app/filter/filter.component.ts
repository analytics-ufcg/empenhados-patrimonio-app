import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RequestService } from '../services/request.service';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { DataService } from '../services/data.service';
import { ViewEncapsulation } from '@angular/core';


const ELEICOES_FEDERAIS = 1;
const ELEICOES_MUNICIPAIS = 2;

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  encapsulation: ViewEncapsulation.None
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

  public estadoSelecionado: String;
  public cargoSelecionado: String;
  public municipioSelecionado: String;
  public anoSelecionado: number;
  public situacaoSelecionada: String;

  public isVereador;
  public isPresidente;
  private tipoEleicao;
  private todosConsulta;
  private todosCargos;
  private todosEstados;
  private todasSituacoes;

  private controlMunicipio: FormControl = new FormControl();
  private filteredOptions: Observable<string[]>;

  constructor(private requestService: RequestService, 
              private dataService: DataService) {

    this.listaMunicipios = [];

    this.todosConsulta = dataService.getTodos();
    this.todosCargos = dataService.getTodosCargos();
    this.todosEstados = dataService.getTodosEstados();
    this.todasSituacoes = dataService.getTodasSituacoes();
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

  async emiteEventoVisualizacao() {
    await this.mudaDados();
    this.visualizaClique.next();
  }
  
  /* Altera a lista de municipios a partir de um estado selecionado */
  onChangeEstado(novoEstado) {
    this.estadoSelecionado = novoEstado;
    this.dataService.mudaEstado(novoEstado);

    this.atualizaFiltroMunicipio();
        
    this.requestService.recuperaMunicipios(this.estadoSelecionado).subscribe(
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
    this.dataService.mudaCargo(novoCargo);
    
    this.atualizaFiltroMunicipio();
  }

  onChangeMunicipio(novoMunicipio) {
    this.municipioSelecionado = novoMunicipio;
  }

  onChangeAno(novoAno) {
    this.anoSelecionado = novoAno;    
    this.dataService.mudaAno(novoAno);

    if (this.anoSelecionado % 4) {
      this.tipoEleicao = ELEICOES_FEDERAIS;
    } else {
      this.tipoEleicao = ELEICOES_MUNICIPAIS;
    }
    this.recuperaCargos();
  }

  onChangeSituacao(novaSituacao) {
    this.situacaoSelecionada = novaSituacao;
    this.dataService.mudaSituacao(novaSituacao);
  }

  // filtro para a pesquisa por muninicipio
  filter(val: string): string[] {
    return this.listaMunicipios.filter(mun =>
    mun.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  // Recupera lista de estados
  private recuperaEstados() {
    this.requestService.recuperaEstados().subscribe(
      data => {        
        this.listaEstados = data;
        this.listaEstados.push({'estado': this.todosEstados});
      }, err => {
        console.log(err);
      }
    );
  }

  private async mudaDados(){
    await this.dataService.mudaDados(this.estadoSelecionado, this.anoSelecionado, this.cargoSelecionado, this.situacaoSelecionada, this.municipioSelecionado);
  }

  // Recupera lista de cargos
  private recuperaCargos() {    
    this.requestService.recuperaCargos().subscribe(
      data => {
        let todosCargos
        todosCargos = data;
        this.listaCargos = todosCargos.filter(element => this.cargosEleicao(element.cargo_pleiteado_2));
        this.listaCargos.push({'cargo_pleiteado_2': this.todosCargos});
      }, err => {
        console.log(err);
      }
    );
  }

  private recuperaSituacoes(){
    this.requestService.recuperaSituacoes().subscribe(
      data => {
        this.listaSituacoes = data;
        this.listaSituacoes.push({'situacao_eleicao_1': this.todasSituacoes});
      }, err => {
        console.log(err);
      }
    )
  }
  
  private cargosEleicao(cargo) {
    let cargosMunicipais = ["PREFEITO", "VEREADOR", "VICE-PREFEITO"];

    if (this.tipoEleicao === ELEICOES_MUNICIPAIS) {
      return cargosMunicipais.indexOf(cargo) !== -1;
    } else {
      return cargosMunicipais.indexOf(cargo) === -1;
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

  private atualizaFiltroMunicipio() {

    if (this.estadoSelecionado === this.todosEstados){
      this.isVereador = false; 
      this.municipioSelecionado = '';
    } else if (this.cargoSelecionado === 'VEREADOR'){
      this.isVereador = true;
    } else {
      this.isVereador = false;
      this.municipioSelecionado = '';
    }

    if (this.cargoSelecionado === 'PRESIDENTE') {
      this.isPresidente = true;
      this.estadoSelecionado = this.todosEstados;
    } else {
      this.isPresidente = false;
    }
  }

}
