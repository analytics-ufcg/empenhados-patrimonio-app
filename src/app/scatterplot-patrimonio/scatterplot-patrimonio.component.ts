import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '../services/data.service';
import { AlertService } from '../services/alert.service';
import {Observable} from 'rxjs/Observable';

@Component({
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
  private ano: Number;
  private situacao: String;
  public transitionToogle: boolean;

  constructor(private dataService: DataService,
              private alertService: AlertService) {

    this.margin = ({top: 20, right: 30, bottom: 20, left: 40});
    this.circleRadius = 6;
    this.transitionToogle = false;
  }

  ngOnInit() {
    this.svg = d3.select('svg');

    this.width = parseInt(this.svg.style("width"))
    this.height = (this.width * 0.6) - this.margin.bottom;

    this.svg.attr("height", this.width * 0.6);
    
    window.addEventListener('resize', () => {
      this.width = parseInt(this.svg.style("width"));
      this.height = (this.width * 0.6) - this.margin.bottom;

      this.svg.attr("height", this.width * 0.6);
      if(this.data){
        this.plotPatrimonio()
      }
    })
  }

  async emiteSelecaoCandidato(d: any){
    await this.dataService.atualizaCandidato(d);
    this.selecaoCandidato.next();
  }

  plotPatrimonio(){    

    this.estadoAtual = this.dataService.getEstado();    
    this.ano = this.dataService.getAno();    
    
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

  executaTransicao(evento){
    this.transitionToogle = evento.checked
    
    if (this.transitionToogle) {
      this.plotDiferencaPatrimonio();
    } else {
      this.plotPatrimonioTransicao();      
    }
  }

  initD3Patrimonio(){
    this.transitionToogle = false;
    this.initX();
    this.initY();
    this.initZ();
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
    .domain([0, d3.max(this.data, (d: any) => Math.max(d.patrimonio_eleicao_1, d.patrimonio_eleicao_2))]).nice()
    .range([this.height - this.margin.bottom, this.margin.top]);
  }

  private initZ(){
    this.z = d3.scaleSequential(d3.interpolateRdBu).domain([-1e6, 1e6]);
    
  }

  private initAxes(){
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
        .attr("fill", "#000")
        .attr("x", 5)
        .attr("y", this.margin.top)
        .attr("dy", "0.32em")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Patrimônio em " + (this.ano.valueOf() + 4)));
  }

  private initScatterplot() {    
    
    this.svg.selectAll("*").remove();

    this.svg = d3.select('svg');

    this.svg.append("g")
        .call(this.xAxis);
    
    this.svg.append("g")
        .attr("id", "y-axis")
        .call(this.yAxis);
  
    // referência
    this.line = this.svg.append("line")          
      .style("stroke", "grey")  
      .attr("x1", this.x(0))     
      .attr("y1", this.y(0))      
      .attr("x2", this.x(this.maiorPatrimonioEleicao1 + 1e3))    
      .attr("y2", this.y(this.maiorPatrimonioEleicao1 + 1e3));
    
    const g = this.svg.append("g")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.2)
   
    
    g.selectAll("line")
      .data(this.data)
      .enter().append("line")
        .attr("x1", (d: any) => this.x(d.patrimonio_eleicao_1 - .5))
        .attr("x2", (d: any) => this.x(d.patrimonio_eleicao_1 - .5))
        .attr("y1", (d: any) => d.patrimonio_eleicao_2 < d.patrimonio_eleicao_1 ? this.y(d.patrimonio_eleicao_2) : this.y(d.patrimonio_eleicao_1))
        .attr("y2", (d: any) => d.patrimonio_eleicao_2 > d.patrimonio_eleicao_1 ? this.y(d.patrimonio_eleicao_2) : this.y(d.patrimonio_eleicao_1))
        .style("stroke-width", 2)
        .attr("stroke", (d: any) => this.z(d.patrimonio_eleicao_2 - d.patrimonio_eleicao_1))
  
      
      
      g.selectAll("circle")
      .data(this.data)
      .enter().append("circle")
        .attr("cx", (d: any) => this.x(d.patrimonio_eleicao_1))
        .attr("cy", (d: any) => this.y(d.patrimonio_eleicao_2))
        .attr("fill", (d: any) => this.z(d.patrimonio_eleicao_2 - d.patrimonio_eleicao_1))
        .attr("opacity", 0.7)
        .attr("r", this.circleRadius)
        .append("title").html((d: any) => d.nome_urna + ", " + d.unidade_eleitoral + 
                "<br>Em " + this.ano.valueOf() + ": " + d.patrimonio_eleicao_1 +
                "<br>Em " + (this.ano.valueOf() + 4) + ": " + d.patrimonio_eleicao_2);

      g.selectAll("circle")
      .on("click", this.onClick())
      .on("mouseover", (d, i, n) => {this.highlightCircle(n[i])})
      .on("mouseout", (d, i, n) => {this.standardizeCircle(d, n[i])});

      this.g = g;
       
    return this.svg.node();
  }

  private highlightCircle(circle){
    d3.select(circle)
        .attr("r", this.circleRadius * 1.5)
        .style("stroke", "#673AB7")
        .style("stroke-width", 10)
        .style("cursor", "pointer")
  }

  private standardizeCircle(d, circle){
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
    .attr("stroke", (d: any) => this.z(d.patrimonio_eleicao_2 - d.patrimonio_eleicao_1))


    this.svg.select("#y-axis")
    .transition()
    .duration(1500)
    .call(this.yAxis);

  }

  private plotPatrimonioTransicao(){

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

    this.svg.select("#y-axis")
    .transition()
    .duration(1500)
    .call(this.yAxis);
  
  }

}
