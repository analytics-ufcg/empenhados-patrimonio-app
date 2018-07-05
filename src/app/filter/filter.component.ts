import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RequestService } from '../services/request.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { DataService } from '../services/data.service';
import { ViewEncapsulation } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';


const ELEICOES_FEDERAIS = 1;
const ELEICOES_MUNICIPAIS = 2;
const CARGOS_MUNICIPAIS = ["PREFEITO", "VEREADOR", "VICE-PREFEITO"];

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FilterComponent implements OnInit {

  @Output() visualizaClique = new EventEmitter<any>();
  @Output() apagaVisualizacao = new EventEmitter<any>();

  public listaEstados: any;
  public listaCargos: any;
  public listaMunicipios: any;
  public listaSituacoes: any;

  public listaAnos: any;

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

  private estados_prep_no = ["AC", "AL", "AM", "AP", "BR", "CE", "DF", "ES", "MA", "MS", "MT", "PA", "PI", "PR", "RJ", "RN", "RS", "TO"];
  private estados_prep_na = ["BA", "PB"];
  private estados_prep_em = ["GO", "MG", "PE", "RO", "RR", "SC", "SE", "SP"];
  public preposicao_estado = "no";


  constructor(private requestService: RequestService,
    private dataService: DataService) {

    this.listaMunicipios = [];

    this.todosConsulta = dataService.getTodos();
    this.todosCargos = dataService.getTodosCargos();
    this.todosEstados = dataService.getTodosEstados();
    this.todasSituacoes = dataService.getTodasSituacoes();

    this.estados_prep_em.push(this.todosEstados);
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

    // O site inicia com a visualização dos deputados federais de todos os estados

    this.onChangeCargo("DEPUTADO FEDERAL");
    
    this.onChangeSituacao("ELEITO");

    this.onChangeAno(2010);

    this.onChangeEstado("qualquer estado");    

    this.decideSobreVisualizacao();
  }

  async emiteEventoVisualizacao() {
    await this.mudaDados();
    this.visualizaClique.next();
  }

  // Verifica se o filtro está pronto, com dados suficientes para apresentar uma visualização
  filtroPronto() {
    if (this.anoSelecionado && this.situacaoSelecionada && this.cargoSelecionado) {
      if (this.cargoSelecionado == "PRESIDENTE") {
        return true;
      } else if (this.cargoSelecionado == "VEREADOR") {
        if (this.estadoSelecionado) {
          if (!this.municipioSelecionado ||
            this.listaMunicipios.includes(this.municipioSelecionado) ||
            this.municipioSelecionado == "") {
            return true;
          }
        }
      } else {
        if (this.cargoSelecionado && this.estadoSelecionado) {
          return true;
        }
      }
    }
    return false;
  }

  // Se o filtro estiver pronto, exibe visualização de patrimônio
  decideSobreVisualizacao() {
    if (this.filtroPronto()) {
      this.emiteEventoVisualizacao();
    }else{
      this.apagaVisualizacao.next();
    }
  }

  /* Altera a lista de municipios a partir de um estado selecionado */
  onChangeEstado(novoEstado) {
    this.estadoSelecionado = novoEstado;
    this.dataService.mudaEstado(novoEstado);
    this.definePreposicao();

    this.municipioSelecionado = "";

    this.atualizaFiltroMunicipio();

    this.requestService.recuperaMunicipios(this.estadoSelecionado).subscribe(
      data => {
        let municipios = data;
        this.listaMunicipios = this.jsonToArray(municipios);
      }, err => {
        console.log(err);
      }
    );

    this.decideSobreVisualizacao();
  }

  // Atualiza cargo atual selecionado
  onChangeCargo(novoCargo) {
    if(!this.mesmoTipoEleicao(novoCargo, this.cargoSelecionado)) {
      if(CARGOS_MUNICIPAIS.indexOf(novoCargo) === -1 && novoCargo !== this.dataService.getTodosCargos()) {
        this.anoSelecionado = 2010;
      } else {
        this.anoSelecionado = undefined;
      }
    }

    this.municipioSelecionado = undefined;

    this.cargoSelecionado = novoCargo;
    this.dataService.mudaCargo(novoCargo);
    this.atualizaFiltroAno();
    this.atualizaFiltroMunicipio();

    this.decideSobreVisualizacao();
  }

  onChangeMunicipio(novoMunicipio) {
    this.municipioSelecionado = novoMunicipio;

    // Escolhe o maior município entre a lista dos municípios do estado selecionado
    let tamanhoMaximoMunicipio = (input) => {
      let maiorNomeMunicipio = this.listaMunicipios
                                  .map(municipio => (municipio.length + 1)/ 2)
                                  .reduce((a, b) => Math.max(a, b));
      input.style.width = maiorNomeMunicipio.toString() + "em";
    }

    let input = document.getElementById("input-municipio");

    // Na unidade 'em', a largura do texto é representada pelo número de caracteres
    // dividido por 2
    if(novoMunicipio){      
      if(this.listaMunicipios.includes(novoMunicipio)){
        input.style.width = ((novoMunicipio.length  + 1)/ 2).toString() + "em";
      }else{
        tamanhoMaximoMunicipio(input);
      }
    }else{
      tamanhoMaximoMunicipio(input);
    }

    this.decideSobreVisualizacao();
  }

  onChangeAno(novoAno) {
    this.anoSelecionado = novoAno;
    this.dataService.mudaAno(novoAno);

    if (this.anoSelecionado % 4) {
      this.tipoEleicao = ELEICOES_FEDERAIS;
    } else {
      this.tipoEleicao = ELEICOES_MUNICIPAIS;
    }

    this.atualizaFiltroMunicipio();
    this.decideSobreVisualizacao();
  }

  onChangeSituacao(novaSituacao) {
    this.situacaoSelecionada = novaSituacao;
    this.dataService.mudaSituacao(novaSituacao);

    this.decideSobreVisualizacao();
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
        this.listaEstados.push({ 'estado': this.todosEstados });
      }, err => {
        console.log(err);
      }
    );
  }

  private async mudaDados() {
    await this.dataService.mudaDados(this.estadoSelecionado, this.anoSelecionado, this.cargoSelecionado, this.situacaoSelecionada, this.municipioSelecionado);
  }

  // Recupera lista de cargos
  private recuperaCargos() {
    return new Promise((resolve, reject) => {
      this.requestService.recuperaCargos().subscribe(
        data => {
          let todosCargos
          todosCargos = data;
          this.listaCargos = todosCargos;
          this.listaCargos.push({ 'cargo_pleiteado_2': this.todosCargos });
          resolve();
        }, err => {
          console.log(err);
          reject();
        }
      );
    });
  }

  private recuperaSituacoes() {
    this.requestService.recuperaSituacoes().subscribe(
      data => {
        this.listaSituacoes = data;
        this.listaSituacoes.push({ 'situacao_eleicao_1': this.todasSituacoes });
      }, err => {
        console.log(err);
      }
    )
  }

  private mesmoTipoEleicao(cargo1, cargo2) {
    return this.cargosEleicao(cargo1) === this.cargosEleicao(cargo2);
  }

  private cargosEleicao(cargo) {
    if(cargo === this.dataService.getTodosCargos()) {
      return false;
    }

    if (this.tipoEleicao === ELEICOES_MUNICIPAIS) {
      return CARGOS_MUNICIPAIS.indexOf(cargo) !== -1;
    } else {
      return CARGOS_MUNICIPAIS.indexOf(cargo) === -1;
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

  private atualizaFiltroAno() {
    if (this.cargoSelecionado == this.todosCargos) {
      this.listaAnos = [
        { ano_um: 2008 },
        { ano_um: 2010 },
        { ano_um: 2012 }
      ];
    } else {
      this.requestService.recuperaAnos(this.cargoSelecionado).subscribe(
        data => {
          this.listaAnos = data;
        }, err => {
          console.log(err);
        }
      )
    }
  }

  private atualizaFiltroMunicipio() {

    if (this.estadoSelecionado === this.todosEstados) {
      this.isVereador = false;
      this.municipioSelecionado = '';
    } else if (this.cargoSelecionado === 'VEREADOR') {
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


  private definePreposicao() {

    if (this.estados_prep_na.indexOf( this.estadoSelecionado.toString() ) !== -1) {
      this.preposicao_estado = "na";
    } else if (this.estados_prep_no.indexOf( this.estadoSelecionado.toString() ) !== -1) {
      this.preposicao_estado = "no";
    } else if (this.estados_prep_em.indexOf( this.estadoSelecionado.toString() ) !== -1) {
      this.preposicao_estado = "em"
    }
  }

}


