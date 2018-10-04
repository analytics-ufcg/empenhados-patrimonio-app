import { Component, OnInit, Output, EventEmitter, ViewChild } from "@angular/core";
import { RequestService } from "../services/request.service";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { startWith } from "rxjs/operators/startWith";
import { map } from "rxjs/operators/map";
import { Subscription } from 'rxjs/Subscription';
import { DataService } from "../services/data.service";
import { PermalinkService } from "../services/permalink.service";
import { AlertService } from "../services/alert.service"
import { ViewEncapsulation } from "@angular/core";
import { Router, Params, ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common'
import { NoDataDialogComponent } from "../no-data-dialog/no-data-dialog.component";
import { MatDialog } from "@angular/material";


const ELEICOES_FEDERAIS = 1;
const ELEICOES_MUNICIPAIS = 2;
const CARGOS_MUNICIPAIS = ["PREFEITO", "VEREADOR", "VICE-PREFEITO"];

@Component({
  selector: "app-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class FilterComponent implements OnInit {

  @Output()
  visualizaClique = new EventEmitter<any>();
  @Output()
  apagaVisualizacao = new EventEmitter<any>();

  public listaEstados: any;
  public listaCargos: any;
  public listaMunicipios: any;
  public listaSituacoes: any;

  public listaCargosAgrupados: any;

  public listaAnos: any;

  public estadoSelecionado: string;
  public cargoSelecionado: string;
  public municipioSelecionado: string;
  public anoSelecionado: number;
  public situacaoSelecionada: string;

  private urlParams: Params;
  private validUrlParams: Params;

  public isVereador;
  public isExecutivo;
  private tipoEleicao;
  private todosConsulta;
  private todosCargos;
  private todosEstados;
  private todasSituacoes;
  private todosMunicipios;

  public subscriptions: Subscription[] = [];
  public eventoVoltar;

  private controlMunicipio: FormControl = new FormControl();
  private filteredOptions: Observable<string[]>;

  private estados_prep_no = [
    "AC",
    "AL",
    "AM",
    "AP",
    "BR",
    "CE",
    "DF",
    "ES",
    "MA",
    "MS",
    "MT",
    "PA",
    "PI",
    "PR",
    "RJ",
    "RN",
    "RS",
    "TO"
  ];
  private estados_prep_na = ["BA", "PB"];
  private estados_prep_em = ["GO", "MG", "PE", "RO", "RR", "SC", "SE", "SP"];
  public preposicao_estado = "no";

  private estados = [
    { sigla: "AC", capital: "Rio Branco" },
    { sigla: "AL", capital: "Maceió" },
    { sigla: "AP", capital: "Macapá" },
    { sigla: "AM", capital: "Manaus" },
    { sigla: "BA", capital: "Salvador" },
    { sigla: "CE", capital: "Fortaleza" },
    { sigla: "DF", capital: "Distrito Federal" },
    { sigla: "ES", capital: "Vitória" },
    { sigla: "GO", capital: "Goiânia" },
    { sigla: "MA", capital: "São Luís" },
    { sigla: "MT", capital: "Cuiabá" },
    { sigla: "MS", capital: "Campo Grande" },
    { sigla: "MG", capital: "Belo Horizonte" },
    { sigla: "PA", capital: "Belém" },
    { sigla: "PB", capital: "João Pessoa" },
    { sigla: "PR", capital: "Curitiba" },
    { sigla: "PE", capital: "Recife" },
    { sigla: "PI", capital: "Teresina" },
    { sigla: "RJ", capital: "Rio De Janeiro" },
    { sigla: "RN", capital: "Natal" },
    { sigla: "RS", capital: "Porto Alegre" },
    { sigla: "RO", capital: "Porto Velho" },
    { sigla: "RR", capital: "Boa Vista" },
    { sigla: "SC", capital: "Florianópolis" },
    { sigla: "SP", capital: "São Paulo" },
    { sigla: "SE", capital: "Aracaju" },
    { sigla: "TO", capital: "Palmas" }
  ];

  encontraCapital = sigla => {
    let estado = this.estados.filter(estado => {
      if (estado.sigla === sigla) {
        return estado.capital;
      }
    })[0];

    if (estado) return estado.capital;
    return "";
  };

  constructor(
    private requestService: RequestService,
    private dataService: DataService,
    private permalinkService: PermalinkService,
    private router: Router,
    private route: ActivatedRoute,
    location: PlatformLocation,
    private alertService: AlertService,
    public dialog: MatDialog
  ) {
    this.listaMunicipios = [];

    this.todosConsulta = dataService.getTodos();
    this.todosCargos = dataService.getTodosCargos();
    this.todosEstados = dataService.getTodosEstados();
    this.todasSituacoes = dataService.getTodasSituacoes();
    this.todosMunicipios = dataService.getTodosMunicipios();

    this.estados_prep_em.push(this.todosEstados);

    location.onPopState(() => {
      this.eventoVoltar = true;
    });

  }

  async ngOnInit() {

    this.filteredOptions = this.controlMunicipio.valueChanges.pipe(
      startWith(""),
      map(val => this.filter(val))
    );

    await this.recuperaEstados();
    await this.recuperaCargos();
    await this.recuperaSituacoes();

    this.agrupaCargos();

    this.subscriptions.push(this.route.queryParamMap.subscribe(queryParamMap => {
      if (Object.keys(queryParamMap['params']).length === 0 && queryParamMap['params'].constructor === Object) {
        this.initFilter();
      } else if (this.eventoVoltar) {
        this.getUrlParams();
        this.eventoVoltar = false;
      }
    }));

    // recupera parâmetros da requisição na URL
    var queryParams: Params = this.permalinkService.getQueryParams();
    if (Object.keys(queryParams).length === 0 && queryParams.constructor === Object) {
      this.initFilter();
    } else {
      this.getUrlParams();
    }

    this.decideSobreVisualizacao();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  async emiteEventoVisualizacao() {
    await this.mudaDados();    
    this.visualizaClique.next();
  }

  // Verifica se o filtro está pronto, com dados suficientes para apresentar uma visualização
  filtroPronto() {
    if (
      this.anoSelecionado &&
      this.situacaoSelecionada &&
      this.cargoSelecionado
    ) {
      if (this.cargoSelecionado == "PRESIDENTE") {
        return true;
      } else if (this.cargoSelecionado == "VEREADOR") {
        if (this.estadoSelecionado) {
          if (
            !this.municipioSelecionado ||
            this.listaMunicipios.includes(this.municipioSelecionado) ||
            this.municipioSelecionado == ""
          ) {
            return true;
          }
        }
      } else if (this.cargoSelecionado && this.estadoSelecionado) {
        return true;
      }
    }    
    return false;
  }

  // Se o filtro estiver pronto, exibe visualização de patrimônio
  decideSobreVisualizacao() {   
    if (this.filtroPronto()) {
      this.emiteEventoVisualizacao();
    } else {
      this.apagaVisualizacao.next();
    }
  }

  /* Altera a lista de municipios a partir de um estado selecionado */
  async onChangeEstado(novoEstado) {
    this.estadoSelecionado = novoEstado;
    this.dataService.mudaEstado(novoEstado);
    await this.permalinkService.updateUrlParams('estado', novoEstado);

    this.definePreposicao();
    this.atualizaFiltroMunicipio();

    // Recupera os municípios do estado selecionado
    await this.requestService
      .recuperaMunicipios(this.estadoSelecionado)
      .subscribe(
        data => {
          let municipios = data;
          this.listaMunicipios = this.jsonToArray(municipios);
          this.listaMunicipios.push(this.todosMunicipios);

          if (this.isVereador && !this.listaMunicipios.includes(this.municipioSelecionado)) {
            this.municipioSelecionado = this.encontraCapital(
              this.estadoSelecionado
            );
            this.permalinkService.updateUrlParams('municipio', this.municipioSelecionado);
          } else {
            this.decideSobreVisualizacao();
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  // Atualiza cargo atual selecionado
  async onChangeCargo(novoCargo) {
    if (!this.mesmoTipoEleicao(novoCargo, this.cargoSelecionado)) {
      if (
        CARGOS_MUNICIPAIS.indexOf(novoCargo) === -1 &&
        novoCargo !== this.dataService.getTodosCargos()
      ) {
        this.anoSelecionado = 2014;
      } else {
        this.anoSelecionado = 2016;
      }
      await this.permalinkService.updateUrlParams('ano', this.anoSelecionado);
    }

    // Limpa municipio ao mudar para um cargo diferente de vereador
    if (!["VEREADOR"].includes(novoCargo)) {
      this.municipioSelecionado = undefined;
      await this.permalinkService.updateUrlParams('municipio', null);
    }

    this.cargoSelecionado = novoCargo;
    this.dataService.mudaCargo(novoCargo);
    await this.permalinkService.updateUrlParams('cargo', novoCargo);

    // Controla o aparecimento ou não da opção todos os estados, a depender do cargo selecionado.
    if (["PREFEITO", "VEREADOR"].includes(novoCargo)) {

      if (this.listaEstados) {           
        this.removeEstado(this.todosEstados);
        this.removeEstado("DF");
        this.removeEstado("BR");
      }

      let novoEstado;
      if (this.estadoSelecionado === this.todosEstados) {
        novoEstado = this.listaEstados[
          Math.floor(Math.random() * this.listaEstados.length)
        ].estado;
      } else {
        novoEstado = this.estadoSelecionado;
      }
      this.onChangeEstado(novoEstado);
      this.atualizaFiltroAno();
      return;
    } else {
      if (this.listaEstados !== undefined && this.listaEstados.length === 26) {
        this.listaEstados.push({ estado: this.todosEstados });
      }
    }

    // Atualiza filtros de acordo com o estado selecionado
    this.atualizaFiltroAno();
    this.atualizaFiltroMunicipio();

    if (novoCargo === "GOVERNADOR") {
      await this.permalinkService.updateUrlParams('estado', null);
    }

    this.decideSobreVisualizacao();
  }

  async onChangeMunicipio(novoMunicipio) {
    if(novoMunicipio === "") { return; }
    
    this.municipioSelecionado = novoMunicipio;
    this.dataService.mudamunicipio(novoMunicipio);

    await this.permalinkService.updateUrlParams('municipio', this.municipioSelecionado);

    // Escolhe o maior município entre a lista dos municípios do estado selecionado
    let tamanhoMaximoMunicipio = input => {
      if (this.listaMunicipios.length > 0) {
        let maiorNomeMunicipio = this.listaMunicipios
          .map(municipio => (municipio.length + 1) / 2)
          .reduce((a, b) => Math.max(a, b));
        input.style.width = maiorNomeMunicipio.toString() + "em";
      }
    };

    let input = document.getElementById("input-municipio");

    // Na unidade 'em', a largura do texto é representada pelo número de caracteres
    // dividido por 2
    if (novoMunicipio) {
      if (this.listaMunicipios.includes(novoMunicipio)) {
        input.style.width = ((novoMunicipio.length + 1) / 2).toString() + "em";
      } else {
        tamanhoMaximoMunicipio(input);
      }
    } else {
      tamanhoMaximoMunicipio(input);
    }

    this.decideSobreVisualizacao();
  }

  async onChangeAno(novoAno) {
    this.anoSelecionado = novoAno;
    await this.permalinkService.updateUrlParams('ano', novoAno);

    if (novoAno === 2018) {
      this.situacaoSelecionada = this.todasSituacoes;
      await this.permalinkService.updateUrlParams('situacao', this.situacaoSelecionada);
    }

    if (this.anoSelecionado % 4) {
      this.tipoEleicao = ELEICOES_FEDERAIS;
    } else {
      this.tipoEleicao = ELEICOES_MUNICIPAIS;
    }

    this.atualizaFiltroMunicipio();
    this.decideSobreVisualizacao();
  }

  async onChangeSituacao(novaSituacao) {
    this.situacaoSelecionada = novaSituacao;
    this.dataService.mudaSituacao(novaSituacao);
    await this.permalinkService.updateUrlParams('situacao', novaSituacao);

    this.decideSobreVisualizacao();
  }

  // filtro para a pesquisa por muninicipio
  filter(val: string): string[] {
    return this.listaMunicipios.filter(
      mun => mun.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
  }

  // Recupera lista de estados
  private async recuperaEstados() {
    this.requestService.recuperaEstados().subscribe(
      data => {
        this.listaEstados = data;
        this.listaEstados.push({ estado: this.todosEstados });
      },
      err => {
        console.log(err);
      }
    );
  }

  private async mudaDados() {
    this.urlParams = this.permalinkService.getQueryParams();
    await this.dataService.mudaDados(
      this.estadoSelecionado,
      this.anoSelecionado,
      this.cargoSelecionado,
      this.situacaoSelecionada,
      this.municipioSelecionado
    ).then(() => { // Se a promisse for resolvida
      this.validUrlParams = this.urlParams;
    }, async () => { // Se a promisse for rejeitada
      this.openNoDataDialog()
      await this.permalinkService.updateAllUrlParams(this.validUrlParams);
      this.getUrlParams();
    })
  }

  // Recupera lista de cargos
  private async recuperaCargos() {
    return new Promise((resolve, reject) => {
      this.requestService.recuperaCargos().subscribe(
        data => {
          let todosCargos;
          todosCargos = data;
          this.listaCargos = todosCargos;
          resolve();
        },
        err => {
          console.log(err);
          reject();
        }
      );
    });
  }

  private agrupaCargos() {
    this.listaCargosAgrupados = this.listaCargos.filter(
      cargo =>
        ["VICE-PREFEITO", "VICE-GOVERNADOR", "VICE-PRESIDENTE", "DEPUTADO DISTRITAL"].indexOf(
          cargo.cargo_pleiteado_2
        ) === -1
    );
  }

  private async recuperaSituacoes() {
    this.requestService.recuperaSituacoes().subscribe(
      data => {
        this.listaSituacoes = data;
        this.listaSituacoes.push({ situacao_eleicao_2: this.todasSituacoes });
        this.listaSituacoes.splice(2, 1); // remove situação "indefinidos"        
      },
      err => {
        console.log(err);
      }
    );
  }

  private mesmoTipoEleicao(cargo1, cargo2) {
    return this.cargosEleicao(cargo1) === this.cargosEleicao(cargo2);
  }

  private cargosEleicao(cargo) {
    if (cargo === this.dataService.getTodosCargos()) {
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

    this.requestService.recuperaAnos(this.cargoSelecionado).subscribe(
      data => {
        this.listaAnos = data;
      },
      err => {
        console.log(err);
      }
    );

  }

  private async atualizaFiltroMunicipio() {
    if (this.estadoSelecionado === this.todosEstados) {
      this.isVereador = false;
      this.municipioSelecionado = "";
      await this.permalinkService.updateUrlParams('municipio', null);
    } else if (this.cargoSelecionado === "VEREADOR") {
      this.isVereador = true;
    } else {
      this.isVereador = false;
      this.municipioSelecionado = "";
      await this.permalinkService.updateUrlParams('municipio', null);
    }

    if (
      this.cargoSelecionado === "PRESIDENTE" ||
      this.cargoSelecionado === "GOVERNADOR"
    ) {
      this.isExecutivo = true;
      this.estadoSelecionado = this.todosEstados;
      await this.permalinkService.updateUrlParams('estado', this.estadoSelecionado);
    } else {
      this.isExecutivo = false;
    }
  }

  private definePreposicao() {
    if (
      this.estados_prep_na.indexOf(this.estadoSelecionado.toString()) !== -1
    ) {
      this.preposicao_estado = "na";
    } else if (
      this.estados_prep_no.indexOf(this.estadoSelecionado.toString()) !== -1
    ) {
      this.preposicao_estado = "no";
    } else if (
      this.estados_prep_em.indexOf(this.estadoSelecionado.toString()) !== -1
    ) {
      this.preposicao_estado = "em";
    }
  }

  private async getUrlParams() {
    var queryParams: Params = this.permalinkService.getQueryParams();

    if (queryParams['cargo']) {
      await this.onChangeCargo(queryParams['cargo']);
    }
    if (queryParams['ano']) {
      await this.onChangeAno(parseInt(queryParams['ano']));
      this.anoSelecionado = parseInt(queryParams['ano']);
    }
    if (queryParams['situacao']) {
      await this.onChangeSituacao(queryParams['situacao']);
    }
    if (queryParams['estado']) {
      await this.onChangeEstado(queryParams['estado']);
    }
    if (queryParams['municipio']) {
      await this.onChangeMunicipio(queryParams['municipio']);
    }
  }

  private async initFilter() {
    await this.onChangeCargo("DEPUTADO FEDERAL");
    await this.onChangeSituacao("ELEITO");
    await this.onChangeAno(2014);
    await this.onChangeEstado("qualquer estado");

    var initURL = { cargo: "deputado-federal", situacao: "eleito", ano: "2014", estado: "qualquer-estado" };
    this.router.navigate([], { queryParams: initURL });
  }

  private removeEstado(nomeEstado) {
    let obj = this.listaEstados.find(e => e.estado === nomeEstado);
    let index = this.listaEstados.indexOf(obj);

    index < 0 ? null : this.listaEstados.splice(index, 1);
  }

  openNoDataDialog(): void {
    const dialogRef = this.dialog.open(NoDataDialogComponent, {
      width: "30%",
      height: "20%"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }

}


