import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { DataService } from '../services/data.service';
import { AlertService } from '../services/alert.service';
import { UtilsService } from '../services/utils.service';
import {Observable} from 'rxjs/Observable';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-scatterplot-patrimonio',
  templateUrl: './scatterplot-patrimonio.component.html',
  styleUrls: ['./scatterplot-patrimonio.component.css']
})
export class ScatterplotPatrimonioComponent implements OnInit {

  @Output() selecaoCandidato = new EventEmitter<any>();

  private height: any;
  private width: any;
  private margin: any;
  private x: any;
  private y: any;
  private z: any;
  private tip: any;
  private circleRadius: any;
  private xAxis: any;
  private yAxis: any;
  private svg: any;
  private line: any;
  private g: any;

  private clickedCircle: any;

  private bounds: any;
    
  private data: any;
  private maiorPatrimonioEleicao1: any;
  private maiorDiferencaPositiva: any;
  private maiorDiferencaNegativa: any;
  private maiorDiferencaModulo: any;

  private estadoAtual: String;
  public ano: Number;
  private situacao: String;
  public cargo: String;
  public transitionToogle: boolean;

  constructor(private dataService: DataService,
              private alertService: AlertService,
              private utilsService: UtilsService) {

    this.margin = ({top: 20, right: 30, bottom: 20, left: 40});
    this.circleRadius = 6;
    this.transitionToogle = false;
  }

  ngOnInit() {
    this.svg = d3.select('svg');

    this.width = parseInt(this.svg.style("width")) - this.margin.right;
    this.height = (this.width * 0.5) - this.margin.bottom;

    this.svg.attr("height", this.width * 0.5);
    
    window.addEventListener('resize', () => {
      this.width = parseInt(this.svg.style("width"));
      this.height = (this.width * 0.5) - this.margin.bottom;

      this.svg.attr("height", this.width * 0.5);
      if(this.data){
        this.plotPatrimonio()
      }
    })
  }

  async emiteSelecaoCandidato(d: any) {
    await this.dataService.atualizaCandidato(d);
    this.selecaoCandidato.next();
  }

  plotPatrimonio() {    

    this.estadoAtual = this.dataService.getEstado();    
    this.ano = this.dataService.getAno(); 
    this.cargo = this.dataService.getCargo();   
    
    this.dataService.dadosPatrimonio.subscribe(data => this.data = data);    

    if (typeof this.data !== 'undefined' && this.data.length === 0) {      
      console.log("Não temos dados para este filtro!");
      this.alertService.openSnackBar("Não temos dados para este filtro!", "OK")
      
    } else {
      this.maiorPatrimonioEleicao1 = d3.max(this.data, (d: any) => d.patrimonio_eleicao_1);  
      this.maiorDiferencaPositiva = d3.max(this.data, (d: any) => d.patrimonio_eleicao_2 - d.patrimonio_eleicao_1);
      this.maiorDiferencaNegativa = d3.max(this.data, (d: any) => d.patrimonio_eleicao_1 - d.patrimonio_eleicao_2);
      
      this.initD3Patrimonio();  
    }
  }

  apagaPlot(){
    d3.selectAll("svg > *").remove();
  }

  executaTransicao(evento) {
    this.transitionToogle = evento.checked
    
    if (this.transitionToogle) {
      this.plotPatrimonioTransicao();      
    } else {
      this.plotDiferencaPatrimonio();      
    }
  }

  initD3Patrimonio() {
    this.transitionToogle = false;
    this.initX();
    this.initY();
    this.initZ();
    this.initTooltip();
    this.initAxes();
    this.initScatterplot();
  }

  private initX() {
    this.x = d3.scaleLinear()
    .domain([0, this.maiorPatrimonioEleicao1]).nice()
    .range([this.margin.left, this.width - this.margin.right]);
  }

  private initY() {
    this.y = d3.scaleLinear()
    .domain([-Math.abs(this.maiorDiferencaNegativa), this.maiorDiferencaPositiva]).nice()    
    .range([this.height - this.margin.bottom, this.margin.top]);
  }

  private initZ(){
    this.z = d3.scaleSequential(d3.interpolateViridis).domain([1e6, -1e6]);
    
  }

  private initTooltip() {
    this.tip = d3Tip()
    .attr('class', 'd3-tip')
    .attr('id', 'tooltip')
    .offset([-10, 0])
    .html((d: any) => this.tooltipDiferenca(d));
  }

  private initAxes() {
    this.xAxis = g => g
    .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
    .call(d3.axisBottom(this.x).ticks(this.width / 80).tickFormat(d3.format('.2s')))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("fill", "#000")
        .attr("x", this.width/2)
        .attr("y", this.margin.bottom*1.5)
        .attr("dy", "0.32em")
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text("Patrimônio em " + this.ano));

    this.yAxis = g => g
    .attr("transform", `translate(${this.margin.left},0)`)
    .call(d3.axisLeft(this.y).ticks(this.height / 50).tickFormat(d3.format('.2s')))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line")
      .filter(d => d === 0)
      .clone()
        .attr("x2", this.width - this.margin.right - this.margin.left)
        .attr("stroke", "#ccc"))
    .call(g => g.append("text")
        .attr("id", "y-title")
        .attr("fill", "#000")
        .attr("x", 5)
        .attr("y", this.margin.top)
        .attr("dy", "0.32em")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Diferença de patrimônio"));
  }

  private initScatterplot() {    
    
    this.svg.selectAll("*").remove();

    this.svg = d3.select('svg');

    this.svg.append("g")
        .call(this.xAxis);
    
    this.svg.append("g")
        .attr("id", "y-axis")
        .call(this.yAxis);
  
    this.svg.call(this.tip);
  
    // referência
    this.line = this.svg.append("line")          
      .style("stroke", "grey") 
      .style("stroke-dasharray", ("10, 10")) 
      .attr("x1", this.x(0))     
      .attr("y1", this.y(0))      
      .attr("x2", this.x(this.maiorPatrimonioEleicao1 + 1e3))    
      .attr("y2", this.y(0));
    
    const g = this.svg.append("g")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.2)
   
    
    g.selectAll("line")
      .data(this.data)
      .enter().append("line")
        .attr("x1", (d: any) => this.x(d.patrimonio_eleicao_1 - .5))
        .attr("x2", (d: any) => this.x(d.patrimonio_eleicao_1 - .5))
        .attr("y1", (d: any) => d.patrimonio_eleicao_2 > d.patrimonio_eleicao_1 ? this.y(0) : this.y(d.patrimonio_eleicao_2 - d.patrimonio_eleicao_1))
        .attr("y2", (d: any) => d.patrimonio_eleicao_2 > d.patrimonio_eleicao_1 ? this.y(d.patrimonio_eleicao_2 - d.patrimonio_eleicao_1) : this.y(0))        
        .style("stroke-width", 2)
        .attr("stroke", (d: any) => this.z(d.patrimonio_eleicao_2 - d.patrimonio_eleicao_1))
  
      g.selectAll("circle")
      .data(this.data)
      .enter().append("circle")
        .attr("cx", (d: any) => this.x(d.patrimonio_eleicao_1))
        .attr("cy", (d: any) => this.y(d.patrimonio_eleicao_2 - d.patrimonio_eleicao_1))
        .attr("fill", (d: any) => this.z(d.patrimonio_eleicao_2 - d.patrimonio_eleicao_1))
        .attr("opacity", 0.7)
        .attr("r", this.circleRadius);

      g.selectAll("circle")
      .on("click", this.onClick())
      .on("mouseover.circle", (d, i, n) => {this.highlightCircle(n[i])})
      .on("mouseover.tip", this.tip.show)   
      .on("mouseout.circle", (d, i, n) => {this.standardizeCircle(d, n[i])})
      .on("mouseout.tip", this.tip.hide);

      this.g = g;
       
    return this.svg.node();
  }

  private highlightCircle(circle) {
    d3.select(circle)        
        .attr("r", this.circleRadius * 1.8)
        .style("stroke", "#230a4f")
        .style("stroke-width", 15)        
        .style("cursor", "pointer")             
  }

  private standardizeCircle(d, circle) {
    if(!d.isclicked){      
      d3.select(circle)
      .attr("r", this.circleRadius)
      .style("stroke", "none");
    }
  }

  private onClick(): (d, i, n) => void {
    return (d, i, n) => {
      if(this.clickedCircle && this.clickedCircle.d !== d){
        this.clickedCircle.d.isclicked = false;
        let previousCircle = this.clickedCircle.n[this.clickedCircle.i]
        this.standardizeCircle(this.clickedCircle.d, previousCircle);
      }
      if(!d.isclicked){
        d.isclicked = true;
        this.clickedCircle = {'d': d, 'i': i, 'n': n};
        this.highlightCircle(n[i]);
      
        this.emiteSelecaoCandidato(d);
      }      
    }
  }

  private plotDiferencaPatrimonio() {
    this.y.domain([-Math.abs(this.maiorDiferencaNegativa), this.maiorDiferencaPositiva]).nice();
    
    this.line
    .transition()
    .duration(2000)
    .attr("y1", this.y(0))
    .attr("y2", this.y(0))

    this.g
    .selectAll("circle")
    .transition()
    .duration(2000)
    .attr("cx", (d: any) => this.x(d.patrimonio_eleicao_1))
    .attr("cy", (d: any) => this.y(d.patrimonio_eleicao_2 - d.patrimonio_eleicao_1));

    this.g
    .selectAll("line")
    .transition()
    .duration(2000)
    .attr("y1", (d: any) => d.patrimonio_eleicao_2 > d.patrimonio_eleicao_1 ? this.y(0) : this.y(d.patrimonio_eleicao_2 - d.patrimonio_eleicao_1))
    .attr("y2", (d: any) => d.patrimonio_eleicao_2 > d.patrimonio_eleicao_1 ? this.y(d.patrimonio_eleicao_2 - d.patrimonio_eleicao_1) : this.y(0))
    .attr("stroke", (d: any) => this.z(d.patrimonio_eleicao_2 - d.patrimonio_eleicao_1));

    this.svg.select("#y-title")    
    .text("Diferença de patrimônio");
    
    this.tip
    .html((d: any) => this.tooltipDiferenca(d));

    this.svg.call(this.tip);

    this.svg.select("#y-axis")
    .transition()
    .duration(1500)    
    .call(d3.axisLeft(this.y).ticks(this.height / 50).tickFormat(d3.format('.2s')))
    .call(g => g.select(".domain").remove());    

  }

  private plotPatrimonioTransicao() {

    this.y.domain([0, d3.max(this.data, (d: any) => Math.max(d.patrimonio_eleicao_1, d.patrimonio_eleicao_2))]).nice();

    this.line
    .transition()
    .duration(2000)
    .attr("y1", this.y(0))
    .attr("y2", this.y(this.maiorPatrimonioEleicao1 + 1e3));

    this.g
    .selectAll("circle")
    .transition()
    .duration(2000)
    .attr("cx", (d: any) => this.x(d.patrimonio_eleicao_1))
    .attr("cy", (d: any) => this.y(d.patrimonio_eleicao_2));

    this.g
    .selectAll("line")
    .transition()
    .duration(2000)
    .attr("y1", (d: any) => d.patrimonio_eleicao_2 < d.patrimonio_eleicao_1 ? this.y(d.patrimonio_eleicao_2) : this.y(d.patrimonio_eleicao_1))
    .attr("y2", (d: any) => d.patrimonio_eleicao_2 > d.patrimonio_eleicao_1 ? this.y(d.patrimonio_eleicao_2) : this.y(d.patrimonio_eleicao_1))  

    this.svg.select("#y-title")    
    .text("Patrimônio em " + (this.ano.valueOf() + 4));

    this.tip
    .html((d: any) => this.tooltipPatrimonio(d));

    this.svg.call(this.tip);

    this.svg.select("#y-axis")
    .transition()
    .duration(1500)
    .call(d3.axisLeft(this.y).ticks(this.height / 50).tickFormat(d3.format('.2s')))
    .call(g => g.select(".domain").remove()); 

  }

  private tooltipPatrimonio(d: any) {
    return "<strong>" + d.nome_urna + "</strong><br><span>" + d.unidade_eleitoral + "</span>" + "<br>" +
    "<span>" + d.ano_um + ": " + this.utilsService.formataReais(d.patrimonio_eleicao_1) + "</span>" + "<br>" +
    "<span>" + (d.ano_um+4) + ": " + this.utilsService.formataReais(d.patrimonio_eleicao_2) + "</span>";
  }

  private tooltipDiferenca(d: any) {
    return "<strong>" + d.nome_urna + "</strong><br><span>" + d.unidade_eleitoral + "</span>" + "<br>" +
    "<span>" + "Diferença: " + this.utilsService.formataReais(d.patrimonio_eleicao_2 - d.patrimonio_eleicao_1) + "</span>";
  }

  public toTitleCase(str) {
    if (str === this.dataService.getTodosCargos()) {
      return str;
    }
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

}
